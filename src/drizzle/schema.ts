import { boolean, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  profileScraped: boolean('profileScraped').default(false),
  name: text('name'),
  profilePicture: text('profilePicture'),
  description: text('description'),
  location: text('location'),
  error: text('error'),
})

export type InsertUser = typeof users.$inferInsert
export type SelectUser = typeof users.$inferSelect
