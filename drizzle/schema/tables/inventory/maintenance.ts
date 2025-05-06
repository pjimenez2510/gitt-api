import {
  pgTable,
  serial,
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
import { relations } from 'drizzle-orm'

export const maintenance = pgTable('maintenances', {
  id: serial('id').primaryKey(),
  itemId: integer('item_id')
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

export const maintenanceRelations = relations(maintenance, ({ one }) => ({
  item: one(item, {
    fields: [maintenance.itemId],
    references: [item.id],
  }),
  responsible: one(user, {
    fields: [maintenance.responsibleId],
    references: [user.id],
  }),
}))
