import React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { LockIcon } from 'lucide-react'
import posthog from 'posthog-js'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { unlockGeneration } from '@/actions/actions'
import { createCheckoutSession } from '@/actions/stripe'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PERSONALITY_PART1_PAYWALL } from '@/lib/config'
import { cn } from '@/lib/utils'

const FormSchema = z.object({
  email: z.string().email(),
})

export const PriceButton = ({ username, price }: { username: string; price: string }) => (
  <Button
    onClick={() => {
      createCheckoutSession({ username, priceInt: parseInt(price), type: 'user' })
    }}
    className={cn('w-full bg-green-600 hover:bg-green-700', !PERSONALITY_PART1_PAYWALL && 'max-w-md')}
    type="button">
    Unlock Full Analysis (${parseInt(price) / 100})
  </Button>
)

export const PaywallCard: React.FC = () => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
    },
  })

  const paywallFlag = posthog.getFeatureFlag('paywall2') ?? searchParams.get('stripe')

  // console.log('paywall flag', paywallFlag, searchParams.get('stripe'))

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    // Attempt to create a contact in Loops
    const { success } = await unlockGeneration({ username: pathname, email: values.email })
    if (!success) {
      toast.error('Something went wrong')
    } else {
      toast.success('You have been added to the newsletter.')
      const newUrl = new URL(pathname, window.location.origin)
      newUrl.searchParams.set('success', 'true')
      router.replace(newUrl.toString())
      router.refresh()
    }
  }

  if (typeof window !== 'undefined' && searchParams.has('success')) {
    console.log('Conversion successful')
    posthog.capture('conversion')
  }
  return (
    <Card className={cn(`relative w-full overflow-hidden rounded-2xl border bg-blue-600 bg-opacity-5 px-4 pb-4`)}>
      <CardHeader className="flex w-full flex-col items-start">
        <CardTitle className="flex w-full items-center justify-between py-2 pb-4 text-2xl">
          <div className="flex items-center gap-3">
            <LockIcon size={24} />
            <span className={`text-xl font-light text-gray-900`}>Want to see your roast? ️‍🔥</span>
          </div>
        </CardTitle>
        <div className="w-full border-b border-gray-300" />
      </CardHeader>
      <CardContent className="flex flex-col text-gray-700">
        {paywallFlag && paywallFlag !== 'control' ? (
          <>
            <p className="mb-4">Unlock all insights by purchasing below.</p>
            <PriceButton
              username={pathname}
              price={paywallFlag as string}
            />
            <p className="mt-4 text-sm text-gray-800">
              Full access includes comprehensive persona analysis, including: <strong>Roast</strong>, <strong>Strengths</strong>, <strong>Weaknesses</strong>,{' '}
              <strong>Love Life</strong>, <strong>Money</strong>, <strong>Health</strong>, <strong>Biggest Goal</strong>, <strong>Colleague Perspective</strong>
              , <strong>Pickup Lines</strong>, <strong>Famous Person Comparison</strong>, <strong>Previous Life</strong>, <strong>Animal Comparison</strong>,{' '}
              <strong>$50 Thing</strong>, <strong>Career</strong>, and <strong>Life Suggestion</strong>.
            </p>
          </>
        ) : (
          <>
            <p className="mb-4">Unlock all insights by leaving your email address below.</p>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex-center">
                          <Input
                            disabled={form.formState.isSubmitting || form.formState.isSubmitSuccessful}
                            className="w-full border-black"
                            placeholder="your@email.com"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  disabled={form.formState.isSubmitting || form.formState.isSubmitSuccessful}
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700">
                  {/* Dynamic button text based on form state */}
                  {form.formState.isSubmitting ? 'Unlocking...' : form.formState.isSubmitSuccessful ? 'Success. Refresh the page.' : 'Unlock Full Analysis'}
                </Button>
              </form>
            </Form>

            <p className="mt-4 text-xs text-gray-500">
              By submitting your email, you agree to receive marketing content from Wordware. We&apos;ll use your email to send you the full analysis and keep
              you updated on our products and services.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )
}
