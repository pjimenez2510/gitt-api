import { pgEnum } from 'drizzle-orm/pg-core'

export const userType = pgEnum('user_type', [
  'ADMINISTRATOR',
  'MANAGER',
  'TEACHER',
  'STUDENT',
])

export const userStatus = pgEnum('user_status', [
  'ACTIVE',
  'INACTIVE',
  'SUSPENDED',
])
