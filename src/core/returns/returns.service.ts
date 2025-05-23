import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'
import { eq, and, lt } from 'drizzle-orm'
import { DatabaseService } from 'src/global/database/database.service'
import { CreateReturnLoanDto } from './dto/req/create-return.dto'
import { loan, loanDetail, user } from 'drizzle/schema'
import { USER_STATUS } from '../users/types/user-status.enum'
import { SimpleUserResDto } from '../auth/dto/res/simple-user-res.dto'
import { StatusLoan } from '../loans/enums/status-loan'

@Injectable()
export class ReturnService {
  constructor(private readonly dbService: DatabaseService) {}

  async processReturn(
    createReturnLoanDto: CreateReturnLoanDto,
    userDto: SimpleUserResDto,
  ) {
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

      // 3. Marcar usuario como moroso si aplica
      const hasDamagedItems = returnedItems.some(
        (item) => item.returnConditionId === 3,
      )

      if (isLate || hasDamagedItems) {
        await tx
          .update(user)
          .set({
            status: USER_STATUS.DEFAULTER,
          })
          .where(eq(user.id, existingLoan.requestorId))
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

    if (loanData.status !== StatusLoan.DELIVERED) {
      throw new BadRequestException(
        `El préstamo debe estar en estado DELIVERED para ser devuelto. Estado actual: ${loanData.status}`,
      )
    }

    return loanData
  }

  async getActiveLoans(userId?: number) {
    const condition = userId
      ? and(eq(loan.status, StatusLoan.DELIVERED), eq(loan.requestorId, userId))
      : eq(loan.status, StatusLoan.DELIVERED)

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
        and(
          eq(loan.status, StatusLoan.DELIVERED),
          lt(loan.scheduledReturnDate, today),
        ),
      )
      .orderBy(loan.scheduledReturnDate)
      .execute()
  }
}
