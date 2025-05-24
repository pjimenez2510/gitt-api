import { and, eq, ilike, SQL } from 'drizzle-orm/sql'
import { FilterLocationDto } from '../dto/req/filter-location.dto'
import { location } from 'drizzle/schema/tables/locations/location'
import { LocationType } from '../enum/location-type'

export function buildLocationFilterConditions(
  filterDto: FilterLocationDto,
): SQL[] {
  const conditions: SQL[] = []

  if (filterDto.name) {
    conditions.push(ilike(location.name, `%${filterDto.name}%`))
  }

  if (filterDto.description) {
    conditions.push(ilike(location.description, `%${filterDto.description}%`))
  }

  if (filterDto.warehouseId) {
    conditions.push(eq(location.warehouseId, filterDto.warehouseId))
  }

  if (filterDto.parentLocationId) {
    conditions.push(eq(location.parentLocationId, filterDto.parentLocationId))
  }

  if (filterDto.type) {
    if (Object.values(LocationType).includes(filterDto.type)) {
      conditions.push(eq(location.type, filterDto.type))
    }
  }

  if (filterDto.building) {
    conditions.push(ilike(location.building, `%${filterDto.building}%`))
  }

  if (filterDto.floor) {
    conditions.push(ilike(location.floor, `%${filterDto.floor}%`))
  }

  if (filterDto.reference) {
    conditions.push(ilike(location.reference, `%${filterDto.reference}%`))
  }

  conditions.push(eq(location.active, true))

  return conditions
}

export function buildLocationWhereClause(conditions: SQL[]): SQL | undefined {
  return conditions.length > 0 ? and(...conditions) : undefined
}
