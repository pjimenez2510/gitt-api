import {
  pgTable,
  uuid,
  varchar,
  date,
  timestamp,
  text,
  integer,
} from 'drizzle-orm/pg-core'
import { verificationStatus } from 'drizzle/schema/enums/reports'
import { user } from '../users/user'
import { relations } from 'drizzle-orm'
import { verificationDetail } from './verificationDetail'

export const physicalVerification = pgTable('physical_verification', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date'),
  responsibleId: integer('responsible_id')
    .references(() => user.id)
    .notNull(),
  status: verificationStatus('status').notNull(),
  observations: text('observations'),
  finalDocument: varchar('final_document', { length: 255 }),
  registrationDate: timestamp('registration_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
  updateDate: timestamp('update_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
})

export const physicalVerificationRelations = relations(
  physicalVerification,
  ({ one, many }) => ({
    responsible: one(user, {
      fields: [physicalVerification.responsibleId],
      references: [user.id],
    }),
    details: many(verificationDetail),
  }),
)
