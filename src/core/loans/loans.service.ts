import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common'
import { excludeColumns } from 'src/common/utils/drizzle-helpers'
import { DatabaseService } from 'src/global/database/database.service'
import { LoanDetailsService } from './loan-details/loan-details.service'
import { and, count, desc, eq, inArray, not, SQL, sql } from 'drizzle-orm'
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
import { EmailService } from '../email/email.service'
import { item } from 'drizzle/schema/tables/inventory/item/item'

@Injectable()
export class LoansService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly loanDetailService: LoanDetailsService,
    private readonly userService: UsersService,
    private readonly itemsService: ItemsService,
    private readonly emailService: EmailService,
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

      // Validar stock disponible antes de crear el préstamo
      for (const detailDto of createLoanDto.loanDetails) {
        const item = await this.itemsService.findOne(detailDto.itemId)

        if (!item.availableForLoan) {
          throw new BadRequestException(
            `El item con ID: ${detailDto.itemId} no está disponible para préstamo`,
          )
        }

        if (item.stock < detailDto.quantity) {
          throw new BadRequestException(
            `Stock insuficiente para el item con ID: ${detailDto.itemId}. Disponible: ${item.stock}, Solicitado: ${detailDto.quantity}`,
          )
        }
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
        // Obtener el item actual para verificar el stock
        const [currentItem] = await tx
          .select()
          .from(item)
          .where(eq(item.id, detailDto.itemId))
          .limit(1)

        if (!currentItem) {
          throw new BadRequestException(
            `El item con ID: ${detailDto.itemId} no existe`,
          )
        }

        // Actualizar el stock del item
        await tx
          .update(item)
          .set({
            stock: currentItem.stock - detailDto.quantity,
            updateDate: new Date(),
          })
          .where(eq(item.id, detailDto.itemId))

        const [record] = await tx
          .insert(loanDetail)
          .values({
            loanId: newLoan.id,
            itemId: detailDto.itemId,
            quantity: detailDto.quantity,
            exitConditionId: detailDto.exitConditionId,
            exitObservations: detailDto.exitObservations,
          })
          .returning()

        loanDetails.push(plainToInstance(LoanDetailResDto, record))
      }

      if (person.email && loanDetails.length > 0) {
        const equipmentNames = loanDetails
          .map((detail) => detail.itemId)
          .join(', ')
        this.emailService
          .sendEmail(
            person.email,
            equipmentNames,
            newLoan.scheduledReturnDate.toISOString().split('T')[0],
          )
          .catch((err) => {
            Logger.log('Error enviando el correo ' + err)
          })
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

    // Permitir devoluciones solo si el préstamo está en estado DELIVERED o PARTIALLY_RETURNED
    if (
      existingLoan.status !== StatusLoan.DELIVERED &&
      existingLoan.status !== StatusLoan.PARTIALLY_RETURNED
    ) {
      throw new BadRequestException(
        `El préstamo debe estar en estado DELIVERED o PARTIALLY_RETURNED para procesarlo como devuelto. Estado actual: ${existingLoan.status}`,
      )
    }

    const returnDate = new Date(actualReturnDate)
    if (existingLoan.deliveryDate && returnDate < existingLoan.deliveryDate) {
      throw new BadRequestException(
        'La fecha de devolución no puede ser anterior a la fecha de entrega',
      )
    }

    const isLate = existingLoan.scheduledReturnDate < returnDate

    const loanDetails = await this.dbService.db
      .select()
      .from(loanDetail)
      .where(eq(loanDetail.loanId, loanId))
      .execute()

    const result = await this.dbService.transaction(async (tx) => {
      // Validar y procesar cada item devuelto
      for (const returnItem of returnedItems) {
        const loanDetailRecord = loanDetails.find(
          (detail) => detail.id === returnItem.loanDetailId,
        )

        if (!loanDetailRecord) {
          throw new BadRequestException(
            `El detalle con ID ${returnItem.loanDetailId} no pertenece a este préstamo`,
          )
        }

        // Calcular la cantidad total devuelta hasta ahora (incluyendo esta devolución)
        const totalReturnedSoFar = loanDetailRecord.returnedQuantity + returnItem.quantity

        // Validar que no se devuelvan más items de los que se prestaron
        if (totalReturnedSoFar > loanDetailRecord.quantity) {
          throw new BadRequestException(
            `No se pueden devolver más items de los que se prestaron. Prestado: ${loanDetailRecord.quantity}, Ya devuelto: ${loanDetailRecord.returnedQuantity}, Intentando devolver: ${returnItem.quantity}, Total: ${totalReturnedSoFar}`,
          )
        }

        // Obtener el item actual para actualizar el stock
        const [currentItem] = await tx
          .select()
          .from(item)
          .where(eq(item.id, loanDetailRecord.itemId))
          .limit(1)

        if (!currentItem) {
          throw new BadRequestException(
            `El item con ID: ${loanDetailRecord.itemId} no existe`,
          )
        }

        // Actualizar el stock del item
        await tx
          .update(item)
          .set({
            stock: currentItem.stock + returnItem.quantity,
            updateDate: new Date(),
          })
          .where(eq(item.id, loanDetailRecord.itemId))

        // Actualizar el detalle del préstamo con la cantidad devuelta
        await tx
          .update(loanDetail)
          .set({
            returnedQuantity: totalReturnedSoFar,
            returnConditionId: returnItem.returnConditionId,
            returnObservations: returnItem.returnObservations,
            updateDate: new Date(),
          })
          .where(eq(loanDetail.id, returnItem.loanDetailId))
      }

      // Determinar el nuevo estado del préstamo
      let newStatus = existingLoan.status
      const updatedLoanDetails = await tx
        .select()
        .from(loanDetail)
        .where(eq(loanDetail.loanId, loanId))
        .execute()

      // Verificar si todos los items han sido devueltos completamente
      const allItemsFullyReturned = updatedLoanDetails.every(
        (detail) => detail.returnedQuantity >= detail.quantity
      )

      // Verificar si al menos un item ha sido devuelto parcialmente
      const hasPartialReturns = updatedLoanDetails.some(
        (detail) => detail.returnedQuantity > 0 && detail.returnedQuantity < detail.quantity
      )

      // Verificar si todos los items han sido devueltos completamente
      const allItemsReturned = updatedLoanDetails.every(
        (detail) => detail.returnedQuantity >= detail.quantity
      )

      if (allItemsReturned) {
        // Todos los items han sido devueltos completamente
        newStatus = isLate ? StatusLoan.RETURNED_LATE : StatusLoan.RETURNED
      } else if (hasPartialReturns) {
        // Al menos un item ha sido devuelto parcialmente
        newStatus = StatusLoan.PARTIALLY_RETURNED
      }

      // Actualizar el estado del préstamo
      await tx
        .update(loan)
        .set({
          status: newStatus,
          actualReturnDate: returnDate,
          notes: notes ?? existingLoan.notes,
          updateDate: new Date(),
        })
        .where(eq(loan.id, loanId))

      // Verificar si hay items dañados para marcar al usuario como moroso
      const hasDamagedItems = returnedItems.some(
        (item) => item.returnConditionId === 3,
      )

      if (isLate || hasDamagedItems) {
        await tx
          .update(person)
          .set({
            status: PERSON_STATUS.DEFAULTER,
          })
          .where(eq(person.id, existingLoan.requestorId))
      }

      return {
        loanId,
        status: newStatus as StatusLoan,
        message: this.getReturnMessage(newStatus as StatusLoan, isLate),
        isLate,
        returnDate,
        returnedItems: returnedItems.length,
        totalItems: updatedLoanDetails.length,
        fullyReturnedItems: updatedLoanDetails.filter(
          (detail) => detail.returnedQuantity >= detail.quantity
        ).length,
      }
    })

    return result
  }

  private getReturnMessage(status: StatusLoan, isLate: boolean): string {
    switch (status) {
      case StatusLoan.RETURNED:
        return `Préstamo devuelto completamente ${isLate ? 'con retraso' : 'a tiempo'}`
      case StatusLoan.RETURNED_LATE:
        return 'Préstamo devuelto completamente con retraso'
      case StatusLoan.PARTIALLY_RETURNED:
        return `Devolución parcial procesada ${isLate ? 'con retraso' : 'a tiempo'}`
      default:
        return 'Devolución procesada'
    }
  }
}
