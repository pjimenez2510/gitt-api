import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { item } from 'drizzle/schema/tables/inventory/item/item'
import { excludeColumns } from 'src/common/utils/drizzle-helpers'
import { DatabaseService } from 'src/global/database/database.service'
import { CreateItemDto } from './dto/req/create-item.dto'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'
import { UpdateItemDto } from './dto/req/update-item.dto'
import { plainToInstance } from 'class-transformer'
import { ItemResDto } from './dto/res/item-res.dto'
import { FilterItemDto } from './dto/req/filter-item.dto'
import { and, count, desc, eq, gte, ilike, lte, SQL } from 'drizzle-orm/sql'

@Injectable()
export class ItemsService {
  constructor(private dbService: DatabaseService) {}

  private itemsWithoutDates = excludeColumns(
    item,
    'registrationDate',
    'updateDate',
    'active',
  )

  async findAll(filterDto: FilterItemDto) {
    const conditions: SQL[] = []

    if (filterDto.code) {
      conditions.push(eq(item.code, filterDto.code))
    }

    if (filterDto.previousCode) {
      conditions.push(eq(item.previousCode, filterDto.previousCode))
    }

    if (filterDto.identifier) {
      conditions.push(eq(item.identifier, filterDto.identifier))
    }

    if (filterDto.certificateId) {
      conditions.push(eq(item.certificateId, filterDto.certificateId))
    }

    if (filterDto.itemTypeId) {
      conditions.push(eq(item.itemTypeId, filterDto.itemTypeId))
    }

    if (filterDto.name) {
      conditions.push(ilike(item.name, `%${filterDto.name}%`))
    }

    if (filterDto.categoryId) {
      conditions.push(eq(item.categoryId, filterDto.categoryId))
    }

    if (filterDto.statusId) {
      conditions.push(eq(item.statusId, filterDto.statusId))
    }

    if (filterDto.conditionId) {
      conditions.push(eq(item.conditionId, filterDto.conditionId))
    }

    if (filterDto.normativeType) {
      conditions.push(eq(item.normativeType, filterDto.normativeType))
    }

    if (filterDto.origin) {
      conditions.push(eq(item.origin, filterDto.origin))
    }

    if (filterDto.entryType) {
      conditions.push(ilike(item.entryType, `%${filterDto.entryType}%`))
    }

    if (filterDto.acquisitionDateFrom) {
      conditions.push(
        gte(item.acquisitionDate, filterDto.acquisitionDateFrom.toISOString()),
      )
    }

    if (filterDto.acquisitionDateTo) {
      conditions.push(
        lte(item.acquisitionDate, filterDto.acquisitionDateTo.toISOString()),
      )
    }

    if (filterDto.modelCharacteristics) {
      conditions.push(
        ilike(item.modelCharacteristics, `%${filterDto.modelCharacteristics}%`),
      )
    }

    if (filterDto.brandBreedOther) {
      conditions.push(
        ilike(item.brandBreedOther, `%${filterDto.brandBreedOther}%`),
      )
    }

    if (filterDto.identificationSeries) {
      conditions.push(
        ilike(item.identificationSeries, `%${filterDto.identificationSeries}%`),
      )
    }

    if (filterDto.critical !== undefined) {
      conditions.push(eq(item.critical, filterDto.critical))
    }

    if (filterDto.dangerous !== undefined) {
      conditions.push(eq(item.dangerous, filterDto.dangerous))
    }

    if (filterDto.requiresSpecialHandling !== undefined) {
      conditions.push(
        eq(item.requiresSpecialHandling, filterDto.requiresSpecialHandling),
      )
    }

    if (filterDto.perishable !== undefined) {
      conditions.push(eq(item.perishable, filterDto.perishable))
    }

    if (filterDto.expirationDateFrom) {
      conditions.push(
        gte(item.expirationDate, filterDto.expirationDateFrom.toISOString()),
      )
    }

    if (filterDto.expirationDateTo) {
      conditions.push(
        lte(item.expirationDate, filterDto.expirationDateTo.toISOString()),
      )
    }

    if (filterDto.locationId) {
      conditions.push(eq(item.locationId, filterDto.locationId))
    }

    if (filterDto.availableForLoan !== undefined) {
      conditions.push(eq(item.availableForLoan, filterDto.availableForLoan))
    }

    if (filterDto.activeCustodian !== undefined) {
      conditions.push(eq(item.activeCustodian, filterDto.activeCustodian))
    }

    conditions.push(eq(item.active, true))

    const whereClause = conditions.length ? and(...conditions) : undefined

    const offset = (filterDto.page - 1) * filterDto.limit

    const query = this.dbService.db
      .select(this.itemsWithoutDates)
      .from(item)
      .where(whereClause)
      .orderBy(desc(item.name))
      .limit(filterDto.limit)
      .offset(offset)

    const totalQuery = this.dbService.db
      .select({ count: count() })
      .from(item)
      .where(whereClause)

    const [records, totalResult] = await Promise.all([
      query.execute(),
      totalQuery.execute(),
    ])

    const total = totalResult[0].count

    return {
      records: plainToInstance(ItemResDto, records),
      total,
      limit: filterDto.limit,
      page: filterDto.page,
      pages: Math.ceil(total / filterDto.limit),
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
