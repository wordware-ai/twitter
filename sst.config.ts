/// <reference path="./.sst/platform/config.d.ts" />

/* We use [SST](https://sst.dev) to host the batching and queueing infrastructure that is used to run out application
 *
 * */
export default $config({
  app(input) {
    return {
      name: 'twitter',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      home: 'aws',
    }
  },
  async run() {
    // API
    const api = new sst.aws.ApiGatewayV2('ScrapingApi')
    const apifySecret = new sst.Secret('ApifySecret')
    const dbUrl = new sst.Secret('NeonDbUrl')

    // PROFILE SCRAPING
    // Deduplicate queue
    const deduplicationQueue = new sst.aws.Queue('ProfileScrapingDeduplication', {
      fifo: true,
    })
    // Handler to add a new username

    api.route('POST /scrape_profile', {
      handler: 'src/workflow/handlers/scrapeProfile.scrapeProfile',
      timeout: '20 seconds',
      memory: '512 MB',
      link: [deduplicationQueue],
    })
    // A queue to batch the requests for profile scraping
    const scrapeProfileQueue = new sst.aws.Queue('ScrapeProfile', { visibilityTimeout: '1 minute' })
    scrapeProfileQueue.subscribe(
      {
        handler: 'src/workflow/handlers/scrapeProfiles.scrapeProfiles',
        timeout: '50 seconds',
        memory: '512 MB',
        link: [api, apifySecret],
      },
      { batch: { size: 50, window: '10 seconds', partialResponses: true } },
    )

    deduplicationQueue.subscribe({
      handler: 'src/workflow/handlers/addToScrapeProfileQueue.addToScrapeProfileQueue',
      timeout: '20 seconds',
      memory: '512 MB',
      link: [scrapeProfileQueue],
    })

    // Handler to respond to webhook requests
    api.route('POST /webhooks/scrape_profiles', {
      handler: 'src/workflow/handlers/scrapeProfilesWebhookCallback.scrapeProfilesWebhookCallback',
      timeout: '1 minute',
      memory: '512 MB',
      link: [apifySecret, dbUrl],
    })

    // TWEET SCRAPING
    // Handler that triggers the scraping of the tweets

    // Handler to respond to webhook requests
  },
})
