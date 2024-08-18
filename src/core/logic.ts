import 'server-only'

import { scrapeTweetsApify } from './apify'
import { fetchAndParseSocialDataTweets, fetchAndParseSocialDataTweetsByUsername } from './social-data'
import { getTweetsTwitterWidget } from './widget-scrape/tweets-widget-scrape'

export const scrapeTweets = async ({ twitterUserID, username }: { twitterUserID?: string; username: string }) => {
  console.log(`[${username}] twitterUserID:`, twitterUserID)
  // Try fetching tweets from social data if twitterUserID is provided
  if (twitterUserID) {
    try {
      const tweets = await fetchAndParseSocialDataTweets(twitterUserID)
      console.log(`[${username}] ✅ SocialData ID Tweets: ${tweets.length} (1/4)`)
      return { data: tweets, error: null }
    } catch (error) {
      console.log(`[${username}] ⚠️ Erros SocialData ID Tweets (Attempt 1/4)`, error)
      // Continue to next method if this fails
    }
  }

  try {
    const tweets = await fetchAndParseSocialDataTweetsByUsername(username)
    console.log(`[${username}] ✅ SocialData Username Tweets: ${tweets.length} (2/4)`)
    return { data: tweets, error: null }
  } catch (error) {
    console.log(`[${username}] ⚠️ Erros SocialData Tweets (Attempt 2/4)`, error)
    // Continue to next method if this fails
  }

  // Try fetching tweets using getTweets function
  try {
    const tweets = await getTweetsTwitterWidget(username)
    if (!tweets || tweets.length === 0) throw new Error('No tweets found')
    console.log(`[${username}] ✅ TimelineWidget Tweets: ${tweets.length} (3/4)`)
    return { data: tweets, error: null }
  } catch (error) {
    console.log(`[${username}] ⚠️ Error TimelineWidget Tweets (Attempt 3/4)`, error)
    // Continue to fallback method if this fails
  }

  try {
    const { data: tweets, error } = await scrapeTweetsApify({ username })
    if (tweets && !error) {
      console.log(`[${username}] ✅ Apify Tweets: ${tweets.length} (4/4)`)
      return { data: tweets, error: null }
    }
  } catch (error) {
    console.error(`[${username}] ⚠️ Error fetching tweets with Apify (Attempt 4/4)`, error)
  }

  return {
    data: null,
    error: 'Failed to fetch tweets from all available methods',
  }
}
