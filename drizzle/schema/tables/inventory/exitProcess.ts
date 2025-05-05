import {
  pgTable,
  uuid,
  varchar,
  date,
  timestamp,
  text,
  integer,
} from 'drizzle-orm/pg-core'
import {
  exitProcessStatus,
  exitProcessType,
} from 'drizzle/schema/enums/inventory'
import { user } from '../users/user'
import { relations } from 'drizzle-orm'
import { exitDetail } from './exitDetail'

export const exitProcess = pgTable('exit_process', {
  id: uuid('id').primaryKey().defaultRandom(),
  processCode: varchar('process_code', { length: 50 }).notNull().unique(),
  type: exitProcessType('type').notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date'),
  status: exitProcessStatus('status').notNull(),
  authorizedById: integer('authorized_by_id')
    .references(() => user.id)
    .notNull(),
  supportingDocument: varchar('supporting_document', { length: 255 }),
  finalCertificate: varchar('final_certificate', { length: 255 }),
  observations: text('observations'),
  registrationDate: timestamp('registration_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
  updateDate: timestamp('update_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
})

export const exitProcessRelations = relations(exitProcess, ({ one, many }) => ({
  authorizedBy: one(user, {
    fields: [exitProcess.authorizedById],
    references: [user.id],
  }),
  details: many(exitDetail),
}))
