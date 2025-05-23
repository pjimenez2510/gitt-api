import { Logger } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { material } from 'drizzle/schema/tables/inventory/material'
import { MaterialRecord } from '../types'
import { getDbConnection } from '../utils/db'

const db = getDbConnection()

/**
 * Busca o crea un material por nombre
 * @param materialName Nombre del material
 * @returns Registro del material o null si hay error
 */
export const findOrCreateMaterial = async (
  materialName: string,
): Promise<MaterialRecord | null> => {
  if (!materialName) return null

  const cleanMaterialName = materialName.trim().toUpperCase()
  if (cleanMaterialName === '') return null

  try {
    // Intentar encontrar el material existente
    const existingMaterial = await db
      .select()
      .from(material)
      .where(eq(material.name, cleanMaterialName))
      .limit(1)

    if (existingMaterial.length > 0) {
      return existingMaterial[0]
    }

    // Crear nuevo material si no existe
    const newMaterial = await db
      .insert(material)
      .values({
        name: cleanMaterialName,
        description: cleanMaterialName,
        materialType: 'OTRO',
        active: true,
      })
      .returning()

    return newMaterial[0]
  } catch (error) {
    Logger.error(`Error al crear material: ${(error as Error).message}`)
    return null
  }
}
