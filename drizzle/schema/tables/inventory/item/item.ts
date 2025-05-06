import {
  pgTable,
  integer,
  varchar,
  text,
  date,
  boolean,
  timestamp,
  serial,
} from 'drizzle-orm/pg-core'
import { normativeType, origin } from 'drizzle/schema/enums/inventory'
import { user } from '../../users/user'
import { itemType } from '../itemType'
import { category } from '../category'
import { certificate } from '../certificate'
import { condition } from '../condition'
import { status } from '../status'
import { location } from '../../locations/location'
import { relations } from 'drizzle-orm'
import { itemColor } from './itemColor'
import { itemMaterial } from './itemMaterial'
import { itemImage } from './itemImage'
import { assetValue } from '../assetValue'
import { maintenance } from '../maintenance'
import { movement } from '../movement'
import { statusChange } from '../statusChange'
import { loanDetail } from '../../loans/loanDetail'
import { exitDetail } from '../exitDetail'
import { assetLoan } from '../assetLoan'
import { insuredAssetDetail } from '../insuredAssetDetail'
import { insuranceClaim } from '../insuranceClaim'
import { label } from '../../labeling/label'
import { verificationDetail } from '../../reports/verificationDetail'

export const item = pgTable('items', {
  id: serial('id').primaryKey(),
  code: integer('code').notNull().unique(),
  previousCode: varchar('previous_code', { length: 50 }),
  identifier: varchar('identifier', { length: 50 }).unique(),
  certificateId: integer('certificate_id').references(() => certificate.id),
  itemTypeId: integer('item_type_id')
    .references(() => itemType.id)
    .notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  categoryId: integer('category_id')
    .references(() => category.id)
    .notNull(),
  statusId: integer('status_id')
    .references(() => status.id)
    .notNull(),
  conditionId: integer('condition_id').references(() => condition.id),
  normativeType: normativeType('normative_type').notNull(),
  origin: origin('origin'),
  entryOrigin: varchar('entry_origin', { length: 100 }),
  entryType: varchar('entry_type', { length: 100 }),
  acquisitionDate: date('acquisition_date'),
  commitmentNumber: varchar('commitment_number', { length: 100 }),
  modelCharacteristics: varchar('model_characteristics', { length: 200 }),
  brandBreedOther: varchar('brand_breed_other', { length: 100 }),
  identificationSeries: varchar('identification_series', { length: 100 }),
  warrantyDate: date('warranty_date'),
  dimensions: varchar('dimensions', { length: 100 }),
  critical: boolean('critical').default(false),
  dangerous: boolean('dangerous').default(false),
  requiresSpecialHandling: boolean('requires_special_handling').default(false),
  perishable: boolean('perishable').default(false),
  expirationDate: date('expiration_date'),
  itemLine: integer('item_line'),
  accountingAccount: varchar('accounting_account', { length: 50 }),
  observations: text('observations'),
  availableForLoan: boolean('available_for_loan').default(true),
  locationId: integer('location_id').references(() => location.id),
  custodianId: integer('custodian_id').references(() => user.id),
  activeCustodian: boolean('active_custodian').default(true),
  active: boolean('active').default(true),
  registrationUserId: integer('registration_user_id')
    .references(() => user.id)
    .notNull(),
  registrationDate: timestamp('registration_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
  updateDate: timestamp('update_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
})

export const itemRelations = relations(item, ({ one, many }) => ({
  certificate: one(certificate, {
    fields: [item.certificateId],
    references: [certificate.id],
  }),
  itemType: one(itemType, {
    fields: [item.itemTypeId],
    references: [itemType.id],
  }),
  category: one(category, {
    fields: [item.categoryId],
    references: [category.id],
  }),
  status: one(status, {
    fields: [item.statusId],
    references: [status.id],
  }),
  condition: one(condition, {
    fields: [item.conditionId],
    references: [condition.id],
  }),
  registrationUser: one(user, {
    fields: [item.registrationUserId],
    references: [user.id],
    relationName: 'registeredBy',
  }),
  location: one(location, {
    fields: [item.locationId],
    references: [location.id],
  }),
  custodian: one(user, {
    fields: [item.custodianId],
    references: [user.id],
    relationName: 'custodian',
  }),

  colors: many(itemColor),
  materials: many(itemMaterial),
  images: many(itemImage),
  assetValues: many(assetValue),
  maintenances: many(maintenance),
  movements: many(movement),
  statusChanges: many(statusChange),
  loanDetails: many(loanDetail),
  exits: many(exitDetail),
  assetLoans: many(assetLoan),
  insuredAssetDetails: many(insuredAssetDetail),
  insuranceClaims: many(insuranceClaim),
  labels: many(label),
  verificationDetails: many(verificationDetail),
}))
