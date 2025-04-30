import { relations } from 'drizzle-orm'
import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  text,
} from 'drizzle-orm/pg-core'
import { userType, userStatus } from 'drizzle/schema/enums/user'
import { userRole } from './userRole'
import { userSession } from './userSession'
import { activityLog } from './activityLog'
import { notification } from '../notifications/notification'
import { notificationPreference } from '../notifications/notificationPreference'
import { loan } from '../loans/loan'
import { generatedReport } from '../reports/generatedReport'
import { physicalVerification } from '../reports/physicalVerification'
import { verificationDetail } from '../reports/verificationDetail'
import { reportTemplate } from '../reports/reportTemplate'
import { scanRecord } from '../labeling/scanRecord'
import { labelTemplate } from '../labeling/labelTemplate'
import { item } from '../inventory/item/item'
import { warehouse } from '../locations/warehouse'
import { maintenance } from '../inventory/maintenance'
import { movement } from '../inventory/movement'
import { statusChange } from '../inventory/statusChange'
import { certificate } from '../inventory/certificate'
import { assetLoan } from '../inventory/assetLoan'

export const user = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  idNumberTaxId: varchar('id_number_tax_id', { length: 20 }).notNull().unique(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  userType: userType('user_type').notNull(),
  status: userStatus('status').notNull().default('ACTIVE'),
  phone: varchar('phone', { length: 20 }),
  department: varchar('department', { length: 100 }),
  degreeProgram: varchar('degree_program', { length: 100 }),
  position: varchar('position', { length: 100 }),
  registrationDate: timestamp('registration_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
  lastLogin: timestamp('last_login', {
    withTimezone: true,
    mode: 'date',
  }),
  active: boolean('active').default(true),
  updateDate: timestamp('update_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
})

export const userRelations = relations(user, ({ many }) => ({
  userRole: many(userRole),
  userSession: many(userSession),
  activityLog: many(activityLog),
  notifications: many(notification),
  notificationPreferences: many(notificationPreference),
  requestedLoans: many(loan, { relationName: 'requestor' }),
  approvedLoans: many(loan, { relationName: 'approver' }),
  generatedReports: many(generatedReport),
  responsibleVerifications: many(physicalVerification, {
    relationName: 'responsible',
  }),
  foundVerificationDetails: many(verificationDetail, {
    relationName: 'foundUser',
  }),
  createdReportTemplates: many(reportTemplate, { relationName: 'creator' }),
  scanRecords: many(scanRecord),
  createdLabelTemplates: many(labelTemplate, { relationName: 'creator' }),
  registeredItems: many(item, { relationName: 'registeredBy' }),
  custodianItems: many(item, { relationName: 'custodian' }),
  deliveryAssetLoans: many(assetLoan, { relationName: 'deliveryResponsible' }),
  deliveryResponsibleCertificates: many(certificate, {
    relationName: 'deliveryResponsible',
  }),
  receptionResponsibleCertificates: many(certificate, {
    relationName: 'receptionResponsible',
  }),
  responsibleWarehouses: many(warehouse, { relationName: 'responsible' }),
  responsibleMaintenances: many(maintenance, { relationName: 'responsible' }),
  movementsByUser: many(movement, { relationName: 'user' }),
  statusChangesByUser: many(statusChange, { relationName: 'user' }),
}))
