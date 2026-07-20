import 'server-only'

import { fetchAndParseSocialDataTweets, fetchAndParseSocialDataTweetsByUsername } from './social-data'

export const scrapeTweets = async ({ twitterUserID, username }: { twitterUserID?: string; username: string }) => {
  console.log(`[${username}] twitterUserID:`, twitterUserID)
  // Try fetching tweets from social data if twitterUserID is provided
  if (twitterUserID) {
    try {
      const tweets = await fetchAndParseSocialDataTweets(twitterUserID)
      console.log(`[${username}] ✅ SocialData ID Tweets: ${tweets.length} (1/2)`)
      return { data: tweets, error: null }
    } catch (error) {
      console.log(`[${username}] ⚠️ Error SocialData ID Tweets (Attempt 1/2)`, error)
      // Continue to next method if this fails
    }
  }

  try {
    const tweets = await fetchAndParseSocialDataTweetsByUsername(username)
    console.log(`[${username}] ✅ SocialData Username Tweets: ${tweets.length} (2/2)`)
    return { data: tweets, error: null }
  } catch (error) {
    console.log(`[${username}] ⚠️ Error SocialData Tweets (Attempt 2/2)`, error)
  }

  return {
    data: null,
    error: 'Failed to fetch tweets from all available methods',
  }
}
