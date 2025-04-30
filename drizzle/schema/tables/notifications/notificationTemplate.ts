import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core'
import {
  notificationChannel,
  notificationType,
} from 'drizzle/schema/enums/notifications'
import { relations } from 'drizzle-orm'

export const notificationTemplate = pgTable('notification_template', {
  id: uuid('id').primaryKey().defaultRandom(),
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

// No hay relaciones directas con otras tablas a través de claves foráneas
export const notificationTemplateRelations = relations(
  notificationTemplate,
  ({}) => ({}),
)
