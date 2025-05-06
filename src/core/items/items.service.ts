import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { and, count, desc, eq } from 'drizzle-orm'
import { item } from 'drizzle/schema/tables/inventory/item/item'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { excludeColumns } from 'src/common/utils/drizzle-helpers'
import { DatabaseService } from 'src/global/database/database.service'
import { CreateItemDto } from './dto/req/create-item.dto'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'
import { UpdateItemDto } from './dto/req/update-item.dto'
import { plainToInstance } from 'class-transformer'
import { ItemResDto } from './dto/res/item-res.dto'

@Injectable()
export class ItemsService {
  constructor(private dbService: DatabaseService) {}

  private itemsWithoutDates = excludeColumns(
    item,
    'registrationDate',
    'updateDate',
    'active',
  )

  async findAll({ limit, page }: BaseParamsDto) {
    const offset = (page - 1) * limit

    const query = this.dbService.db
      .select(this.itemsWithoutDates)
      .from(item)
      .where(eq(item.active, true))
      .orderBy(desc(item.name))
      .limit(limit)
      .offset(offset)

    const totalQuery = this.dbService.db
      .select({ count: count() })
      .from(item)
      .where(eq(item.active, true))

    const [records, totalResult] = await Promise.all([
      query.execute(),
      totalQuery.execute(),
    ])

    const total = totalResult[0].count

    return {
      records: plainToInstance(ItemResDto, records),
      total,
      limit,
      page,
      pages: Math.ceil(total / limit),
    }
  }

  async findOne(id: number) {
    const [record] = await this.dbService.db
      .select(this.itemsWithoutDates)
      .from(item)
      .where(and(eq(item.id, id), eq(item.active, true)))
      .limit(1)
      .execute()

    if (!record) {
      throw new NotFoundException(`Item con id ${id} no encontrado`)
    }

    return plainToInstance(ItemResDto, record)
  }

  async create(dto: CreateItemDto, registrationUserId: number) {
    const [newItem] = await this.dbService.db
      .insert(item)
      .values({
        ...dto,
        registrationUserId,
      })
      .returning(this.itemsWithoutDates)
      .execute()

    return plainToInstance(ItemResDto, newItem)
  }

  async update(id: number, dto: UpdateItemDto) {
    await this.findOne(id)

    const updateData = {
      ...dto,
      updateDate: new Date(),
    }

    const [updatedItem] = await this.dbService.db
      .update(item)
      .set(updateData)
      .where(eq(item.id, id))
      .returning(this.itemsWithoutDates)
      .execute()

    return plainToInstance(ItemResDto, updatedItem)
  }

  async remove(id: number) {
    await this.findOne(id)

    const [deletedItem] = await this.dbService.db
      .update(item)
      .set({
        active: false,
        updateDate: new Date(),
      })
      .where(eq(item.id, id))
      .returning(this.itemsWithoutDates)
      .execute()

    if (!deletedItem) {
      throw new DisplayableException(
        `Error al eliminar el item con id ${id}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }

    return plainToInstance(ItemResDto, deletedItem)
  }
}
