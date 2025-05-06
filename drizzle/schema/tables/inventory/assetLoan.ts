import {
  pgTable,
  serial,
  varchar,
  date,
  text,
  timestamp,
  integer,
} from 'drizzle-orm/pg-core'
import { item } from './item/item'
import { user } from '../users/user'
import { assetLoanStatus } from 'drizzle/schema/enums/inventory'
import { relations } from 'drizzle-orm'

export const assetLoan = pgTable('asset_loans', {
  id: serial('id').primaryKey(),
  itemId: integer('item_id')
    .references(() => item.id, { onDelete: 'cascade' })
    .notNull(),
  beneficiaryInstitution: varchar('beneficiary_institution', {
    length: 255,
  }).notNull(),
  deliveryResponsibleId: integer('delivery_responsible_id')
    .references(() => user.id)
    .notNull(),
  receptionResponsible: varchar('reception_responsible', {
    length: 255,
  }).notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  contractNumber: varchar('contract_number', { length: 50 }),
  reason: text('reason'),
  conditions: text('conditions'),
  status: assetLoanStatus('status').default('ACTIVE'),
  observations: text('observations'),
  registrationDate: timestamp('registration_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
  updateDate: timestamp('update_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
})

export const assetLoanRelations = relations(assetLoan, ({ one }) => ({
  item: one(item, {
    fields: [assetLoan.itemId],
    references: [item.id],
  }),
  deliveryResponsible: one(user, {
    fields: [assetLoan.deliveryResponsibleId],
    references: [user.id],
  }),
}))
