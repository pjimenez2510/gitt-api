import { integer, pgTable, varchar } from 'drizzle-orm/pg-core'

export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userName: varchar('user_name', { length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
})
