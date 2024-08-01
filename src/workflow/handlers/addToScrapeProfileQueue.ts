import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs'
import { SQSEvent } from 'aws-lambda'
import { Resource } from 'sst'

import { UsernameRequestBodySchema } from '@/workflow/types'
import { sqsRecordHandler } from '@/workflow/utils/sqsHandler'

const client = new SQSClient()

// Listen to the deduplication queue and pass to the batching queue
export const addToScrapeProfileQueue = async (event: SQSEvent) =>
  sqsRecordHandler(
    event,
    async (body) => {
      // Send to scrape profile queue for batching
      const r = await client.send(
        new SendMessageCommand({
          QueueUrl: Resource.ScrapeProfile.url,
          MessageBody: JSON.stringify(body),
        }),
      )

      console.log('Added to queue', r)
    },
    UsernameRequestBodySchema,
  )
