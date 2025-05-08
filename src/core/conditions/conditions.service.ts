import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { and, count, desc, eq, not, sql } from 'drizzle-orm'
import { condition } from 'drizzle/schema/tables/inventory/condition'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { excludeColumns } from 'src/common/utils/drizzle-helpers'
import { DatabaseService } from 'src/global/database/database.service'
import { CreateConditionDto } from './dto/req/create-condition.dto'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'
import { UpdateConditionDto } from './dto/req/update-condition.dto'
import { plainToInstance } from 'class-transformer'
import { ConditionResDto } from './dto/res/condition-res.dto'

@Injectable()
export class ConditionsService {
  constructor(private readonly dbService: DatabaseService) {}

  private readonly conditionsWithoutDates = excludeColumns(
    condition,
    'registrationDate',
    'updateDate',
    'active',
  )

  async findAll({ limit, page }: BaseParamsDto) {
    const offset = (page - 1) * limit

    const query = this.dbService.db
      .select(this.conditionsWithoutDates)
      .from(condition)
      .where(eq(condition.active, true))
      .orderBy(desc(condition.name))
      .limit(limit)
      .offset(offset)

    const totalQuery = this.dbService.db
      .select({ count: count() })
      .from(condition)
      .where(eq(condition.active, true))

    const [records, totalResult] = await Promise.all([
      query.execute(),
      totalQuery.execute(),
    ])

    const total = totalResult[0].count

    return {
      records: plainToInstance(ConditionResDto, records),
      total,
      limit,
      page,
      pages: Math.ceil(total / limit),
    }
  }

  async findOne(id: number) {
    const [record] = await this.dbService.db
      .select(this.conditionsWithoutDates)
      .from(condition)
      .where(and(eq(condition.id, id), eq(condition.active, true)))
      .limit(1)
      .execute()

    if (!record) {
      throw new NotFoundException(`Condición con id ${id} no encontrada`)
    }

    return plainToInstance(ConditionResDto, record)
  }

  async existByName(name?: string, excludeId?: number) {
    if (!name) return true
    const [record] = await this.dbService.db
      .select(this.conditionsWithoutDates)
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
      .returning(this.conditionsWithoutDates)
      .execute()

    return plainToInstance(ConditionResDto, newCondition)
  }

  async update(id: number, dto: UpdateConditionDto) {
    await this.findOne(id)

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
      .returning(this.conditionsWithoutDates)
      .execute()

    return plainToInstance(ConditionResDto, updatedCondition)
  }

  async remove(id: number) {
    await this.findOne(id)

    const [deletedCondition] = await this.dbService.db
      .update(condition)
      .set({ active: false, updateDate: new Date() })
      .where(eq(condition.id, id))
      .returning(this.conditionsWithoutDates)
      .execute()

    if (!deletedCondition) {
      throw new DisplayableException(
        `Error al eliminar la condición con id ${id}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }

    return plainToInstance(ConditionResDto, deletedCondition)
  }
}
