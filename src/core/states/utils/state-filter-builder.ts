import { SQL, and, eq, ilike } from 'drizzle-orm/sql'
import { status } from 'drizzle/schema/tables/inventory/status'
import { FilterStateDto } from '../dto/req/filter-state.dto'

export function buildStateFilterConditions(filterDto: FilterStateDto): SQL[] {
  const conditions: SQL[] = []

  if (filterDto.name) {
    conditions.push(ilike(status.name, `%${filterDto.name}%`))
  }

  if (filterDto.description) {
    conditions.push(ilike(status.description, `%${filterDto.description}%`))
  }

  conditions.push(eq(status.active, true))

  return conditions
}

export function buildStateWhereClause(conditions: SQL[]): SQL | undefined {
  return conditions.length ? and(...conditions) : undefined
}
