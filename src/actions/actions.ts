'use server'

import { unstable_cache as cache, unstable_noStore as noStore, revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { ApifyClient } from 'apify-client'
import { and, desc, eq, inArray, sql } from 'drizzle-orm'

import { UserCardData } from '@/app/top-list'
import { db } from '@/drizzle/db'
import { InsertPair, InsertUser, pairs, SelectUser, users } from '@/drizzle/schema'

import { fetchAndParseSocialDataTweets } from './social-data'
import { fetchUserData } from './twitter-api'
import { getTweets } from './widget-scrape/tweets-widget-scrape'

export const getUser = async ({ username }: { username: SelectUser['username'] }) => {
  noStore()
  return await db.query.users.findFirst({ where: eq(users.lowercaseUsername, username.toLowerCase()) })
}

export const getUserCached = cache(
  async ({ username }: { username: SelectUser['username'] }) => {
    return await db.query.users.findFirst({ where: eq(users.lowercaseUsername, username.toLowerCase()) })
  },
  ['user-cache'],
)

export const getAuthors = cache(async (): Promise<UserCardData[]> => {
  return [
    {
      id: '2',
      username: 'bertie_ai',
      name: 'Robert Chandler',
      profilePicture: 'https://pbs.twimg.com/profile_images/1582852165831229440/PijbiUGm_400x400.jpg',
      followers: 0,
    },
    {
      id: '3',
      username: 'kozerafilip',
      name: 'Filip Kozera',
      profilePicture: 'https://pbs.twimg.com/profile_images/1720918552721661952/Opqp--Su_400x400.jpg',
      followers: 0,
    },
    {
      id: '6',
      username: 'unable0_',
      name: 'Kamil Ruczynski',
      profilePicture: 'https://pbs.twimg.com/profile_images/1737521497525088258/WylWyvQn_400x400.jpg',
      followers: 0,
    },
    {
      id: '4',
      username: 'pio_sce',
      name: 'Pio Scelina',
      profilePicture: 'https://pbs.twimg.com/profile_images/1693591650818244608/ts3JYlzY_400x400.jpg',
      followers: 0,
    },
    {
      id: '5',
      username: 'danny_hunt_code',
      name: 'Danny Hunt',
      profilePicture: 'https://pbs.twimg.com/profile_images/1647625717721583619/EcHl0CIu_400x400.jpg',
      followers: 0,
    },

    {
      id: '7',
      username: 'ky__zo',
      name: 'Kyzo',
      profilePicture: 'https://pbs.twimg.com/profile_images/1726431958891466752/JaDcBy6P_400x400.jpg',
      followers: 0,
    },
  ]
}, ['authors-users'])

const featuredUsernames = [
  'yoheinakajima',
  'MattPRD',
  'benparr',
  'jowyang',
  'saranormous',
  'swyx',
  'azeem',
  'unable0_',
  'bertie_ai',
  'kozerafilip',
  'AlexReibman',
  'bentossell',
]

export const getTop = cache(async (): Promise<UserCardData[]> => {
  return db.query.users.findMany({
    where: eq(users.wordwareCompleted, true),
    orderBy: desc(users.followers),
    limit: 12,
    columns: {
      id: true,
      username: true,
      name: true,
      profilePicture: true,
      followers: true,
    },
  })
}, ['top-users'])

export const getFeatured = cache(async (): Promise<UserCardData[]> => {
  return await db.query.users.findMany({
    where: inArray(
      users.lowercaseUsername,
      featuredUsernames.map((u) => u.toLowerCase()),
    ),
    orderBy: desc(users.followers),
    columns: {
      id: true,
      username: true,
      name: true,
      profilePicture: true,
      followers: true,
    },
  })
}, ['featured-users'])

export const insertUser = async ({ user }: { user: InsertUser }) => {
  await db.insert(users).values(user)
}

export const updateUser = async ({ user }: { user: InsertUser }) => {
  if (!user.username) {
    throw new Error('Username is required for updating a user')
  }

  await db.update(users).set(user).where(eq(users.lowercaseUsername, user.lowercaseUsername))
}

export const handleNewUsername = async ({ username, redirectPath }: { username: string; redirectPath?: string }) => {
  const user = await getUser({ username })
  if (user && redirectPath) {
    redirect(redirectPath)
  }

  let { data, error } = await fetchUserData({ screenName: username })

  if (!data && error) {
    ;({ data, error } = await scrapeProfile({ username }))
  }

  if (data && !error) {
    const user = {
      ...data,
      lowercaseUsername: data.username.toLowerCase(),
      profileScraped: true,
      error: null,
    }
    await insertUser({ user })
    if (redirectPath) {
      redirect(redirectPath)
    }
    return { error: false, found: true }
  }

  if (!data && error) {
    return {
      data: null,
      error: error,
      found: false,
    }
  }
}

const apifyClient = new ApifyClient({
  token: process.env.APIFY_API_KEY,
})

export const scrapeProfile = async ({ username }: { username: string }) => {
  const input = {
    maxItems: 5,
    startUrls: [
      `https://twitter.com/${username}`,
      `https://twitter.com/${username}`,
      `https://twitter.com/${username}`,
      `https://twitter.com/${username}`,
      `https://twitter.com/${username}`,
    ],
    getFollowers: false,
    getFollowing: false,
    getRetweeters: false,
    includeUnavailableUsers: false,
  }
  try {
    const run = await apifyClient.actor('apidojo/twitter-user-scraper').call(input)

    if (run.status === 'FAILED') throw new Error(`Scraping Error: ${run.statusMessage}`)

    const { items: profiles } = await apifyClient.dataset(run.defaultDatasetId).listItems()
    const profile = profiles[0]
    const profilePicture = profile.profilePicture as string

    if (!profile || Object.keys(profile).length === 0) throw new Error('No profile found')

    return {
      error: null,
      data: {
        username: profile.userName as string,
        url: profile.url as string,
        name: profile.name as string,
        profilePicture: profilePicture.replace('_normal.', '_400x400.'),
        description: profile.description as string,
        location: profile.location as string,
        fullProfile: profile as object,
        followers: profile.followers as number,
      },
    }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'No profile found',
    }
  }
}

