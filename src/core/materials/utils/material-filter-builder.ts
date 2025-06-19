import { SQL, and, eq, ilike } from 'drizzle-orm/sql'
import { material } from 'drizzle/schema/tables/inventory/material'
import { FilterMaterialDto } from '../dto/req/filter-material.dto'

export function buildMaterialFilterConditions(
  filterDto: FilterMaterialDto,
): SQL[] {
  const conditions: SQL[] = []

  if (filterDto.name) {
    conditions.push(ilike(material.name, `%${filterDto.name}%`))
  }

  if (filterDto.description) {
    conditions.push(ilike(material.description, `%${filterDto.description}%`))
  }

  if (filterDto.materialType) {
    conditions.push(ilike(material.materialType, `%${filterDto.materialType}%`))
  }

  conditions.push(eq(material.active, true))

  return conditions
}

export function buildMaterialWhereClause(conditions: SQL[]): SQL | undefined {
  return conditions.length ? and(...conditions) : undefined
}
