import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { and, count, desc, eq, not, sql } from 'drizzle-orm'
import { category } from 'drizzle/schema/tables/inventory/category'
import { DatabaseService } from 'src/global/database/database.service'
import { CreateCategoryDto } from './dto/req/create-category.dto'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'
import { UpdateCategoryDto } from './dto/req/update-category.dto'
import { plainToInstance } from 'class-transformer'
import { CategoryResDto } from './dto/res/category-res.dto'
import { FilterCategoryDto } from './dto/req/filter-category.dto'
import { categoryColumnsAndWith } from './const/category-columns-and-with'
import {
  buildCategoryFilterConditions,
  buildCategoryWhereClause,
} from './utils/category-filter-builder'

@Injectable()
export class CategoriesService {
  constructor(private readonly dbService: DatabaseService) {}

  async findAll(filterDto: FilterCategoryDto) {
    const conditions = buildCategoryFilterConditions(filterDto)
    const whereClause = buildCategoryWhereClause(conditions)

    const offset = (filterDto.page - 1) * filterDto.limit

    const categoriesResult = await this.dbService.db.query.category.findMany({
      where: whereClause,
      with: categoryColumnsAndWith.with,
      columns: categoryColumnsAndWith.columns,
      orderBy: [desc(category.name)],
      limit: filterDto.allRecords ? undefined : filterDto.limit,
      offset: filterDto.allRecords ? undefined : offset,
    })

    const totalResult = await this.dbService.db
      .select({ count: count() })
      .from(category)
      .where(whereClause)
      .execute()

    const total = totalResult[0].count

    return {
      records: categoriesResult,
      total,
      limit: filterDto.allRecords ? total : filterDto.limit,
      page: filterDto.allRecords ? 1 : filterDto.page,
      pages: filterDto.allRecords ? 1 : Math.ceil(total / filterDto.limit),
    }
  }

  async existById(id: number) {
    const categoryResult = await this.dbService.db.query.category.findFirst({
      where: and(eq(category.id, id), eq(category.active, true)),
      columns: {
        id: true,
      },
    })

    return categoryResult?.id !== undefined
  }

  async findOne(id: number) {
    const categoryResult = await this.dbService.db.query.category.findFirst({
      where: and(eq(category.id, id), eq(category.active, true)),
      columns: categoryColumnsAndWith.columns,
      with: categoryColumnsAndWith.with,
    })

    if (!categoryResult) {
      throw new NotFoundException(`Categoría con id ${id} no encontrada`)
    }

    return plainToInstance(CategoryResDto, categoryResult)
  }

  async existByCode(code?: string, excludeId?: number) {
    if (!code) return false

    const categoryResult = await this.dbService.db.query.category.findFirst({
      where: and(
        eq(sql<string>`lower(${category.code})`, code.toLowerCase()),
        eq(category.active, true),
        excludeId ? not(eq(category.id, excludeId)) : undefined,
      ),
      columns: {
        id: true,
      },
    })

    return categoryResult?.id !== undefined
  }

  async create(dto: CreateCategoryDto) {
    const alreadyExistCategoryCode = await this.existByCode(dto.code)

    if (alreadyExistCategoryCode) {
      throw new DisplayableException(
        'Ya existe una categoría con este código',
        HttpStatus.CONFLICT,
      )
    }

    const [newCategory] = await this.dbService.db
      .insert(category)
      .values({
        ...dto,
      })
      .returning({ id: category.id })
      .execute()

    return this.findOne(newCategory.id)
  }

  async update(id: number, dto: UpdateCategoryDto) {
    const exists = await this.existById(id)

    if (!exists) {
      throw new NotFoundException(`Categoría con id ${id} no encontrada`)
    }

    if (dto.code) {
      const alreadyExistCategoryCode = await this.existByCode(dto.code, id)

      if (alreadyExistCategoryCode) {
        throw new DisplayableException(
          'Ya existe una categoría con este código',
          HttpStatus.CONFLICT,
        )
      }
    }

    const updateData = {
      ...dto,
      updateDate: new Date(),
    }

    await this.dbService.db
      .update(category)
      .set(updateData)
      .where(eq(category.id, id))
      .execute()

    return this.findOne(id)
  }

  async remove(id: number) {
    const exists = await this.existById(id)

    if (!exists) {
      throw new NotFoundException(`Categoría con id ${id} no encontrada`)
    }

    const [categoryToRemove] = await this.dbService.db
      .update(category)
      .set({
        active: false,
        updateDate: new Date(),
      })
      .where(eq(category.id, id))
      .returning({ active: category.active })
      .execute()

    return categoryToRemove.active === false
  }
}
