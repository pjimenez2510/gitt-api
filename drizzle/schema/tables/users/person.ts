import { relations } from 'drizzle-orm'
import { date, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core'
import { user } from './user'

export const person = pgTable('people', {
  id: serial('id').primaryKey(),
  dni: varchar('dni', { length: 15 }).notNull().unique(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  middleName: varchar('middle_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  secondLastName: varchar('second_last_name', { length: 100 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  birthDate: date('birth_date'),
  phone: varchar('phone', { length: 15 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const personRelations = relations(person, ({ many }) => ({
  users: many(user),
}))
