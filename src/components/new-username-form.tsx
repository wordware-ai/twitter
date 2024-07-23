'use client'

import { useSearchParams } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { PiSpinner } from 'react-icons/pi'
import { z } from 'zod'

import { handleNewUsername } from '@/actions/actions'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cleanUsername } from '@/lib/utils'

const formSchema = z.object({
  username: z.string().min(3).max(50),
})

const NewUsernameForm = () => {
  const searchParams = useSearchParams()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: searchParams.get('u') || '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const cleanedUsername = cleanUsername(values.username)
    await handleNewUsername({ username: cleanedUsername })
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-sm space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>Your X handle or link</FormLabel> */}
                <FormControl>
                  <div className="flex items-center">
                    <Input
                      disabled={form.formState.isSubmitting || form.formState.isSubmitSuccessful}
                      className="w-full rounded-l-sm rounded-r-none border-black"
                      placeholder="@username"
                      {...field}
                    />
                    <Button
                      disabled={form.formState.isSubmitting || form.formState.isSubmitSuccessful}
                      type="submit"
                      className="rounded-r-sm rounded-l-none">
                      Discover
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      {(form.formState.isSubmitting || form.formState.isSubmitSuccessful) && (
        <div className="flex items-center gap-2 text-sm">
          <PiSpinner className="animate-spin" />
          Looking for your X profile...
        </div>
      )}
    </div>
  )
}

export default NewUsernameForm
