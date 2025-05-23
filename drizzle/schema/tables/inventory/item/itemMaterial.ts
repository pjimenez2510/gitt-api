import {
  pgTable,
  serial,
  integer,
  boolean,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core'
import { item } from './item'
import { material } from '../material'
import { relations } from 'drizzle-orm'

export const itemMaterial = pgTable(
  'item_materials',
  {
    id: serial('id').primaryKey(),
    itemId: integer('item_id')
      .references(() => item.id, { onDelete: 'cascade' })
      .notNull(),
    materialId: integer('material_id')
      .references(() => material.id)
      .notNull(),
    isMainMaterial: boolean('is_main_material').default(false),
    registrationDate: timestamp('registration_date', {
      withTimezone: true,
      mode: 'date',
    }).defaultNow(),
    active: boolean('active').default(true),
    updateDate: timestamp('update_date', {
      withTimezone: true,
      mode: 'date',
    }).defaultNow(),
  },
  (t) => [unique().on(t.itemId, t.materialId)],
)

export const itemMaterialRelations = relations(itemMaterial, ({ one }) => ({
  item: one(item, {
    fields: [itemMaterial.itemId],
    references: [item.id],
  }),
  material: one(material, {
    fields: [itemMaterial.materialId],
    references: [material.id],
  }),
}))
