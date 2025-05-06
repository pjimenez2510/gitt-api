import {
  pgTable,
  serial,
  integer,
  text,
  varchar,
  boolean,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core'
import { loan } from './loan'
import { item } from '../inventory/item/item'
import { status } from '../inventory/status'
import { relations } from 'drizzle-orm'

export const loanDetail = pgTable(
  'loan_details',
  {
    id: serial('id').primaryKey(),
    loanId: integer('loan_id')
      .references(() => loan.id, { onDelete: 'cascade' })
      .notNull(),
    itemId: integer('item_id')
      .references(() => item.id)
      .notNull(),
    exitStatusId: integer('exit_status_id').references(() => status.id),
    returnStatusId: integer('return_status_id').references(() => status.id),
    exitObservations: text('exit_observations'),
    returnObservations: text('return_observations'),
    exitImage: varchar('exit_image', { length: 255 }),
    returnImage: varchar('return_image', { length: 255 }),
    approved: boolean('approved').default(false),
    registrationDate: timestamp('registration_date', {
      withTimezone: true,
      mode: 'date',
    }).defaultNow(),
    updateDate: timestamp('update_date', {
      withTimezone: true,
      mode: 'date',
    }).defaultNow(),
  },
  (t) => [unique().on(t.loanId, t.itemId)],
)

export const loanDetailRelations = relations(loanDetail, ({ one }) => ({
  loan: one(loan, {
    fields: [loanDetail.loanId],
    references: [loan.id],
  }),
  item: one(item, {
    fields: [loanDetail.itemId],
    references: [item.id],
  }),
  exitStatus: one(status, {
    fields: [loanDetail.exitStatusId],
    references: [status.id],
    relationName: 'exitStatus',
  }),
  returnStatus: one(status, {
    fields: [loanDetail.returnStatusId],
    references: [status.id],
    relationName: 'returnStatus',
  }),
}))
