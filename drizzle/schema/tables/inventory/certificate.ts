import {
  pgTable,
  uuid,
  integer,
  date,
  timestamp,
  boolean,
  text,
} from 'drizzle-orm/pg-core'
import {
  certificateType,
  certificateStatus,
} from 'drizzle/schema/enums/inventory'
import { user } from '../users/user'
import { relations } from 'drizzle-orm'
import { item } from './item/item'

export const certificate = pgTable('certificate', {
  id: uuid('id').primaryKey().defaultRandom(),
  number: integer('number').notNull().unique(),
  date: date('date'),
  type: certificateType('type'),
  status: certificateStatus('status'),
  deliveryResponsibleId: integer('delivery_responsible_id').references(
    () => user.id,
  ),
  receptionResponsibleId: integer('reception_responsible_id').references(
    () => user.id,
  ),
  observations: text('observations'),
  accounted: boolean('accounted').default(false),
  registrationDate: timestamp('registration_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
  updateDate: timestamp('update_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
})

export const certificateRelations = relations(certificate, ({ one, many }) => ({
  deliveryResponsible: one(user, {
    fields: [certificate.deliveryResponsibleId],
    references: [user.id],
    relationName: 'deliveryResponsible',
  }),
  receptionResponsible: one(user, {
    fields: [certificate.receptionResponsibleId],
    references: [user.id],
    relationName: 'receptionResponsible',
  }),
  items: many(item),
}))
