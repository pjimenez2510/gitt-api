import { SQL, and, eq } from 'drizzle-orm/sql'
import { itemMaterial } from 'drizzle/schema/tables/inventory/item/itemMaterial'
import { FilterItemMaterialDto } from '../dto/req/item-material-filter.dto'

export function buildItemMaterialFilterConditions(
  filterDto: FilterItemMaterialDto,
): SQL[] {
  const conditions: SQL[] = []

  // Filtrado por itemId
  if (filterDto.itemId) {
    conditions.push(eq(itemMaterial.itemId, filterDto.itemId))
  }

  // Filtrado por materialId
  if (filterDto.materialId) {
    conditions.push(eq(itemMaterial.materialId, filterDto.materialId))
  }

  // Filtrado por isMainMaterial
  if (filterDto.isMainMaterial !== undefined) {
    conditions.push(eq(itemMaterial.isMainMaterial, filterDto.isMainMaterial))
  }

  // Siempre incluir solo registros activos
  conditions.push(eq(itemMaterial.active, true))

  return conditions
}

export function buildItemMaterialWhereClause(
  conditions: SQL[],
): SQL | undefined {
  return conditions.length ? and(...conditions) : undefined
}
