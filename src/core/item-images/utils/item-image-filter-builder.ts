import { and, eq, SQL } from 'drizzle-orm'
import { FilterItemImageDto } from '../dto/req/item-image-filter.dto'
import { itemImage } from 'drizzle/schema/tables/inventory/item/itemImage'

export function buildItemImageFilterConditions(
  filterDto: FilterItemImageDto,
): SQL[] {
  const conditions: SQL[] = []

  if (filterDto.itemId) {
    conditions.push(eq(itemImage.itemId, filterDto.itemId))
  }

  if (filterDto.type) {
    conditions.push(eq(itemImage.type, filterDto.type))
  }

  if (typeof filterDto.isPrimary !== 'undefined') {
    conditions.push(eq(itemImage.isPrimary, filterDto.isPrimary))
  }

  if (filterDto.photoDate) {
    conditions.push(eq(itemImage.photoDate, filterDto.photoDate))
  }

  return conditions
}

export function buildItemImageWhereClause(conditions: SQL[]): SQL | undefined {
  return conditions.length > 0 ? and(...conditions) : undefined
}
