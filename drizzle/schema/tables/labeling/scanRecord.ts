import {
  pgTable,
  serial,
  timestamp,
  text,
  varchar,
  integer,
} from 'drizzle-orm/pg-core'
import { label } from './label'
import { user } from '../users/user'
import { relations } from 'drizzle-orm'

export const scanRecord = pgTable('scan_records', {
  id: serial('id').primaryKey(),
  labelId: integer('label_id')
    .references(() => label.id, { onDelete: 'cascade' })
    .notNull(),
  userId: integer('user_id')
    .references(() => user.id)
    .notNull(),
  scanDate: timestamp('scan_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
  scanLocation: text('scan_location'),
  device: varchar('device', { length: 255 }),
  actionPerformed: varchar('action_performed', { length: 100 }),
  registrationDate: timestamp('registration_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
})

export const scanRecordRelations = relations(scanRecord, ({ one }) => ({
  label: one(label, {
    fields: [scanRecord.labelId],
    references: [label.id],
  }),
  user: one(user, {
    fields: [scanRecord.userId],
    references: [user.id],
  }),
}))
