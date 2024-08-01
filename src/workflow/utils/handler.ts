import * as lambda from 'aws-lambda'
import { APIGatewayProxyStructuredResultV2 } from 'aws-lambda'
import { z } from 'zod'

import { HttpBadRequest, HttpError } from './errors'

export interface HandlerProps<T> {
  successResponseCode?: number // Response code on success, defaults to 200
  headers?: APIGatewayProxyStructuredResultV2['headers']
  skipStringify?: boolean
  requestSchema?: z.Schema<T>
  suppressLog?: boolean
}

export function handler<T, R>(lambda: (parsedBody: T) => R, props?: HandlerProps<T>): lambda.Handler {
  return async (event) => {
    const successResponseCode = props?.successResponseCode ? props.successResponseCode : 200

    !props?.suppressLog && console.debug('Request body:', event.body)
    console.debug('Path parameters:', event.pathParameters)

    let responseBody, statusCode

    try {
      // Run the Lambda
      let parsedBody: T | undefined = undefined
      if (props?.requestSchema) {
        if (!event.body) {
          console.error('Body was empty')
          throw new HttpBadRequest('No body')
        } else {
          parsedBody = props.requestSchema.parse(JSON.parse(event.body))
        }
        responseBody = await lambda(parsedBody)
      } else {
        responseBody = await lambda(JSON.parse(event.body))
      }

      statusCode = successResponseCode
    } catch (e) {
      statusCode = 500
      if (e instanceof HttpError) {
        responseBody = { error: e.message }
        statusCode = e.code
      } else if (e instanceof Error) {
        responseBody = { error: e.message }
      } else {
        responseBody = { error: 'Unknown error' }
      }

      if (statusCode === 500) {
        console.error(e)
      } else {
        console.warn(e)
      }
    }

    // Return HTTP response
    console.debug('Response body:', responseBody)
    const body = JSON.stringify(responseBody)

    const headers: APIGatewayProxyStructuredResultV2['headers'] = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Content-Type': 'application/json',
      ...props?.headers,
    }

    if (statusCode && [301, 302, 303, 307, 308].includes(statusCode)) {
      // Handle redirect
      headers.Location = body
    }

    return {
      statusCode,
      body,
      headers: headers,
    }
  }
}
