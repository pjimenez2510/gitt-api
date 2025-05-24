import { SQL, and, eq, ilike } from 'drizzle-orm/sql'
import { itemType } from 'drizzle/schema/tables/inventory/itemType'
import { FilterItemTypeDto } from '../dto/req/item-type-filter.dto'

export function buildItemTypeFilterConditions(
  filterDto: FilterItemTypeDto,
): SQL[] {
  const conditions: SQL[] = []

  if (filterDto.code) {
    conditions.push(ilike(itemType.code, `%${filterDto.code}%`))
  }

  if (filterDto.name) {
    conditions.push(ilike(itemType.name, `%${filterDto.name}%`))
  }

  if (filterDto.description) {
    conditions.push(ilike(itemType.description, `%${filterDto.description}%`))
  }

  conditions.push(eq(itemType.active, true))

  return conditions
}

export function buildItemTypeWhereClause(conditions: SQL[]): SQL | undefined {
  return conditions.length ? and(...conditions) : undefined
}
