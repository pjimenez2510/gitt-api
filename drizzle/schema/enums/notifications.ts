import { pgEnum } from 'drizzle-orm/pg-core'

export const notificationType = pgEnum('notification_type', [
  'LOAN',
  'RETURN',
  'MAINTENANCE',
  'SYSTEM',
  'EXPIRATION',
])

export const notificationStatus = pgEnum('notification_status', [
  'PENDING',
  'READ',
  'ARCHIVED',
])

export const notificationChannel = pgEnum('notification_channel', [
  'EMAIL',
  'SYSTEM',
  'MOBILE',
])

export const deliveryStatus = pgEnum('delivery_status', [
  'PENDING',
  'SENT',
  'FAILED',
])
