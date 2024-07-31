import { sql } from 'drizzle-orm'
import { boolean, index, integer, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable(
  'users',
  {
    id: text('id')
      .primaryKey()
      .default(sql`concat('usr_', uuid_generate_v4())`),
    username: text('username').notNull().unique(),
    lowercaseUsername: text('lowercase_username').notNull().unique(),
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
    unlocked: boolean('unlocked').default(false),
    unlockType: text('unlock_type').$type<'stripe' | 'email' | 'free'>(),

    //Statuses
    profileScraped: boolean('profile_scraped').default(false),
    tweetScrapeStarted: boolean('tweet_scrape_started').default(false),
    tweetScrapeStartedTime: timestamp('tweet_scrape_started_time').notNull().defaultNow(),
    tweetScrapeCompleted: boolean('tweet_scrape_completed').default(false),
    wordwareStarted: boolean('wordware_started').default(false),
    wordwareStartedTime: timestamp('wordware_started_time').notNull().defaultNow(),
    wordwareCompleted: boolean('wordware_completed').default(false),
  },
  (table) => {
    return {
      usernameIdx: index('username_idx').on(table.username),
      lowercaseUsernameIdx: index('lowercase_username_idx').on(table.lowercaseUsername),
    }
  },
)

export type InsertUser = typeof users.$inferInsert
export type SelectUser = typeof users.$inferSelect
