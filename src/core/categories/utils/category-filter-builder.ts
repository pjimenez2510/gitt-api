import { SQL, and, eq, ilike } from 'drizzle-orm/sql'
import { category } from 'drizzle/schema/tables/inventory/category'
import { FilterCategoryDto } from '../dto/req/filter-category.dto'

export function buildCategoryFilterConditions(
  filterDto: FilterCategoryDto,
): SQL[] {
  const conditions: SQL[] = []

  if (filterDto.code) {
    conditions.push(ilike(category.code, `%${filterDto.code}%`))
  }

  if (filterDto.name) {
    conditions.push(ilike(category.name, `%${filterDto.name}%`))
  }

  if (filterDto.description) {
    conditions.push(ilike(category.description, `%${filterDto.description}%`))
  }

  if (filterDto.parentCategoryId) {
    conditions.push(eq(category.parentCategoryId, filterDto.parentCategoryId))
  }

  conditions.push(eq(category.active, true))

  return conditions
}

export function buildCategoryWhereClause(conditions: SQL[]): SQL | undefined {
  return conditions.length ? and(...conditions) : undefined
}
