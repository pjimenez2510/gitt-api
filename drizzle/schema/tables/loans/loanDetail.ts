import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core'
import { loan } from './loan'
import { item } from '../inventory/item/item'
import { relations } from 'drizzle-orm'
import { condition } from '../inventory'

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
    exitConditionId: integer('exit_condition_id').references(
      () => condition.id,
    ),
    returnConditionId: integer('return_condition_id').references(
      () => condition.id,
    ),
    exitObservations: text('exit_observations'),
    returnObservations: text('return_observations'),
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
  exitCondition: one(condition, {
    fields: [loanDetail.exitConditionId],
    references: [condition.id],
    relationName: 'exitCondition',
  }),
  returnCondition: one(condition, {
    fields: [loanDetail.returnConditionId],
    references: [condition.id],
    relationName: 'returnCondition',
  }),
}))
