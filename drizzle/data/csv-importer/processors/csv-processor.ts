import { Logger } from '@nestjs/common'
import * as fs from 'fs'
import { parse } from 'csv-parse/sync'

import { CSVOptions, ProcessCSVResult } from '../types'
import { getDbConnection } from '../utils/db'
import { findAdminUser } from '../services/user-service'
import { findOrCreateWarehouse } from '../services/warehouse-service'
import { findOrCreateLocation } from '../services/location-service'
import { findStatusByName } from '../services/status-service'
import { findConditionByName } from '../services/condition-service'
import { findCategoryByNameOrDefault } from '../services/category-service'
import { findItemTypeByCode } from '../services/item-type-service'
import { findOrCreateColor } from '../services/color-service'
import { findOrCreateMaterial } from '../services/material-service'
import { mapCsvToItemFields } from '../mappers/csv-mapper'
import { parseDate } from '../parsers/date-parser'
import { parseBoolean, parseDecimal, parseInt } from '../parsers/value-parser'
import {
  assetValue,
  item,
  itemColor,
  itemMaterial,
} from 'drizzle/schema/tables/inventory'

// Conexión a la base de datos
const db = getDbConnection()

/**
 * Procesa un archivo CSV y carga los datos en la base de datos
 * @param filePath Ruta al archivo CSV
 * @param options Opciones para el procesamiento
 * @returns Resultado del procesamiento con estadísticas
 */
