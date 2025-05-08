import {
  pgTable,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  timestamp,
  serial,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { item } from './item/item'

export const category = pgTable('categories', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 20 }).notNull().unique(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  parentCategoryId: integer('parent_category_id'),
  standardUsefulLife: integer('standard_useful_life'),
  depreciationPercentage: decimal('depreciation_percentage', {
    precision: 5,
    scale: 2,
  }),
  active: boolean('active').default(true),
  registrationDate: timestamp('registration_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
  updateDate: timestamp('update_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
})

export const categoryRelations = relations(category, ({ one, many }) => ({
  parentCategory: one(category, {
    fields: [category.parentCategoryId],
    references: [category.id],
  }),
  childCategories: many(category, {
    relationName: 'parentCategory',
  }),
  items: many(item),
}))
