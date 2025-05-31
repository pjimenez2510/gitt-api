import { pgEnum } from 'drizzle-orm/pg-core'

export const loanStatus = pgEnum('loan_status', [
  'DELIVERED',
  'RETURNED',
  'CANCELLED',
  'RETURNED_LATE',
])

export const documentType = pgEnum('document_type', ['LOAN', 'RETURN'])
