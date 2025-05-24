import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { and, count, desc, eq, not, sql } from 'drizzle-orm'
import { material } from 'drizzle/schema/tables/inventory/material'
import { excludeColumns } from 'src/common/utils/drizzle-helpers'
import { DatabaseService } from 'src/global/database/database.service'
import { CreateMaterialDto } from './dto/req/create-material.dto'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'
import { UpdateMaterialDto } from './dto/req/update-material.dto'
import { plainToInstance } from 'class-transformer'
import { MaterialResDto } from './dto/res/material-res.dto'
import { FilterMaterialDto } from './dto/req/filter-material.dto'
import { materialColumnsAndWith } from './const/material-columns-and-with'
import {
  buildMaterialFilterConditions,
  buildMaterialWhereClause,
} from './utils/material-filter-builder'

@Injectable()
export class MaterialsService {
  constructor(private readonly dbService: DatabaseService) {}

  private materialsWithoutDates = excludeColumns(
    material,
    'registrationDate',
    'updateDate',
    'active',
  )

  async findAll(filterDto: FilterMaterialDto) {
    const conditions = buildMaterialFilterConditions(filterDto)
    const whereClause = buildMaterialWhereClause(conditions)

    const offset = (filterDto.page - 1) * filterDto.limit

    const materialsResult = await this.dbService.db.query.material.findMany({
      where: whereClause,
      with: materialColumnsAndWith.with,
      columns: materialColumnsAndWith.columns,
      orderBy: [desc(material.name)],
      limit: filterDto.allRecords ? undefined : filterDto.limit,
      offset: filterDto.allRecords ? undefined : offset,
    })

    const totalResult = await this.dbService.db
      .select({ count: count() })
      .from(material)
      .where(whereClause)
      .execute()

    const total = totalResult[0].count

    return {
      records: materialsResult,
      total,
      limit: filterDto.allRecords ? total : filterDto.limit,
      page: filterDto.allRecords ? 1 : filterDto.page,
      pages: filterDto.allRecords ? 1 : Math.ceil(total / filterDto.limit),
    }
  }

  async existById(id: number) {
    const materialResult = await this.dbService.db.query.material.findFirst({
      where: and(eq(material.id, id), eq(material.active, true)),
      columns: {
        id: true,
      },
    })

    return materialResult?.id !== undefined
  }

  async findOne(id: number) {
    const materialResult = await this.dbService.db.query.material.findFirst({
      where: and(eq(material.id, id), eq(material.active, true)),
      columns: materialColumnsAndWith.columns,
      with: materialColumnsAndWith.with,
    })

    if (!materialResult) {
      throw new NotFoundException(`Material con id ${id} no encontrado`)
    }

    return plainToInstance(MaterialResDto, materialResult)
  }

  async existByName(name?: string, excludeId?: number) {
    if (!name) return false

    const materialResult = await this.dbService.db.query.material.findFirst({
      where: and(
        eq(sql<string>`lower(${material.name})`, name.toLowerCase()),
        eq(material.active, true),
        excludeId ? not(eq(material.id, excludeId)) : undefined,
      ),
      columns: {
        id: true,
      },
    })

    return materialResult?.id !== undefined
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
        ...dto,
      })
      .returning({ id: material.id })
      .execute()

    return this.findOne(newMaterial.id)
  }

  async update(id: number, dto: UpdateMaterialDto) {
    const exists = await this.existById(id)

    if (!exists) {
      throw new NotFoundException(`Material con id ${id} no encontrado`)
    }

    if (dto.name) {
      const alreadyExistMaterial = await this.existByName(dto.name, id)

      if (alreadyExistMaterial) {
        throw new DisplayableException(
          'Ya existe un material con este nombre',
          HttpStatus.CONFLICT,
        )
      }
    }

    const updateData = {
      ...dto,
      updateDate: new Date(),
    }

    await this.dbService.db
      .update(material)
      .set(updateData)
      .where(eq(material.id, id))
      .execute()

    return this.findOne(id)
  }

  async remove(id: number) {
    const exists = await this.existById(id)

    if (!exists) {
      throw new NotFoundException(`Material con id ${id} no encontrado`)
    }

    const [materialToRemove] = await this.dbService.db
      .update(material)
      .set({
        active: false,
        updateDate: new Date(),
      })
      .where(eq(material.id, id))
      .returning({ active: material.active })
      .execute()

    return materialToRemove.active === false
  }
}
