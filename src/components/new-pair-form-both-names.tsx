'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { PiSparkle, PiSpinner } from 'react-icons/pi'
import { toast } from 'sonner'
import { z } from 'zod'

import { getOrCreatePair, handleNewUsername } from '@/actions/actions'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cleanUsername, cn } from '@/lib/utils'

const formSchema = z.object({
  username1: z.string().min(3).max(50),
  username2: z.string().min(3).max(50),
})

const NewPairFormBothNames = () => {
  const pathname = usePathname()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username1: '',
      username2: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const cleanedUsername1 = cleanUsername(values.username1)
    const cleanedUsername2 = cleanUsername(values.username2)
    if (cleanedUsername1.toLowerCase() === cleanedUsername2.toLowerCase()) {
      toast.error('You cannot pair with yourself')
      return
    }
    const response = await handleNewUsername({
      username: cleanedUsername1,
      redirectPath: `${pathname}/${cleanedUsername1}`,
    })

    if (response?.error) {
      toast.error(response.error)
      return
    }
    await getOrCreatePair({ usernames: [cleanedUsername1, cleanedUsername2], shouldRedirect: true })
  }

  return (
    <div className="w-full gap-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full min-w-0 max-w-sm">
          <div className="flex w-full flex-col">
            <FormField
              control={form.control}
              name="username1"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center">
                      <Input
                        disabled={form.formState.isSubmitting}
                        className="w-full rounded-b-none rounded-t-sm border-blue-500"
                        placeholder="@username"
                        {...field}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username2"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center">
                      <Input
                        disabled={form.formState.isSubmitting}
                        className="w-full rounded-none border-t-0 border-blue-500"
                        placeholder="@username"
                        {...field}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              disabled={form.formState.isSubmitting}
              type="submit"
              className="w-full gap-2 rounded-b-sm rounded-t-none bg-blue-500 hover:bg-blue-600">
              <PiSparkle />
              Check Compatibility
            </Button>
            {form.formState.errors.username1 && (
              <p className="mt-2 text-sm font-medium text-destructive">Error with first username: {form.formState.errors.username1?.message}</p>
            )}
            {form.formState.errors.username2 && (
              <p className="mt-2 text-sm font-medium text-destructive">Error with second username: {form.formState.errors.username2?.message}</p>
            )}
          </div>
        </form>
      </Form>
      {/* Display loading spinner when form is submitting or submission is successful */}
      {form.formState.isSubmitting && (
        <div className="flex items-center gap-2 text-sm">
          <PiSpinner className="animate-spin" />
          Checking compatibility...
        </div>
      )}
    </div>
  )
}

export default NewPairFormBothNames
