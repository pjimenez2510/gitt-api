import { pgTable, varchar, serial, integer } from 'drizzle-orm/pg-core'
import { person } from './person'
import { relations } from 'drizzle-orm'
import { userStatus, userType } from 'drizzle/schema/enums/user'
import { userRole } from './userRole'
import { USER_STATUS } from 'src/core/users/types/user-status.enum'

export const user = pgTable('users', {
  id: serial('id').primaryKey(),
  personId: integer('person_id')
    .notNull()
    .references(() => person.id),
  userName: varchar('user_name', { length: 50 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  career: varchar('career', { length: 100 }),
  userType: userType('user_type').notNull(),
  status: userStatus('status').default(USER_STATUS.ACTIVE).notNull(),
})

export const userRelations = relations(user, ({ one, many }) => ({
  person: one(person, {
    fields: [user.personId],
    references: [person.id],
  }),
  roles: many(userRole),
}))
