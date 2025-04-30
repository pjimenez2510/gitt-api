import { pgEnum } from 'drizzle-orm/pg-core'

export const verificationStatus = pgEnum('verification_status', [
  'SCHEDULED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
])

export const foundStatus = pgEnum('found_status', [
  'FOUND',
  'NOT_FOUND',
  'DAMAGED',
])

export const reportType = pgEnum('report_type', [
  'INVENTORY',
  'LOANS',
  'DEPRECIATION',
  'VERIFICATION',
])

export const reportFormat = pgEnum('report_format', [
  'PDF',
  'EXCEL',
  'CSV',
  'HTML',
])

export const reportFrequency = pgEnum('report_frequency', [
  'DAILY',
  'WEEKLY',
  'MONTHLY',
  'QUARTERLY',
  'ANNUAL',
])
