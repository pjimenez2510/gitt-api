import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { and, count, desc, eq } from 'drizzle-orm'
import { itemMaterial } from 'drizzle/schema'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { excludeColumns } from 'src/common/utils/drizzle-helpers'
import { DatabaseService } from 'src/global/database/database.service'
import { ItemMaterialResDto } from './dto/res/item-material-res.dto'
import { CreateItemMaterialDto } from './dto/req/create-item-material.dto'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'
import { UpdateItemMaterialDto } from './dto/req/update-item-material.dto'

@Injectable()
export class ItemMaterialsService {
  constructor(private readonly dbService: DatabaseService) {}

  private readonly itemMaterialWithoutDates = excludeColumns(
    itemMaterial,
    'registrationDate',
    'updateDate',
  )

  async findByItemId({ limit, page }: BaseParamsDto, itemId: number) {
    const offset = (page - 1) * limit

    const query = this.dbService.db
      .select(this.itemMaterialWithoutDates)
      .from(itemMaterial)
      .where(eq(itemMaterial.itemId, itemId))
      .orderBy(desc(itemMaterial.id))
      .limit(limit)
      .offset(offset)

    const totalQuery = this.dbService.db
      .select({ count: count() })
      .from(itemMaterial)
      .where(eq(itemMaterial.itemId, itemId))

    const [records, totalResult] = await Promise.all([
      query.execute(),
      totalQuery.execute(),
    ])

    const total = totalResult[0].count

    return {
      records: plainToInstance(ItemMaterialResDto, records),
      total,
      limit,
      page,
      pages: Math.ceil(total / limit),
    }
  }

  async findOne(id: number) {
    const [record] = await this.dbService.db
      .select(this.itemMaterialWithoutDates)
      .from(itemMaterial)
      .where(eq(itemMaterial.id, id))
      .limit(1)
      .execute()
    if (!record) {
      throw new NotFoundException(`ítem/material con id ${id} no encontrado`)
    }
    return plainToInstance(ItemMaterialResDto, record)
  }

  async create(dto: CreateItemMaterialDto) {
    const [alreadyExistItemMaterial] = await this.dbService.db
      .select(this.itemMaterialWithoutDates)
      .from(itemMaterial)
      .where(
        and(
          eq(itemMaterial.itemId, dto.itemId),
          eq(itemMaterial.materialId, dto.materialId),
        ),
      )
      .limit(1)
      .execute()

    if (alreadyExistItemMaterial) {
      throw new DisplayableException(
        'Ya existe una combiancion de item y ese material',
        HttpStatus.CONFLICT,
      )
    }

    const [newItemMaterial] = await this.dbService.db
      .insert(itemMaterial)
      .values(dto)
      .returning(this.itemMaterialWithoutDates)
      .execute()
    return plainToInstance(ItemMaterialResDto, newItemMaterial)
  }

  async update(id: number, dto: UpdateItemMaterialDto) {
    await this.findOne(id)

    const [updateditemMaterial] = await this.dbService.db
      .update(itemMaterial)
      .set(dto)
      .where(eq(itemMaterial.id, id))
      .returning(this.itemMaterialWithoutDates)
      .execute()

    return plainToInstance(ItemMaterialResDto, updateditemMaterial)
  }

  //sin borrado logico
  async remove(id: number) {
    await this.findOne(id)

    const [deleteditemMaterial] = await this.dbService.db
      .update(itemMaterial)
      .set({ active: false })
      .where(eq(itemMaterial.id, id))
      .returning(this.itemMaterialWithoutDates)
      .execute()

    if (!deleteditemMaterial) {
      throw new DisplayableException(
        `Error al eliminar el item-material con id ${id}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
    return plainToInstance(ItemMaterialResDto, deleteditemMaterial)
  }
}
