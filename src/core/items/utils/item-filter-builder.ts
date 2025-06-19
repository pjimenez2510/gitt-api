import { SQL, and, eq, gte, ilike, lte } from 'drizzle-orm/sql'
import { FilterItemDto } from '../dto/req/filter-item.dto'
import { item } from 'drizzle/schema/tables/inventory/item/item'

export function buildItemFilterConditions(filterDto: FilterItemDto): SQL[] {
  const conditions: SQL[] = []

  if (filterDto.code) {
    conditions.push(eq(item.code, filterDto.code))
  }

  if (filterDto.previousCode) {
    conditions.push(eq(item.previousCode, filterDto.previousCode))
  }

  if (filterDto.identifier) {
    conditions.push(eq(item.identifier, filterDto.identifier))
  }

  if (filterDto.certificateId) {
    conditions.push(eq(item.certificateId, filterDto.certificateId))
  }

  if (filterDto.itemTypeId) {
    conditions.push(eq(item.itemTypeId, filterDto.itemTypeId))
  }

  if (filterDto.categoryId) {
    conditions.push(eq(item.categoryId, filterDto.categoryId))
  }

  if (filterDto.statusId) {
    conditions.push(eq(item.statusId, filterDto.statusId))
  }

  if (filterDto.conditionId) {
    conditions.push(eq(item.conditionId, filterDto.conditionId))
  }

  if (filterDto.normativeType) {
    conditions.push(eq(item.normativeType, filterDto.normativeType))
  }

  if (filterDto.origin) {
    conditions.push(eq(item.origin, filterDto.origin))
  }

  if (filterDto.locationId) {
    conditions.push(eq(item.locationId, filterDto.locationId))
  }

  if (filterDto.critical !== undefined) {
    conditions.push(eq(item.critical, filterDto.critical))
  }

  if (filterDto.dangerous !== undefined) {
    conditions.push(eq(item.dangerous, filterDto.dangerous))
  }

  if (filterDto.requiresSpecialHandling !== undefined) {
    conditions.push(
      eq(item.requiresSpecialHandling, filterDto.requiresSpecialHandling),
    )
  }

  if (filterDto.perishable !== undefined) {
    conditions.push(eq(item.perishable, filterDto.perishable))
  }

  if (filterDto.availableForLoan !== undefined) {
    conditions.push(eq(item.availableForLoan, filterDto.availableForLoan))
  }

  if (filterDto.activeCustodian !== undefined) {
    conditions.push(eq(item.activeCustodian, filterDto.activeCustodian))
  }

  if (filterDto.name) {
    conditions.push(ilike(item.name, `%${filterDto.name}%`))
  }

  if (filterDto.entryType) {
    conditions.push(ilike(item.entryType, `%${filterDto.entryType}%`))
  }

  if (filterDto.modelCharacteristics) {
    conditions.push(
      ilike(item.modelCharacteristics, `%${filterDto.modelCharacteristics}%`),
    )
  }

  if (filterDto.brandBreedOther) {
    conditions.push(
      ilike(item.brandBreedOther, `%${filterDto.brandBreedOther}%`),
    )
  }

  if (filterDto.identificationSeries) {
    conditions.push(
      ilike(item.identificationSeries, `%${filterDto.identificationSeries}%`),
    )
  }

  if (filterDto.acquisitionDateFrom) {
    conditions.push(
      gte(item.acquisitionDate, filterDto.acquisitionDateFrom.toISOString()),
    )
  }

  if (filterDto.acquisitionDateTo) {
    conditions.push(
      lte(item.acquisitionDate, filterDto.acquisitionDateTo.toISOString()),
    )
  }

  if (filterDto.expirationDateFrom) {
    conditions.push(
      gte(item.expirationDate, filterDto.expirationDateFrom.toISOString()),
    )
  }

  if (filterDto.expirationDateTo) {
    conditions.push(
      lte(item.expirationDate, filterDto.expirationDateTo.toISOString()),
    )
  }

  conditions.push(eq(item.active, true))

  return conditions
}

export function buildItemWhereClause(conditions: SQL[]): SQL | undefined {
  return conditions.length ? and(...conditions) : undefined
}
