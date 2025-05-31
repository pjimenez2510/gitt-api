import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core'
import { capacityUnit, locationType } from 'drizzle/schema/enums/locations'
import { relations } from 'drizzle-orm'
import { item } from '../inventory/item/item'
import { movement } from '../inventory/movement'

export const location = pgTable('locations', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  parentLocationId: integer('parent_location_id'),
  type: locationType('type').notNull(),
  floor: varchar('floor', { length: 50 }),
  reference: varchar('reference', { length: 255 }),
  capacity: integer('capacity'),
  capacityUnit: capacityUnit('capacity_unit'),
  occupancy: integer('occupancy').default(0),
  qrCode: varchar('qr_code', { length: 255 }),
  coordinates: text('coordinates'),
  notes: text('notes'),
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

export const locationRelations = relations(location, ({ one, many }) => ({
  parentLocation: one(location, {
    fields: [location.parentLocationId],
    references: [location.id],
  }),
  childLocations: many(location, {
    relationName: 'parentLocation',
  }),
  items: many(item),
  originMovements: many(movement, {
    relationName: 'originLocation',
  }),
  destinationMovements: many(movement, {
    relationName: 'destinationLocation',
  }),
}))
