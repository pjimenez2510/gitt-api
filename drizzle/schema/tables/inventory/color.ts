import {
  pgTable,
  varchar,
  text,
  timestamp,
  boolean,
  serial,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { itemColor } from './item/itemColor'

export const color = pgTable('colors', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  hexCode: varchar('hex_code', { length: 7 }),
  description: text('description'),
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

export const colorRelations = relations(color, ({ many }) => ({
  itemColors: many(itemColor),
}))
