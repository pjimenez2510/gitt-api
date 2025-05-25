import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { and, count, desc, eq, not } from 'drizzle-orm'
import { DatabaseService } from 'src/global/database/database.service'
import { ItemMaterialResDto } from './dto/res/item-material-res.dto'
import { CreateItemMaterialDto } from './dto/req/create-item-material.dto'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'
import { UpdateItemMaterialDto } from './dto/req/update-item-material.dto'
import { itemMaterial } from 'drizzle/schema/tables/inventory/item/itemMaterial'
import { FilterItemMaterialDto } from './dto/req/item-material-filter.dto'
import { itemMaterialColumnsAndWith } from './const/item-material-columns-and-with'
import {
  buildItemMaterialFilterConditions,
  buildItemMaterialWhereClause,
} from './utils/item-material-filter-builder'

@Injectable()
export class ItemMaterialsService {
  constructor(private readonly dbService: DatabaseService) {}

  async findAll(filterDto: FilterItemMaterialDto) {
    const conditions = buildItemMaterialFilterConditions(filterDto)
    const whereClause = buildItemMaterialWhereClause(conditions)

    const offset = (filterDto.page - 1) * filterDto.limit

    const query = this.dbService.db.query.itemMaterial.findMany({
      where: whereClause,
      with: itemMaterialColumnsAndWith.with,
      columns: itemMaterialColumnsAndWith.columns,
      orderBy: [desc(itemMaterial.id)],
      limit: filterDto.allRecords ? undefined : filterDto.limit,
      offset: filterDto.allRecords ? undefined : offset,
    })

    const totalQuery = this.dbService.db
      .select({ count: count() })
      .from(itemMaterial)
      .where(whereClause)

    const [records, totalResult] = await Promise.all([
      query,
      totalQuery.execute(),
    ])

    const total = totalResult[0].count

    return {
      records: plainToInstance(ItemMaterialResDto, records),
      total,
      limit: filterDto.allRecords ? total : filterDto.limit,
      page: filterDto.allRecords ? 1 : filterDto.page,
      pages: filterDto.allRecords ? 1 : Math.ceil(total / filterDto.limit),
    }
  }

  async existById(id: number) {
    const [record] = await this.dbService.db
      .select({ id: itemMaterial.id })
      .from(itemMaterial)
      .where(and(eq(itemMaterial.id, id), eq(itemMaterial.active, true)))
      .limit(1)
      .execute()

    return !!record
  }

  async findOne(id: number) {
    const record = await this.dbService.db.query.itemMaterial.findFirst({
      where: and(eq(itemMaterial.id, id), eq(itemMaterial.active, true)),
      columns: itemMaterialColumnsAndWith.columns,
      with: itemMaterialColumnsAndWith.with,
    })

    if (!record) {
      throw new NotFoundException(`Ítem/Material con id ${id} no encontrado`)
    }

    return plainToInstance(ItemMaterialResDto, record)
  }

  async existsItemAndMaterialCombination(
    itemId: number,
    materialId: number,
    excludeId?: number,
  ) {
    const record = await this.dbService.db.query.itemMaterial.findFirst({
      where: and(
        eq(itemMaterial.itemId, itemId),
        eq(itemMaterial.materialId, materialId),
        eq(itemMaterial.active, true),
        excludeId ? not(eq(itemMaterial.id, excludeId)) : undefined,
      ),
      columns: {
        id: true,
      },
    })

    return !!record
  }

  async create(dto: CreateItemMaterialDto) {
    const alreadyExistItemMaterial =
      await this.existsItemAndMaterialCombination(dto.itemId, dto.materialId)

    if (alreadyExistItemMaterial) {
      throw new DisplayableException(
        'Ya existe una combinación de ítem y ese material',
        HttpStatus.CONFLICT,
      )
    }

    const [newItemMaterial] = await this.dbService.db
      .insert(itemMaterial)
      .values(dto)
      .returning()
      .execute()

    return this.findOne(newItemMaterial.id)
  }

  async update(id: number, dto: UpdateItemMaterialDto) {
    const exists = await this.existById(id)

    if (!exists) {
      throw new NotFoundException(`Ítem/Material con id ${id} no encontrado`)
    }

    // Si se está actualizando el materialId, verificar que no exista ya esa combinación
    if (dto.materialId) {
      // Primero obtenemos el itemId actual
      const currentRecord = await this.findOne(id)

      const alreadyExistItemMaterial =
        await this.existsItemAndMaterialCombination(
          currentRecord.itemId,
          dto.materialId,
          id,
        )

      if (alreadyExistItemMaterial) {
        throw new DisplayableException(
          'Ya existe una combinación de ítem y ese material',
          HttpStatus.CONFLICT,
        )
      }
    }

    await this.dbService.db
      .update(itemMaterial)
      .set(dto)
      .where(eq(itemMaterial.id, id))
      .execute()

    return this.findOne(id)
  }

  async remove(id: number) {
    const exists = await this.existById(id)

    if (!exists) {
      throw new NotFoundException(`Ítem/Material con id ${id} no encontrado`)
    }

    const [updatedItemMaterial] = await this.dbService.db
      .update(itemMaterial)
      .set({ active: false, updateDate: new Date() })
      .where(eq(itemMaterial.id, id))
      .returning({ active: itemMaterial.active })
      .execute()

    return updatedItemMaterial.active === false
  }
}
