'use server'

import { unstable_noStore as noStore, revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { scrapeProfileApify } from '@/core/apify'
import { scrapeTweets } from '@/core/logic'
import { getPair, getUser, insertPair, insertUser, unlockPair, unlockUser, updateUser } from '@/drizzle/queries'
import { createLoopsContact } from '@/lib/loops'

import { fetchUserDataBySocialData } from '../core/social-data'
import { fetchUserData } from '../core/twitter-api'

export const handleNewUsername = async ({ username, redirectPath }: { username: string; redirectPath?: string }) => {
  const user = await getUser({ username })
  if (user) {
    if (redirectPath) {
      redirect(redirectPath)
    } else {
      return { error: false, found: true }
    }
  }

  let { data, error } = await fetchUserData({ screenName: username })
  if (error) {
    console.log(`[${username}] ⚠️ Profile TwitterAPI (1/3)`, error)
  } else {
    console.log(`[${username}] ✅ Profile TwitterAPI (1/3)`)
  }

  if (!data && error) {
    ;({ data, error } = await fetchUserDataBySocialData({ username }))
    if (!data) {
      console.log(`[${username}] ⚠️ Profile SocialData (2/3)`, error)
    } else {
      console.log(`[${username}] ✅ Profile SocialData (2/3)`)
    }
  }

  if (!data && error) {
    ;({ data, error } = await scrapeProfileApify({ username }))
    if (!data) {
      console.log(`[${username}] ⚠️ Profile Apify (3/3)`, error)
    } else {
      console.log(`[${username}] ✅ Profile Apify (3/3)`)
    }
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

    try {
      const res = await scrapeTweets({ username, twitterUserID: twitterUserID })
      tweets = res.data
      error = res.error
      if (!tweets) throw new Error('No tweets found')
    } catch (e) {
      error = e
      console.warn(`[${username}] ⚠️ All 3 attemtps failed. Trying again...`, e)
      try {
        const res = await scrapeTweets({ username, twitterUserID: twitterUserID })
        tweets = res.data
        error = res.error
        console.warn(`[${username}] ⚠️ All 6 attemtps failed.`, e)
        if (!tweets) throw new Error('No tweets found')
      } catch (e) {
        console.warn(`[${username}] ⚠️ Yeah it's fucked:`, e)
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

export const newsletterSignup = async ({ email }: { email: string }) => {
  try {
    await createLoopsContact(email)
    return { success: true }
  } catch (error) {
    return { success: false, error: error }
  }
}

export const unlockGenerationByEmail = async ({
  username,
  usernamePair,
  email,
  type = 'user',
}: {
  username: string
  usernamePair?: string
  email: string
  type?: 'pair' | 'user'
}) => {
  try {
    await createLoopsContact(email, 'Twitter Personality - PAYWALL')

    if (type === 'user') {
      await unlockUser({ username: username.replace('/', ''), unlockType: 'email' })
    }
    if (type === 'pair' && usernamePair) {
      await unlockPair({ username1: username, username2: usernamePair, unlockType: 'email' })
    }

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

export const handlePair = async ({ usernames, shouldRedirect }: { usernames: string[]; shouldRedirect?: boolean }) => {
  noStore()

  const existingPair = await getPair({ usernames })

  if (existingPair) {
    if (shouldRedirect) {
      redirect(`/${usernames[0]}/${usernames[1]}`)
    }
    return existingPair
  }

  const result = await insertPair({ usernames })

  if (result.length !== 1) {
    throw new Error('Expected to create exactly one pair, but got ' + result.length)
  }

  const newPair = result[0]

  if (shouldRedirect) {
    redirect(`/${usernames[0]}/${usernames[1]}`)
  }

  return newPair
}
