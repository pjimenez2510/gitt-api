import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { and, count, desc, eq, not, sql } from 'drizzle-orm'
import { color } from 'drizzle/schema/tables/inventory/color'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { excludeColumns } from 'src/common/utils/drizzle-helpers'
import { DatabaseService } from 'src/global/database/database.service'
import { CreateColorDto } from './dto/req/create-color.dto'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'
import { UpdateColorDto } from './dto/req/update-color.dto'
import { plainToInstance } from 'class-transformer'
import { ColorResDto } from './dto/res/color-res.dto'

@Injectable()
export class ColorsService {
  constructor(private readonly dbService: DatabaseService) {}

  private readonly colorsWithoutDates = excludeColumns(
    color,
    'registrationDate',
    'updateDate',
    'active',
  )

  async findAll({ limit, page }: BaseParamsDto) {
    const offset = (page - 1) * limit

    const query = this.dbService.db
      .select(this.colorsWithoutDates)
      .from(color)
      .where(eq(color.active, true))
      .orderBy(desc(color.name))
      .limit(limit)
      .offset(offset)

    const totalQuery = this.dbService.db
      .select({ count: count() })
      .from(color)
      .where(eq(color.active, true))

    const [records, totalResult] = await Promise.all([
      query.execute(),
      totalQuery.execute(),
    ])

    const total = totalResult[0].count

    return {
      records: plainToInstance(ColorResDto, records),
      total,
      limit,
      page,
      pages: Math.ceil(total / limit),
    }
  }

  async findOne(id: number) {
    const [record] = await this.dbService.db
      .select(this.colorsWithoutDates)
      .from(color)
      .where(and(eq(color.id, id), eq(color.active, true)))
      .limit(1)
      .execute()

    if (!record) {
      throw new NotFoundException(`Color con id ${id} no encontrado`)
    }

    return plainToInstance(ColorResDto, record)
  }

  async existByName(name?: string, excludeId?: number) {
    if (!name) return true
    const [record] = await this.dbService.db
      .select(this.colorsWithoutDates)
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
      .returning(this.colorsWithoutDates)
      .execute()

    return plainToInstance(ColorResDto, newColor)
  }

  async update(id: number, dto: UpdateColorDto) {
    await this.findOne(id)

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
      .returning(this.colorsWithoutDates)
      .execute()

    return plainToInstance(ColorResDto, updatedColor)
  }

  async remove(id: number) {
    await this.findOne(id)

    const [deletedColor] = await this.dbService.db
      .update(color)
      .set({ active: false, updateDate: new Date() })
      .where(eq(color.id, id))
      .returning(this.colorsWithoutDates)
      .execute()

    if (!deletedColor) {
      throw new DisplayableException(
        `Error al eliminar el color con id ${id}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }

    return plainToInstance(ColorResDto, deletedColor)
  }
}
