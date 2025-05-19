import { MappedRecord } from '../types'

/**
 * Mapea los campos del CSV a los campos de la base de datos
 * Soporta múltiples formatos de CSV con diferentes nombres de columnas
 * @param record Registro del CSV
 * @returns Objeto con los campos mapeados
 */
export const mapCsvToItemFields = (
  record: Record<string, string>,
): MappedRecord => {
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
