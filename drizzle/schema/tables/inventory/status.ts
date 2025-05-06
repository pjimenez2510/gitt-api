import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { item } from './item/item'
import { statusChange } from './statusChange'
import { loanDetail } from '../loans/loanDetail'

export const status = pgTable('states', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  description: text('description'),
  requiresMaintenance: boolean('requires_maintenance').default(false),
  registrationDate: timestamp('registration_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
  updateDate: timestamp('update_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
})

export const statusRelations = relations(status, ({ many }) => ({
  items: many(item),
  previousStatusChanges: many(statusChange, { relationName: 'previousStatus' }),
  newStatusChanges: many(statusChange, { relationName: 'newStatus' }),
  exitStatuses: many(loanDetail, { relationName: 'exitStatus' }),
  returnStatuses: many(loanDetail, { relationName: 'returnStatus' }),
}))
