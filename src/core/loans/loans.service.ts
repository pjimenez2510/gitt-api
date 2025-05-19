import { Injectable, NotFoundException } from '@nestjs/common'
import { loan } from 'drizzle/schema'
import { excludeColumns } from 'src/common/utils/drizzle-helpers'
import { DatabaseService } from 'src/global/database/database.service'
import { LoanDetailsService } from './loan-details/loan-details.service'
import { and, count, desc, eq, inArray, not } from 'drizzle-orm'
import { plainToInstance } from 'class-transformer'
import { LoanResDto } from './dto/res/loan-res.dto'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { UsersService } from '../users/users.service'

@Injectable()
export class LoansService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly loanDetailService: LoanDetailsService,
    private readonly userService: UsersService,
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

  async findActive({ limit, page }: BaseParamsDto) {
    const offset = (page - 1) * limit

    const query = this.dbService.db
      .select(this.loanWithoutDates)
      .from(loan)
      .where(not(inArray(loan.status, ['CANCELLED', 'RETURNED', 'EXPIRED'])))
      .orderBy(desc(loan.requestorId), desc(loan.registrationDate))
      .limit(limit)
      .offset(offset)

    const totalQuery = this.dbService.db
      .select({ count: count() })
      .from(loan)
      .where(not(inArray(loan.status, ['CANCELLED', 'RETURNED', 'EXPIRED'])))

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
          not(inArray(loan.status, ['CANCELLED'])),
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
          not(inArray(loan.status, ['CANCELLED'])),
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
}
