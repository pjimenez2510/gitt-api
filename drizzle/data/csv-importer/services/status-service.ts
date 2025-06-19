import { Logger } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { status } from 'drizzle/schema/tables/inventory/status'
import { StatusRecord } from '../types'
import { getDbConnection } from '../utils/db'

const db = getDbConnection()

/**
 * Busca un estado por nombre, con fallback a "Activo"
 * @param statusName Nombre del estado
 * @returns Registro del estado o null si hay error
 */
export const findStatusByName = async (
  statusName: string | null,
): Promise<StatusRecord | null> => {
  if (!statusName) statusName = 'Activo'

  const cleanStatusName = statusName.trim()

  try {
    let mappedName = cleanStatusName
    if (cleanStatusName.toUpperCase() === 'APROBADO') mappedName = 'Activo'

    const statusRecord = await db
      .select()
      .from(status)
      .where(eq(status.name, mappedName))
      .limit(1)

    if (statusRecord.length > 0) {
      return statusRecord[0]
    }

    const defaultStatus = await db
      .select()
      .from(status)
      .where(eq(status.name, 'Activo'))
      .limit(1)

    if (defaultStatus.length > 0) {
      return defaultStatus[0]
    }

    const newStatus = await db
      .insert(status)
      .values({
        name: 'Activo',
        description: 'Estado por defecto',
        active: false,
      })
      .returning()

    return newStatus[0]
  } catch (error) {
    Logger.error(`Error al buscar estado: ${(error as Error).message}`)
    return null
  }
}
