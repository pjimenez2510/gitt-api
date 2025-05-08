import {
  pgTable,
  serial,
  integer,
  varchar,
  timestamp,
} from 'drizzle-orm/pg-core'
import {
  labelType,
  labelFormat,
  labelStatus,
} from 'drizzle/schema/enums/labeling'
import { item } from '../inventory/item/item'
import { relations } from 'drizzle-orm'
import { scanRecord } from './scanRecord'

export const label = pgTable('labels', {
  id: serial('id').primaryKey(),
  itemId: integer('item_id')
    .references(() => item.id, { onDelete: 'cascade' })
    .notNull(),
  type: labelType('type').notNull(),
  content: varchar('content', { length: 255 }).notNull(),
  format: labelFormat('format').notNull(),
  generationDate: timestamp('generation_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
  printDate: timestamp('print_date', {
    withTimezone: true,
    mode: 'date',
  }),
  imageUrl: varchar('image_url', { length: 255 }),
  status: labelStatus('status').notNull().default('ACTIVE'),
  registrationDate: timestamp('registration_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
  updateDate: timestamp('update_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
})

export const labelRelations = relations(label, ({ one, many }) => ({
  item: one(item, {
    fields: [label.itemId],
    references: [item.id],
  }),
  scanRecords: many(scanRecord),
}))
