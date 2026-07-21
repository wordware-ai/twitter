'use server'

import { unstable_noStore as noStore, revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { scrapeTweets } from '@/core/logic'
import { fetchProfileXApi } from '@/core/x-api'
import { getPair, getUser, insertPair, insertUser, unlockPair, unlockUser, updateUser } from '@/drizzle/queries'
import { SelectUser } from '@/drizzle/schema'

import { fetchUserDataBySocialData } from '../core/social-data'

export const handleNewUsername = async ({ username, redirectPath }: { username: string; redirectPath?: string }) => {
  const user = await getUser({ username })
  if (user) {
    if (redirectPath) {
      redirect(redirectPath)
    } else {
      return { error: false, found: true }
    }
  }

  let { data, error } = await fetchProfileXApi({ username })
  if (!data) {
    console.log(`[${username}] ⚠️ Profile X API (1/2)`, error)
  } else {
    console.log(`[${username}] ✅ Profile X API (1/2)`)
  }

  if (!data) {
    ;({ data, error } = await fetchUserDataBySocialData({ username }))
    if (!data) {
      console.log(`[${username}] ⚠️ Profile SocialData (2/2)`, error)
    } else {
      console.log(`[${username}] ✅ Profile SocialData (2/2)`)
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

const ANALYSIS_MAX_AGE_MS = 182 * 24 * 60 * 60 * 1000 // ~6 months

/**
 * Lazily expire analyses older than ~6 months: archive the current analysis and
 * tweets into `analysisHistory`, refresh the profile (avatars from old scrapes
 * 404 — X rotates profile-image URLs), then reset the pipeline flags so the
 * visit re-scrapes and re-generates. The stale analysis stays in place (and on
 * screen) until the fresh one streams in over it.
 */
export const refreshStaleUser = async ({ user }: { user: SelectUser }): Promise<SelectUser> => {
  if (!user.wordwareCompleted) return user
  if (Date.now() - user.wordwareStartedTime.getTime() < ANALYSIS_MAX_AGE_MS) return user

  // Safety valve: never archive the same user more than once a day, even if a
  // bug elsewhere leaves the started-time looking stale after a regeneration
  const existingHistory = (user.analysisHistory as { archivedAt?: string }[] | null) ?? []
  const lastArchivedAt = existingHistory[existingHistory.length - 1]?.archivedAt
  if (lastArchivedAt && Date.now() - new Date(lastArchivedAt).getTime() < 24 * 60 * 60 * 1000) return user

  const history = [...existingHistory, { archivedAt: new Date().toISOString(), analysis: user.analysis, tweets: user.tweets }]

  let { data: freshProfile } = await fetchProfileXApi({ username: user.username })
  if (!freshProfile) {
    ;({ data: freshProfile } = await fetchUserDataBySocialData({ username: user.username }))
  }
  const profileFields = freshProfile
    ? {
        name: freshProfile.name,
        profilePicture: freshProfile.profilePicture,
        description: freshProfile.description,
        location: freshProfile.location,
        followers: freshProfile.followers,
        fullProfile: freshProfile.fullProfile,
      }
    : {}

  const updated = {
    ...user,
    ...profileFields,
    analysisHistory: history,
    tweetScrapeStarted: false,
    tweetScrapeCompleted: false,
    wordwareStarted: false,
    wordwareCompleted: false,
    paidWordwareStarted: false,
    paidWordwareCompleted: false,
  }
  await updateUser({ user: updated })
  console.log(`[${user.username}] ♻️ Archived analysis from ${user.wordwareStartedTime.toISOString()}, refreshed profile, re-running scrape + roast`)
  return updated
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
      console.warn(`[${username}] ⚠️ All scrape methods failed. Retrying once...`, e)
      try {
        const res = await scrapeTweets({ username, twitterUserID: twitterUserID })
        tweets = res.data
        error = res.error
        if (!tweets) throw new Error('No tweets found')
      } catch (e) {
        console.warn(`[${username}] ⚠️ Tweet scraping failed after retry:`, e)
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

// `email` is accepted for backwards compatibility with the paywall forms but no
// longer stored anywhere (the Loops integration was removed).
export const unlockGenerationByEmail = async ({
  username,
  usernamePair,
  type = 'user',
}: {
  username: string
  usernamePair?: string
  email: string
  type?: 'pair' | 'user'
}) => {
  try {
    if (type === 'user') {
      await unlockUser({ username: username.replace('/', ''), unlockType: 'email' })
    }
    if (type === 'pair' && usernamePair) {
      await unlockPair({ username1: username, username2: usernamePair, unlockType: 'email' })
    }

    revalidatePath(username)
    return { success: true }
  } catch (error) {
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
