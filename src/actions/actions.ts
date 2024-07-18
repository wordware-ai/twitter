'use server'

import { unstable_noStore as noStore } from 'next/cache'
import { redirect } from 'next/navigation'
import { ApifyClient } from 'apify-client'
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
  //First, check if the user already exist. If yes, just redirect to user's page.
  const user = await getUser({ username })
  if (user) redirect(`/${username}`)

  //If user does not exist, scrape the profile and then redirect to user's page.
  const { data, error } = await scrapeProfile({ username })

  //
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

const apifyClient = new ApifyClient({
  token: process.env.APIFY_API_KEY,
})

export const scrapeProfile = async ({ username }: { username: string }) => {
  const input = {
    twitterHandles: [username],
    maxItems: 1,
    customMapFunction: '(object) => { return {...object} }',
  }
  try {
    const run = await apifyClient.actor('apidojo/twitter-user-scraper').call(input)
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
  const input = {
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
    const run = await apifyClient.actor('apidojo/tweet-scraper').call(input)
    const { items: tweets } = await apifyClient.dataset(run.defaultDatasetId).listItems()

    return { data: tweets, error: null }
  } catch (error) {
    return {
      data: null,
      error: error,
    }
  }
}
