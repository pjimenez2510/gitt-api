import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  timestamp,
  integer,
} from 'drizzle-orm/pg-core'
import { user } from '../users/user'
import { relations } from 'drizzle-orm'

export const labelTemplate = pgTable('label_templates', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  description: text('description'),
  configuration: text('configuration').notNull(),
  defaultTemplate: boolean('default_template').default(false),
  creatorId: integer('creator_id')
    .references(() => user.id)
    .notNull(),
  creationDate: timestamp('creation_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
  active: boolean('active').default(true),
  updateDate: timestamp('update_date', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
})

export const labelTemplateRelations = relations(labelTemplate, ({ one }) => ({
  creator: one(user, {
    fields: [labelTemplate.creatorId],
    references: [user.id],
  }),
}))
