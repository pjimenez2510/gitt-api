import { pgTable, uuid, varchar, timestamp, boolean } from 'drizzle-orm/pg-core'
import { user } from './user'
import { relations } from 'drizzle-orm'

export const userSession = pgTable('user_session', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => user.id)
    .notNull(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  clientIp: varchar('client_ip', { length: 45 }),
  userAgent: varchar('user_agent', { length: 255 }),
  startDate: timestamp('start_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
  expirationDate: timestamp('expiration_date', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
  active: boolean('active').default(true),
})

export const userSessionRelations = relations(userSession, ({ one }) => ({
  user: one(user, {
    fields: [userSession.userId],
    references: [user.id],
  }),
}))
