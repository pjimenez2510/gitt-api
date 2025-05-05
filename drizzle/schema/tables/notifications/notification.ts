import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
} from 'drizzle-orm/pg-core'
import {
  notificationType,
  notificationStatus,
} from 'drizzle/schema/enums/notifications'
import { user } from '../users/user'
import { relations } from 'drizzle-orm'
import { deliveryRecord } from './deliveryRecord'

export const notification = pgTable('notification', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: integer('user_id')
    .references(() => user.id, { onDelete: 'cascade' })
    .notNull(),
  type: notificationType('type').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  creationDate: timestamp('creation_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
  readDate: timestamp('read_date', {
    withTimezone: true,
    mode: 'date',
  }),
  status: notificationStatus('status').notNull().default('PENDING'),
  actionUrl: varchar('action_url', { length: 255 }),
  entityId: uuid('entity_id'),
  entityType: varchar('entity_type', { length: 50 }),
  updateDate: timestamp('update_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
})

export const notificationRelations = relations(
  notification,
  ({ one, many }) => ({
    user: one(user, {
      fields: [notification.userId],
      references: [user.id],
    }),
    deliveryRecords: many(deliveryRecord),
  }),
)
