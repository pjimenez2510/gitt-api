import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { and, count, desc, eq, not, sql } from 'drizzle-orm'
import { material } from 'drizzle/schema/tables/inventory/material'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { excludeColumns } from 'src/common/utils/drizzle-helpers'
import { DatabaseService } from 'src/global/database/database.service'
import { CreateMaterialDto } from './dto/req/create-material.dto'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'
import { UpdateMaterialDto } from './dto/req/update-material.dto'
import { plainToInstance } from 'class-transformer'
import { MaterialResDto } from './dto/res/material-res.dto'

@Injectable()
export class MaterialsService {
  constructor(private readonly dbService: DatabaseService) {}

  private readonly materialsWithoutDates = excludeColumns(
    material,
    'registrationDate',
    'updateDate',
    'active',
  )

  async findAll({ limit, page }: BaseParamsDto) {
    const offset = (page - 1) * limit

    const query = this.dbService.db
      .select(this.materialsWithoutDates)
      .from(material)
      .where(eq(material.active, true))
      .orderBy(desc(material.name))
      .limit(limit)
      .offset(offset)

    const totalQuery = this.dbService.db
      .select({ count: count() })
      .from(material)
      .where(eq(material.active, true))

    const [records, totalResult] = await Promise.all([
      query.execute(),
      totalQuery.execute(),
    ])

    const total = totalResult[0].count

    return {
      records: plainToInstance(MaterialResDto, records),
      total,
      limit,
      page,
      pages: Math.ceil(total / limit),
    }
  }

  async findOne(id: number) {
    const [record] = await this.dbService.db
      .select(this.materialsWithoutDates)
      .from(material)
      .where(and(eq(material.id, id), eq(material.active, true)))
      .limit(1)
      .execute()

    if (!record) {
      throw new NotFoundException(`Material con id ${id} no encontrado`)
    }

    return plainToInstance(MaterialResDto, record)
  }

  async existByName(name?: string, excludeId?: number) {
    if (!name) return true
    const [record] = await this.dbService.db
      .select(this.materialsWithoutDates)
      .from(material)
      .where(
        and(
          eq(sql<string>`lower(${material.name})`, name.toLowerCase()),
          eq(material.active, true),
          excludeId ? not(eq(material.id, excludeId)) : undefined,
        ),
      )
      .limit(1)
      .execute()

    return !!record
  }

  async create(dto: CreateMaterialDto) {
    const alreadyExistMaterial = await this.existByName(dto.name)

    if (alreadyExistMaterial) {
      throw new DisplayableException(
        'Ya existe un material con este nombre',
        HttpStatus.CONFLICT,
      )
    }

    const [newMaterial] = await this.dbService.db
      .insert(material)
      .values({
        name: dto.name,
        description: dto.description,
        materialType: dto.materialType,
      })
      .returning(this.materialsWithoutDates)
      .execute()

    return plainToInstance(MaterialResDto, newMaterial)
  }

  async update(id: number, dto: UpdateMaterialDto) {
    await this.findOne(id)

    const alreadyExistMaterial = await this.existByName(dto.name, id)

    if (alreadyExistMaterial) {
      throw new DisplayableException(
        'Ya existe un material con este nombre',
        HttpStatus.CONFLICT,
      )
    }

    const [updatedMaterial] = await this.dbService.db
      .update(material)
      .set(dto)
      .where(eq(material.id, id))
      .returning(this.materialsWithoutDates)
      .execute()

    return plainToInstance(MaterialResDto, updatedMaterial)
  }

  async remove(id: number) {
    await this.findOne(id)

    const [deletedMaterial] = await this.dbService.db
      .update(material)
      .set({ active: false, updateDate: new Date() })
      .where(eq(material.id, id))
      .returning(this.materialsWithoutDates)
      .execute()

    if (!deletedMaterial) {
      throw new DisplayableException(
        `Error al eliminar el material con id ${id}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }

    return plainToInstance(MaterialResDto, deletedMaterial)
  }
}
