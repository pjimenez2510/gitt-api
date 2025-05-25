import { Logger } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { color } from 'drizzle/schema/tables/inventory/color'
import { ColorRecord } from '../types'
import { getDbConnection } from '../utils/db'

const db = getDbConnection()

/**
 * Busca o crea un color por nombre
 * @param colorName Nombre del color
 * @returns Registro del color o null si hay error
 */
export const findOrCreateColor = async (
  colorName: string,
): Promise<ColorRecord | null> => {
  if (!colorName) return null

  const cleanColorName = colorName.trim().toUpperCase()
  if (cleanColorName === '') return null

  try {
    // Intentar encontrar el color existente
    const existingColor = await db
      .select()
      .from(color)
      .where(eq(color.name, cleanColorName))
      .limit(1)

    if (existingColor.length > 0) {
      return existingColor[0]
    }

    // Color por defecto si no tiene hexCode
    const defaultHexCode = '#CCCCCC'

    // Crear nuevo color si no existe
    const newColor = await db
      .insert(color)
      .values({
        name: cleanColorName,
        hexCode: defaultHexCode,
        description: cleanColorName,
        active: true,
      })
      .returning()

    return newColor[0]
  } catch (error) {
    Logger.error(`Error al crear color: ${(error as Error).message}`)
    return null
  }
}
