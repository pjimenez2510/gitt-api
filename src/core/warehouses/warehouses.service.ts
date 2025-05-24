import { Injectable, NotFoundException } from '@nestjs/common'
import { and, count, desc, eq } from 'drizzle-orm'
import { warehouse } from 'drizzle/schema/tables/locations/warehouse'
import { DatabaseService } from 'src/global/database/database.service'
import { CreateWarehouseDto } from './dto/req/create-warehouse.dto'
import { UpdateWarehouseDto } from './dto/req/update-warehouse.dto'
import { plainToInstance } from 'class-transformer'
import { WarehouseResDto } from './dto/res/warehouse-res.dto'
import { FilterWarehouseDto } from './dto/req/filter-warehouse.dto'
import { warehouseColumnsAndWith } from './const/warehouse-columns-and-with'
import {
  buildWarehouseFilterConditions,
  buildWarehouseWhereClause,
} from './utils/warehouse-filter-builder'

@Injectable()
export class WarehousesService {
  constructor(private readonly dbService: DatabaseService) {}

  async findAll(filterDto: FilterWarehouseDto) {
    const conditions = buildWarehouseFilterConditions(filterDto)
    const whereClause = buildWarehouseWhereClause(conditions)

    const offset = (filterDto.page - 1) * filterDto.limit

    const warehousesResult = await this.dbService.db.query.warehouse.findMany({
      where: whereClause,
      with: warehouseColumnsAndWith.with,
      columns: warehouseColumnsAndWith.columns,
      orderBy: [desc(warehouse.name)],
      limit: filterDto.allRecords ? undefined : filterDto.limit,
      offset: filterDto.allRecords ? undefined : offset,
    })

    const totalResult = await this.dbService.db
      .select({ count: count() })
      .from(warehouse)
      .where(whereClause)
      .execute()

    const total = totalResult[0].count

    return {
      records: warehousesResult,
      total,
      limit: filterDto.allRecords ? total : filterDto.limit,
      page: filterDto.allRecords ? 1 : filterDto.page,
      pages: filterDto.allRecords ? 1 : Math.ceil(total / filterDto.limit),
    }
  }

  async existById(id: number) {
    const warehouseResult = await this.dbService.db.query.warehouse.findFirst({
      where: and(eq(warehouse.id, id), eq(warehouse.active, true)),
      columns: {
        id: true,
      },
    })

    return warehouseResult?.id !== undefined
  }

  async findOne(id: number) {
    const warehouseResult = await this.dbService.db.query.warehouse.findFirst({
      where: and(eq(warehouse.id, id), eq(warehouse.active, true)),
      columns: warehouseColumnsAndWith.columns,
      with: warehouseColumnsAndWith.with,
    })

    if (!warehouseResult) {
      throw new NotFoundException(`Almacén con id ${id} no encontrado`)
    }

    return plainToInstance(WarehouseResDto, warehouseResult)
  }

  async create(dto: CreateWarehouseDto) {
    const [newWarehouse] = await this.dbService.db
      .insert(warehouse)
      .values({
        ...dto,
      })
      .returning({ id: warehouse.id })
      .execute()

    return this.findOne(newWarehouse.id)
  }

  async update(id: number, dto: UpdateWarehouseDto) {
    const exists = await this.existById(id)

    if (!exists) {
      throw new NotFoundException(`Almacén con id ${id} no encontrado`)
    }

    const updateData = {
      ...dto,
      updateDate: new Date(),
    }

    await this.dbService.db
      .update(warehouse)
      .set(updateData)
      .where(eq(warehouse.id, id))
      .execute()

    return this.findOne(id)
  }

  async remove(id: number) {
    const exists = await this.existById(id)

    if (!exists) {
      throw new NotFoundException(`Almacén con id ${id} no encontrado`)
    }

    const [warehouseToRemove] = await this.dbService.db
      .update(warehouse)
      .set({
        active: false,
        updateDate: new Date(),
      })
      .where(eq(warehouse.id, id))
      .returning({ active: warehouse.active })
      .execute()

    return warehouseToRemove.active === false
  }
}
