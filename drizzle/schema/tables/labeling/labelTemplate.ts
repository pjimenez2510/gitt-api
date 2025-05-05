import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  integer,
} from 'drizzle-orm/pg-core'
import { user } from '../users/user'

export const labelTemplate = pgTable('label_template', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  description: text('description'),
  configuration: text('configuration').notNull(),
  defaultTemplate: boolean('default_template').default(false),
  creatorId: integer('creator_id')
    .references(() => user.id)
    .notNull(),
  creationDate: timestamp('creation_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
  active: boolean('active').default(true),
  updateDate: timestamp('update_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
})
