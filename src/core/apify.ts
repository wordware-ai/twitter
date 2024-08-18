import 'server-only'

import { ApifyClient } from 'apify-client'

import { TweetType } from '@/types'

const apifyClient = new ApifyClient({
  token: process.env.APIFY_API_KEY,
})

export const scrapeProfileApify = async ({ username }: { username: string }) => {
  const input = {
    maxItems: 5,
    startUrls: [
      `https://twitter.com/${username}`,
      `https://twitter.com/${username}`,
      `https://twitter.com/${username}`,
      `https://twitter.com/${username}`,
      `https://twitter.com/${username}`,
    ],
    getFollowers: false,
    getFollowing: false,
    getRetweeters: false,
    includeUnavailableUsers: false,
  }
  try {
    const run = await apifyClient.actor('apidojo/twitter-user-scraper').call(input)

    if (run.status === 'FAILED') throw new Error(`Scraping Error: ${run.statusMessage}`)

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
        followers: profile.followers as number,
      },
    }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'No profile found',
    }
  }
}
export const scrapeTweetsApify = async ({ username }: { username: string }) => {
  try {
    const input = {
      startUrls: [`https://twitter.com/${username}`],
      maxItems: 12,
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
          isRetweet: object.isRetweet,
          isQuote: object.isQuote,
        }
      }`,
    }
    const run = await apifyClient.actor('apidojo/tweet-scraper').call(input)
    const { items: tweets } = await apifyClient.dataset(run.defaultDatasetId).listItems()
    if (!tweets || tweets.length === 0) throw new Error('No tweets found with Apify')

    return { data: tweets as TweetType[], error: null }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'No profile found',
    }
  }
}
