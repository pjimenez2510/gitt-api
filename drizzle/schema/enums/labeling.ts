import { pgEnum } from 'drizzle-orm/pg-core'

export const labelType = pgEnum('label_type', ['BARCODE', 'QR'])

export const labelFormat = pgEnum('label_format', [
  'CODE128',
  'QR',
  'PDF417',
  'EAN13',
])

export const labelStatus = pgEnum('label_status', [
  'ACTIVE',
  'REPLACED',
  'CANCELLED',
])
