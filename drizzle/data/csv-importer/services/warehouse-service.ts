import { Logger } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { WarehouseRecord } from '../types'
import { getDbConnection } from '../utils/db'
import { warehouse } from 'drizzle/schema/tables/locations/warehouse'

const db = getDbConnection()

/**
 * Busca o crea un almacén por nombre
 * @param warehouseName Nombre del almacén
 * @returns Registro del almacén o null si hay un error
 */
export const findOrCreateWarehouse = async (
  warehouseName: string,
): Promise<WarehouseRecord | null> => {
  if (!warehouseName) return null

  const cleanWarehouseName = warehouseName.trim()
  if (cleanWarehouseName === '') return null

  try {
    // Intentar encontrar el almacén existente
    const existingWarehouse = await db
      .select()
      .from(warehouse)
      .where(eq(warehouse.name, cleanWarehouseName))
      .limit(1)

    if (existingWarehouse.length > 0) {
      return existingWarehouse[0]
    }

    // Crear nuevo almacén si no existe
    const newWarehouse = await db
      .insert(warehouse)
      .values({
        name: cleanWarehouseName,
        description: `Bodega de ${cleanWarehouseName}`,
        active: true,
      })
      .returning()

    return newWarehouse[0]
  } catch (error) {
    Logger.error(`Error al crear almacén: ${(error as Error).message}`)
    return null
  }
}
