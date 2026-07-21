import 'server-only'

import { DatabaseUser, TweetType } from '../types'

/**
 * Official X API v2 client (pay-per-use).
 * Docs: https://docs.x.com — GET /2/users/by/username/{username} and GET /2/users/{id}/tweets
 */

const X_API_BASE = 'https://api.x.com/2'

const USER_FIELDS = [
  'created_at',
  'description',
  'entities',
  'location',
  'profile_image_url',
  'protected',
  'public_metrics',
  'url',
  'verified',
  'verified_type',
  'pinned_tweet_id',
].join(',')

// note_tweet: full text of long-form posts (plain `text` truncates them);
// entities: lets us expand t.co links so the model sees real URLs
const TWEET_FIELDS = ['created_at', 'public_metrics', 'text', 'referenced_tweets', 'note_tweet', 'entities'].join(',')

// Match the historical SocialData cap so fresh rows look like cached ones
const MAX_TWEETS = 15

type XApiUser = {
  id: string
  name: string
  username: string
  created_at?: string
  description?: string
  location?: string
  profile_image_url?: string
  protected?: boolean
  url?: string
  verified?: boolean
  verified_type?: string
  public_metrics?: {
    followers_count: number
    following_count: number
    tweet_count: number
    listed_count: number
  }
}

type XApiUrlEntity = { url: string; expanded_url?: string }

type XApiTweet = {
  id: string
  text: string
  created_at?: string
  public_metrics?: {
    retweet_count: number
    reply_count: number
    like_count: number
    quote_count: number
    impression_count?: number
  }
  referenced_tweets?: { type: 'retweeted' | 'quoted' | 'replied_to'; id: string }[]
  note_tweet?: { text: string; entities?: { urls?: XApiUrlEntity[] } }
  entities?: { urls?: XApiUrlEntity[] }
}

// Replace t.co shortlinks with their expanded URLs so the analysis model sees
// what was actually linked instead of an opaque https://t.co/... token
const expandTweetText = (tweet: XApiTweet): string => {
  let text = tweet.note_tweet?.text ?? tweet.text
  const urls = [...(tweet.entities?.urls ?? []), ...(tweet.note_tweet?.entities?.urls ?? [])]
  for (const u of urls) {
    if (u.expanded_url) text = text.replaceAll(u.url, u.expanded_url)
  }
  return text
}

const xApiFetch = async (path: string) => {
  const token = process.env.X_API_BEARER_TOKEN
  if (!token) throw new Error('X_API_BEARER_TOKEN is not set')

  const response = await fetch(`${X_API_BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  })

  const remaining = response.headers.get('x-rate-limit-remaining')
  if (remaining !== null && Number(remaining) < 10) {
    console.warn(`⚠️ X API rate limit remaining: ${remaining} for ${path}`)
  }

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(`X API error ${response.status} for ${path}: ${body.slice(0, 300)}`)
  }

  return response.json()
}

/**
 * Fetch a profile by username and map it into the exact `DatabaseUser` shape the
 * rest of the app (and the cached Neon rows) expect. `fullProfile.twitterUserID`
 * is load-bearing: `processScrapedUser` reads it to fetch tweets by user ID.
 */
export async function fetchProfileXApi({ username }: { username: string }): Promise<{
  data: DatabaseUser | null
  error: string | null
}> {
  try {
    const json = await xApiFetch(`/users/by/username/${encodeURIComponent(username)}?user.fields=${USER_FIELDS}`)

    const user = json.data as XApiUser | undefined
    if (!user) {
      throw new Error(json.errors?.[0]?.detail || `No profile found for ${username}`)
    }

    const databaseUser: DatabaseUser = {
      username: user.username,
      url: `https://x.com/${user.username}`,
      name: user.name,
      profilePicture: (user.profile_image_url || '').replace('_normal.', '_400x400.'),
      description: user.description || '',
      location: user.location || '',
      fullProfile: {
        twitterUserID: user.id,
        ...user,
      },
      followers: user.public_metrics?.followers_count ?? 0,
    }

    return { data: databaseUser, error: null }
  } catch (error) {
    console.error(`Error fetching X API profile for ${username}:`, error)
    return {
      data: null,
      error: error instanceof Error ? error.message : 'No profile found',
    }
  }
}

/**
 * Fetch a user's recent original posts (no retweets/replies) and map them into
 * the `TweetType` shape stored in the `tweets` JSONB column. Throws on failure
 * so the caller can fall back to SocialData.
 */
export async function fetchTweetsXApi({ userId, username }: { userId: string; username: string }): Promise<TweetType[]> {
  const json = await xApiFetch(`/users/${encodeURIComponent(userId)}/tweets?max_results=20&exclude=retweets,replies&tweet.fields=${TWEET_FIELDS}`)

  const tweets = (json.data ?? []) as XApiTweet[]
  if (tweets.length === 0) {
    throw new Error(`X API returned no tweets for ${username} (${userId})`)
  }

  return tweets
    .map((tweet) => ({
      isRetweet: tweet.referenced_tweets?.some((ref) => ref.type === 'retweeted') ?? false,
      author: { userName: username },
      createdAt: tweet.created_at || '',
      text: expandTweetText(tweet),
      retweetCount: tweet.public_metrics?.retweet_count ?? 0,
      replyCount: tweet.public_metrics?.reply_count ?? 0,
      likeCount: tweet.public_metrics?.like_count ?? 0,
      quoteCount: tweet.public_metrics?.quote_count ?? 0,
      viewCount: tweet.public_metrics?.impression_count ?? 0,
    }))
    .slice(0, MAX_TWEETS)
}
