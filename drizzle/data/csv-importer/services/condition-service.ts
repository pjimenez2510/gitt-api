import { Logger } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { condition } from 'drizzle/schema/tables/inventory/condition'
import { ConditionRecord } from '../types'
import { getDbConnection } from '../utils/db'

const db = getDbConnection()

/**
 * Busca una condición por nombre, con fallback a "BUENO"
 * @param conditionName Nombre de la condición
 * @returns Registro de la condición o null si hay error
 */
export const findConditionByName = async (
  conditionName: string | null,
): Promise<ConditionRecord | null> => {
  if (!conditionName) conditionName = 'BUENO'

  const cleanConditionName = conditionName.trim().toUpperCase()

  try {
    // Intentar encontrar la condición por nombre
    const conditionRecord = await db
      .select()
      .from(condition)
      .where(eq(condition.name, cleanConditionName))
      .limit(1)

    if (conditionRecord.length > 0) {
      return conditionRecord[0]
    }

    // Fallback a "BUENO"
    const defaultCondition = await db
      .select()
      .from(condition)
      .where(eq(condition.name, 'BUENO'))
      .limit(1)

    if (defaultCondition.length > 0) {
      return defaultCondition[0]
    }

    // Crear condición "BUENO" por defecto si no existe
    const newCondition = await db
      .insert(condition)
      .values({
        name: 'BUENO',
        description: 'Condición por defecto',
      })
      .returning()

    return newCondition[0]
  } catch (error) {
    Logger.error(`Error al buscar condición: ${(error as Error).message}`)
    return null
  }
}
