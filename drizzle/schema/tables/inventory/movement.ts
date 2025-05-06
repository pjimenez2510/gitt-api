import {
  pgTable,
  serial,
  timestamp,
  text,
  varchar,
  integer,
} from 'drizzle-orm/pg-core'
import { movementType } from 'drizzle/schema/enums/locations'
import { item } from './item/item'
import { location } from '../locations/location'
import { user } from '../users/user'
import { relations } from 'drizzle-orm'

export const movement = pgTable('movements', {
  id: serial('id').primaryKey(),
  itemId: integer('item_id')
    .references(() => item.id)
    .notNull(),
  movementType: movementType('movement_type').notNull(),
  originLocationId: integer('origin_location_id').references(() => location.id),
  destinationLocationId: integer('destination_location_id').references(
    () => location.id,
  ),
  movementDate: timestamp('movement_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
  userId: integer('user_id')
    .references(() => user.id)
    .notNull(),
  loanId: integer('loan_id'), // Will reference loan table
  observations: text('observations'),
  reason: varchar('reason', { length: 255 }),
  transferCertificate: varchar('transfer_certificate', { length: 50 }),
  registrationDate: timestamp('registration_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
})

export const movementRelations = relations(movement, ({ one }) => ({
  item: one(item, {
    fields: [movement.itemId],
    references: [item.id],
  }),
  originLocation: one(location, {
    fields: [movement.originLocationId],
    references: [location.id],
  }),
  destinationLocation: one(location, {
    fields: [movement.destinationLocationId],
    references: [location.id],
  }),
  user: one(user, {
    fields: [movement.userId],
    references: [user.id],
  }),
}))
