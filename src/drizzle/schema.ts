import { sql } from 'drizzle-orm'
import { boolean, index, integer, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable(
  'users',
  {
    id: text('id')
      .primaryKey()
      .default(sql`concat('usr_', uuid_generate_v4())`),
    username: text('username').notNull().unique(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    name: text('name'),
    profilePicture: text('profile_picture'),
    description: text('description'),
    location: text('location'),
    error: text('error'),
    fullProfile: jsonb('full_profile'),
    tweets: jsonb('tweets'),
    analysis: jsonb('analysis'),
    followers: integer('followers'),

    //Statuses
    profileScraped: boolean('profile_scraped').default(false),
    tweetScrapeStarted: boolean('tweet_scrape_started').default(false),
    tweetScrapeCompleted: boolean('tweet_scrape_completed').default(false),
    wordwareStarted: boolean('wordware_started').default(false),
    wordwareCompleted: boolean('wordware_completed').default(false),
  },
  (table) => {
    return {
      usernameIdx: index('username_idx').on(table.username),
    }
  },
)

export type InsertUser = typeof users.$inferInsert
export type SelectUser = typeof users.$inferSelect
