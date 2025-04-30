import {
  pgTable,
  uuid,
  decimal,
  text,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core'
import { insurancePolicy } from './insurancePolicy'
import { item } from './item/item'
import { relations } from 'drizzle-orm'

export const insuredAssetDetail = pgTable(
  'insured_asset_detail',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    policyId: uuid('policy_id')
      .references(() => insurancePolicy.id, { onDelete: 'cascade' })
      .notNull(),
    itemId: uuid('item_id')
      .references(() => item.id, { onDelete: 'cascade' })
      .notNull(),
    insuredValue: decimal('insured_value', {
      precision: 12,
      scale: 2,
    }).notNull(),
    deductible: decimal('deductible', { precision: 10, scale: 2 }),
    coverage: text('coverage'),
    registrationDate: timestamp('registration_date', {
      withTimezone: true,
      mode: 'date',
    }).defaultNow(),
    updateDate: timestamp('update_date', {
      withTimezone: true,
      mode: 'date',
    }).defaultNow(),
  },
  (t) => [unique().on(t.policyId, t.itemId)],
)

export const insuredAssetDetailRelations = relations(
  insuredAssetDetail,
  ({ one }) => ({
    policy: one(insurancePolicy, {
      fields: [insuredAssetDetail.policyId],
      references: [insurancePolicy.id],
    }),
    item: one(item, {
      fields: [insuredAssetDetail.itemId],
      references: [item.id],
    }),
  }),
)
