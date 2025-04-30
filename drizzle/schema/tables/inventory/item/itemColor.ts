import {
  pgTable,
  uuid,
  integer,
  boolean,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core'
import { item } from './item'
import { color } from '../color'
import { relations } from 'drizzle-orm'

export const itemColor = pgTable(
  'item_color',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    itemId: uuid('item_id')
      .references(() => item.id, { onDelete: 'cascade' })
      .notNull(),
    colorId: uuid('color_id')
      .references(() => color.id)
      .notNull(),
    percentage: integer('percentage'),
    isMainColor: boolean('is_main_color').default(false),
    registrationDate: timestamp('registration_date', {
      withTimezone: true,
      mode: 'date',
    }).defaultNow(),
    updateDate: timestamp('update_date', {
      withTimezone: true,
      mode: 'date',
    }).defaultNow(),
  },
  (t) => [unique().on(t.itemId, t.colorId)],
)

export const itemColorRelations = relations(itemColor, ({ one }) => ({
  item: one(item, {
    fields: [itemColor.itemId],
    references: [item.id],
  }),
  color: one(color, {
    fields: [itemColor.colorId],
    references: [color.id],
  }),
}))
