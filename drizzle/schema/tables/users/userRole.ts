import { pgTable, timestamp, serial, integer } from 'drizzle-orm/pg-core'
import { user } from './user'
import { role } from './role'
import { relations } from 'drizzle-orm'

export const userRole = pgTable('user_roles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => user.id),
  roleId: integer('role_id')
    .notNull()
    .references(() => role.id),
  assignedAt: timestamp('assigned_at').defaultNow().notNull(),
})

export const userRoleRelations = relations(userRole, ({ one }) => ({
  user: one(user, {
    fields: [userRole.userId],
    references: [user.id],
  }),
  role: one(role, {
    fields: [userRole.roleId],
    references: [role.id],
  }),
}))
