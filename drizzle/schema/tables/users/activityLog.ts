import { pgTable, uuid, varchar, timestamp, text } from 'drizzle-orm/pg-core'
import { user } from './user'
import { relations } from 'drizzle-orm'

export const activityLog = pgTable('activity_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => user.id)
    .notNull(),
  action: varchar('action', { length: 100 }).notNull(),
  module: varchar('module', { length: 50 }).notNull(),
  entityId: uuid('entity_id'),
  entityType: varchar('entity_type', { length: 50 }),
  date: timestamp('date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
  clientIp: varchar('client_ip', { length: 45 }),
  details: text('details'),
})

export const activityLogRelations = relations(activityLog, ({ one }) => ({
  user: one(user, {
    fields: [activityLog.userId],
    references: [user.id],
  }),
}))
