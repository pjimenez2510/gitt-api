import { and, ilike, SQL } from 'drizzle-orm/sql'
import { FilterLocationDto } from '../dto/req/filter-location.dto'
import { location } from 'drizzle/schema/tables/locations/location'

export function buildLocationFilterConditions(filterDto: FilterLocationDto) {
  const conditions: SQL[] = []

  if (filterDto.name) {
    conditions.push(ilike(location.name, `%${filterDto.name}%`))
  }

  return conditions
}

export function buildLocationWhereClause(conditions: SQL[]): SQL | undefined {
  return conditions.length > 0 ? and(...conditions) : undefined
}
