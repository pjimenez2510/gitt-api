import { Logger } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { category } from 'drizzle/schema/tables/inventory/category'
import { CategoryRecord } from '../types'
import { getDbConnection } from '../utils/db'

const db = getDbConnection()

/**
 * Busca una categoría por nombre o retorna una por defecto
 * @param categoryName Nombre de la categoría
 * @returns Registro de la categoría o null si hay error
 */
export const findCategoryByNameOrDefault = async (
  categoryName: string,
): Promise<CategoryRecord | null> => {
  if (!categoryName) categoryName = 'OTROS'

  const cleanCategoryName = categoryName.trim().toUpperCase()

  try {
    // Intentar buscar por nombre
    const categoryRecord = await db
      .select()
      .from(category)
      .where(eq(category.name, cleanCategoryName))
      .limit(1)

    if (categoryRecord.length > 0) {
      return categoryRecord[0]
    }

    // Si no se encuentra, retornar la primera categoría disponible
    const categories = await db.select().from(category).limit(1)

    if (categories.length > 0) {
      return categories[0]
    }

    // Si no hay categorías, crear una por defecto
    const newCategory = await db
      .insert(category)
      .values({
        name: 'OTROS',
        code: 'OTR',
        description: 'Categoría por defecto',
        active: true,
      })
      .returning()

    return newCategory[0]
  } catch (error) {
    Logger.error(`Error al buscar categoría: ${(error as Error).message}`)
    return null
  }
}
