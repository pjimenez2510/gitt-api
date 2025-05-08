import {
  pgTable,
  varchar,
  text,
  boolean,
  timestamp,
  serial,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { item } from './item/item'

export const condition = pgTable('conditions', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  description: text('description'),
  requiresMaintenance: boolean('requires_maintenance').default(false),
  registrationDate: timestamp('registration_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
  updateDate: timestamp('update_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
  active: boolean('active').notNull().default(true),
})

export const conditionRelations = relations(condition, ({ many }) => ({
  items: many(item),
}))
