import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  timestamp,
  integer,
} from 'drizzle-orm/pg-core'
import { user } from '../users/user'
import { relations } from 'drizzle-orm'
import { location } from './location'

export const warehouse = pgTable('warehouses', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  location: varchar('location', { length: 255 }),
  responsibleId: integer('responsible_id').references(() => user.id),
  description: text('description'),
  active: boolean('active').notNull().default(true),
  registrationDate: timestamp('registration_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
  updateDate: timestamp('update_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
})

export const warehouseRelations = relations(warehouse, ({ one, many }) => ({
  responsible: one(user, {
    fields: [warehouse.responsibleId],
    references: [user.id],
  }),
  locations: many(location),
}))
