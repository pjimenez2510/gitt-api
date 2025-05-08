import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { parse } from 'csv-parse/sync'
import * as fs from 'fs'
import { Logger } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

import {
  item,
  assetValue,
  itemColor,
  itemMaterial,
  warehouse,
  location,
  status,
  condition,
  color,
  material,
  itemType,
  category,
  user,
  person,
} from '../schema'
import { eq } from 'drizzle-orm'
import { USER_STATUS } from 'src/core/users/types/user-status.enum'
import { USER_TYPE } from 'src/core/users/types/user-type.enum'

// Configuración del DB
const db = drizzle(process.env.DATABASE_URL!)

// Helper para hashear contraseñas
const hashPassword = (password: string): string => {
  return bcrypt.hashSync(password, 12)
}

// Tipos para el resultado de las consultas de tablas
type WarehouseRecord = typeof warehouse.$inferSelect
type LocationRecord = typeof location.$inferSelect
type ColorRecord = typeof color.$inferSelect
type MaterialRecord = typeof material.$inferSelect
type StatusRecord = typeof status.$inferSelect
type ConditionRecord = typeof condition.$inferSelect
type CategoryRecord = typeof category.$inferSelect
type ItemTypeRecord = typeof itemType.$inferSelect
type UserRecord = typeof user.$inferSelect

// Interfaces para tipado estricto
interface MappedRecord {
  code: string | null
  previousCode: string | null
  identifier: string | null
  name: string | null
  description: string | null
  certificateNumber: string | null
  typeCode: string | null
  modelCharacteristics: string | null
  brandBreedOther: string | null
  identificationSeries: string | null
  dimensions: string | null
  critical: string | null
  warehouseName: string | null
  locationName: string | null
  locationReference: string | null
  statusName: string | null
  conditionName: string | null
  entryOrigin: string | null
  entryType: string | null
  acquisitionDate: string | null
  commitmentNumber: string | null
  currency: string | null
  purchaseValue: string | null
  repurchase: string | null
  depreciable: string | null
  lastDepreciationDate: string | null
  usefulLife: string | null
  depreciationEndDate: string | null
  bookValue: string | null
  residualValue: string | null
  ledgerValue: string | null
  accumulatedDepreciationValue: string | null
  onLoan: string | null
  colorName: string | null
  materialName: string | null
  itemLine: string | null
  accountingAccount: string | null
}

interface ProcessCSVResult {
  success: number
  error: number
  total: number
}

interface CSVOptions {
  delimiter: string
  headerRowCount: number
}

// Función para parsear fecha según formato
const parseDate = (dateStr: string | null): string | null => {
  if (!dateStr) return null

  // Intentar diferentes formatos de fecha
  try {
    if (dateStr.includes('/')) {
      const parts = dateStr.split('/')
      if (parts[0].length <= 2) {
        // DD/MM/YYYY
        const [day, month, year] = parts.map(Number)
        return new Date(year, month - 1, day).toISOString().split('T')[0]
      } else {
        // YYYY/MM/DD
        const [year, month, day] = parts.map(Number)
        return new Date(year, month - 1, day).toISOString().split('T')[0]
      }
    } else if (dateStr.includes('-')) {
      // Ya está en formato YYYY-MM-DD
      return dateStr
    }

    // Fallback: intentar parsear como fecha directamente
    const date = new Date(dateStr)
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0]
    }
  } catch (e) {
    Logger.warn(`Error parseando fecha: ${dateStr} ${e}`)
  }

  return null
}

// Función para parsear valores decimales
const parseDecimal = (valueStr: string | null): string => {
  if (!valueStr) return '0'
  return String(valueStr).replace(',', '.')
}

// Función para buscar u obtener usuario administrador para registro
const findAdminUser = async (): Promise<UserRecord | null> => {
  try {
    // Buscar un usuario existente
    const users = await db.select().from(user).limit(1)

    if (users.length > 0) {
      return users[0]
    }

    // Si no hay usuarios, crear uno por defecto
    Logger.warn(
      'No se encontró ningún usuario para asignar como registrador. Creando usuario por defecto.',
    )

    // Primero crear una persona
    const newPerson = await db
      .insert(person)
      .values({
        dni: '9999999999',
        firstName: 'Admin',
        lastName: 'Sistema',
        email: 'admin@sistema.local',
      })
      .returning()

    if (newPerson.length === 0) {
      throw new Error('No se pudo crear la persona para el usuario por defecto')
    }

    // Luego crear el usuario
    const newUser = await db
      .insert(user)
      .values({
        userName: 'admin',
        passwordHash: hashPassword('123456'),
        userType: USER_TYPE.ADMINISTRATOR,
        personId: newPerson[0].id,
        career: 'ADMINISTRATOR',
        status: USER_STATUS.ACTIVE,
      })
      .returning()

    if (newUser.length === 0) {
      throw new Error('No se pudo crear el usuario por defecto')
    }

    return newUser[0]
  } catch (error) {
    Logger.error(
      `Error al buscar/crear usuario administrador: ${(error as Error).message}`,
    )
    return null
  }
}

