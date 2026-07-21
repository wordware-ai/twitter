import 'server-only'

import { fetchAndParseSocialDataTweets, fetchAndParseSocialDataTweetsByUsername } from './social-data'
import { fetchProfileXApi, fetchTweetsXApi } from './x-api'

/**
 * Tweet scraping orchestrator. Tiers:
 *   1. Official X API v2 (pay-per-use, primary)
 *   2. SocialData by user ID (fallback)
 *   3. SocialData by username search (fallback)
 */
export const scrapeTweets = async ({ twitterUserID, username }: { twitterUserID?: string; username: string }) => {
  console.log(`[${username}] twitterUserID:`, twitterUserID)

  let userId = twitterUserID

  try {
    // Old cached profiles (pre-X API) may lack the ID; resolve it first.
    if (!userId) {
      const { data } = await fetchProfileXApi({ username })
      userId = (data?.fullProfile as { twitterUserID?: string })?.twitterUserID
    }
    if (!userId) throw new Error('Could not resolve X user ID')

    const tweets = await fetchTweetsXApi({ userId, username })
    console.log(`[${username}] ✅ X API Tweets: ${tweets.length} (1/3)`)
    return { data: tweets, error: null }
  } catch (error) {
    console.log(`[${username}] ⚠️ Error X API Tweets (Attempt 1/3)`, error)
    // Continue to next method if this fails
  }

  if (userId) {
    try {
      const tweets = await fetchAndParseSocialDataTweets(userId)
      console.log(`[${username}] ✅ SocialData ID Tweets: ${tweets.length} (2/3)`)
      return { data: tweets, error: null }
    } catch (error) {
      console.log(`[${username}] ⚠️ Error SocialData ID Tweets (Attempt 2/3)`, error)
      // Continue to next method if this fails
    }
  }

  try {
    const tweets = await fetchAndParseSocialDataTweetsByUsername(username)
    console.log(`[${username}] ✅ SocialData Username Tweets: ${tweets.length} (3/3)`)
    return { data: tweets, error: null }
  } catch (error) {
    console.log(`[${username}] ⚠️ Error SocialData Tweets (Attempt 3/3)`, error)
  }

  return {
    data: null,
    error: 'Failed to fetch tweets from all available methods',
  }
}
