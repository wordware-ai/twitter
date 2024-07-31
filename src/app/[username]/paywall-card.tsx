import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { LockIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { unlockGeneration } from '@/actions/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const FormSchema = z.object({
  email: z.string().email(),
})

export const PaywallCard: React.FC = () => {
  const pathname = usePathname()
  const router = useRouter()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    // Attempt to create a contact in Loops
    const { success } = await unlockGeneration({ username: pathname, email: values.email })
    if (!success) {
      toast.error('Something went wrong')
    } else {
      toast.success('You have been added to the newsletter.')
      router.refresh()
    }
  }

  return (
    <Card className={cn(`relative w-full overflow-hidden rounded-2xl border bg-blue-600 bg-opacity-5 px-4 pb-4`)}>
      <CardHeader className="flex w-full flex-col items-start">
        <CardTitle className="flex w-full items-center justify-between py-2 pb-4 text-2xl">
          <div className="flex items-center gap-3">
            <LockIcon size={24} />
            <span className={`text-xl font-light text-gray-900`}>Want to see the full picture?</span>
          </div>
        </CardTitle>
        <div className="w-full border-b border-gray-300" />
      </CardHeader>
      <CardContent className="flex flex-col text-gray-700">
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
              className="w-full"
              disabled={form.formState.isSubmitting || form.formState.isSubmitSuccessful}
              type="submit">
              {/* Dynamic button text based on form state */}
              {form.formState.isSubmitting ? 'Unlocking...' : form.formState.isSubmitSuccessful ? 'Success. Refresh the page.' : 'Unlock Full Analysis'}
            </Button>
          </form>
        </Form>

        <p className="mt-4 text-xs text-gray-500">
          By submitting your email, you agree to receive marketing content from Wordware. We&apos;ll use your email to send you the full analysis and keep you
          updated on our products and services.
        </p>
      </CardContent>
    </Card>
  )
}
