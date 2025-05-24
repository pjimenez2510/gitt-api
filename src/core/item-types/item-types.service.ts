import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { and, count, desc, eq, not, sql } from 'drizzle-orm'
import { itemType } from 'drizzle/schema/tables/inventory/itemType'
import { DatabaseService } from 'src/global/database/database.service'
import { CreateItemTypeDto } from './dto/req/create-item-type.dto'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'
import { UpdateItemTypeDto } from './dto/req/update-item-type.dto'
import { plainToInstance } from 'class-transformer'
import { ItemTypeResDto } from './dto/res/item-type-res.dto'
import { FilterItemTypeDto } from './dto/req/item-type-filter.dto'
import { itemTypeColumnsAndWith } from './const/item-type-columns-and-with'
import {
  buildItemTypeFilterConditions,
  buildItemTypeWhereClause,
} from './utils/item-type-filter-builder'

@Injectable()
export class ItemTypesService {
  constructor(private readonly dbService: DatabaseService) {}

  async findAll(filterDto: FilterItemTypeDto) {
    const conditions = buildItemTypeFilterConditions(filterDto)
    const whereClause = buildItemTypeWhereClause(conditions)

    const offset = (filterDto.page - 1) * filterDto.limit

    const query = this.dbService.db.query.itemType.findMany({
      where: whereClause,
      with: itemTypeColumnsAndWith.with,
      columns: itemTypeColumnsAndWith.columns,
      orderBy: [desc(itemType.name)],
      limit: filterDto.allRecords ? undefined : filterDto.limit,
      offset: filterDto.allRecords ? undefined : offset,
    })

    const totalQuery = this.dbService.db
      .select({ count: count() })
      .from(itemType)
      .where(whereClause)

    const [records, totalResult] = await Promise.all([
      query,
      totalQuery.execute(),
    ])

    const total = totalResult[0].count

    return {
      records: plainToInstance(ItemTypeResDto, records),
      total,
      limit: filterDto.allRecords ? total : filterDto.limit,
      page: filterDto.allRecords ? 1 : filterDto.page,
      pages: filterDto.allRecords ? 1 : Math.ceil(total / filterDto.limit),
    }
  }

  async existById(id: number) {
    const [record] = await this.dbService.db
      .select({ id: itemType.id })
      .from(itemType)
      .where(and(eq(itemType.id, id), eq(itemType.active, true)))
      .limit(1)
      .execute()

    return !!record
  }

  async findOne(id: number) {
    const record = await this.dbService.db.query.itemType.findFirst({
      where: and(eq(itemType.id, id), eq(itemType.active, true)),
      columns: itemTypeColumnsAndWith.columns,
      with: itemTypeColumnsAndWith.with,
    })

    if (!record) {
      throw new NotFoundException(`Tipo de ítem con id ${id} no encontrado`)
    }

    return plainToInstance(ItemTypeResDto, record)
  }

  async existByCode(code?: string, excludeId?: number) {
    if (!code) return false

    const [record] = await this.dbService.db
      .select({ id: itemType.id })
      .from(itemType)
      .where(
        and(
          eq(sql<string>`lower(${itemType.code})`, code.toLowerCase()),
          eq(itemType.active, true),
          excludeId ? not(eq(itemType.id, excludeId)) : undefined,
        ),
      )
      .limit(1)
      .execute()

    return !!record
  }

  async create(dto: CreateItemTypeDto) {
    const alreadyExistItemType = await this.existByCode(dto.code)

    if (alreadyExistItemType) {
      throw new DisplayableException(
        'Ya existe un tipo de ítem con este código',
        HttpStatus.CONFLICT,
      )
    }

    const [newItemType] = await this.dbService.db
      .insert(itemType)
      .values(dto)
      .returning()
      .execute()

    return this.findOne(newItemType.id)
  }

  async update(id: number, dto: UpdateItemTypeDto) {
    const exists = await this.existById(id)

    if (!exists) {
      throw new NotFoundException(`Tipo de ítem con id ${id} no encontrado`)
    }

    const alreadyExistItemType = await this.existByCode(dto.code, id)

    if (alreadyExistItemType) {
      throw new DisplayableException(
        'Ya existe un tipo de ítem con este código',
        HttpStatus.CONFLICT,
      )
    }

    await this.dbService.db
      .update(itemType)
      .set(dto)
      .where(eq(itemType.id, id))
      .execute()

    return this.findOne(id)
  }

  async remove(id: number) {
    const exists = await this.existById(id)

    if (!exists) {
      throw new NotFoundException(`Tipo de ítem con id ${id} no encontrado`)
    }

    const [updatedItemType] = await this.dbService.db
      .update(itemType)
      .set({ active: false, updateDate: new Date() })
      .where(eq(itemType.id, id))
      .returning({ active: itemType.active })
      .execute()

    return updatedItemType.active === false
  }
}
