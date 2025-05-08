import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { and, count, desc, eq, not, sql } from 'drizzle-orm'
import { itemType } from 'drizzle/schema/tables/inventory/itemType'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { excludeColumns } from 'src/common/utils/drizzle-helpers'
import { DatabaseService } from 'src/global/database/database.service'
import { CreateItemTypeDto } from './dto/req/create-item-type.dto'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'
import { UpdateItemTypeDto } from './dto/req/update-item-type.dto'
import { plainToInstance } from 'class-transformer'
import { ItemTypeResDto } from './dto/res/item-type-res.dto'

@Injectable()
export class ItemTypesService {
  constructor(private readonly dbService: DatabaseService) {}

  private readonly itemTypesWithoutDates = excludeColumns(
    itemType,
    'registrationDate',
    'updateDate',
    'active',
  )

  async findAll({ limit, page }: BaseParamsDto) {
    const offset = (page - 1) * limit

    const query = this.dbService.db
      .select(this.itemTypesWithoutDates)
      .from(itemType)
      .where(eq(itemType.active, true))
      .orderBy(desc(itemType.name))
      .limit(limit)
      .offset(offset)

    const totalQuery = this.dbService.db
      .select({ count: count() })
      .from(itemType)
      .where(eq(itemType.active, true))

    const [records, totalResult] = await Promise.all([
      query.execute(),
      totalQuery.execute(),
    ])

    const total = totalResult[0].count

    return {
      records: plainToInstance(ItemTypeResDto, records),
      total,
      limit,
      page,
      pages: Math.ceil(total / limit),
    }
  }

  async findOne(id: number) {
    const [record] = await this.dbService.db
      .select(this.itemTypesWithoutDates)
      .from(itemType)
      .where(and(eq(itemType.id, id), eq(itemType.active, true)))
      .limit(1)
      .execute()
    if (!record) {
      throw new NotFoundException(`Tipo de ítem con id ${id} no encontrado`)
    }
    return plainToInstance(ItemTypeResDto, record)
  }

  async existByCode(code?: string, excludeId?: number) {
    if (!code) return true

    const [alreadyExistItemType] = await this.dbService.db
      .select(this.itemTypesWithoutDates)
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

    return !!alreadyExistItemType
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
      .values({
        code: dto.code,
        name: dto.name,
        description: dto.description,
        active: dto.active,
      })
      .returning(this.itemTypesWithoutDates)
      .execute()
    return plainToInstance(ItemTypeResDto, newItemType)
  }

  async update(id: number, dto: UpdateItemTypeDto) {
    await this.findOne(id)

    const alreadyExistItemType = await this.existByCode(dto.code, id)

    if (alreadyExistItemType) {
      throw new DisplayableException(
        'Ya existe un tipo de ítem con este código',
        HttpStatus.CONFLICT,
      )
    }

    const [updatedItemType] = await this.dbService.db
      .update(itemType)
      .set(dto)
      .where(eq(itemType.id, id))
      .returning(this.itemTypesWithoutDates)
      .execute()

    return plainToInstance(ItemTypeResDto, updatedItemType)
  }

  async remove(id: number) {
    await this.findOne(id)

    const [deletedItemType] = await this.dbService.db
      .update(itemType)
      .set({ active: false, updateDate: new Date() })
      .where(eq(itemType.id, id))
      .returning(this.itemTypesWithoutDates)
      .execute()

    if (!deletedItemType) {
      throw new DisplayableException(
        `Error al eliminar el tipo de ítem con id ${id}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
    return plainToInstance(ItemTypeResDto, deletedItemType)
  }
}
