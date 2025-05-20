import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'
import { eq, and, lt } from 'drizzle-orm'
import { DatabaseService } from 'src/global/database/database.service'
import { CreateReturnLoanDto } from './dto/req/create-return.dto'
import { loan, loanDetail, statusChange, user, status } from 'drizzle/schema'
import { USER_STATUS } from '../users/types/user-status.enum'

@Injectable()
export class ReturnService {
  constructor(private readonly dbService: DatabaseService) {}

  async processReturn(createReturnLoanDto: CreateReturnLoanDto, user: any) {
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

    if (existingLoan.status !== 'DELIVERED') {
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
    const newStatus = isLate ? 'RETURNED_LATE' : 'RETURNED'

    const loanDetails = await this.dbService.db
      .select()
      .from(loanDetail)
      .where(eq(loanDetail.loanId, loanId))
      .execute()

    const result = await this.dbService.transaction(async (tx) => {
      const previousStatusId = await this.getStatusIdByName(
        existingLoan.status,
        tx,
      )
      const newStatusId = await this.getStatusIdByName(newStatus, tx)

      // 1. Actualizar el préstamo
      await tx
        .update(loan)
        .set({
          status: newStatus,
          actualReturnDate: returnDate,
          notes: notes || existingLoan.notes,
          updateDate: new Date(),
        })
        .where(eq(loan.id, loanId))

      // 2. Verificar y actualizar detalles de ítems devueltos
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

      // 3. Registrar cambio de estado del préstamo
      await tx.insert(statusChange).values({
        itemId: loanId,
        previousStatusId,
        newStatusId,
        changeDate: new Date(),
        userId: user.id,
        loanId,
        observations: `Préstamo devuelto ${isLate ? 'con retraso' : 'a tiempo'}. ${notes || ''}`,
        registrationDate: new Date(),
      })

      // 4. Marcar usuario como moroso si aplica
      const hasDamagedItems = returnedItems.some(
        (item) => item.returnConditionId === 3,
      )

      if (isLate || hasDamagedItems) {
        const defaulterStatusId = await this.getStatusIdByName('DEFAULTER', tx)

        await tx
          .update(user)
          .set({
            status: 'DEFAULTER' as USER_STATUS,
          })
          .where(eq(user.id, existingLoan.requestorId))

        await tx.insert(statusChange).values({
          itemId: loanId,
          previousStatusId: null,
          newStatusId: defaulterStatusId,
          changeDate: new Date(),
          userId: user.id,
          loanId,
          observations: `Usuario marcado como moroso por ${
            isLate ? 'retraso' : 'ítems dañados'
          }.`,
          registrationDate: new Date(),
        })
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

  async getLoanForReturn(loanId: number) {
    const [loanData] = await this.dbService.db
      .select()
      .from(loan)
      .where(eq(loan.id, loanId))
      .limit(1)
      .execute()

    if (!loanData) {
      throw new NotFoundException(`El préstamo con ID ${loanId} no existe`)
    }

    if (loanData.status !== 'DELIVERED') {
      throw new BadRequestException(
        `El préstamo debe estar en estado DELIVERED para ser devuelto. Estado actual: ${loanData.status}`,
      )
    }

    return loanData
  }

  async getActiveLoans(userId?: number) {
    const condition = userId
      ? and(eq(loan.status, 'DELIVERED'), eq(loan.requestorId, userId))
      : eq(loan.status, 'DELIVERED')

    return await this.dbService.db
      .select()
      .from(loan)
      .where(condition)
      .orderBy(loan.scheduledReturnDate)
      .execute()
  }

  async getOverdueLoans() {
    const today = new Date()

    return await this.dbService.db
      .select()
      .from(loan)
      .where(
        and(eq(loan.status, 'DELIVERED'), lt(loan.scheduledReturnDate, today)),
      )
      .orderBy(loan.scheduledReturnDate)
      .execute()
  }

  async getStatusIdByName(statusName: string, tx: typeof this.dbService.db) {
    const result = await tx
      .select()
      .from(status)
      .where(eq(status.name, statusName))
      .limit(1)

    if (result.length === 0) {
      throw new NotFoundException(`No se encontró el estado: ${statusName}`)
    }

    return result[0].id
  }
}
