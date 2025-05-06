import {
  pgTable,
  serial,
  timestamp,
  text,
  varchar,
  integer,
} from 'drizzle-orm/pg-core'
import { item } from './item/item'
import { status } from './status'
import { user } from '../users/user'
import { loan } from '../loans/loan'
import { relations } from 'drizzle-orm'

export const statusChange = pgTable('status_changes', {
  id: serial('id').primaryKey(),
  itemId: integer('item_id')
    .references(() => item.id, { onDelete: 'cascade' })
    .notNull(),
  previousStatusId: integer('previous_status_id').references(() => status.id),
  newStatusId: integer('new_status_id')
    .references(() => status.id)
    .notNull(),
  changeDate: timestamp('change_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
  userId: integer('user_id')
    .references(() => user.id)
    .notNull(),
  loanId: integer('loan_id')
    .references(() => loan.id)
    .notNull(),
  observations: text('observations'),
  evidenceImage: varchar('evidence_image', { length: 255 }),
  registrationDate: timestamp('registration_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
})

export const statusChangeRelations = relations(statusChange, ({ one }) => ({
  item: one(item, {
    fields: [statusChange.itemId],
    references: [item.id],
  }),
  previousStatus: one(status, {
    fields: [statusChange.previousStatusId],
    references: [status.id],
    relationName: 'previousStatus',
  }),
  newStatus: one(status, {
    fields: [statusChange.newStatusId],
    references: [status.id],
    relationName: 'newStatus',
  }),
  user: one(user, {
    fields: [statusChange.userId],
    references: [user.id],
  }),
  loan: one(loan, {
    fields: [statusChange.loanId],
    references: [loan.id],
  }),
}))
