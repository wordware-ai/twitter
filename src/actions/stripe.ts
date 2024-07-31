'use server'

import { redirect } from 'next/navigation'

import { getURL } from '@/lib/config'
import { stripe } from '@/lib/stripe'

export const createCheckoutSession = async ({ username, priceInt }: { username: string; priceInt: number }) => {
  const cleanUsername = username.replace('/', '')
  const metadataObject = {
    username: cleanUsername,
  }

  const sessionConfig = {
    payment_method_types: ['card' as const],
    billing_address_collection: 'required' as const,
    line_items: [
      {
        price_data: {
          product: process.env.STRIPE_PRODUCT_ID,
          currency: 'USD',
          unit_amount: priceInt,
        },

        quantity: 1,
      },
    ],
    allow_promotion_codes: undefined as boolean | undefined,
    metadata: metadataObject,
    mode: 'payment' as const,
    success_url: `${getURL()}${cleanUsername}?success=true`,
    cancel_url: `${getURL()}${cleanUsername}?error=cancel`,
  }

  const session = await stripe.checkout.sessions.create(sessionConfig)

  if (session.url) redirect(session.url)
  return { error: 'No session url' }
}
