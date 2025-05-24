import { and, eq, ilike, SQL } from 'drizzle-orm/sql'
import { UserFiltersDto } from '../dto/req/user-filters.dto'
import { user } from 'drizzle/schema/tables/users/user'
import { person } from 'drizzle/schema/tables/users/person'

export function buildUserFilterConditions(filterDto: UserFiltersDto): SQL[] {
  const conditions: SQL[] = []
  if (filterDto.userName) {
    conditions.push(ilike(user.userName, `%${filterDto.userName}%`))
  }

  if (filterDto.dni) {
    conditions.push(eq(person.dni, filterDto.dni))
  }

  if (filterDto.email) {
    conditions.push(ilike(person.email, `%${filterDto.email}%`))
  }

  if (filterDto.career) {
    conditions.push(ilike(user.career, `%${filterDto.career}%`))
  }

  if (filterDto.userType) {
    conditions.push(eq(user.userType, filterDto.userType))
  }

  if (filterDto.status) {
    conditions.push(eq(user.status, filterDto.status))
  }

  return conditions
}

export function buildUserWhereClause(conditions: SQL[]): SQL | undefined {
  return conditions.length > 0 ? and(...conditions) : undefined
}
