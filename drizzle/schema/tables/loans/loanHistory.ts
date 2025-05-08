import { pgTable, serial, timestamp, text, integer } from 'drizzle-orm/pg-core'
import { loan } from './loan'
import { loanStatus } from 'drizzle/schema/enums/loans'
import { user } from '../users/user'
import { relations } from 'drizzle-orm'

export const loanHistory = pgTable('loan_histories', {
  id: serial('id').primaryKey(),
  loanId: integer('loan_id')
    .references(() => loan.id, { onDelete: 'cascade' })
    .notNull(),
  previousStatus: loanStatus('previous_status'),
  newStatus: loanStatus('new_status').notNull(),
  changeDate: timestamp('change_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
  userId: integer('user_id')
    .references(() => user.id)
    .notNull(),
  comments: text('comments'),
  registrationDate: timestamp('registration_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
})

export const loanHistoryRelations = relations(loanHistory, ({ one }) => ({
  loan: one(loan, {
    fields: [loanHistory.loanId],
    references: [loan.id],
  }),
  user: one(user, {
    fields: [loanHistory.userId],
    references: [user.id],
  }),
}))
