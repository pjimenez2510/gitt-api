import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { itemColor } from './item/itemColor'

export const color = pgTable('color', {
  id: uuid('id').primaryKey().defaultRandom(),
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
