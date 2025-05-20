import { Logger } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { location } from 'drizzle/schema/tables/locations/location'
import { LocationRecord } from '../types'
import { getDbConnection } from '../utils/db'

const db = getDbConnection()

/**
 * Busca o crea una ubicación por nombre y almacén
 * @param locationName Nombre de la ubicación
 * @param warehouseId ID del almacén relacionado
 * @param reference Referencia opcional
 * @returns Registro de la ubicación o null si hay un error
 */
export const findOrCreateLocation = async (
  locationName: string,
  warehouseId: number,
  reference?: string,
): Promise<LocationRecord | null> => {
  if (!locationName || !warehouseId) return null

  const cleanLocationName = locationName.trim()
  if (cleanLocationName === '') return null

  try {
    // Intentar encontrar la ubicación existente
    const existingLocation = await db
      .select()
      .from(location)
      .where(eq(location.name, cleanLocationName))
      .limit(1)

    if (existingLocation.length > 0) {
      return existingLocation[0]
    }

    // Crear nueva ubicación si no existe
    const newLocation = await db
      .insert(location)
      .values({
        name: cleanLocationName,
        warehouseId,
        type: 'WAREHOUSE',
        reference: reference || '',
        description: `Ubicación ${cleanLocationName}`,
        active: true,
      })
      .returning()

    return newLocation[0]
  } catch (error) {
    Logger.error(`Error al crear ubicación: ${(error as Error).message}`)
    return null
  }
}
