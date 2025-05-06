import {
  pgTable,
  serial,
  integer,
  decimal,
  varchar,
  text,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core'
import { exitProcess } from './exitProcess'
import { item } from './item/item'
import { relations } from 'drizzle-orm'

export const exitDetail = pgTable(
  'exit_details',
  {
    id: serial('id').primaryKey(),
    processId: integer('process_id')
      .references(() => exitProcess.id, { onDelete: 'cascade' })
      .notNull(),
    itemId: integer('item_id')
      .references(() => item.id)
      .notNull(),
    appraisalValue: decimal('appraisal_value', { precision: 12, scale: 2 }),
    exitValue: decimal('exit_value', { precision: 12, scale: 2 }),
    beneficiary: varchar('beneficiary', { length: 255 }),
    observations: text('observations'),
    registrationDate: timestamp('registration_date', {
      withTimezone: true,
      mode: 'date',
    }).defaultNow(),
    updateDate: timestamp('update_date', {
      withTimezone: true,
      mode: 'date',
    }).defaultNow(),
  },
  (t) => [unique().on(t.processId, t.itemId)],
)

export const exitDetailRelations = relations(exitDetail, ({ one }) => ({
  process: one(exitProcess, {
    fields: [exitDetail.processId],
    references: [exitProcess.id],
  }),
  item: one(item, {
    fields: [exitDetail.itemId],
    references: [item.id],
  }),
}))
