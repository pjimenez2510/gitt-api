import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { and, count, desc, eq, not } from 'drizzle-orm'
import { DatabaseService } from 'src/global/database/database.service'
import { ItemColorResDto } from './dto/res/item-color-res.dto'
import { CreateItemColorDto } from './dto/req/create-item-color.dto'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'
import { UpdateItemColorDto } from './dto/req/update-item-color.dto'
import { itemColor } from 'drizzle/schema/tables/inventory/item/itemColor'
import { FilterItemColorDto } from './dto/req/item-color-filter.dto'
import { itemColorColumnsAndWith } from './const/item-color-columns-and-with'
import {
  buildItemColorFilterConditions,
  buildItemColorWhereClause,
} from './utils/item-color-filter-builder'

@Injectable()
export class ItemColorsService {
  constructor(private readonly dbService: DatabaseService) {}

  async findAll(filterDto: FilterItemColorDto) {
    const conditions = buildItemColorFilterConditions(filterDto)
    const whereClause = buildItemColorWhereClause(conditions)

    const offset = (filterDto.page - 1) * filterDto.limit

    const query = this.dbService.db.query.itemColor.findMany({
      where: whereClause,
      with: itemColorColumnsAndWith.with,
      columns: itemColorColumnsAndWith.columns,
      orderBy: [desc(itemColor.id)],
      limit: filterDto.allRecords ? undefined : filterDto.limit,
      offset: filterDto.allRecords ? undefined : offset,
    })

    const totalQuery = this.dbService.db
      .select({ count: count() })
      .from(itemColor)
      .where(whereClause)

    const [records, totalResult] = await Promise.all([
      query,
      totalQuery.execute(),
    ])

    const total = totalResult[0].count

    return {
      records: plainToInstance(ItemColorResDto, records),
      total,
      limit: filterDto.allRecords ? total : filterDto.limit,
      page: filterDto.allRecords ? 1 : filterDto.page,
      pages: filterDto.allRecords ? 1 : Math.ceil(total / filterDto.limit),
    }
  }

  async existById(id: number) {
    const [record] = await this.dbService.db
      .select({ id: itemColor.id })
      .from(itemColor)
      .where(and(eq(itemColor.id, id), eq(itemColor.active, true)))
      .limit(1)
      .execute()

    return !!record
  }

  async findOne(id: number) {
    const record = await this.dbService.db.query.itemColor.findFirst({
      where: and(eq(itemColor.id, id), eq(itemColor.active, true)),
      columns: itemColorColumnsAndWith.columns,
      with: itemColorColumnsAndWith.with,
    })

    if (!record) {
      throw new NotFoundException(`Ítem/Color con id ${id} no encontrado`)
    }

    return plainToInstance(ItemColorResDto, record)
  }

  async existsItemAndColorCombination(
    itemId: number,
    colorId: number,
    excludeId?: number,
  ) {
    const record = await this.dbService.db.query.itemColor.findFirst({
      where: and(
        and(
          eq(itemColor.itemId, itemId),
          eq(itemColor.colorId, colorId),
          eq(itemColor.active, true),
          excludeId ? not(eq(itemColor.id, excludeId)) : undefined,
        ),
      ),
      columns: itemColorColumnsAndWith.columns,
      with: itemColorColumnsAndWith.with,
    })

    return !!record
  }

  async create(dto: CreateItemColorDto) {
    const alreadyExistItemColor = await this.existsItemAndColorCombination(
      dto.itemId,
      dto.colorId,
    )

    if (alreadyExistItemColor) {
      throw new DisplayableException(
        'Ya existe una combinación de ítem y ese color',
        HttpStatus.CONFLICT,
      )
    }

    const [newItemColor] = await this.dbService.db
      .insert(itemColor)
      .values(dto)
      .returning()
      .execute()

    return plainToInstance(ItemColorResDto, newItemColor)
  }

  async update(id: number, dto: UpdateItemColorDto) {
    const exists = await this.existById(id)

    if (!exists) {
      throw new NotFoundException(`Ítem/Color con id ${id} no encontrado`)
    }

    if (dto.colorId) {
      const currentRecord = await this.findOne(id)

      const alreadyExistItemColor = await this.existsItemAndColorCombination(
        currentRecord.itemId,
        dto.colorId,
        id,
      )

      if (alreadyExistItemColor) {
        throw new DisplayableException(
          'Ya existe una combinación de ítem y ese color',
          HttpStatus.CONFLICT,
        )
      }
    }

    const [updatedItemColor] = await this.dbService.db
      .update(itemColor)
      .set(dto)
      .where(eq(itemColor.id, id))
      .returning()
      .execute()

    return plainToInstance(ItemColorResDto, updatedItemColor)
  }

  async remove(id: number) {
    const exists = await this.existById(id)

    if (!exists) {
      throw new NotFoundException(`Ítem/Color con id ${id} no encontrado`)
    }

    const [updatedItemColor] = await this.dbService.db
      .update(itemColor)
      .set({ active: false, updateDate: new Date() })
      .where(eq(itemColor.id, id))
      .returning({ active: itemColor.active })
      .execute()

    return updatedItemColor.active === false
  }
}
