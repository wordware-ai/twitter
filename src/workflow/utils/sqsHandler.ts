import { SQSBatchItemFailure, SQSEvent } from 'aws-lambda'
import { z } from 'zod'

interface RecordCallback<Type> {
  (record: Type): Promise<void>
}

export async function sqsRecordHandler<Type>(event: SQSEvent, recordCallback: RecordCallback<Type>, recordSchema: z.Schema<Type>) {
  console.log('Event:', event)
  const batchItemFailures: SQSBatchItemFailure[] = []
  for (const record of event.Records) {
    console.log('Processing record', record.messageId)
    try {
      // Parse the body and call the per-record processor
      const jsonBody = JSON.parse(record.body)
      console.log('Body', jsonBody)
      await recordCallback(recordSchema.parse(jsonBody))
    } catch (error) {
      console.error(`Error in processing SQS consumer, message body: ${JSON.parse(JSON.stringify(record.body))}, error:\n ${error}`)

      batchItemFailures.push({ itemIdentifier: record.messageId })
      if (process.env.CATCH_ERRORS === 'false') {
        throw error
      }
    }
  }
  console.log('Processing batch complete, failures', batchItemFailures)
  return { batchItemFailures }
}

interface BatchCallback<Type> {
  (records: Type[]): Promise<void>
}

export async function sqsBatchHandler<Type>(event: SQSEvent, batchCallback: BatchCallback<Type>, recordSchema: z.Schema<Type>) {
  console.log('Event:', event)
  const batchItemFailures: SQSBatchItemFailure[] = []
  const records: Type[] = []
  for (const record of event.Records) {
    console.log('Processing record', record.messageId)
    try {
      // Parse the body and call the per-record processor
      const jsonBody = JSON.parse(record.body)
      console.log('Body', jsonBody)
      records.push(recordSchema.parse(jsonBody))
    } catch (error) {
      console.error(`Error in processing SQS consumer, message body: ${JSON.parse(JSON.stringify(record.body))}, error:\n ${error}`)

      batchItemFailures.push({ itemIdentifier: record.messageId })
      if (process.env.THROW_ERRORS === 'false') {
        throw error
      }
    }
  }

  await batchCallback(records)

  console.log('Processing batch complete, failures', batchItemFailures)
  return { batchItemFailures }
}
