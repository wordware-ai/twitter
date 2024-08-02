'use client'

import { useSearchParams } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { PiSpinner } from 'react-icons/pi'
import { z } from 'zod'

// import { handleNewUsername } from '@/actions/actions'
import { Button } from '@/components/ui/button'

// import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
// import { Input } from '@/components/ui/input'
// import { cleanUsername } from '@/lib/utils'

/**
 * Zod schema for form validation
 */
const formSchema = z.object({
  username: z.string().min(3).max(50),
})

/**
 * NewUsernameForm component
 * Renders a form for entering a new username
 * @returns {JSX.Element}
 */
const NewUsernameForm = () => {
  const searchParams = useSearchParams()

  // Initialize form with react-hook-form and zod resolver
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: searchParams.get('u') || '',
    },
  })

  // async function onSubmit(values: z.infer<typeof formSchema>) {
  //   const cleanedUsername = cleanUsername(values.username)
  //   const response = await handleNewUsername({ username: cleanedUsername })
  //   console.log('🟣 | file: new-username-form.tsx:46 | onSubmit | response:', response)
  //   if (response?.error) {
  //     window.location.href = 'https://tally.so/r/3lRoOp'
  //   }
  // }

  return (
    <div className="flex w-full flex-col gap-4">
      <Button
        asChild
        className="flex max-w-[220px]">
        <a
          href="https://tally.so/r/3lRoOp"
          target="_blank">
          Sign up for the Waitlist
        </a>
      </Button>
      {/* <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-sm space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center">
                    <Input
                      disabled={form.formState.isSubmitting}
                      className="w-full rounded-l-sm rounded-r-none border-black"
                      placeholder="@username"
                      {...field}
                    />
                    <Button
                      disabled={form.formState.isSubmitting}
                      type="submit"
                      className="rounded-l-none rounded-r-sm">
                      Discover
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form> */}
      {/* Display loading spinner when form is submitting or submission is successful */}
      {form.formState.isSubmitting && (
        <div className="flex items-center gap-2 text-sm">
          <PiSpinner className="animate-spin" />
          Looking for your X profile...
        </div>
      )}
    </div>
  )
}

export default NewUsernameForm
