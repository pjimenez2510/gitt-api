import { Injectable, NotFoundException } from '@nestjs/common'
import { item } from 'drizzle/schema/tables/inventory/item/item'
import { excludeColumns } from 'src/common/utils/drizzle-helpers'
import { DatabaseService } from 'src/global/database/database.service'
import { CreateItemDto } from './dto/req/create-item.dto'
import { UpdateItemDto } from './dto/req/update-item.dto'
import { FilterItemDto } from './dto/req/filter-item.dto'
import { and, count, desc, eq } from 'drizzle-orm/sql'
import { itemColumnsAndWith } from './const/item-columns-and-with'
import {
  buildItemFilterConditions,
  buildItemWhereClause,
} from './utils/item-filter-builder'
import { plainToInstance } from 'class-transformer'
import { ItemResDto } from './dto/res/item-res.dto'

@Injectable()
export class ItemsService {
  constructor(private readonly dbService: DatabaseService) {}

  private itemsWithoutDates = excludeColumns(
    item,
    'registrationDate',
    'updateDate',
    'active',
  )

  async findAll(filterDto: FilterItemDto) {
    const conditions = buildItemFilterConditions(filterDto)
    const whereClause = buildItemWhereClause(conditions)

    const offset = (filterDto.page - 1) * filterDto.limit

    const itemsResult = await this.dbService.db.query.item.findMany({
      where: whereClause,
      with: {
        ...itemColumnsAndWith.with,
      },
      columns: itemColumnsAndWith.columns,
      orderBy: [desc(item.name)],
      limit: filterDto.allRecords ? undefined : filterDto.limit,
      offset: filterDto.allRecords ? undefined : offset,
    })

    const totalResult = await this.dbService.db
      .select({ count: count() })
      .from(item)
      .where(whereClause)
      .execute()

    const total = totalResult[0].count

    return {
      records: itemsResult,
      total,
      limit: filterDto.allRecords ? total : filterDto.limit,
      page: filterDto.allRecords ? 1 : filterDto.page,
      pages: filterDto.allRecords ? 1 : Math.ceil(total / filterDto.limit),
    }
  }

  async existById(id: number) {
    const itemResult = await this.dbService.db.query.item.findFirst({
      where: and(eq(item.id, id), eq(item.active, true)),
      columns: {
        id: true,
      },
    })

    return itemResult?.id !== undefined
  }

  async findOne(id: number) {
    const itemResult = await this.dbService.db.query.item.findFirst({
      where: and(eq(item.id, id), eq(item.active, true)),
      columns: itemColumnsAndWith.columns,
      with: {
        ...itemColumnsAndWith.with,
      },
    })

    if (!itemResult) {
      throw new NotFoundException(`Item con id ${id} no encontrado`)
    }

    return plainToInstance(ItemResDto, itemResult)
  }

  async create(dto: CreateItemDto, registrationUserId: number) {
    const [newItem] = await this.dbService.db
      .insert(item)
      .values({
        ...dto,
        registrationUserId,
      })
      .returning({ id: item.id })
      .execute()

    return this.findOne(newItem.id)
  }

  async update(id: number, dto: UpdateItemDto) {
    const exists = await this.existById(id)

    if (!exists) {
      throw new NotFoundException(`Item con id ${id} no encontrado`)
    }

    const updateData = {
      ...dto,
      updateDate: new Date(),
    }

    await this.dbService.db
      .update(item)
      .set(updateData)
      .where(eq(item.id, id))
      .execute()

    return this.findOne(id)
  }

  async remove(id: number) {
    const exists = await this.existById(id)

    if (!exists) {
      throw new NotFoundException(`Item con id ${id} no encontrado`)
    }

    const [itemToRemove] = await this.dbService.db
      .update(item)
      .set({
        active: false,
        updateDate: new Date(),
      })
      .where(eq(item.id, id))
      .returning({ active: item.active })
      .execute()

    return itemToRemove.active === false
  }
}
