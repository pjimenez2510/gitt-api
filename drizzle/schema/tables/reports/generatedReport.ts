import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
  boolean,
  integer,
} from 'drizzle-orm/pg-core'
import { reportFrequency } from 'drizzle/schema/enums/reports'
import { reportFormat, reportType } from 'drizzle/schema/enums/reports'
import { user } from '../users/user'
import { relations } from 'drizzle-orm'

export const generatedReport = pgTable('generated_report', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  type: reportType('type').notNull(),
  parameters: text('parameters'),
  generationDate: timestamp('generation_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
  userId: integer('user_id')
    .references(() => user.id)
    .notNull(),
  documentUrl: varchar('document_url', { length: 255 }).notNull(),
  format: reportFormat('format').notNull(),
  scheduled: boolean('scheduled').default(false),
  frequency: reportFrequency('frequency'),
  updateDate: timestamp('update_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
})

export const generatedReportRelations = relations(
  generatedReport,
  ({ one }) => ({
    user: one(user, {
      fields: [generatedReport.userId],
      references: [user.id],
    }),
  }),
)
