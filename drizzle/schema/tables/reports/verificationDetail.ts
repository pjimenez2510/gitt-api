import {
  pgTable,
  uuid,
  timestamp,
  text,
  varchar,
  unique,
  integer,
} from 'drizzle-orm/pg-core'
import { foundStatus } from 'drizzle/schema/enums/reports'
import { item } from '../inventory/item/item'
import { user } from '../users/user'
import { physicalVerification } from './physicalVerification'
import { location } from '../locations/location'
import { relations } from 'drizzle-orm'

export const verificationDetail = pgTable(
  'verification_detail',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    verificationId: uuid('verification_id')
      .references(() => physicalVerification.id, { onDelete: 'cascade' })
      .notNull(),
    itemId: uuid('item_id')
      .references(() => item.id)
      .notNull(),
    foundStatus: foundStatus('found_status').notNull(),
    foundLocationId: uuid('found_location_id').references(() => location.id),
    foundUserId: integer('found_user_id').references(() => user.id),
    observations: text('observations'),
    evidencePhoto: varchar('evidence_photo', { length: 255 }),
    registrationDate: timestamp('registration_date', {
      withTimezone: true,
      mode: 'date',
    }).defaultNow(),
    updateDate: timestamp('update_date', {
      withTimezone: true,
      mode: 'date',
    }).defaultNow(),
  },
  (t) => [unique().on(t.verificationId, t.itemId)],
)

export const verificationDetailRelations = relations(
  verificationDetail,
  ({ one }) => ({
    verification: one(physicalVerification, {
      fields: [verificationDetail.verificationId],
      references: [physicalVerification.id],
    }),
    item: one(item, {
      fields: [verificationDetail.itemId],
      references: [item.id],
    }),
    foundLocation: one(location, {
      fields: [verificationDetail.foundLocationId],
      references: [location.id],
    }),
    foundUser: one(user, {
      fields: [verificationDetail.foundUserId],
      references: [user.id],
    }),
  }),
)
