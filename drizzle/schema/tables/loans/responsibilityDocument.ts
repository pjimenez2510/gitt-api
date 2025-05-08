import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
} from 'drizzle-orm/pg-core'
import { loan } from './loan'
import { documentType } from 'drizzle/schema/enums/loans'
import { relations } from 'drizzle-orm'

export const responsibilityDocument = pgTable('responsibility_documents', {
  id: serial('id').primaryKey(),
  loanId: integer('loan_id')
    .references(() => loan.id, { onDelete: 'cascade' })
    .notNull(),
  documentUrl: varchar('document_url', { length: 255 }).notNull(),
  generationDate: timestamp('generation_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
  signatureDate: timestamp('signature_date', {
    withTimezone: true,
    mode: 'date',
  }),
  signatureHash: varchar('signature_hash', { length: 255 }),
  type: documentType('type').notNull(),
  version: integer('version').default(1),
  registrationDate: timestamp('registration_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
  updateDate: timestamp('update_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
})

export const responsibilityDocumentRelations = relations(
  responsibilityDocument,
  ({ one }) => ({
    loan: one(loan, {
      fields: [responsibilityDocument.loanId],
      references: [loan.id],
    }),
  }),
)
