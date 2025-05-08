import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  timestamp,
  integer,
} from 'drizzle-orm/pg-core'
import { reportType } from 'drizzle/schema/enums/reports'
import { user } from '../users/user'
import { relations } from 'drizzle-orm'

export const reportTemplate = pgTable('report_templates', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  description: text('description'),
  type: reportType('type').notNull(),
  definition: text('definition').notNull(),
  creatorId: integer('creator_id')
    .references(() => user.id)
    .notNull(),
  creationDate: timestamp('creation_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
  active: boolean('active').default(true),
  requiredPermissions: text('required_permissions'),
  updateDate: timestamp('update_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
})

export const reportTemplateRelations = relations(reportTemplate, ({ one }) => ({
  creator: one(user, {
    fields: [reportTemplate.creatorId],
    references: [user.id],
  }),
}))
