import { pgTable, varchar, jsonb, serial } from 'drizzle-orm/pg-core'
import { userRole } from './userRole'
import { relations } from 'drizzle-orm'

export const role = pgTable('roles', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  description: varchar('description', { length: 255 }),
  permissions: jsonb('permissions'),
})

export const roleRelations = relations(role, ({ many }) => ({
  users: many(userRole),
}))
