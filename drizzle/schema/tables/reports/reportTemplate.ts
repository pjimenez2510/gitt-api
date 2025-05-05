import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  integer,
} from 'drizzle-orm/pg-core'
import { reportType } from 'drizzle/schema/enums/reports'
import { user } from '../users/user'

export const reportTemplate = pgTable('report_template', {
  id: uuid('id').primaryKey().defaultRandom(),
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
