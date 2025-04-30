import { pgEnum } from 'drizzle-orm/pg-core'

export const loanStatus = pgEnum('loan_status', [
  'REQUESTED',
  'APPROVED',
  'DELIVERED',
  'RETURNED',
  'CANCELLED',
  'EXPIRED',
])

export const documentType = pgEnum('document_type', ['LOAN', 'RETURN'])
