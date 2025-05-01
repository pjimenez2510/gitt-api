import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core'
import { warehouse } from './warehouse'
import { capacityUnit, locationType } from 'drizzle/schema/enums/locations'
import { relations } from 'drizzle-orm'
import { item } from '../inventory/item/item'
import { movement } from '../inventory/movement'

export const location = pgTable('location', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  warehouseId: uuid('warehouse_id').references(() => warehouse.id),
  parentLocationId: uuid('parent_location_id').references(() => location.id),
  type: locationType('type').notNull(),
  building: varchar('building', { length: 100 }),
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
  warehouse: one(warehouse, {
    fields: [location.warehouseId],
    references: [warehouse.id],
  }),
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
