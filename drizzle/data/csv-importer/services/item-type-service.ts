import { Logger } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { itemType } from 'drizzle/schema/tables/inventory/itemType'
import { ItemTypeRecord } from '../types'
import { getDbConnection } from '../utils/db'

const db = getDbConnection()

/**
 * Busca un tipo de ítem por código, con fallback a BLD
 * @param typeCode Código del tipo de ítem
 * @returns Registro del tipo de ítem o null si hay error
 */
export const findItemTypeByCode = async (
  typeCode: string | null,
): Promise<ItemTypeRecord | null> => {
  if (!typeCode) typeCode = 'BLD'

  const cleanTypeCode = typeCode.trim().toUpperCase()

  try {
    const itemTypeRecord = await db
      .select()
      .from(itemType)
      .where(eq(itemType.code, cleanTypeCode))
      .limit(1)

    if (itemTypeRecord.length > 0) {
      return itemTypeRecord[0]
    }

    const defaultCode =
      cleanTypeCode === 'BLD' || cleanTypeCode === 'BCA' ? cleanTypeCode : 'BLD'

    const typeContains = await db
      .select()
      .from(itemType)
      .where(eq(itemType.code, defaultCode))
      .limit(1)

    if (typeContains.length > 0) {
      return typeContains[0]
    }

    const newType = await db
      .insert(itemType)
      .values({
        name: 'Bienes de lujo',
        code: 'BLD',
        description: 'Bienes que superan los 100 dólares',
        active: true,
      })
      .returning()

    return newType[0]
  } catch (error) {
    Logger.error(`Error al buscar tipo de item: ${(error as Error).message}`)
    return null
  }
}