export const scrapeTweets = async ({ twitterUserID, username }: { twitterUserID?: string; username: string }) => {
  console.log('🟣 | scrapeTweets | twitterUserID:', twitterUserID)
  // Try fetching tweets from social data if twitterUserID is provided
  if (twitterUserID) {
    try {
      const tweets = await fetchAndParseSocialDataTweets(twitterUserID)
      console.log(`✅✅SOCIAL DATA SUCCESS✅✅ ${tweets.length}`)
      return { data: tweets, error: null }
    } catch (error) {
      console.error('Error fetching tweets from social data', error)
      // Continue to next method if this fails
    }
  }

  // Try fetching tweets using getTweets function
  try {
    const tweets = await getTweets(username)
    if (!tweets || tweets.length === 0) throw new Error('No tweets found')
    console.log('getTweets success ✅')
    return { data: tweets, error: null }
  } catch (error) {
    console.error('Error fetching tweets with getTweets', error)
    // Continue to fallback method if this fails
  }

  // Fallback: Use Apify as a last resort
  console.log('Using Apify fallback for tweet scraping')
  const input = {
    startUrls: [`https://twitter.com/${username}`],
    maxItems: 12,
    sort: 'Latest',
    tweetLanguage: 'en',
    customMapFunction: `(object) => { 
      return {
        type: object.type,
        text: object.text,
        source: object.source,
        retweetCount: object.retweetCount,
        replyCount: object.replyCount,
        likeCount: object.likeCount,
        quoteCount: object.quoteCount,
        viewCount: object.viewCount,
        createdAt: object.createdAt,
        lang: object.lang,
        bookmarkCount: object.bookmarkCount,
        isReply: object.isReply,
        fastFollowersCount: object.fastFollowersCount,
        favouritesCount: object.favouritesCount,
        isRetweet: object.isRetweet,
        isQuote: object.isQuote,
      }
    }`,
  }

  try {
    const run = await apifyClient.actor('apidojo/tweet-scraper').call(input)
    const { items: tweets } = await apifyClient.dataset(run.defaultDatasetId).listItems()
    if (!tweets || tweets.length === 0) throw new Error('No tweets found with Apify')
    return { data: tweets, error: null }
  } catch (error) {
    console.error('Error fetching tweets with Apify', error)
    return {
      data: null,
      error: 'Failed to fetch tweets from all available methods',
    }
  }
}

export const processScrapedUser = async ({ username }: { username: string }) => {
  let user = await getUser({ username })

  if (!user) {
    throw Error(`User not found: ${username}`)
  }

  // If tweets are already scraped, return them
  if (user.tweetScrapeCompleted) {
    return user.tweets
  }

  if (!user.tweetScrapeStarted || (!user.tweetScrapeCompleted && Date.now() - user.createdAt.getTime() > 3 * 60 * 1000)) {
    user = {
      ...user,
      tweetScrapeStarted: true,
      tweetScrapeStartedTime: new Date(),
    }
    await updateUser({ user })
    let tweets
    let error
    const twitterUserID = (user.fullProfile as { twitterUserID?: string })?.twitterUserID ?? undefined
    console.log('🟣 |  processScrapedUser | twitterUserID:', twitterUserID)

    try {
      const res = await scrapeTweets({ username, twitterUserID: twitterUserID })
      tweets = res.data
      error = res.error
      if (!tweets) throw new Error('No tweets found')
    } catch (e) {
      error = e
      console.warn('Tweet scraping failed. Trying again...)', e)
      try {
        const res = await scrapeTweets({ username, twitterUserID: twitterUserID })
        tweets = res.data
        error = res.error
        console.error('🟣 | file: actions.ts:252 | processScrapedUserFirst | e:', e)
        if (!tweets) throw new Error('No tweets found')
      } catch (e) {
        console.error('🟣 | file: actions.ts:255 | processScrapedUserSecond | e:', e)
        throw e
      }
    }

    if (tweets && !error) {
      user = {
        ...user,
        tweets: tweets,
        tweetScrapeCompleted: true,
      }
      await updateUser({ user })
      return tweets
    }
    if (error) {
      user = {
        ...user,
        error: JSON.stringify(error),
      }

      await updateUser({ user })
    }
  }
}

