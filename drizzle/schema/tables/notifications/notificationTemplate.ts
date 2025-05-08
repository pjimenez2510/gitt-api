import { pgTable, serial, text, boolean, timestamp } from 'drizzle-orm/pg-core'
import {
  notificationChannel,
  notificationType,
} from 'drizzle/schema/enums/notifications'

export const notificationTemplate = pgTable('notification_templates', {
  id: serial('id').primaryKey(),
  type: notificationType('type').notNull().unique(),
  templateTitle: text('template_title').notNull(),
  templateContent: text('template_content').notNull(),
  channels: notificationChannel('channels').array().notNull(),
  active: boolean('active').default(true),
  registrationDate: timestamp('registration_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
  updateDate: timestamp('update_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
})
