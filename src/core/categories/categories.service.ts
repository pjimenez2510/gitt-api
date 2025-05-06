import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { count, desc, eq, sql } from 'drizzle-orm'
import { category } from 'drizzle/schema'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { excludeColumns } from 'src/common/utils/drizzle-helpers'
import { DatabaseService } from 'src/global/database/database.service'
import { CreateCategoryDto } from './dto/req/create-category.dto'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'
import { UpdateCategoryDto } from './dto/req/update-category.dto'

@Injectable()
export class CategoriesService {
  constructor(private dbService: DatabaseService) {}

  private readonly categoriesWithoutDates = excludeColumns(
    category,
    'registrationDate',
    'updateDate',
  )

  async findAll({ limit, page }: BaseParamsDto) {
    const offset = (page - 1) * limit

    const query = this.dbService.db
      .select(this.categoriesWithoutDates)
      .from(category)
      .orderBy(desc(category.name))
      .limit(limit)
      .offset(offset)

    const totalQuery = this.dbService.db
      .select({ count: count() })
      .from(category)

    const [records, totalResult] = await Promise.all([
      query.execute(),
      totalQuery.execute(),
    ])

    const total = totalResult[0].count

    return {
      records,
      total,
      limit,
      page,
      pages: Math.ceil(total / limit),
    }
  }

  async findOne(id: number) {
    const [record] = await this.dbService.db
      .select(this.categoriesWithoutDates)
      .from(category)
      .where(eq(category.id, id))
      .limit(1)
      .execute()
    if (!record) {
      throw new NotFoundException(`Category with id ${id} not found`)
    }
    return record
  }

  async create(dto: CreateCategoryDto) {
    const [alreadyExistCategory] = await this.dbService.db
      .select(this.categoriesWithoutDates)
      .from(category)
      .where(eq(sql<string>`lower(${category.code})`, dto.code.toLowerCase()))
      .limit(1)
      .execute()

    if (alreadyExistCategory) {
      throw new DisplayableException(
        'Ya existe una categoria con este codigo',
        HttpStatus.CONFLICT,
      )
    }

    const [newCategory] = await this.dbService.db
      .insert(category)
      .values({
        code: dto.code,
        name: dto.name,
        description: dto.description,
        parentCategoryId: dto.parentCategoryId,
        standardUsefulLife: dto.standardUsefulLife,
        depreciationPercentage: dto.depreciationPercentage,
      })
      .returning(this.categoriesWithoutDates)
      .execute()
    return newCategory
  }

  async update(id: number, dto: UpdateCategoryDto) {
    await this.findOne(id)

    const updateData: Partial<UpdateCategoryDto> = {
      ...dto,
    }

    const [updateCategory] = await this.dbService.db
      .update(category)
      .set(updateData)
      .where(eq(category.id, id))
      .returning(this.categoriesWithoutDates)
      .execute()

    return updateCategory
  }

  async remove(id: number) {
    await this.findOne(id)

    const [deletedCategory] = await this.dbService.db
      .update(category)
      .set({ active: false, updateDate: new Date() })
      .where(eq(category.id, id))
      .returning(this.categoriesWithoutDates)
      .execute()

    if (!deletedCategory) {
      throw new DisplayableException(
        `Error deleting category with id ${id}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
    return deletedCategory
  }
}
