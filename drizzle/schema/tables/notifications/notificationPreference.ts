import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  unique,
  integer,
} from 'drizzle-orm/pg-core'
import { user } from '../users/user'
import { relations } from 'drizzle-orm'

export const notificationPreference = pgTable(
  'notification_preference',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: integer('user_id')
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(),
    notificationType: varchar('notification_type', { length: 50 }).notNull(),
    emailChannel: boolean('email_channel').default(true),
    systemChannel: boolean('system_channel').default(true),
    mobileChannel: boolean('mobile_channel').default(false),
    active: boolean('active').default(true),
    registrationDate: timestamp('registration_date', {
      withTimezone: true,
      mode: 'date',
    }).defaultNow(),
    updateDate: timestamp('update_date', {
      withTimezone: true,
      mode: 'date',
    }).defaultNow(),
  },
  (t) => [unique().on(t.userId, t.notificationType)],
)

export const notificationPreferenceRelations = relations(
  notificationPreference,
  ({ one }) => ({
    user: one(user, {
      fields: [notificationPreference.userId],
      references: [user.id],
    }),
  }),
)
