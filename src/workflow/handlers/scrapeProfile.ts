import * as crypto from 'crypto'
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs'
import { Resource } from 'sst'

import { UsernameRequestBodySchema } from '@/workflow/types'
import { handler } from '@/workflow/utils/handler'

const client = new SQSClient()

export const scrapeProfile = handler(
  async (body) => {
    // Send to scrape profile queue for batching
    const hash = crypto.createHash('sha256').update(body.username).digest('hex')
    const r = await client.send(
      new SendMessageCommand({
        QueueUrl: Resource.ProfileScrapingDeduplication.url,
        MessageBody: JSON.stringify(body),
        MessageDeduplicationId: hash,
        MessageGroupId: hash,
      }),
    )
    return { success: true, messageId: r.MessageId, username: body?.username }
  },
  { requestSchema: UsernameRequestBodySchema },
)
