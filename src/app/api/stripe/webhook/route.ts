import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

import { unlockPair, unlockUser } from '@/actions/actions'
import { stripe } from '@/lib/stripe'

// import { changeSubscriptionStatus } from '@/utils/server-actions/stripe'

/**
 * Set of Stripe event types that this webhook handler will process
 */
const relevantEvents = new Set([
  //   'product.created',
  //   'product.updated',
  //   'price.created',
  //   'price.updated',
  'checkout.session.completed',
  //   'customer.subscription.created',
  //   'customer.subscription.updated',
  //   'customer.subscription.deleted',
])

/**
 * Handles POST requests for Stripe webhook events
 * @param {Request} req - The incoming request object
 */
export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('Stripe-Signature') as string
  console.log('🟣 | file: route.ts:30 | POST | signature:', signature)
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  console.log('🟣 | file: route.ts:32 | POST | webhookSecret:', webhookSecret)

  let event: Stripe.Event

  try {
    // Verify and construct the Stripe event
    if (!signature || !webhookSecret) return
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.warn('❗️ Webhook Error:', err.message)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  // Process the event if it's one we're interested in
  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case 'checkout.session.completed':
          const checkoutSession = event.data.object as Stripe.Checkout.Session
          console.log('🟣 Checkout Session Completed:', checkoutSession)

          if (checkoutSession.metadata?.type === 'pair') {
            const [username1, username2] = [checkoutSession.metadata.username1, checkoutSession.metadata.username2].sort()
            console.log('Webhook: UNLOCKING PAIR: ', username1, username2)
            await unlockPair({ username1, username2, unlockType: 'stripe' })
          }
          if (checkoutSession.metadata?.type === 'user') {
            console.log('Webhook: UNLOCKING USER: ', checkoutSession.metadata.username)
            await unlockUser({ username: checkoutSession.metadata.username, unlockType: 'stripe' })
            revalidatePath(`/${checkoutSession.metadata.username}`)
          }

          // if (checkoutSession.metadata?.username) {
          //   await unlockUser({ username: checkoutSession.metadata.username, unlockType: 'stripe' })
          //   revalidatePath(`/${checkoutSession.metadata.username}`)
          // } else {
          //   console.error('Username not found in checkout session metadata')
          // }
          break
        default:
          throw new Error('Unhandled relevant event!')
      }
    } catch (error) {
      console.warn('❗️ Webhook handler failed:', error)
      return new Response('Webhook handler failed. View your nextjs function logs.', {
        status: 400,
      })
    }
  }

  // Acknowledge receipt of the event
  return NextResponse.json({ received: true })
}
