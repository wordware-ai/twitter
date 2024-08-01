import { APIGatewayProxyEventPathParameters, APIGatewayProxyEventQueryStringParameters } from 'aws-lambda/trigger/api-gateway-proxy'

import { HttpBadRequest } from './errors'

export const readEnvVar = (envVarName: string): string => {
  const value = process.env[envVarName]
  if (value == undefined) {
    throw Error(`Environment variable ${envVarName} is not defined`)
  }
  return value
}

export const readPathParameter = (parameterName: string, pathParameters: APIGatewayProxyEventPathParameters | undefined): string => {
  if (pathParameters == undefined) throw Error('No path parameters defined')
  const value = pathParameters[parameterName]
  if (value == undefined) {
    throw new HttpBadRequest(`Path parameter was not defined ${parameterName}`)
  }
  console.log(`Read path parameter ${parameterName} as ${value}`)
  return value
}

export const readQueryParameter = (parameterName: string, pathParameters: APIGatewayProxyEventQueryStringParameters | undefined): string | undefined => {
  if (pathParameters === undefined) {
    return undefined
  }
  const value = pathParameters[parameterName]
  console.log(`Read path parameter ${parameterName} as ${value}`)
  return value
}
