import { Injectable, NotFoundException } from '@nestjs/common'
import { count, desc, eq } from 'drizzle-orm'
import { assetValue } from 'drizzle/schema'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { excludeColumns } from 'src/common/utils/drizzle-helpers'
import { DatabaseService } from 'src/global/database/database.service'

@Injectable()
export class AssetsValueService {
  constructor(private readonly dbService: DatabaseService) {}

  private readonly assetValueWithoutDates = excludeColumns(
    assetValue,
    'registrationDate',
    'updateDate',
  )

  async findAll({ limit, page }: BaseParamsDto) {
    const offset = (page - 1) * limit

    const query = this.dbService.db
      .select(this.assetValueWithoutDates)
      .from(assetValue)
      .orderBy(desc(assetValue.id))
      .limit(limit)
      .offset(offset)

    const totalQuery = this.dbService.db
      .select({ count: count() })
      .from(assetValue)

    const [records, totalResult] = await Promise.all([
      query.execute(),
      totalQuery.execute(),
    ])

    const total = totalResult[0].count

    return {
      records,
      total,
      limit,
      page,
      pages: Math.ceil(total / limit),
    }
  }

  async findOne(id: number) {
    const [record] = await this.dbService.db
      .select(this.assetValueWithoutDates)
      .from(assetValue)
      .where(eq(assetValue.id, id))
      .limit(1)
      .execute()
    if (!record) {
      throw new NotFoundException(`Asset Value with Itemid ${id} not found`)
    }
    return record
  }

  async findByItemId(id: number) {
    const [record] = await this.dbService.db
      .select(this.assetValueWithoutDates)
      .from(assetValue)
      .where(eq(assetValue.itemId, id))
      .limit(1)
      .execute()
    if (!record) {
      throw new NotFoundException(`Asset Value with Itemid ${id} not found`)
    }
    return record
  }
}
