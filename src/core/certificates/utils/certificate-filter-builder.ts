import { SQL, and, eq, gte, ilike, lte } from 'drizzle-orm/sql'
import { certificate } from 'drizzle/schema/tables/inventory/certificate'
import { FilterCertificateDto } from '../dto/req/certificate-filter.dto'

export function buildCertificateFilterConditions(
  filterDto: FilterCertificateDto,
): SQL[] {
  const conditions: SQL[] = []

  if (filterDto.number) {
    conditions.push(eq(certificate.number, filterDto.number))
  }

  if (filterDto.dateFrom) {
    conditions.push(gte(certificate.date, filterDto.dateFrom))
  }

  if (filterDto.dateTo) {
    conditions.push(lte(certificate.date, filterDto.dateTo))
  }

  if (filterDto.type) {
    conditions.push(eq(certificate.type, filterDto.type))
  }

  if (filterDto.status) {
    conditions.push(eq(certificate.status, filterDto.status))
  }

  if (filterDto.deliveryResponsibleId) {
    conditions.push(
      eq(certificate.deliveryResponsibleId, filterDto.deliveryResponsibleId),
    )
  }

  if (filterDto.receptionResponsibleId) {
    conditions.push(
      eq(certificate.receptionResponsibleId, filterDto.receptionResponsibleId),
    )
  }

  if (filterDto.observations) {
    conditions.push(
      ilike(certificate.observations, `%${filterDto.observations}%`),
    )
  }

  return conditions
}

export function buildCertificateWhereClause(
  conditions: SQL[],
): SQL | undefined {
  return conditions.length ? and(...conditions) : undefined
}
