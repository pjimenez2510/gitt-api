import { SQL, and, eq, ilike } from 'drizzle-orm/sql'
import { warehouse } from 'drizzle/schema/tables/locations/warehouse'
import { FilterWarehouseDto } from '../dto/req/filter-warehouse.dto'

export function buildWarehouseFilterConditions(
  filterDto: FilterWarehouseDto,
): SQL[] {
  const conditions: SQL[] = []

  if (filterDto.name) {
    conditions.push(ilike(warehouse.name, `%${filterDto.name}%`))
  }

  if (filterDto.location) {
    conditions.push(ilike(warehouse.location, `%${filterDto.location}%`))
  }

  conditions.push(eq(warehouse.active, true))

  return conditions
}

export function buildWarehouseWhereClause(conditions: SQL[]): SQL | undefined {
  return conditions.length ? and(...conditions) : undefined
}
