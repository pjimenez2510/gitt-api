import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { and, count, desc, eq } from 'drizzle-orm'
import { location } from 'drizzle/schema/tables/locations/location'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { excludeColumns } from 'src/common/utils/drizzle-helpers'
import { DatabaseService } from 'src/global/database/database.service'
import { CreateLocationDto } from './dto/req/create-location.dto'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'
import { UpdateLocationDto } from './dto/req/update-location.dto'
import { plainToInstance } from 'class-transformer'
import { LocationResDto } from './dto/res/location-res.dto'
import { locationType } from 'drizzle/schema'

@Injectable()
export class LocationsService {
  constructor(private dbService: DatabaseService) {}

  private locationsWithoutDates = excludeColumns(
    location,
    'registrationDate',
    'updateDate',
    'active',
  )

  async findAll({ limit, page }: BaseParamsDto) {
    const offset = (page - 1) * limit

    const query = this.dbService.db
      .select(this.locationsWithoutDates)
      .from(location)
      .where(eq(location.active, true))
      .orderBy(desc(location.name))
      .limit(limit)
      .offset(offset)

    const totalQuery = this.dbService.db
      .select({ count: count() })
      .from(location)
      .where(eq(location.active, true))

    const [records, totalResult] = await Promise.all([
      query.execute(),
      totalQuery.execute(),
    ])

    const total = totalResult[0].count

    return {
      records: plainToInstance(LocationResDto, records),
      total,
      limit,
      page,
      pages: Math.ceil(total / limit),
    }
  }

  async findOne(id: number) {
    const [record] = await this.dbService.db
      .select(this.locationsWithoutDates)
      .from(location)
      .where(and(eq(location.id, id), eq(location.active, true)))
      .limit(1)
      .execute()

    if (!record) {
      throw new NotFoundException(`Location with id ${id} not found`)
    }

    return plainToInstance(LocationResDto, record)
  }

  async create(dto: CreateLocationDto) {
    const [newLocation] = await this.dbService.db
      .insert(location)
      .values({
        name: dto.name,
        description: dto.description,
        warehouseId: dto.warehouseId,
        parentLocationId: dto.parentLocationId,
        type: dto.type as (typeof locationType)['enumValues'][number],
        building: dto.building,
        floor: dto.floor,
        registrationDate: new Date(),
        updateDate: new Date(),
        active: true,
      })
      .returning(this.locationsWithoutDates)
      .execute()

    return plainToInstance(LocationResDto, newLocation)
  }

  async update(id: number, dto: UpdateLocationDto) {
    await this.findOne(id)

    const [updatedLocation] = await this.dbService.db
      .update(location)
      .set({
        ...dto,
        type: dto.type as (typeof locationType)['enumValues'][number],
        capacityUnit: dto.capacityUnit
          ? (dto.capacityUnit as 'UNITS' | 'METERS' | 'SQUARE_METERS' | null)
          : null,
      })
      .where(eq(location.id, id))
      .returning(this.locationsWithoutDates)
      .execute()

    return plainToInstance(LocationResDto, updatedLocation)
  }

  async remove(id: number) {
    await this.findOne(id)

    const [deletedLocation] = await this.dbService.db
      .update(location)
      .set({ active: false, updateDate: new Date() })
      .where(eq(location.id, id))
      .returning(this.locationsWithoutDates)
      .execute()

    if (!deletedLocation) {
      throw new DisplayableException(
        `Error deleting location with id ${id}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }

    return plainToInstance(LocationResDto, deletedLocation)
  }
}
