import { Injectable } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { count, desc, eq } from 'drizzle-orm'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { excludeColumns } from 'src/common/utils/drizzle-helpers'
import { DatabaseService } from 'src/global/database/database.service'
import { LoanDetailResDto } from './dto/res/loan-detail-res.dto'
import { CreateLoanDetailDto } from './dto/req/create-loan-detail.dto'
import { loanDetail } from 'drizzle/schema/tables/loans'

@Injectable()
export class LoanDetailsService {
  constructor(private readonly dbService: DatabaseService) {}

  private readonly loanDetailWithoutDates = excludeColumns(
    loanDetail,
    'registrationDate',
    'updateDate',
  )

  async findByLoanID({ limit, page }: BaseParamsDto, loanId: number) {
    const offset = (page - 1) * limit

    const query = this.dbService.db
      .select(this.loanDetailWithoutDates)
      .from(loanDetail)
      .where(eq(loanDetail.loanId, loanId))
      .orderBy(desc(loanDetail.id))
      .limit(limit)
      .offset(offset)

    const totalQuery = this.dbService.db
      .select({ count: count() })
      .from(loanDetail)
      .where(eq(loanDetail.loanId, loanId))

    const [records, totalResult] = await Promise.all([
      query.execute(),
      totalQuery.execute(),
    ])

    const total = totalResult[0].count

    return {
      records: plainToInstance(LoanDetailResDto, records),
      total,
      limit,
      page,
      pages: Math.ceil(total / limit),
    }
  }

  async findDetailsByLoanID(loanId: number) {
    const records = await this.dbService.db
      .select(this.loanDetailWithoutDates)
      .from(loanDetail)
      .where(eq(loanDetail.loanId, loanId))
      .orderBy(desc(loanDetail.id))
      .execute()

    return plainToInstance(LoanDetailResDto, records)
  }

  async createDetail(loanId: number, detailDto: CreateLoanDetailDto) {
    const [record] = await this.dbService.db
      .insert(loanDetail)
      .values({
        loanId,
        itemId: detailDto.itemId,
        exitConditionId: detailDto.exitConditionId,
        exitObservations: detailDto.exitObservations,
      })
      .returning()

    return plainToInstance(LoanDetailResDto, record)
  }
}
