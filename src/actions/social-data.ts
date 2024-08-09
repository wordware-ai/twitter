import { TweetType } from './types'

type SocialDataTweet = {
  tweet_created_at: string
  id: number
  id_str: string
  text: string | null
  full_text: string
  source: string
  truncated: boolean
  in_reply_to_status_id: number | null
  in_reply_to_status_id_str: string | null
  in_reply_to_user_id: number | null
  in_reply_to_user_id_str: string | null
  in_reply_to_screen_name: string | null
  user: {
    id: number
    id_str: string
    name: string
    screen_name: string
    location: string
    url: string | null
    description: string
    protected: boolean
    verified: boolean
    followers_count: number
    friends_count: number
    listed_count: number
    favourites_count: number
    statuses_count: number
    created_at: string
    profile_banner_url: string | null
    profile_image_url_https: string
    can_dm: boolean
  }
  quoted_status_id: number | null
  quoted_status_id_str: string | null
  is_quote_status: boolean
  quoted_status: object | null
  retweeted_status: object | null
  quote_count: number
  reply_count: number
  retweet_count: number
  favorite_count: number
  lang: string
  entities: object
  views_count: number
  bookmark_count: number
  is_pinned: boolean
  articleDetailsArray: any | null
  article: any | null
  parserEntryId: any | null
  controllerComponentName: string
}

export async function fetchTweets(userId: string) {
  const url = `https://api.socialdata.tools/twitter/user/${userId}/tweets-and-replies`

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.SOCIALDATA_API_KEY}`,
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return data.tweets as SocialDataTweet[]
  } catch (error) {
    console.error(`Error fetching tweets for user ID ${userId}:`, error)
    throw new Error(`Failed to fetch tweets for user ID ${userId}`)
  }
}

export async function fetchAndParseSocialDataTweets(userId: string): Promise<TweetType[]> {
  try {
    const tweets = await fetchTweets(userId)

    return tweets
      .map((tweet) => ({
        isRetweet: !!tweet.retweeted_status,
        author: {
          userName: (tweet.user as SocialDataTweet['user']).screen_name || '',
        },
        createdAt: tweet.tweet_created_at,
        text: tweet.full_text || tweet.text || '',
        retweetCount: tweet.retweet_count,
        replyCount: tweet.reply_count,
        likeCount: tweet.favorite_count,
        quoteCount: tweet.quote_count,
        viewCount: tweet.views_count || 0,
      }))
      .slice(0, 14)
  } catch (error) {
    console.error(`Error fetching and parsing tweets for user ID ${userId}:`, error)
    throw new Error(`Failed to fetch and parse tweets for user ID ${userId}`)
  }
}

export async function fetchTweetsByUsername(username: string) {
  const url = `https://api.socialdata.tools/twitter/search?query=from%3A${username}%20-filter%3Areplies&type=Latest`

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.SOCIALDATA_API_KEY}`,
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return data.tweets as SocialDataTweet[]
  } catch (error) {
    console.error(`Error fetching tweets for username ${username}:`, error)
    throw new Error(`Failed to fetch tweets for username ${username}`)
  }
}

export async function fetchAndParseSocialDataTweetsByUsername(username: string): Promise<TweetType[]> {
  try {
    const tweets = await fetchTweetsByUsername(username)

    return tweets
      .map((tweet) => ({
        isRetweet: !!tweet.retweeted_status,
        author: {
          userName: (tweet.user as SocialDataTweet['user']).screen_name || '',
        },
        createdAt: tweet.tweet_created_at,
        text: tweet.full_text || tweet.text || '',
        retweetCount: tweet.retweet_count,
        replyCount: tweet.reply_count,
        likeCount: tweet.favorite_count,
        quoteCount: tweet.quote_count,
        viewCount: tweet.views_count || 0,
      }))
      .slice(0, 14)
  } catch (error) {
    console.error(`Error fetching and parsing tweets for username ${username}:`, error)
    throw new Error(`Failed to fetch and parse tweets for username ${username}`)
  }
}
