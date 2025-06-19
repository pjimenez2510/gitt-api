import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { and, count, desc, eq, not, sql } from 'drizzle-orm'
import { color } from 'drizzle/schema/tables/inventory/color'
import { DatabaseService } from 'src/global/database/database.service'
import { CreateColorDto } from './dto/req/create-color.dto'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'
import { UpdateColorDto } from './dto/req/update-color.dto'
import { plainToInstance } from 'class-transformer'
import { ColorResDto } from './dto/res/color-res.dto'
import { FilterColorDto } from './dto/req/color-filter.dto'
import { colorColumnsAndWith } from './const/color-columns-and-with'
import {
  buildColorFilterConditions,
  buildColorWhereClause,
} from './utils/color-filter-builder'

@Injectable()
export class ColorsService {
  constructor(private readonly dbService: DatabaseService) {}

  async findAll(filterDto: FilterColorDto) {
    const conditions = buildColorFilterConditions(filterDto)
    const whereClause = buildColorWhereClause(conditions)

    const offset = (filterDto.page - 1) * filterDto.limit

    const query = this.dbService.db.query.color.findMany({
      where: whereClause,
      with: colorColumnsAndWith.with,
      columns: colorColumnsAndWith.columns,
      orderBy: [desc(color.name)],
      limit: filterDto.allRecords ? undefined : filterDto.limit,
      offset: filterDto.allRecords ? undefined : offset,
    })

    const totalQuery = this.dbService.db
      .select({ count: count() })
      .from(color)
      .where(whereClause)

    const [records, totalResult] = await Promise.all([
      query,
      totalQuery.execute(),
    ])

    const total = totalResult[0].count

    return {
      records: plainToInstance(ColorResDto, records),
      total,
      limit: filterDto.allRecords ? total : filterDto.limit,
      page: filterDto.allRecords ? 1 : filterDto.page,
      pages: filterDto.allRecords ? 1 : Math.ceil(total / filterDto.limit),
    }
  }

  async existById(id: number) {
    const [record] = await this.dbService.db
      .select({ id: color.id })
      .from(color)
      .where(and(eq(color.id, id), eq(color.active, true)))
      .limit(1)
      .execute()

    return !!record
  }

  async findOne(id: number) {
    const record = await this.dbService.db.query.color.findFirst({
      where: and(eq(color.id, id), eq(color.active, true)),
      columns: colorColumnsAndWith.columns,
      with: colorColumnsAndWith.with,
    })

    if (!record) {
      throw new NotFoundException(`Color con id ${id} no encontrado`)
    }

    return plainToInstance(ColorResDto, record)
  }

  async existByName(name?: string, excludeId?: number) {
    if (!name) return false

    const [record] = await this.dbService.db
      .select({ id: color.id })
      .from(color)
      .where(
        and(
          eq(sql<string>`lower(${color.name})`, name.toLowerCase()),
          eq(color.active, true),
          excludeId ? not(eq(color.id, excludeId)) : undefined,
        ),
      )
      .limit(1)
      .execute()

    return !!record
  }

  async create(dto: CreateColorDto) {
    const alreadyExistColor = await this.existByName(dto.name)

    if (alreadyExistColor) {
      throw new DisplayableException(
        'Ya existe un color con este nombre',
        HttpStatus.CONFLICT,
      )
    }

    const [newColor] = await this.dbService.db
      .insert(color)
      .values({
        name: dto.name,
        hexCode: dto.hexCode,
        description: dto.description,
      })
      .returning()
      .execute()

    return plainToInstance(ColorResDto, newColor)
  }

  async update(id: number, dto: UpdateColorDto) {
    const exists = await this.existById(id)

    if (!exists) {
      throw new NotFoundException(`Color con id ${id} no encontrado`)
    }

    const alreadyExistColor = await this.existByName(dto.name, id)

    if (alreadyExistColor) {
      throw new DisplayableException(
        'Ya existe un color con este nombre',
        HttpStatus.CONFLICT,
      )
    }

    const [updatedColor] = await this.dbService.db
      .update(color)
      .set(dto)
      .where(eq(color.id, id))
      .returning()
      .execute()

    return plainToInstance(ColorResDto, updatedColor)
  }

  async remove(id: number) {
    const exists = await this.existById(id)

    if (!exists) {
      throw new NotFoundException(`Color con id ${id} no encontrado`)
    }

    await this.dbService.db
      .update(color)
      .set({ active: false, updateDate: new Date() })
      .where(eq(color.id, id))
      .execute()

    return true
  }
}
