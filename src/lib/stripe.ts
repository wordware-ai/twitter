import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) throw new Error('No Stripe secret key found')

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
})
