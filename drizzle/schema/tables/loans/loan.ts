import {
  pgTable,
  serial,
  varchar,
  timestamp,
  text,
  boolean,
  integer,
} from 'drizzle-orm/pg-core'
import { loanStatus } from 'drizzle/schema/enums/loans'
import { user } from '../users/user'
import { relations } from 'drizzle-orm'
import { loanDetail } from './loanDetail'

export const loan = pgTable('loans', {
  id: serial('id').primaryKey(),
  requestDate: timestamp('request_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
  approvalDate: timestamp('approval_date', {
    withTimezone: true,
    mode: 'date',
  }),
  deliveryDate: timestamp('delivery_date', {
    withTimezone: true,
    mode: 'date',
  }),
  scheduledReturnDate: timestamp('scheduled_return_date', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
  actualReturnDate: timestamp('actual_return_date', {
    withTimezone: true,
    mode: 'date',
  }),
  status: loanStatus('status').notNull().default('REQUESTED'),
  requestorId: integer('requestor_id')
    .references(() => user.id)
    .notNull(),
  approverId: integer('approver_id').references(() => user.id),
  reason: text('reason').notNull(),
  associatedEvent: varchar('associated_event', { length: 255 }),
  externalLocation: varchar('external_location', { length: 255 }),
  notes: text('notes'),
  reminderSent: boolean('reminder_sent').default(false),
  registrationDate: timestamp('registration_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
  updateDate: timestamp('update_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
})

export const loanRelations = relations(loan, ({ one, many }) => ({
  requestor: one(user, {
    fields: [loan.requestorId],
    references: [user.id],
    relationName: 'requestor',
  }),
  approver: one(user, {
    fields: [loan.approverId],
    references: [user.id],
    relationName: 'approver',
  }),
  details: many(loanDetail),
}))