export const createLoopsContact = async ({ email }: { email: string }) => {
  const options = {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.LOOPS_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email,
      source: 'twitter-personality',
      subscribed: true,
    }),
  }

  try {
    const response = await fetch('https://app.loops.so/api/v1/contacts/create', options)
    await response.json()

    return { success: true }
  } catch (error) {
    return { success: false, error: error }
  }
}

export const unlockGeneration = async ({ username, email }: { username: string; email: string }) => {
  const options = {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.LOOPS_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email,
      source: 'twitter-personality',
      subscribed: true,
      userGroup: 'Twitter Personality - PAYWALL',
    }),
  }

  try {
    const response = await fetch('https://app.loops.so/api/v1/contacts/create', options)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || response.statusText)
    }
    await unlockUser({ username: username.replace('/', ''), unlockType: 'email' })

    revalidatePath(username)
    return { success: true }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Email already on list')) {
      await unlockUser({ username: username.replace('/', ''), unlockType: 'email' })

      revalidatePath(username)

      return { success: true }
    }

    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'An unknown error occurred' }
  }
}

export const unlockUser = async ({ username, unlockType }: { username: string; unlockType: 'email' | 'stripe' | 'free' }) => {
  try {
    const r = await db
      .update(users)
      .set({
        unlocked: true,
        unlockType: unlockType,
      })
      .where(eq(users.lowercaseUsername, username.toLowerCase()))
      .returning({
        id: users.id,
      })
    console.log('Updated', r)

    return { success: true }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'An unknown error occurred' }
  }
}

export const getStatistics = cache(
  async () => {
    const result = await db.execute(sql`
      SELECT 
        DATE(created_at) AS date, 
        EXTRACT(HOUR FROM created_at) AS hour, 
        COUNT(DISTINCT id) AS unique_users_count
      FROM users
      GROUP BY DATE(created_at), EXTRACT(HOUR FROM created_at)
      ORDER BY DATE(created_at), EXTRACT(HOUR FROM created_at)
    `)

    let cumulative = 0
    const formattedResult = result.rows.map((row: any) => {
      cumulative += parseInt(row.unique_users_count)
      return {
        timestamp: `${row.date}T${row.hour.toString().padStart(2, '0')}:00:00Z`,
        unique: parseInt(row.unique_users_count),
        cumulative: cumulative,
      }
    })

    // Remove the last item from the array (which might be incomplete data for the current hour)
    const lastElement = formattedResult[formattedResult.length - 2] // Get the second to last element
    const lastTimestamp = lastElement ? new Date(lastElement.timestamp) : new Date()
    return { chartData: formattedResult.slice(0, -1), timestamp: lastTimestamp.toISOString() }
  },
  ['statistics'],
  { revalidate: 3600 }, // Cache for 1 hour (3600 seconds)
)

export const createPair = async ({ usernames, shouldRedirect }: { usernames: string[]; shouldRedirect?: boolean }) => {
  const [user1lowercaseUsername, user2lowercaseUsername] = [usernames[0].toLowerCase(), usernames[1].toLowerCase()].sort()

  console.log('creating pair', user1lowercaseUsername, user2lowercaseUsername)

  const result = await db
    .insert(pairs)
    .values({
      user1lowercaseUsername,
      user2lowercaseUsername,
    })
    .returning()

  if (result.length !== 1) {
    throw new Error('Expected to create exactly one pair, but got ' + result.length)
  }
  if (shouldRedirect) {
    redirect(`/${usernames[0]}/${usernames[1]}`)
  }

  return result[0]
}

export const getPair = async ({ usernames }: { usernames: string[] }) => {
  noStore()
  const [user1lowercaseUsername, user2lowercaseUsername] = [usernames[0].toLowerCase(), usernames[1].toLowerCase()].sort()

  return await db.query.pairs.findFirst({
    where: and(eq(pairs.user1lowercaseUsername, user1lowercaseUsername), eq(pairs.user2lowercaseUsername, user2lowercaseUsername)),
  })
}

export const getOrCreatePair = async ({ usernames }: { usernames: string[] }) => {
  noStore()

  const existingPair = await getPair({ usernames })

  if (existingPair) return existingPair

  return await createPair({ usernames })
}

export const updatePair = async ({ pair }: { pair: InsertPair }) => {
  if (!pair.id) throw new Error('Pair ID is required for update')
  return await db.update(pairs).set(pair).where(eq(pairs.id, pair.id))
}
