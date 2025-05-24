import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { and, count, desc, eq, not, sql } from 'drizzle-orm'
import { condition } from 'drizzle/schema/tables/inventory/condition'
import { DatabaseService } from 'src/global/database/database.service'
import { CreateConditionDto } from './dto/req/create-condition.dto'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'
import { UpdateConditionDto } from './dto/req/update-condition.dto'
import { plainToInstance } from 'class-transformer'
import { ConditionResDto } from './dto/res/condition-res.dto'
import { FilterConditionDto } from './dto/req/condition-filter.dto'
import { conditionColumnsAndWith } from './const/condition-columns-and-with'
import {
  buildConditionFilterConditions,
  buildConditionWhereClause,
} from './utils/condition-filter-builder'

@Injectable()
export class ConditionsService {
  constructor(private readonly dbService: DatabaseService) {}

  async findAll(filterDto: FilterConditionDto) {
    const conditions = buildConditionFilterConditions(filterDto)
    const whereClause = buildConditionWhereClause(conditions)

    const offset = (filterDto.page - 1) * filterDto.limit

    const query = this.dbService.db.query.condition.findMany({
      where: whereClause,
      with: conditionColumnsAndWith.with,
      columns: conditionColumnsAndWith.columns,
      orderBy: [desc(condition.name)],
      limit: filterDto.allRecords ? undefined : filterDto.limit,
      offset: filterDto.allRecords ? undefined : offset,
    })

    const totalQuery = this.dbService.db
      .select({ count: count() })
      .from(condition)
      .where(whereClause)

    const [records, totalResult] = await Promise.all([
      query,
      totalQuery.execute(),
    ])

    const total = totalResult[0].count

    return {
      records: plainToInstance(ConditionResDto, records),
      total,
      limit: filterDto.allRecords ? total : filterDto.limit,
      page: filterDto.allRecords ? 1 : filterDto.page,
      pages: filterDto.allRecords ? 1 : Math.ceil(total / filterDto.limit),
    }
  }

  async existById(id: number) {
    const [record] = await this.dbService.db
      .select({ id: condition.id })
      .from(condition)
      .where(and(eq(condition.id, id), eq(condition.active, true)))
      .limit(1)
      .execute()

    return !!record
  }

  async findOne(id: number) {
    const record = await this.dbService.db.query.condition.findFirst({
      where: and(eq(condition.id, id), eq(condition.active, true)),
      columns: conditionColumnsAndWith.columns,
      with: conditionColumnsAndWith.with,
    })

    if (!record) {
      throw new NotFoundException(`Condición con id ${id} no encontrada`)
    }

    return plainToInstance(ConditionResDto, record)
  }

  async existByName(name?: string, excludeId?: number) {
    if (!name) return false

    const [record] = await this.dbService.db
      .select({ id: condition.id })
      .from(condition)
      .where(
        and(
          eq(sql<string>`lower(${condition.name})`, name.toLowerCase()),
          eq(condition.active, true),
          excludeId ? not(eq(condition.id, excludeId)) : undefined,
        ),
      )
      .limit(1)
      .execute()

    return !!record
  }

  async create(dto: CreateConditionDto) {
    const alreadyExistCondition = await this.existByName(dto.name)

    if (alreadyExistCondition) {
      throw new DisplayableException(
        'Ya existe una condición con este nombre',
        HttpStatus.CONFLICT,
      )
    }

    const [newCondition] = await this.dbService.db
      .insert(condition)
      .values({
        name: dto.name,
        description: dto.description,
        requiresMaintenance: dto.requiresMaintenance,
      })
      .returning()
      .execute()

    return plainToInstance(ConditionResDto, newCondition)
  }

  async update(id: number, dto: UpdateConditionDto) {
    const exists = await this.existById(id)

    if (!exists) {
      throw new NotFoundException(`Condición con id ${id} no encontrada`)
    }

    const alreadyExistCondition = await this.existByName(dto.name, id)

    if (alreadyExistCondition) {
      throw new DisplayableException(
        'Ya existe una condición con este nombre',
        HttpStatus.CONFLICT,
      )
    }

    const [updatedCondition] = await this.dbService.db
      .update(condition)
      .set(dto)
      .where(eq(condition.id, id))
      .returning()
      .execute()

    return plainToInstance(ConditionResDto, updatedCondition)
  }

  async remove(id: number) {
    const exists = await this.existById(id)

    if (!exists) {
      throw new NotFoundException(`Condición con id ${id} no encontrada`)
    }

    await this.dbService.db
      .update(condition)
      .set({ active: false, updateDate: new Date() })
      .where(eq(condition.id, id))
      .execute()

    return true
  }
}
