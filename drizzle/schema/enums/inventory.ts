import { pgEnum } from 'drizzle-orm/pg-core'

export const normativeType = pgEnum('normative_type', [
  'PROPERTY',
  'ADMINISTRATIVE_CONTROL',
  'INVENTORY',
])

export const origin = pgEnum('origin', [
  'PURCHASE',
  'DONATION',
  'MANUFACTURING',
  'TRANSFER',
])

export const certificateType = pgEnum('certificate_type', [
  'ENTRY',
  'EXIT',
  'TRANSFER',
])

export const certificateStatus = pgEnum('certificate_status', [
  'DRAFT',
  'APPROVED',
  'CANCELLED',
])

export const policyStatus = pgEnum('policy_status', [
  'ACTIVE',
  'EXPIRED',
  'CANCELLED',
])

export const maintenanceType = pgEnum('maintenance_type', [
  'PREVENTIVE',
  'CORRECTIVE',
])

export const maintenanceStatus = pgEnum('maintenance_status', [
  'SCHEDULED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
])

export const assetLoanStatus = pgEnum('asset_loan_status', [
  'ACTIVE',
  'FINISHED',
  'CANCELLED',
])

export const exitProcessType = pgEnum('exit_process_type', [
  'WRITE_OFF',
  'DONATION',
  'AUCTION',
  'SCRAPPING',
  'DESTRUCTION',
  'RECYCLING',
])

export const exitProcessStatus = pgEnum('exit_process_status', [
  'INITIATED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
])

export const claimStatus = pgEnum('claim_status', [
  'REPORTED',
  'IN_PROGRESS',
  'APPROVED',
  'REJECTED',
])
