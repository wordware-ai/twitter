import 'server-only'

import type { DatabaseUser, TweetType } from '../types'

const XQUIK_API_BASE = 'https://xquik.com/api/v1'
const XQUIK_API_CONTRACT = '2026-04-29'
const MAX_TWEETS = 15

type XquikUrlEntity = {
  expanded_url?: string
  url?: string
}

type XquikTweet = {
  author?: {
    username?: string
  }
  createdAt?: string
  entities?: {
    urls?: XquikUrlEntity[]
  }
  inReplyToId?: string
  isReply?: boolean
  likeCount?: number
  quoteCount?: number
  replyCount?: number
  retweetCount?: number
  retweeted_tweet?: object | null
  text: string
  type?: string
  viewCount?: number
}

type XquikTweetSearchResponse = {
  tweets?: XquikTweet[]
}

type XquikUser = {
  description?: string
  followers?: number
  id: string
  location?: string
  name: string
  profilePicture?: string
  username: string
}

const getApiKey = (): string => process.env.XQUIK_API_KEY?.trim() ?? ''

const normalizeUsername = (username: string): string => {
  const normalized = username.replace(/^@/, '').trim()
  if (!/^[A-Za-z0-9_]{1,15}$/.test(normalized)) {
    throw new Error(`Invalid X username: ${username}`)
  }
  return normalized
}

const expandTweetText = (tweet: XquikTweet): string => {
  let text = tweet.text
  for (const entity of tweet.entities?.urls ?? []) {
    if (entity.url && entity.expanded_url) {
      text = text.replaceAll(entity.url, entity.expanded_url)
    }
  }
  return text
}

const isRetweet = (tweet: XquikTweet): boolean => tweet.type === 'retweet' || (tweet.retweeted_tweet !== undefined && tweet.retweeted_tweet !== null)

const xquikFetch = async <T>(path: string, params: Record<string, string | number> = {}): Promise<T> => {
  const apiKey = getApiKey()
  if (!apiKey) {
    throw new Error('XQUIK_API_KEY is not set')
  }

  const url = new URL(`${XQUIK_API_BASE}${path}`)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value))
  }

  const response = await fetch(url, {
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      'x-api-key': apiKey,
      'xquik-api-contract': XQUIK_API_CONTRACT,
    },
    signal: AbortSignal.timeout(15_000),
  })

  if (!response.ok) {
    throw new Error(`Xquik API request failed with status ${response.status}`)
  }

  return response.json() as Promise<T>
}

export const fetchTweetsXquik = async ({ username }: { username: string }): Promise<TweetType[]> => {
  const normalizedUsername = normalizeUsername(username)
  const result = await xquikFetch<XquikTweetSearchResponse>('/x/tweets/search', {
    fromUser: normalizedUsername,
    limit: 20,
    q: `from:${normalizedUsername}`,
    queryType: 'Latest',
    replies: 'exclude',
    retweets: 'exclude',
  })

  const tweets = (result.tweets ?? [])
    .filter((tweet) => !tweet.isReply && !tweet.inReplyToId && !isRetweet(tweet))
    .map((tweet) => ({
      isRetweet: false,
      author: {
        userName: tweet.author?.username ?? normalizedUsername,
      },
      createdAt: tweet.createdAt ?? '',
      text: expandTweetText(tweet),
      retweetCount: tweet.retweetCount ?? 0,
      replyCount: tweet.replyCount ?? 0,
      likeCount: tweet.likeCount ?? 0,
      quoteCount: tweet.quoteCount ?? 0,
      viewCount: tweet.viewCount ?? 0,
    }))
    .slice(0, MAX_TWEETS)

  if (tweets.length === 0) {
    throw new Error(`Xquik returned no original posts for ${normalizedUsername}`)
  }

  return tweets
}

export const fetchProfileXquik = async ({
  username,
}: {
  username: string
}): Promise<{
  data: DatabaseUser | null
  error: string | null
}> => {
  try {
    const normalizedUsername = normalizeUsername(username)
    const user = await xquikFetch<XquikUser>(`/x/users/${encodeURIComponent(normalizedUsername)}`)

    return {
      data: {
        username: user.username,
        url: `https://x.com/${user.username}`,
        name: user.name,
        profilePicture: (user.profilePicture ?? '').replace('_normal.', '_400x400.'),
        description: user.description ?? '',
        location: user.location ?? '',
        fullProfile: {
          twitterUserID: user.id,
          ...user,
        },
        followers: user.followers ?? 0,
      },
      error: null,
    }
  } catch (error) {
    console.error(`Error fetching Xquik profile for ${username}:`, error)
    return {
      data: null,
      error: error instanceof Error ? error.message : 'No profile found',
    }
  }
}

export const isXquikConfigured = (): boolean => getApiKey().length > 0
