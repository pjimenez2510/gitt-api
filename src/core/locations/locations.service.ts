import { Injectable, NotFoundException } from '@nestjs/common'
import { and, count, desc, eq } from 'drizzle-orm'
import { location } from 'drizzle/schema/tables/locations/location'
import { DatabaseService } from 'src/global/database/database.service'
import { CreateLocationDto } from './dto/req/create-location.dto'
import { UpdateLocationDto } from './dto/req/update-location.dto'
import { plainToInstance } from 'class-transformer'
import { LocationResDto } from './dto/res/location-res.dto'
import {
  buildLocationFilterConditions,
  buildLocationWhereClause,
} from './utils/location-filter-builder'
import { FilterLocationDto } from './dto/req/filter-location.dto'
import { locationColumnsAndWith } from './const/location-columns-and-with'

@Injectable()
export class LocationsService {
  constructor(private dbService: DatabaseService) {}

  async findAll(filterDto: FilterLocationDto) {
    const conditions = buildLocationFilterConditions(filterDto)
    const whereClause = buildLocationWhereClause(conditions)

    const offset = (filterDto.page - 1) * filterDto.limit

    const query = this.dbService.db.query.location.findMany({
      where: whereClause,
      columns: locationColumnsAndWith.columns,
      with: locationColumnsAndWith.with,
      orderBy: [desc(location.name)],
      limit: filterDto.allRecords ? undefined : filterDto.limit,
      offset: filterDto.allRecords ? undefined : offset,
    })

    const totalQuery = this.dbService.db
      .select({ count: count() })
      .from(location)
      .where(whereClause)

    const [records, totalResult] = await Promise.all([
      query,
      totalQuery.execute(),
    ])

    const total = totalResult[0].count

    return {
      records: plainToInstance(LocationResDto, records),
      total,
      limit: filterDto.allRecords ? total : filterDto.limit,
      page: filterDto.allRecords ? 1 : filterDto.page,
      pages: filterDto.allRecords ? 1 : Math.ceil(total / filterDto.limit),
    }
  }

  async existById(id: number) {
    const [record] = await this.dbService.db
      .select({ id: location.id })
      .from(location)
      .where(and(eq(location.id, id), eq(location.active, true)))
      .limit(1)
      .execute()

    return !!record
  }

  async findOne(id: number) {
    const record = await this.dbService.db.query.location.findFirst({
      where: and(eq(location.id, id), eq(location.active, true)),
      columns: locationColumnsAndWith.columns,
      with: locationColumnsAndWith.with,
    })

    if (!record) {
      throw new NotFoundException(`Ubicación con id ${id} no encontrada`)
    }

    return plainToInstance(LocationResDto, record)
  }

  async create(dto: CreateLocationDto) {
    const [newLocation] = await this.dbService.db
      .insert(location)
      .values(dto)
      .returning()
      .execute()

    return this.findOne(newLocation.id)
  }

  async update(id: number, dto: UpdateLocationDto) {
    const exists = await this.existById(id)

    if (!exists) {
      throw new NotFoundException(`Ubicación con id ${id} no encontrada`)
    }

    const updateData = {
      ...dto,
      updateDate: new Date(),
    }

    await this.dbService.db
      .update(location)
      .set(updateData)
      .where(eq(location.id, id))
      .execute()

    return this.findOne(id)
  }

  async remove(id: number) {
    const exists = await this.existById(id)

    if (!exists) {
      throw new NotFoundException(`Ubicación con id ${id} no encontrada`)
    }

    const [updatedLocation] = await this.dbService.db
      .update(location)
      .set({ active: false, updateDate: new Date() })
      .where(eq(location.id, id))
      .returning({ active: location.active })
      .execute()

    return updatedLocation.active === false
  }
}
