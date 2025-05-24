import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { excludeColumns } from 'src/common/utils/drizzle-helpers'
import { DatabaseService } from 'src/global/database/database.service'
import { LoanDetailsService } from './loan-details/loan-details.service'
import { and, count, desc, eq, gt, inArray, lt, not, SQL } from 'drizzle-orm'
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
import { ApproveLoanDto } from './dto/req/approve-loan.dto'
import { DeliverLoanDto } from './dto/req/deliver-loan.dto'
import { ItemsService } from '../items/items.service'
import { USER_STATUS } from '../users/types/user-status.enum'

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
    const { limit, page, status, requestorDni, fromDate, toDate } = filterDto
    const offset = (page - 1) * limit

    const conditions: SQL[] = []

    if (status) {
      conditions.push(eq(loan.status, status))
    }

    if (fromDate) {
      conditions.push(gt(loan.requestDate, new Date(fromDate)))
    }

    if (toDate) {
      conditions.push(lt(loan.requestDate, new Date(toDate)))
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

    query.orderBy(desc(loan.requestDate)).limit(limit).offset(offset)

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

  async findActive({ limit, page }: BaseParamsDto) {
    const offset = (page - 1) * limit

    const query = this.dbService.db
      .select(this.loanWithoutDates)
      .from(loan)
      .where(
        not(
          inArray(loan.status, [
            StatusLoan.CANCELLED,
            StatusLoan.RETURNED,
            StatusLoan.EXPIRED,
          ]),
        ),
      )
      .orderBy(desc(loan.requestorId), desc(loan.registrationDate))
      .limit(limit)
      .offset(offset)
    const totalQuery = this.dbService.db
      .select({ count: count() })
      .from(loan)
      .where(
        not(
          inArray(loan.status, [
            StatusLoan.CANCELLED,
            StatusLoan.RETURNED,
            StatusLoan.EXPIRED,
          ]),
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

  async create(createLoanDto: CreateLoanDto) {
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

      const user = await this.userService.findByDni(createLoanDto.requestorId)
      if (
        user.status === USER_STATUS.DEFAULTER ||
        user.status === USER_STATUS.INACTIVE ||
        user.status === USER_STATUS.SUSPENDED
      ) {
        if (createLoanDto.blockBlackListed)
          throw new BadRequestException(
            `El usuario con DNI: ${user.person.dni} no puede realizar préstamos, ${statusMessages[user.status]}`,
          )
      }
      const [newLoan] = await tx
        .insert(loan)
        .values({
          scheduledReturnDate: createLoanDto.scheduledReturnDate,
          requestorId: user.id,
          reason: createLoanDto.reason,
          associatedEvent: createLoanDto.associatedEvent,
          externalLocation: createLoanDto.externalLocation,
          notes: createLoanDto.notes,
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

  async approveLoan(
    id: number,
    approveLoanDto: ApproveLoanDto,
    approverId: number,
  ) {
    const { notes } = approveLoanDto

    const [loanRecord] = await this.dbService.db
      .select()
      .from(loan)
      .where(eq(loan.id, id))
      .limit(1)
      .execute()

    if (!loanRecord) {
      throw new NotFoundException(`Préstamo con ID: ${id} no encontrado`)
    }

    if (loanRecord.status !== StatusLoan.REQUESTED) {
      throw new BadRequestException(
        `El préstamo debe estar en estado REQUESTED para ser aprobado. Estado actual: ${loanRecord.status}`,
      )
    }

    const [updatedLoan] = await this.dbService.db
      .update(loan)
      .set({
        status: StatusLoan.APPROVED,
        approverId,
        approvalDate: new Date(),
        notes: notes || loanRecord.notes,
        updateDate: new Date(),
      })
      .where(eq(loan.id, id))
      .returning()

    const loanDetails = await this.loanDetailService.findDetailsByLoanID(id)

    return plainToInstance(LoanResDto, {
      ...updatedLoan,
      loanDetails,
    })
  }

  async deliverLoan(id: number, deliverLoanDto: DeliverLoanDto) {
    const { deliveryDate, notes } = deliverLoanDto

    const [loanRecord] = await this.dbService.db
      .select()
      .from(loan)
      .where(eq(loan.id, id))
      .limit(1)
      .execute()

    if (!loanRecord) {
      throw new NotFoundException(`Préstamo con ID: ${id} no encontrado`)
    }

    if (loanRecord.status !== StatusLoan.APPROVED) {
      throw new BadRequestException(
        `El préstamo debe estar en estado APPROVED para ser entregado. Estado actual: ${loanRecord.status}`,
      )
    }

    if (new Date(deliveryDate) > new Date(loanRecord.scheduledReturnDate)) {
      throw new BadRequestException(
        'La fecha de entrega no puede ser posterior a la fecha programada de devolución',
      )
    }

    const [updatedLoan] = await this.dbService.db
      .update(loan)
      .set({
        status: StatusLoan.DELIVERED,
        deliveryDate: new Date(deliveryDate),
        notes: notes || loanRecord.notes,
        updateDate: new Date(),
      })
      .where(eq(loan.id, id))
      .returning()

    const loanDetails = await this.loanDetailService.findDetailsByLoanID(id)

    return plainToInstance(LoanResDto, {
      ...updatedLoan,
      loanDetails,
    })
  }
}
