import { SQL, and, eq } from 'drizzle-orm/sql'
import { itemColor } from 'drizzle/schema/tables/inventory/item/itemColor'
import { FilterItemColorDto } from '../dto/req/item-color-filter.dto'

export function buildItemColorFilterConditions(
  filterDto: FilterItemColorDto,
): SQL[] {
  const conditions: SQL[] = []

  if (filterDto.itemId) {
    conditions.push(eq(itemColor.itemId, filterDto.itemId))
  }

  if (filterDto.colorId) {
    conditions.push(eq(itemColor.colorId, filterDto.colorId))
  }

  if (filterDto.isMainColor !== undefined) {
    conditions.push(eq(itemColor.isMainColor, filterDto.isMainColor))
  }

  conditions.push(eq(itemColor.active, true))

  return conditions
}

export function buildItemColorWhereClause(conditions: SQL[]): SQL | undefined {
  return conditions.length ? and(...conditions) : undefined
}
