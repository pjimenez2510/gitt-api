import {
  color,
  material,
  condition,
  category,
  itemType,
  status,
} from 'drizzle/schema/tables/inventory'
import { location } from 'drizzle/schema/tables/locations/location'
import { user } from 'drizzle/schema/tables/users'

export type LocationRecord = typeof location.$inferSelect
export type ColorRecord = typeof color.$inferSelect
export type MaterialRecord = typeof material.$inferSelect
export type StatusRecord = typeof status.$inferSelect
export type ConditionRecord = typeof condition.$inferSelect
export type CategoryRecord = typeof category.$inferSelect
export type ItemTypeRecord = typeof itemType.$inferSelect
export type UserRecord = typeof user.$inferSelect

export interface MappedRecord {
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
  quantity: string | null
  custodyCurrent: string | null
  warehouseId: string | null
  locationId: string | null
  documentId: string | null
  currentCustodian: string | null
  activeCustodian: string | null
  actStatus: string | null
  actAccounted: string | null
  itemAccounted: string | null
}

export interface ProcessCSVResult {
  success: number
  error: number
  total: number
  errorMessage: string | null
}

export interface CSVOptions {
  delimiter: string
  headerRowCount: number
}
