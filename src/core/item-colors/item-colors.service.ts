import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { and, count, desc, eq } from 'drizzle-orm'
import { itemColor } from 'drizzle/schema'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { excludeColumns } from 'src/common/utils/drizzle-helpers'
import { DatabaseService } from 'src/global/database/database.service'
import { ItemColorResDto } from './dto/res/item-color-res.dto'
import { CreateItemColorDto } from './dto/req/create-item-color.dto'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'
import { UpdateItemColorDto } from './dto/req/update-item-color.dto'

@Injectable()
export class ItemColorsService {
  constructor(private readonly dbService: DatabaseService) {}

  private readonly itemColorsWithoutDates = excludeColumns(
    itemColor,
    'registrationDate',
    'updateDate',
  )

  async findByItemId({ limit, page }: BaseParamsDto, itemId: number) {
    const offset = (page - 1) * limit

    const query = this.dbService.db
      .select(this.itemColorsWithoutDates)
      .from(itemColor)
      .where(eq(itemColor.itemId, itemId))
      .orderBy(desc(itemColor.id))
      .limit(limit)
      .offset(offset)

    const totalQuery = this.dbService.db
      .select({ count: count() })
      .from(itemColor)
      .where(eq(itemColor.itemId, itemId))

    const [records, totalResult] = await Promise.all([
      query.execute(),
      totalQuery.execute(),
    ])

    const total = totalResult[0].count

    return {
      records: plainToInstance(ItemColorResDto, records),
      total,
      limit,
      page,
      pages: Math.ceil(total / limit),
    }
  }

  async findOne(id: number) {
    const [record] = await this.dbService.db
      .select(this.itemColorsWithoutDates)
      .from(itemColor)
      .where(eq(itemColor.id, id))
      .limit(1)
      .execute()
    if (!record) {
      throw new NotFoundException(`ítem/Color con id ${id} no encontrado`)
    }
    return plainToInstance(ItemColorResDto, record)
  }

  async create(dto: CreateItemColorDto) {
    const [alreadyExistItemColor] = await this.dbService.db
      .select(this.itemColorsWithoutDates)
      .from(itemColor)
      .where(
        and(
          eq(itemColor.itemId, dto.itemId),
          eq(itemColor.colorId, dto.colorId),
        ),
      )
      .limit(1)
      .execute()

    if (alreadyExistItemColor) {
      throw new DisplayableException(
        'Ya existe una combiancion de item y ese color',
        HttpStatus.CONFLICT,
      )
    }

    const [newItemColor] = await this.dbService.db
      .insert(itemColor)
      .values(dto)
      .returning(this.itemColorsWithoutDates)
      .execute()
    return plainToInstance(ItemColorResDto, newItemColor)
  }

  async update(id: number, dto: UpdateItemColorDto) {
    await this.findOne(id)

    const [updatedItemColor] = await this.dbService.db
      .update(itemColor)
      .set(dto)
      .where(eq(itemColor.id, id))
      .returning(this.itemColorsWithoutDates)
      .execute()

    return plainToInstance(ItemColorResDto, updatedItemColor)
  }

  //sin borrado logico
  async remove(id: number) {
    await this.findOne(id)

    const [deletedItemColor] = await this.dbService.db
      .update(itemColor)
      .set({ active: false })
      .where(eq(itemColor.id, id))
      .returning(this.itemColorsWithoutDates)
      .execute()

    if (!deletedItemColor) {
      throw new DisplayableException(
        `Error al eliminar el item-color con id ${id}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
    return plainToInstance(ItemColorResDto, deletedItemColor)
  }
}
