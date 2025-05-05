import {
  pgTable,
  uuid,
  date,
  varchar,
  text,
  decimal,
  timestamp,
  integer,
} from 'drizzle-orm/pg-core'
import { item } from './item/item'
import {
  maintenanceStatus,
  maintenanceType,
} from 'drizzle/schema/enums/inventory'
import { user } from '../users/user'

export const maintenance = pgTable('maintenance', {
  id: uuid('id').primaryKey().defaultRandom(),
  itemId: uuid('item_id')
    .references(() => item.id, { onDelete: 'cascade' })
    .notNull(),
  maintenanceDate: date('maintenance_date').notNull(),
  type: maintenanceType('type').notNull(),
  responsibleId: integer('responsible_id').references(() => user.id),
  externalResponsible: varchar('external_responsible', { length: 255 }),
  description: text('description'),
  cost: decimal('cost', { precision: 10, scale: 2 }),
  status: maintenanceStatus('status'),
  scheduledDate: date('scheduled_date'),
  executionDate: date('execution_date'),
  completionDate: date('completion_date'),
  activitiesPerformed: text('activities_performed'),
  result: text('result'),
  warrantyUntil: date('warranty_until'),
  registrationDate: timestamp('registration_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
  updateDate: timestamp('update_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
})
