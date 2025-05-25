import { SQL, and, eq, ilike } from 'drizzle-orm/sql'
import { condition } from 'drizzle/schema/tables/inventory/condition'
import { FilterConditionDto } from '../dto/req/condition-filter.dto'

export function buildConditionFilterConditions(
  filterDto: FilterConditionDto,
): SQL[] {
  const conditions: SQL[] = []

  // Filtrado por nombre (búsqueda parcial, case-insensitive)
  if (filterDto.name) {
    conditions.push(ilike(condition.name, `%${filterDto.name}%`))
  }

  // Filtrado por descripción (búsqueda parcial, case-insensitive)
  if (filterDto.description) {
    conditions.push(ilike(condition.description, `%${filterDto.description}%`))
  }

  // Filtrado por requiresMaintenance (booleano)
  if (filterDto.requiresMaintenance !== undefined) {
    conditions.push(
      eq(condition.requiresMaintenance, filterDto.requiresMaintenance),
    )
  }

  // Siempre incluir solo condiciones activas
  conditions.push(eq(condition.active, true))

  return conditions
}

export function buildConditionWhereClause(conditions: SQL[]): SQL | undefined {
  return conditions.length ? and(...conditions) : undefined
}
