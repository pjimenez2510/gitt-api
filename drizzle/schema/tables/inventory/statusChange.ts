import {
  pgTable,
  uuid,
  timestamp,
  text,
  varchar,
  integer,
} from 'drizzle-orm/pg-core'
import { item } from './item/item'
import { status } from './status'
import { user } from '../users/user'
import { loan } from '../loans/loan'

export const statusChange = pgTable('status_change', {
  id: uuid('id').primaryKey().defaultRandom(),
  itemId: uuid('item_id')
    .references(() => item.id, { onDelete: 'cascade' })
    .notNull(),
  previousStatusId: uuid('previous_status_id').references(() => status.id),
  newStatusId: uuid('new_status_id')
    .references(() => status.id)
    .notNull(),
  changeDate: timestamp('change_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
  userId: integer('user_id')
    .references(() => user.id)
    .notNull(),
  loanId: uuid('loan_id')
    .references(() => loan.id)
    .notNull(),
  observations: text('observations'),
  evidenceImage: varchar('evidence_image', { length: 255 }),
  registrationDate: timestamp('registration_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
})
