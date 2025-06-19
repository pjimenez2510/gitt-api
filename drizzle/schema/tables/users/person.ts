import { relations } from 'drizzle-orm'
import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core'
import { user } from './user'
import { PERSON_STATUS } from 'src/core/people/types/person-status.enum'
import { personStatus, personType } from 'drizzle/schema/enums'

export const person = pgTable('people', {
  id: serial('id').primaryKey(),
  dni: varchar('dni', { length: 15 }).notNull().unique(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 15 }),
  type: personType('type').notNull(),
  status: personStatus('status').default(PERSON_STATUS.ACTIVE).notNull(),
  registrationDate: timestamp('registration_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
  updateDate: timestamp('update_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
})

export const personRelations = relations(person, ({ many }) => ({
  users: many(user),
}))
