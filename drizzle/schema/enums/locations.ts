import { pgEnum } from 'drizzle-orm/pg-core'

export const locationType = pgEnum('location_type', [
  'BUILDING',
  'FLOOR',
  'OFFICE',
  'WAREHOUSE',
  'SHELF',
  'LABORATORY',
])

export const movementType = pgEnum('movement_type', [
  'ENTRY',
  'TRANSFER',
  'EXIT',
])

export const capacityUnit = pgEnum('capacity_unit', [
  'UNITS',
  'METERS',
  'SQUARE_METERS',
])
