'use server'

import { redirect } from 'next/navigation'

import { getURL } from '@/lib/config'
import { stripe } from '@/lib/stripe'

type CheckoutSessionType =
  | {
      username: string
      priceInt: number
      type: 'user'
    }
  | {
      username1: string
      username2: string
      priceInt: number
      type: 'pair'
    }

export const createCheckoutSession = async (params: CheckoutSessionType) => {
  if (params.type === 'user' && !params.username) return { error: 'Username is required' }
  if (params.type === 'pair' && !params.username1 && !params.username2) return { error: 'Usernames are required' }

  let metadataObject: Record<string, string> = {}
  let successUrl = ''
  let cancelUrl = ''

  if (params.type === 'user') {
    metadataObject = {
      username: params.username.replace('/', ''),
      type: params.type,
    }
    successUrl = `${getURL()}${params.username}?success=true`
    cancelUrl = `${getURL()}${params.username}?error=cancel`
  }
  if (params.type === 'pair') {
    const [username1, username2] = [params.username1, params.username2].sort()
    metadataObject = {
      username1: username1.replace('/', ''),
      username2: username2.replace('/', ''),
      type: params.type,
    }
    successUrl = `${getURL()}${username1}/${username2}/?success=true`
    cancelUrl = `${getURL()}${username1}/${username2}/?error=cancel`
  }

  const sessionConfig = {
    payment_method_types: ['card' as const],
    billing_address_collection: 'required' as const,
    line_items: [
      {
        price_data: {
          product: process.env.STRIPE_PRODUCT_ID,
          currency: 'USD',
          unit_amount: params.priceInt,
        },
        quantity: 1,
      },
    ],
    payment_intent_data: {
      metadata: metadataObject,
    },
    allow_promotion_codes: undefined as boolean | undefined,
    metadata: metadataObject,
    mode: 'payment' as const,
    success_url: successUrl,
    cancel_url: cancelUrl,
  }

  const session = await stripe.checkout.sessions.create(sessionConfig)

  if (session.url) redirect(session.url)
  return { error: 'No session url' }
}
