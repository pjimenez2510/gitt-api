import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { excludeColumns } from 'src/common/utils/drizzle-helpers'
import { DatabaseService } from 'src/global/database/database.service'
import { LoanDetailsService } from './loan-details/loan-details.service'
import { and, count, desc, eq, inArray, not, SQL } from 'drizzle-orm'
import { plainToInstance } from 'class-transformer'
import { LoanResDto } from './dto/res/loan-res.dto'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { UsersService } from '../users/users.service'
import { CreateLoanDto } from './dto/req/create-loan.dto'
import { FilterLoansDto } from './dto/req/filter-loans.dto'
import { loanDetail } from 'drizzle/schema/tables/loans/loanDetail'
import { LoanDetailResDto } from './loan-details/dto/res/loan-detail-res.dto'
import { loan } from 'drizzle/schema/tables/loans'
import { StatusLoan } from './enums/status-loan'
import { ItemsService } from '../items/items.service'
import { USER_STATUS } from '../users/types/user-status.enum'
import { CreateReturnLoanDto } from './dto/req/create-return.dto'
import { person } from 'drizzle/schema'
import { PERSON_STATUS } from '../people/types/person-status.enum'

@Injectable()
export class LoansService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly loanDetailService: LoanDetailsService,
    private readonly userService: UsersService,
    private readonly itemsService: ItemsService,
  ) {}

  private readonly loanWithoutDates = excludeColumns(
    loan,
    'registrationDate',
    'updateDate',
  )

  async findOne(id: number) {
    const [record] = await this.dbService.db
      .select(this.loanWithoutDates)
      .from(loan)
      .where(eq(loan.id, id))
      .limit(1)
      .execute()

    if (!record) {
      throw new NotFoundException(`Prestamo con ID: ${id} no encontrado`)
    }

    const loanDetails = await this.loanDetailService.findDetailsByLoanID(id)

    return plainToInstance(LoanResDto, {
      ...record,
      loanDetails,
    })
  }

  async findAll(filterDto: FilterLoansDto) {
    const { limit, page, status, requestorDni } = filterDto
    const offset = (page - 1) * limit

    const conditions: SQL[] = []

    if (status) {
      conditions.push(eq(loan.status, status))
    }

    if (requestorDni) {
      const user = await this.userService.findByDni(requestorDni)
      conditions.push(eq(loan.requestorId, user.id))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const query = this.dbService.db.select(this.loanWithoutDates).from(loan)

    if (whereClause) {
      query.where(whereClause)
    }

    query.orderBy(desc(loan.registrationDate)).limit(limit).offset(offset)

    const totalQuery = this.dbService.db.select({ count: count() }).from(loan)

    if (whereClause) {
      totalQuery.where(whereClause)
    }

    const [records, totalResult] = await Promise.all([
      query.execute(),
      totalQuery.execute(),
    ])

    for (const record of records) {
      const loanDetails = await this.loanDetailService.findDetailsByLoanID(
        record.id as number,
      )
      record.loanDetails = loanDetails
    }

    const total = totalResult[0].count

    return {
      records: plainToInstance(LoanResDto, records),
      total,
      limit,
      page,
      pages: Math.ceil(total / limit),
    }
  }

  async findByUserDni({ limit, page }: BaseParamsDto, dni: string) {
    const offset = (page - 1) * limit

    const user = await this.userService.findByDni(dni)
    const query = this.dbService.db
      .select(this.loanWithoutDates)
      .from(loan)
      .where(
        and(
          not(inArray(loan.status, [StatusLoan.CANCELLED])),
          eq(loan.requestorId, user.id),
        ),
      )
      .orderBy(desc(loan.registrationDate), desc(loan.status))
      .limit(limit)
      .offset(offset)

    const totalQuery = this.dbService.db
      .select({ count: count() })
      .from(loan)
      .where(
        and(
          not(inArray(loan.status, [StatusLoan.CANCELLED])),
          eq(loan.requestorId, user.id),
        ),
      )

    const [records, totalResult] = await Promise.all([
      query.execute(),
      totalQuery.execute(),
    ])
    for (const record of records) {
      const loanDetails = await this.loanDetailService.findDetailsByLoanID(
        record.id as number,
      )
      record.loanDetails = loanDetails
    }
    const total = totalResult[0].count

    return {
      records: plainToInstance(LoanResDto, records),
      total,
      limit,
      page,
      pages: Math.ceil(total / limit),
    }
  }

  async findPersonByDni(dni: string) {
    const personResult = await this.dbService.db.query.person
      .findFirst({
        where: eq(person.dni, dni),
      })
      .execute()

    if (!personResult) {
      throw new NotFoundException(`La persona con DNI ${dni} no existe`)
    }

    return personResult
  }

  async create(createLoanDto: CreateLoanDto, userId: number) {
    return await this.dbService.db.transaction(async (tx) => {
      if (Date.now() > new Date(createLoanDto.scheduledReturnDate).getTime()) {
        throw new BadRequestException(
          'La fecha programada de devolución no puede ser anterior a la fecha actual',
        )
      }

      const statusMessages = {
        [USER_STATUS.DEFAULTER]: 'está en la lista de morosos',
        [USER_STATUS.INACTIVE]: 'tiene la cuenta inactiva',
        [USER_STATUS.SUSPENDED]: 'tiene la cuenta suspendida',
      }

      const person = await this.findPersonByDni(createLoanDto.requestorId)
      if (
        person.status === PERSON_STATUS.DEFAULTER ||
        person.status === PERSON_STATUS.INACTIVE ||
        person.status === PERSON_STATUS.SUSPENDED
      ) {
        if (createLoanDto.blockBlackListed)
          throw new BadRequestException(
            `El usuario con DNI: ${person.dni} no puede realizar préstamos, ${statusMessages[person.status]}`,
          )
      }
      const [newLoan] = await tx
        .insert(loan)
        .values({
          scheduledReturnDate: createLoanDto.scheduledReturnDate,
          requestorId: person.id,
          approverId: userId,
          reason: createLoanDto.reason,
          associatedEvent: createLoanDto.associatedEvent,
          externalLocation: createLoanDto.externalLocation,
          notes: createLoanDto.notes,
          status: StatusLoan.DELIVERED,
          deliveryDate: new Date(),
        })
        .returning()

      const loanDetails: LoanDetailResDto[] = []

      for (const detailDto of createLoanDto.loanDetails) {
        const item = await this.itemsService.findOne(detailDto.itemId)

        if (!item.availableForLoan) {
          throw new BadRequestException(
            `El item con ID: ${detailDto.itemId} no está disponible para préstamo`,
          )
        }

        const [record] = await tx
          .insert(loanDetail)
          .values({
            loanId: newLoan.id,
            itemId: detailDto.itemId,
            exitConditionId: detailDto.exitConditionId,
            exitObservations: detailDto.exitObservations,
          })
          .returning()

        loanDetails.push(plainToInstance(LoanDetailResDto, record))
      }

      return plainToInstance(LoanResDto, {
        ...newLoan,
        loanDetails,
      })
    })
  }

  async processReturn(createReturnLoanDto: CreateReturnLoanDto) {
    const { loanId, actualReturnDate, returnedItems, notes } =
      createReturnLoanDto

    const existingLoanArr = await this.dbService.db
      .select()
      .from(loan)
      .where(eq(loan.id, loanId))
      .limit(1)
      .execute()

    const existingLoan = existingLoanArr[0]

    if (!existingLoan) {
      throw new NotFoundException(`El préstamo con ID ${loanId} no existe`)
    }

    if (existingLoan.status !== StatusLoan.DELIVERED) {
      throw new BadRequestException(
        `El préstamo debe estar en estado DELIVERED para procesarlo como devuelto. Estado actual: ${existingLoan.status}`,
      )
    }

    const returnDate = new Date(actualReturnDate)
    if (existingLoan.deliveryDate && returnDate < existingLoan.deliveryDate) {
      throw new BadRequestException(
        'La fecha de devolución no puede ser anterior a la fecha de entrega',
      )
    }

    const isLate = existingLoan.scheduledReturnDate < returnDate
    const newStatus = isLate ? StatusLoan.RETURNED_LATE : StatusLoan.RETURNED

    const loanDetails = await this.dbService.db
      .select()
      .from(loanDetail)
      .where(eq(loanDetail.loanId, loanId))
      .execute()

    const result = await this.dbService.transaction(async (tx) => {
      await tx
        .update(loan)
        .set({
          status: newStatus,
          actualReturnDate: returnDate,
          notes: notes ?? existingLoan.notes,
          updateDate: new Date(),
        })
        .where(eq(loan.id, loanId))

      for (const item of returnedItems) {
        const belongsToLoan = loanDetails.some(
          (detail) => detail.id === item.loanDetailId,
        )

        if (!belongsToLoan) {
          throw new BadRequestException(
            `El detalle con ID ${item.loanDetailId} no pertenece a este préstamo`,
          )
        }

        await tx
          .update(loanDetail)
          .set({
            returnConditionId: item.returnConditionId,
            returnObservations: item.returnObservations,
            updateDate: new Date(),
          })
          .where(eq(loanDetail.id, item.loanDetailId))
      }

      const hasDamagedItems = returnedItems.some(
        (item) => item.returnConditionId === 3,
      )

      if (isLate ?? hasDamagedItems) {
        await tx
          .update(person)
          .set({
            status: PERSON_STATUS.DEFAULTER,
          })
          .where(eq(person.id, existingLoan.requestorId))
      }

      return {
        loanId,
        status: newStatus,
        message: `Préstamo devuelto ${isLate ? 'con retraso' : 'a tiempo'}`,
        isLate,
        returnDate,
      }
    })

    return result
  }
}
