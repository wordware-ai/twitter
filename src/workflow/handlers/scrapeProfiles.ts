import { ApifyClient, WebhookUpdateData } from 'apify-client'
import { SQSEvent } from 'aws-lambda'
import { Resource } from 'sst'

import { UsernameRequestBodySchema } from '@/workflow/types'
import { sqsBatchHandler } from '@/workflow/utils/sqsHandler'

// Initialize the Apify client with the API key
const apifyClient = new ApifyClient({
  token: Resource.ApifySecret.value,
})

// Take in a batch of usernames and call apify
export const scrapeProfiles = async (event: SQSEvent) =>
  sqsBatchHandler(
    event,
    async (body) => {
      console.log('Got usernames:', body)
      const usernames = body.map((b) => b.username)

      const startUrls = usernames.map((username) => `https://twitter.com/${username}`)

      // Ensure at least 5 start urls
      for (let i = usernames.length; i < 5; i++) {
        startUrls.push(`https://twitter.com/${usernames[0]}`)
      }

      const input = {
        maxItems: body.length < 5 ? 5 : body.length,
        startUrls: startUrls,
        getFollowers: false,
        getFollowing: false,
        getRetweeters: false,
        includeUnavailableUsers: false,
      }

      const apiUrl = Resource.ScrapingApi.url
      console.log('API url', apiUrl)
      const webhook: WebhookUpdateData = {
        eventTypes: ['ACTOR.RUN.SUCCEEDED'], // You can specify other events like ACTOR.RUN.FAILED
        requestUrl: apiUrl + '/webhooks/scrape_profiles',
      }

      // Asynchronously call the actor
      const run = await apifyClient.actor('apidojo/twitter-user-scraper').start(input, { webhooks: [webhook] })
      console.log('🟣 | scrapeProfile | run:', run)
      if (run.status === 'FAILED') throw new Error(`Scraping Error: ${run.statusMessage}`)

      console.log('Started actor', run)
      // const { items: profiles } = await apifyClient.dataset(run.defaultDatasetId).listItems()
      // const profile = profiles[0]
      // const profilePicture = profile.profilePicture as string
      //
      // if (!profile || Object.keys(profile).length === 0) throw new Error('No profile found')
      //
      // return {
      //   error: null,
      //   data: {
      //     username: profile.userName as string,
      //     url: profile.url as string,
      //     name: profile.name as string,
      //     profilePicture: profilePicture.replace('_normal.', '_400x400.'),
      //     description: profile.description as string,
      //     location: profile.location as string,
      //     fullProfile: profile as object,
      //     followers: profile.followers as number,
      //   },
      // }
    },
    UsernameRequestBodySchema,
  )
