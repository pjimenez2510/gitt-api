import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'
import { user } from '../users/user'

export const log = pgTable('logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => user.id, {
    onDelete: 'set null',
  }),
  endpoint: varchar('endpoint', { length: 255 }).notNull(),
  method: varchar('method', { length: 10 }).notNull(),
  action: varchar('action', { length: 100 }),
  statusCode: integer('status_code'),
  message: text('message'),
  ip: varchar('ip', { length: 50 }),
  userAgent: varchar('user_agent', { length: 255 }),
  registrationDate: timestamp('registration_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
})
