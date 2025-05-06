import {
  pgTable,
  serial,
  varchar,
  date,
  decimal,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'
import { policyStatus } from 'drizzle/schema/enums/inventory'
import { relations } from 'drizzle-orm'
import { insuredAssetDetail } from './insuredAssetDetail'
import { insuranceClaim } from './insuranceClaim'

export const insurancePolicy = pgTable('insurance_policies', {
  id: serial('id').primaryKey(),
  policyNumber: varchar('policy_number', { length: 50 }).notNull().unique(),
  insuranceCompany: varchar('insurance_company', { length: 255 }).notNull(),
  policyType: varchar('policy_type', { length: 100 }),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  totalInsuredValue: decimal('total_insured_value', {
    precision: 12,
    scale: 2,
  }).notNull(),
  totalPremium: decimal('total_premium', { precision: 10, scale: 2 }).notNull(),
  status: policyStatus('status').notNull(),
  policyDocument: varchar('policy_document', { length: 255 }),
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

export const insurancePolicyRelations = relations(
  insurancePolicy,
  ({ many }) => ({
    insuredAssets: many(insuredAssetDetail),
    claims: many(insuranceClaim),
  }),
)
