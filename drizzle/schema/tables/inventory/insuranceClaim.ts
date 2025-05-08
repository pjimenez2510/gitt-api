import {
  pgTable,
  serial,
  integer,
  date,
  decimal,
  text,
  varchar,
  timestamp,
} from 'drizzle-orm/pg-core'
import { insurancePolicy } from './insurancePolicy'
import { item } from './item/item'
import { claimStatus } from 'drizzle/schema/enums/inventory'
import { relations } from 'drizzle-orm'

export const insuranceClaim = pgTable('insurance_claims', {
  id: serial('id').primaryKey(),
  policyId: integer('policy_id')
    .references(() => insurancePolicy.id)
    .notNull(),
  itemId: integer('item_id')
    .references(() => item.id)
    .notNull(),
  claimDate: date('claim_date').notNull(),
  claimDescription: text('claim_description').notNull(),
  claimFilingDate: date('claim_filing_date'),
  claimStatus: claimStatus('claim_status').notNull(),
  claimedValue: decimal('claimed_value', { precision: 12, scale: 2 }).notNull(),
  indemnifiedValue: decimal('indemnified_value', { precision: 12, scale: 2 }),
  indemnificationDate: date('indemnification_date'),
  supportingDocuments: varchar('supporting_documents', { length: 255 }),
  registrationDate: timestamp('registration_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
  updateDate: timestamp('update_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
})

export const insuranceClaimRelations = relations(insuranceClaim, ({ one }) => ({
  policy: one(insurancePolicy, {
    fields: [insuranceClaim.policyId],
    references: [insurancePolicy.id],
  }),
  item: one(item, {
    fields: [insuranceClaim.itemId],
    references: [item.id],
  }),
}))
