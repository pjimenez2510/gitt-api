import {
  pgTable,
  uuid,
  varchar,
  date,
  decimal,
  boolean,
  timestamp,
  integer,
} from 'drizzle-orm/pg-core'
import { item } from './item/item'
import { relations } from 'drizzle-orm'

export const assetValue = pgTable('asset_value', {
  id: uuid('id').primaryKey().defaultRandom(),
  itemId: uuid('item_id')
    .references(() => item.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  currency: varchar('currency', { length: 10 }).default('USD'),
  purchaseValue: decimal('purchase_value', {
    precision: 12,
    scale: 2,
  }).notNull(),
  repurchase: boolean('repurchase').default(false),
  depreciable: boolean('depreciable').default(false),
  entryDate: date('entry_date').notNull(),
  lastDepreciationDate: date('last_depreciation_date'),
  usefulLife: integer('useful_life'),
  depreciationEndDate: date('depreciation_end_date'),
  bookValue: decimal('book_value', { precision: 12, scale: 2 }),
  residualValue: decimal('residual_value', { precision: 12, scale: 2 }),
  ledgerValue: decimal('ledger_value', { precision: 12, scale: 2 }),
  accumulatedDepreciationValue: decimal('accumulated_depreciation_value', {
    precision: 12,
    scale: 2,
  }),
  onLoan: boolean('on_loan').default(false),
  registrationDate: timestamp('registration_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
  updateDate: timestamp('update_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
})

export const assetValueRelations = relations(assetValue, ({ one }) => ({
  item: one(item, {
    fields: [assetValue.itemId],
    references: [item.id],
  }),
}))
