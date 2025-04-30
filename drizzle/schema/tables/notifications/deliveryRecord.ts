import { pgTable, uuid, integer, text, timestamp } from 'drizzle-orm/pg-core'
import { notification } from './notification'
import {
  notificationChannel,
  deliveryStatus,
} from 'drizzle/schema/enums/notifications'
import { relations } from 'drizzle-orm'

export const deliveryRecord = pgTable('delivery_record', {
  id: uuid('id').primaryKey().defaultRandom(),
  notificationId: uuid('notification_id')
    .references(() => notification.id, { onDelete: 'cascade' })
    .notNull(),
  channel: notificationChannel('channel').notNull(),
  deliveryStatus: deliveryStatus('delivery_status').notNull(),
  deliveryDate: timestamp('delivery_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
  errorDetails: text('error_details'),
  attempts: integer('attempts').default(1),
  updateDate: timestamp('update_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
})

export const deliveryRecordRelations = relations(deliveryRecord, ({ one }) => ({
  notification: one(notification, {
    fields: [deliveryRecord.notificationId],
    references: [notification.id],
  }),
}))
