'use server'

import { unstable_noStore as noStore } from 'next/cache'
import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'

import { db } from '@/drizzle/db'
import { InsertUser, SelectUser, users } from '@/drizzle/schema'

export const getUser = async ({ username }: { username: SelectUser['username'] }) => {
  noStore()
  const data = await db.select().from(users).where(eq(users.username, username))
  return data[0]
}

export const insertUser = async ({ user }: { user: InsertUser }) => {
  await db.insert(users).values(user)
}

export const handleNewUsername = async ({ username }: { username: string }) => {
  const user = await getUser({ username })
  if (user) redirect(`/${username}`)

  const { data, error } = await scrapeProfile({ username })

  if (data && !error) {
    const user = {
      ...data,
      profileScraped: true,
      error: null,
    }
    await insertUser({ user })
  }
  if (!data && error) {
    const user = {
      username,
      error: `We couldn't find your profile. Please try again with a different username.`,
      profileScraped: false,
    }
    await insertUser({ user })
  }

  redirect(`/${data?.username}`)
}

export const scrapeProfile = async ({ username }: { username: string }) => {
  const url = `https://api.apify.com/v2/acts/V38PZzpEgOfeeWvZY/run-sync-get-dataset-items?token=${process.env.APIFY_API_KEY}`
  const headers = {
    'Content-Type': 'application/json',
  }
  const body = {
    twitterHandles: [username],
    maxItems: 1,
    customMapFunction: '(object) => { return {...object} }',
  }
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })

    const data = await response.json()
    console.log('🟣 | file: actions.ts:63 | scrapeProfile | data:', data)
    console.log('🟣 | file: actions.ts:63 | scrapeProfile | data:', response)

    const profile = data[0]

    if (!profile || Object.keys(profile).length === 0) throw new Error('No profile found')

    return {
      error: null,
      data: {
        username: profile.userName,
        url: profile.url,
        name: profile.name,
        profilePicture: profile.profilePicture.replace('_normal.', '_400x400.'),
        description: profile.description,
        location: profile.location,
      },
    }
  } catch (error) {
    return {
      data: null,
      error: 'No profile found',
    }
  }
}

export const scrapeTweets = async ({ username }: { username: string }) => {
  const url = `https://api.apify.com/v2/acts/61RPP7dywgiy0JPD0/run-sync-get-dataset-items?token=${process.env.APIFY_API_KEY}`

  // Headers for the HTTP request
  const headers = {
    'Content-Type': 'application/json',
  }

  // Prepare the data for the POST request
  const body = {
    startUrls: [`https://twitter.com/${username}`],
    maxItems: 40,
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
        extendedEntities: object.extendedEntities,
        isRetweet: object.isRetweet,
        isQuote: object.isQuote,
        media: object.media
      }
    }`,
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })
    const data = await response.json()
    console.log('🟣 | file: actions.ts:114 | scrapeTweets | data:', data)

    return { data: data, error: null }
  } catch (error) {
    return {
      data: null,
      error: error,
    }
  }
}