// Función para encontrar o crear almacén
const findOrCreateWarehouse = async (
  warehouseName: string,
): Promise<WarehouseRecord | null> => {
  if (!warehouseName) return null

  const cleanWarehouseName = warehouseName.trim()
  if (cleanWarehouseName === '') return null

  try {
    const existingWarehouse = await db
      .select()
      .from(warehouse)
      .where(eq(warehouse.name, cleanWarehouseName))
      .limit(1)

    if (existingWarehouse.length > 0) {
      return existingWarehouse[0]
    }

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

// Función para encontrar o crear ubicación
const findOrCreateLocation = async (
  locationName: string,
  warehouseId: number,
  reference?: string,
): Promise<LocationRecord | null> => {
  if (!locationName || !warehouseId) return null

  const cleanLocationName = locationName.trim()
  if (cleanLocationName === '') return null

  try {
    const existingLocation = await db
      .select()
      .from(location)
      .where(eq(location.name, cleanLocationName))
      .limit(1)

    if (existingLocation.length > 0) {
      return existingLocation[0]
    }

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

// Función para encontrar o crear color
const findOrCreateColor = async (
  colorName: string,
): Promise<ColorRecord | null> => {
  if (!colorName) return null

  const cleanColorName = colorName.trim().toUpperCase()
  if (cleanColorName === '') return null

  try {
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

// Función para encontrar o crear material
const findOrCreateMaterial = async (
  materialName: string,
): Promise<MaterialRecord | null> => {
  if (!materialName) return null

  const cleanMaterialName = materialName.trim().toUpperCase()
  if (cleanMaterialName === '') return null

  try {
    const existingMaterial = await db
      .select()
      .from(material)
      .where(eq(material.name, cleanMaterialName))
      .limit(1)

    if (existingMaterial.length > 0) {
      return existingMaterial[0]
    }

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

// Función para obtener el status por nombre, con fallback a "Activo"
const findStatusByName = async (
  statusName: string | null,
): Promise<StatusRecord | null> => {
  if (!statusName) statusName = 'Activo'

  const cleanStatusName = statusName.trim()

  try {
    // Mapeo de nombres comunes
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

    // Fallback a "Activo"
    const defaultStatus = await db
      .select()
      .from(status)
      .where(eq(status.name, 'Activo'))
      .limit(1)

    if (defaultStatus.length > 0) {
      return defaultStatus[0]
    }

    // Crear estado por defecto si no existe
    const newStatus = await db
      .insert(status)
      .values({
        name: 'Activo',
        description: 'Estado por defecto',
        requiresMaintenance: false,
      })
      .returning()

    return newStatus[0]
  } catch (error) {
    Logger.error(`Error al buscar estado: ${(error as Error).message}`)
    return null
  }
}

// Función para obtener la condición por nombre, con fallback a "BUENO"
const findConditionByName = async (
  conditionName: string | null,
): Promise<ConditionRecord | null> => {
  if (!conditionName) conditionName = 'BUENO'

  const cleanConditionName = conditionName.trim().toUpperCase()

  try {
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

    // Crear condición por defecto si no existe
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

// Función para obtener la categoría, con fallback a la primera disponible o crear una por defecto
const findCategoryByNameOrDefault = async (
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

// Función para obtener el tipo de item, con fallback a BLD o BCA
const findItemTypeByCode = async (
  typeCode: string | null,
): Promise<ItemTypeRecord | null> => {
  if (!typeCode) typeCode = 'BLD'

  const cleanTypeCode = typeCode.trim().toUpperCase()

  try {
    // Intentar buscar por código
    const itemTypeRecord = await db
      .select()
      .from(itemType)
      .where(eq(itemType.code, cleanTypeCode))
      .limit(1)

    if (itemTypeRecord.length > 0) {
      return itemTypeRecord[0]
    }

    // Si no se encuentra por código exacto, buscar que contenga el código
    const typeContains = await db
      .select()
      .from(itemType)
      .where(
        eq(
          itemType.code,
          cleanTypeCode === 'BLD' || cleanTypeCode === 'BCA'
            ? cleanTypeCode
            : 'BLD',
        ),
      )
      .limit(1)

    if (typeContains.length > 0) {
      return typeContains[0]
    }

    // Fallback a BLD
    const defaultType = await db
      .select()
      .from(itemType)
      .where(eq(itemType.code, 'BLD'))
      .limit(1)

    if (defaultType.length > 0) {
      return defaultType[0]
    }

    // Crear tipo por defecto si no existe
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

// Mapea los campos del CSV a los campos de la base de datos
const mapCsvToItemFields = (record: Record<string, string>): MappedRecord => {
  // Mapeos posibles para campos comunes en diferentes CSV
  const possibleMappings: Record<keyof MappedRecord, string[]> = {
    code: ['Código del Bien', 'Código', 'Code', 'ID'],
    previousCode: ['Código Anterior', 'Previous Code', 'Old Code'],
    identifier: ['Identificador', 'Identifier'],
    name: ['Bien', 'Nombre', 'Name', 'Item Name'],
    description: ['Descripción', 'Description'],
    certificateNumber: [
      'Nro de Acta/ Nro de Matriz',
      'Certificate Number',
      'Acta',
    ],
    typeCode: ['(BLD) o (BCA)', 'Item Type', 'Tipo Bien'],
    modelCharacteristics: ['Modelo/ Características', 'Model', 'Modelo'],
    brandBreedOther: ['Marca/ Raza/ Otros', 'Brand', 'Marca'],
    identificationSeries: ['Serie/ Identificación', 'Serial', 'Serie'],
    dimensions: ['Dimensiones', 'Dimensions'],
    critical: ['Crítico', 'Critical'],
    warehouseName: ['Bodega', 'Warehouse'],
    locationName: ['Ubicación de Bodega', 'Location', 'Ubicación'],
    locationReference: ['UBICACIÓN', 'Reference'],
    statusName: ['Estado Bien', 'Status', 'Estado'],
    conditionName: ['Condición del Bien', 'Condition', 'Condición'],
    entryOrigin: ['Origen del Ingreso', 'Origin', 'Origen'],
    entryType: ['Tipo de Ingreso', 'Entry Type', 'Tipo Entrada'],
    acquisitionDate: [
      'Fecha de Ingreso',
      'Acquisition Date',
      'Fecha Adquisición',
    ],
    commitmentNumber: ['Nro de Compromiso', 'Commitment Number', 'Compromiso'],
    currency: ['Moneda', 'Currency'],
    purchaseValue: ['Valor de Compra', 'Purchase Value', 'Valor'],
    repurchase: ['Recompra', 'Repurchase'],
    depreciable: ['Depreciable'],
    lastDepreciationDate: [
      'Fecha Última Depreciación',
      'Last Depreciation Date',
    ],
    usefulLife: ['Vida Útil', 'Useful Life'],
    depreciationEndDate: [
      'Fecha Término Depreciación',
      'Depreciation End Date',
    ],
    bookValue: ['Valor Contable', 'Book Value'],
    residualValue: ['Valor Residual', 'Residual Value'],
    ledgerValue: ['Valor en Libros', 'Ledger Value'],
    accumulatedDepreciationValue: [
      'Valor Depreciación Acumulada',
      'Accumulated Depreciation',
    ],
    onLoan: ['Comodato', 'On Loan'],
    colorName: ['Color'],
    materialName: ['Material'],
    itemLine: ['Item/ Renglón', 'Item Line', 'Línea'],
    accountingAccount: ['Cuenta Contable', 'Accounting Account', 'Cuenta'],
  }

  // Buscar valores para cada campo mapeado
  const getValue = (fieldMappings: string[]): string | null => {
    for (const mapping of fieldMappings) {
      if (record[mapping] !== undefined) return record[mapping]
    }
    return null
  }

  return {
    code: getValue(possibleMappings.code),
    previousCode: getValue(possibleMappings.previousCode),
    identifier: getValue(possibleMappings.identifier),
    name: getValue(possibleMappings.name),
    description: getValue(possibleMappings.description),
    certificateNumber: getValue(possibleMappings.certificateNumber),
    typeCode: getValue(possibleMappings.typeCode),
    modelCharacteristics: getValue(possibleMappings.modelCharacteristics),
    brandBreedOther: getValue(possibleMappings.brandBreedOther),
    identificationSeries: getValue(possibleMappings.identificationSeries),
    dimensions: getValue(possibleMappings.dimensions),
    critical: getValue(possibleMappings.critical),
    warehouseName: getValue(possibleMappings.warehouseName),
    locationName: getValue(possibleMappings.locationName),
    locationReference: getValue(possibleMappings.locationReference),
    statusName: getValue(possibleMappings.statusName),
    conditionName: getValue(possibleMappings.conditionName),
    entryOrigin: getValue(possibleMappings.entryOrigin),
    entryType: getValue(possibleMappings.entryType),
    acquisitionDate: getValue(possibleMappings.acquisitionDate),
    commitmentNumber: getValue(possibleMappings.commitmentNumber),
    currency: getValue(possibleMappings.currency),
    purchaseValue: getValue(possibleMappings.purchaseValue),
    repurchase: getValue(possibleMappings.repurchase),
    depreciable: getValue(possibleMappings.depreciable),
    lastDepreciationDate: getValue(possibleMappings.lastDepreciationDate),
    usefulLife: getValue(possibleMappings.usefulLife),
    depreciationEndDate: getValue(possibleMappings.depreciationEndDate),
    bookValue: getValue(possibleMappings.bookValue),
    residualValue: getValue(possibleMappings.residualValue),
    ledgerValue: getValue(possibleMappings.ledgerValue),
    accumulatedDepreciationValue: getValue(
      possibleMappings.accumulatedDepreciationValue,
    ),
    onLoan: getValue(possibleMappings.onLoan),
    colorName: getValue(possibleMappings.colorName),
    materialName: getValue(possibleMappings.materialName),
    itemLine: getValue(possibleMappings.itemLine),
    accountingAccount: getValue(possibleMappings.accountingAccount),
  }
}

// Función para procesar el CSV
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

      // Parsear código
      let itemCode: string | null = null
      try {
        itemCode = mappedRecord.code
      } catch (e) {
        itemCode = (index + 10000).toString()
        Logger.warn(`Error al procesar código para fila ${index + 1}: ${e}`)
      }

      if (!itemCode) {
        Logger.error(`Error al procesar código para fila ${index + 1}`)
        errorCount++
        continue
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
          critical:
            mappedRecord.critical === 'S' ||
            mappedRecord.critical === 'true' ||
            mappedRecord.critical === 'SI' ||
            mappedRecord.critical === 'Y',
          observations: mappedRecord.description || '',
          locationId: locationRecord.id,
          itemLine: mappedRecord.itemLine
            ? parseInt(mappedRecord.itemLine)
            : null,
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
          repurchase:
            mappedRecord.repurchase === 'S' ||
            mappedRecord.repurchase === 'true' ||
            mappedRecord.repurchase === 'SI' ||
            mappedRecord.repurchase === 'Y',
          depreciable:
            mappedRecord.depreciable === 'S' ||
            mappedRecord.depreciable === 'true' ||
            mappedRecord.depreciable === 'SI' ||
            mappedRecord.depreciable === 'Y',
          entryDate:
            parseDate(mappedRecord.acquisitionDate) ||
            new Date().toISOString().split('T')[0],
          lastDepreciationDate: parseDate(mappedRecord.lastDepreciationDate),
          usefulLife: mappedRecord.usefulLife
            ? parseInt(mappedRecord.usefulLife)
            : null,
          depreciationEndDate: parseDate(mappedRecord.depreciationEndDate),
          bookValue: parseDecimal(mappedRecord.bookValue),
          residualValue: parseDecimal(mappedRecord.residualValue),
          ledgerValue: parseDecimal(mappedRecord.ledgerValue),
          accumulatedDepreciationValue: parseDecimal(
            mappedRecord.accumulatedDepreciationValue,
          ),
          onLoan:
            mappedRecord.onLoan === 'S' ||
            mappedRecord.onLoan === 'true' ||
            mappedRecord.onLoan === 'SI' ||
            mappedRecord.onLoan === 'Y',
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
  return { success: successCount, error: errorCount, total: records.length }
}

// Si se ejecuta directamente
if (require.main === module) {
  const filePath =
    process.argv[2] || 'drizzle/data/BIENES_FRANKLIN_SALAZAR_FINAL.csv'
  const delimiter = process.argv[3] || ','

  processCSV(filePath, { delimiter, headerRowCount: 1 })
    .then((result) => {
      Logger.log(
        `Importación completada exitosamente: ${JSON.stringify(result)}`,
      )
    })
    .catch((error) => {
      Logger.error(`Error durante la importación: ${(error as Error).message}`)
      process.exit(1)
    })
}
