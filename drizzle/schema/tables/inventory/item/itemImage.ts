import {
  pgTable,
  serial,
  integer,
  varchar,
  timestamp,
  boolean,
  text,
  date,
} from 'drizzle-orm/pg-core'
import { item } from './item'
import { relations } from 'drizzle-orm'

export const itemImage = pgTable('item_images', {
  id: serial('id').primaryKey(),
  itemId: integer('item_id')
    .references(() => item.id, { onDelete: 'cascade' })
    .notNull(),
  filePath: varchar('file_path', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }), // 'PRIMARY', 'SECONDARY', 'DETAIL'
  isPrimary: boolean('is_primary').default(false),
  description: text('description'),
  photoDate: date('photo_date'),
  registrationDate: timestamp('registration_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
  updateDate: timestamp('update_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
})

export const itemImageRelations = relations(itemImage, ({ one }) => ({
  item: one(item, {
    fields: [itemImage.itemId],
    references: [item.id],
  }),
}))
