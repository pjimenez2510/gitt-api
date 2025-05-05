import { pgTable, varchar, serial, integer } from 'drizzle-orm/pg-core'
import { person } from './person'
import { userRole, userStatus, userType } from 'drizzle/schema'
import { relations } from 'drizzle-orm'

export const user = pgTable('users', {
  id: serial('id').primaryKey(),
  personId: integer('person_id')
    .notNull()
    .references(() => person.id),
  username: varchar('username', { length: 50 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  career: varchar('career', { length: 100 }),
  userType: userType('user_type').notNull(),
  status: userStatus('status').default('ACTIVE').notNull(),
})

export const userRelations = relations(user, ({ one, many }) => ({
  person: one(person, {
    fields: [user.personId],
    references: [person.id],
  }),
  roles: many(userRole),
}))
