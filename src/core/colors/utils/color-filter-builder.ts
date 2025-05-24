import { SQL, and, eq, ilike } from 'drizzle-orm/sql'
import { color } from 'drizzle/schema/tables/inventory/color'
import { FilterColorDto } from '../dto/req/color-filter.dto'

export function buildColorFilterConditions(filterDto: FilterColorDto): SQL[] {
  const conditions: SQL[] = []

  if (filterDto.name) {
    conditions.push(ilike(color.name, `%${filterDto.name}%`))
  }

  if (filterDto.hexCode) {
    conditions.push(eq(color.hexCode, filterDto.hexCode))
  }

  if (filterDto.description) {
    conditions.push(ilike(color.description, `%${filterDto.description}%`))
  }

  conditions.push(eq(color.active, true))

  return conditions
}

export function buildColorWhereClause(conditions: SQL[]): SQL | undefined {
  return conditions.length ? and(...conditions) : undefined
}
