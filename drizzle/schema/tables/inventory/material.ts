import {
  pgTable,
  varchar,
  text,
  timestamp,
  boolean,
  serial,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { itemMaterial } from './item/itemMaterial'

export const material = pgTable('materials', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  materialType: varchar('material_type', { length: 50 }),
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

export const materialRelations = relations(material, ({ many }) => ({
  itemMaterials: many(itemMaterial),
}))
