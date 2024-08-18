import { sql } from 'drizzle-orm'
import { boolean, index, integer, jsonb, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'

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
    paidWordwareStarted: boolean('paid_wordware_started').default(false),
    paidWordwareStartedTime: timestamp('paid_wordware_started_time').notNull().defaultNow(),
    paidWordwareCompleted: boolean('paid_wordware_completed').default(false),
  },
  (table) => {
    return {
      usernameIdx: index('username_idx').on(table.username),
      lowercaseUsernameIdx: index('lowercase_username_idx').on(table.lowercaseUsername),
      createdAtIndex: index('created_at_index').on(table.createdAt),
    }
  },
)

export const pairs = pgTable(
  'pairs',
  {
    id: text('id')
      .primaryKey()
      .default(sql`concat('pair_', uuid_generate_v4())`),
    user1lowercaseUsername: text('user1_lowercase_username')
      .notNull()
      .references(() => users.lowercaseUsername),
    user2lowercaseUsername: text('user2_lowercase_username')
      .notNull()
      .references(() => users.lowercaseUsername),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    analysis: jsonb('analysis'),
    unlocked: boolean('unlocked').default(false),
    unlockType: text('unlock_type').$type<'stripe' | 'email' | 'free'>(),
    wordwareStarted: boolean('wordware_started').default(false),
    wordwareStartedTime: timestamp('wordware_started_time').notNull().defaultNow(),
    wordwareCompleted: boolean('wordware_completed').default(false),
  },
  (table) => {
    return {
      userPairIdx: uniqueIndex('unique_user_pair_idx').on(table.user1lowercaseUsername, table.user2lowercaseUsername),
      createdAtPairIndex: index('created_at_pair_idx').on(table.createdAt),
    }
  },
)

export const userStatistics = pgTable(
  'user_statistics',
  {
    timestamp: timestamp('timestamp').notNull(),
    uniqueUsersCount: integer('unique_users_count').notNull(),
    uniquePairsCount: integer('unique_pairs_count').notNull(),
  },
  (table) => {
    return {
      timestampIdx: uniqueIndex('timestamp_idx').on(table.timestamp),
    }
  },
)

export type InsertUser = typeof users.$inferInsert
export type SelectUser = typeof users.$inferSelect
export type InsertPair = typeof pairs.$inferInsert
export type SelectPair = typeof pairs.$inferSelect
