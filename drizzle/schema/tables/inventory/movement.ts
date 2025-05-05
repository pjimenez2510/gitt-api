import {
  pgTable,
  uuid,
  timestamp,
  text,
  varchar,
  integer,
} from 'drizzle-orm/pg-core'
import { movementType } from 'drizzle/schema/enums/locations'
import { item } from './item/item'
import { location } from '../locations/location'
import { user } from '../users/user'
export const movement = pgTable('movement', {
  id: uuid('id').primaryKey().defaultRandom(),
  itemId: uuid('item_id')
    .references(() => item.id)
    .notNull(),
  movementType: movementType('movement_type').notNull(),
  originLocationId: uuid('origin_location_id').references(() => location.id),
  destinationLocationId: uuid('destination_location_id').references(
    () => location.id,
  ),
  movementDate: timestamp('movement_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
  userId: integer('user_id')
    .references(() => user.id)
    .notNull(),
  loanId: uuid('loan_id'), // Will reference loan table
  observations: text('observations'),
  reason: varchar('reason', { length: 255 }),
  transferCertificate: varchar('transfer_certificate', { length: 50 }),
  registrationDate: timestamp('registration_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
})
