import {
  pgTable,
  uuid,
  date,
  decimal,
  timestamp,
  integer,
} from 'drizzle-orm/pg-core'
import { item } from './item/item'
import { user } from '../users/user'
import { relations } from 'drizzle-orm'

export const depreciation = pgTable('depreciation', {
  id: uuid('id').primaryKey().defaultRandom(),
  itemId: uuid('item_id')
    .references(() => item.id, { onDelete: 'cascade' })
    .notNull(),
  depreciationDate: date('depreciation_date').notNull(),
  initialValue: decimal('initial_value', { precision: 12, scale: 2 }).notNull(),
  depreciatedValue: decimal('depreciated_value', {
    precision: 12,
    scale: 2,
  }).notNull(),
  accumulatedValue: decimal('accumulated_value', {
    precision: 12,
    scale: 2,
  }).notNull(),
  currentValue: decimal('current_value', { precision: 12, scale: 2 }).notNull(),
  registrationUserId: integer('registration_user_id')
    .references(() => user.id)
    .notNull(),
  registrationDate: timestamp('registration_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
  updateDate: timestamp('update_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
})

export const depreciationRelations = relations(depreciation, ({ one }) => ({
  item: one(item, {
    fields: [depreciation.itemId],
    references: [item.id],
  }),
  registrationUser: one(user, {
    fields: [depreciation.registrationUserId],
    references: [user.id],
  }),
}))
