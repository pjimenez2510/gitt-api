import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { and, count, desc, eq } from 'drizzle-orm'
import { warehouse } from 'drizzle/schema/tables/locations/warehouse'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { excludeColumns } from 'src/common/utils/drizzle-helpers'
import { DatabaseService } from 'src/global/database/database.service'
import { CreateWarehouseDto } from './dto/req/create-warehouse.dto'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'
import { UpdateWarehouseDto } from './dto/req/update-warehouse.dto'
import { plainToInstance } from 'class-transformer'
import { WarehouseResDto } from './dto/res/warehouse-res.dto'

@Injectable()
export class WarehousesService {
  constructor(private dbService: DatabaseService) {}

  private warehousesWithoutDates = excludeColumns(
    warehouse,
    'registrationDate',
    'updateDate',
    'active',
  )

  async findAll({ limit, page }: BaseParamsDto) {
    const offset = (page - 1) * limit

    const query = this.dbService.db
      .select(this.warehousesWithoutDates)
      .from(warehouse)
      .where(eq(warehouse.active, true))
      .orderBy(desc(warehouse.name))
      .limit(limit)
      .offset(offset)

    const totalQuery = this.dbService.db
      .select({ count: count() })
      .from(warehouse)
      .where(eq(warehouse.active, true))

    const [records, totalResult] = await Promise.all([
      query.execute(),
      totalQuery.execute(),
    ])

    const total = totalResult[0].count

    return {
      records: plainToInstance(WarehouseResDto, records),
      total,
      limit,
      page,
      pages: Math.ceil(total / limit),
    }
  }

  async findOne(id: string) {
    const [record] = await this.dbService.db
      .select(this.warehousesWithoutDates)
      .from(warehouse)
      .where(and(eq(warehouse.id, id), eq(warehouse.active, true)))
      .limit(1)
      .execute()

    if (!record) {
      throw new NotFoundException(`Almacén con id ${id} no encontrado`)
    }

    return plainToInstance(WarehouseResDto, record)
  }

  async create(dto: CreateWarehouseDto) {
    const [newWarehouse] = await this.dbService.db
      .insert(warehouse)
      .values({
        name: dto.name,
        location: dto.location,
        responsibleId: dto.responsibleId,
        description: dto.description,
      })
      .returning(this.warehousesWithoutDates)
      .execute()

    return plainToInstance(WarehouseResDto, newWarehouse)
  }

  async update(id: string, dto: UpdateWarehouseDto) {
    await this.findOne(id)

    const [updatedWarehouse] = await this.dbService.db
      .update(warehouse)
      .set(dto)
      .where(eq(warehouse.id, id))
      .returning(this.warehousesWithoutDates)
      .execute()

    return plainToInstance(WarehouseResDto, updatedWarehouse)
  }

  async remove(id: string) {
    await this.findOne(id)

    const [deletedWarehouse] = await this.dbService.db
      .update(warehouse)
      .set({ active: false, updateDate: new Date() })
      .where(eq(warehouse.id, id))
      .returning(this.warehousesWithoutDates)
      .execute()

    if (!deletedWarehouse) {
      throw new DisplayableException(
        `Error al eliminar el almacén con id ${id}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }

    return plainToInstance(WarehouseResDto, deletedWarehouse)
  }
}
