'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { newsletterSignup } from '@/actions/actions'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

/**
 * Zod schema for form validation
 */
const FormSchema = z.object({
  email: z.string().email(),
})

/**
 * NewsletterForm component
 * Renders a form for users to sign up for a newsletter
 */
export function NewsletterForm() {
  // Initialize form with react-hook-form and zod resolver
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
    },
  })

  /**
   * Handle form submission
   * @param {z.infer<typeof FormSchema>} values - Form values
   */
  async function onSubmit(values: z.infer<typeof FormSchema>) {
    // Attempt to create a contact in Loops
    const { success } = await newsletterSignup({ email: values.email })
    if (!success) {
      toast.error('Something went wrong')
    } else {
      toast.success('You have been added to the newsletter.')
    }
  }

  return (
    <div className="flex-center container mx-auto flex-col space-y-4 px-4">
      <h2 className="text-center text-2xl font-light">Sign up for the newsletter</h2>
      <p className="font-light">If you&apos;d like to get notified about our upcoming project or exploring different WordApps, leave your email here.</p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex-center">
                    <Input
                      disabled={form.formState.isSubmitting || form.formState.isSubmitSuccessful}
                      className="max-w-[400px] rounded-l-sm rounded-r-none border-black"
                      placeholder="your@email.com"
                      {...field}
                    />
                    <Button
                      className="min-w-[120px] rounded-l-none rounded-r-sm"
                      disabled={form.formState.isSubmitting || form.formState.isSubmitSuccessful}
                      type="submit">
                      {/* Dynamic button text based on form state */}
                      {form.formState.isSubmitting ? 'Submitting...' : form.formState.isSubmitSuccessful ? 'Subscribed' : 'Sign up'}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  )
}
