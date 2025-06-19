import { and, eq, ilike, SQL } from 'drizzle-orm/sql'
import { PersonFiltersDto } from '../dto/req/person-filters.dto'
import { person } from 'drizzle/schema/tables/users/person'

export function buildPersonFilterConditions(
  filterDto: PersonFiltersDto,
): SQL[] {
  const conditions: SQL[] = []

  if (filterDto.dni) {
    conditions.push(eq(person.dni, filterDto.dni))
  }

  if (filterDto.email) {
    conditions.push(ilike(person.email, `%${filterDto.email}%`))
  }

  if (filterDto.firstName) {
    conditions.push(ilike(person.firstName, `%${filterDto.firstName}%`))
  }

  if (filterDto.lastName) {
    conditions.push(ilike(person.lastName, `%${filterDto.lastName}%`))
  }

  if (filterDto.phone) {
    conditions.push(ilike(person.phone, `%${filterDto.phone}%`))
  }

  if (filterDto.type) {
    conditions.push(eq(person.type, filterDto.type))
  }

  if (filterDto.status) {
    conditions.push(eq(person.status, filterDto.status))
  }

  return conditions
}

export function buildPersonWhereClause(conditions: SQL[]): SQL | undefined {
  return conditions.length > 0 ? and(...conditions) : undefined
}
