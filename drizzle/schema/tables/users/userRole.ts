import { pgTable, uuid, timestamp, unique } from 'drizzle-orm/pg-core'
import { user } from './user'
import { role } from './role'
import { relations } from 'drizzle-orm'

export const userRole = pgTable(
  'user_role',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .references(() => user.id)
      .notNull(),
    roleId: uuid('role_id')
      .references(() => role.id)
      .notNull(),
    assignmentDate: timestamp('assignment_date', {
      withTimezone: true,
      mode: 'date',
    }).defaultNow(),
    updateDate: timestamp('update_date', {
      withTimezone: true,
      mode: 'date',
    }).defaultNow(),
  },
  (table) => [unique().on(table.userId, table.roleId)],
)

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
