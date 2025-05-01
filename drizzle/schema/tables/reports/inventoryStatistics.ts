import {
  pgTable,
  uuid,
  date,
  integer,
  decimal,
  timestamp,
  text,
} from 'drizzle-orm/pg-core'

export const inventoryStatistics = pgTable('inventory_statistics', {
  id: uuid('id').primaryKey().defaultRandom(),
  date: date('date').notNull(),
  totalItems: integer('total_items').notNull(),
  totalCategories: integer('total_categories').notNull(),
  totalActiveLoans: integer('total_active_loans').notNull(),
  itemsByStatus: text('items_by_status').notNull(),
  itemsByCategory: text('items_by_category').notNull(),
  totalValuation: decimal('total_valuation', {
    precision: 14,
    scale: 2,
  }).notNull(),
  registrationDate: timestamp('registration_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
  updateDate: timestamp('update_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
})