export const processCSV = async (
  filePath: string,
  options: CSVOptions = { delimiter: ',', headerRowCount: 1 },
): Promise<ProcessCSVResult> => {
  Logger.log(`Procesando archivo: ${filePath}`)

  // Validar que el archivo existe
  if (!fs.existsSync(filePath)) {
    throw new Error(`El archivo ${filePath} no existe`)
  }

  // Leer el archivo CSV
  const fileContent = fs.readFileSync(filePath, 'utf-8')

  // Determinar el tipo de delimitador si no se especificó
  const delimiter = options.delimiter || (fileContent.includes(';') ? ';' : ',')

  // Parsear el CSV a un array de objetos
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    delimiter,
    from_line: options.headerRowCount || 1,
  }) as Record<string, string>[]

  Logger.log(`Encontradas ${records.length} filas en el CSV`)

  // Obtener usuario para registrar items
  const adminUser = await findAdminUser()
  if (!adminUser) {
    throw new Error('No se encontró un usuario para registrar los ítems')
  }

  // Contadores para estadísticas
  let successCount = 0
  let errorCount = 0

  // Importar cada registro
  for (const [index, record] of records.entries()) {
    try {
      // Mapear campos del CSV a campos de la base de datos
      const mappedRecord = mapCsvToItemFields(record)

      // Obtener tipo de bien
      const itemTypeRecord = await findItemTypeByCode(mappedRecord.typeCode)
      if (!itemTypeRecord) {
        Logger.error(`Tipo de bien no encontrado para fila ${index + 1}`)
        errorCount++
        continue
      }

      // Encontrar o crear almacén
      const warehouseRecord = await findOrCreateWarehouse(
        mappedRecord.warehouseName || 'Bodega Principal',
      )
      if (!warehouseRecord) {
        Logger.error(`Error al procesar almacén para fila ${index + 1}`)
        errorCount++
        continue
      }

      // Encontrar o crear ubicación
      const locationRecord = await findOrCreateLocation(
        mappedRecord.locationName || 'Ubicación Principal',
        warehouseRecord.id,
        mappedRecord.locationReference || '',
      )
      if (!locationRecord) {
        Logger.error(`Error al procesar ubicación para fila ${index + 1}`)
        errorCount++
        continue
      }

      // Obtener estado
      const statusRecord = await findStatusByName(mappedRecord.statusName)
      if (!statusRecord) {
        Logger.error(`Error al procesar estado para fila ${index + 1}`)
        errorCount++
        continue
      }

      // Obtener condición
      const conditionRecord = await findConditionByName(
        mappedRecord.conditionName,
      )
      if (!conditionRecord) {
        Logger.error(`Error al procesar condición para fila ${index + 1}`)
        errorCount++
        continue
      }

      // Encontrar categoría
      const categoryRecord = await findCategoryByNameOrDefault(
        mappedRecord.name ? mappedRecord.name.split('/')[0] : 'OTROS',
      )
      if (!categoryRecord) {
        Logger.error(`Error al procesar categoría para fila ${index + 1}`)
        errorCount++
        continue
      }

      // Parsear código - usar un valor autogenerado si no existe
      let itemCode: string = (index + 10000).toString()
      if (mappedRecord.code) {
        try {
          itemCode = mappedRecord.code
        } catch (e) {
          Logger.warn(`Error al parsear código para fila ${index + 1}: ${e}`)
        }
      }

      // Crear el bien
      const itemRecord = await db
        .insert(item)
        .values({
          code: itemCode,
          previousCode: mappedRecord.previousCode || '',
          identifier: mappedRecord.identifier || '',
          itemTypeId: itemTypeRecord.id,
          name: mappedRecord.name || 'Sin nombre',
          description: mappedRecord.description || '',
          categoryId: categoryRecord.id,
          statusId: statusRecord.id,
          conditionId: conditionRecord.id,
          normativeType: 'INVENTORY' as const,
          origin: 'PURCHASE' as const,
          entryOrigin: mappedRecord.entryOrigin || '',
          entryType: mappedRecord.entryType || '',
          acquisitionDate: parseDate(mappedRecord.acquisitionDate),
          commitmentNumber: mappedRecord.commitmentNumber || '',
          modelCharacteristics: mappedRecord.modelCharacteristics || '',
          brandBreedOther: mappedRecord.brandBreedOther || '',
          identificationSeries: mappedRecord.identificationSeries || '',
          dimensions: mappedRecord.dimensions || '',
          critical: parseBoolean(mappedRecord.critical),
          observations: mappedRecord.description || '',
          locationId: locationRecord.id,
          itemLine: parseInt(mappedRecord.itemLine),
          accountingAccount: mappedRecord.accountingAccount || '',
          registrationUserId: adminUser.id,
        })
        .returning()

      // Crear el valor del activo
      if (itemRecord.length > 0) {
        await db.insert(assetValue).values({
          itemId: itemRecord[0].id,
          currency: mappedRecord.currency || 'USD',
          purchaseValue: parseDecimal(mappedRecord.purchaseValue),
          repurchase: parseBoolean(mappedRecord.repurchase),
          depreciable: parseBoolean(mappedRecord.depreciable),
          entryDate:
            parseDate(mappedRecord.acquisitionDate) ||
            new Date().toISOString().split('T')[0],
          lastDepreciationDate: parseDate(mappedRecord.lastDepreciationDate),
          usefulLife: parseInt(mappedRecord.usefulLife),
          depreciationEndDate: parseDate(mappedRecord.depreciationEndDate),
          bookValue: parseDecimal(mappedRecord.bookValue),
          residualValue: parseDecimal(mappedRecord.residualValue),
          ledgerValue: parseDecimal(mappedRecord.ledgerValue),
          accumulatedDepreciationValue: parseDecimal(
            mappedRecord.accumulatedDepreciationValue,
          ),
          onLoan: parseBoolean(mappedRecord.onLoan),
        })

        // Asociar color si existe
        if (mappedRecord.colorName) {
          const colorRecord = await findOrCreateColor(mappedRecord.colorName)
          if (colorRecord) {
            await db.insert(itemColor).values({
              itemId: itemRecord[0].id,
              colorId: colorRecord.id,
              isMainColor: true,
            })
          }
        }

        // Asociar material si existe
        if (mappedRecord.materialName) {
          const materialRecord = await findOrCreateMaterial(
            mappedRecord.materialName,
          )
          if (materialRecord) {
            await db.insert(itemMaterial).values({
              itemId: itemRecord[0].id,
              materialId: materialRecord.id,
              isMainMaterial: true,
            })
          }
        }

        successCount++
      } else {
        Logger.error(`Error al crear item para fila ${index + 1}`)
        errorCount++
      }

      if ((index + 1) % 10 === 0) {
        Logger.log(
          `Procesados ${index + 1} registros (${successCount} exitosos, ${errorCount} con error)`,
        )
      }
    } catch (error) {
      Logger.error(
        `Error al procesar fila ${index + 1}: ${(error as Error).message}`,
      )
      errorCount++
      continue
    }
  }

  Logger.log(
    `Importación finalizada: ${successCount} registros importados correctamente, ${errorCount} con error`,
  )
  return {
    success: successCount,
    error: errorCount,
    total: records.length,
    errorMessage: null,
  }
}
