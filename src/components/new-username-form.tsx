'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { handleNewUsername } from '@/actions/actions'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  username: z.string().min(3).max(50),
})

const NewUsernameForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    const cleanUsername = (input: string) => {
      // Remove https:// or http:// if present
      let cleaned = input.replace(/^(https?:\/\/)?(www\.)?/, '')

      // Remove twitter.com/ or x.com/ if present
      cleaned = cleaned.replace(/^(twitter\.com\/|x\.com\/)/, '')

      // Remove @ if present at the start
      cleaned = cleaned.replace(/^@/, '')

      // Split by / and take the last part (in case of full URLs)
      cleaned = cleaned.split('/').pop() || ''

      return cleaned.trim()
    }

    const cleanedUsername = cleanUsername(values.username)
    handleNewUsername({ username: cleanedUsername })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-sm space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your X handle or link</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Input
                    className="w-full"
                    placeholder="@username"
                    {...field}
                  />
                  <Button
                    disabled={form.formState.isSubmitting || isLoading}
                    type="submit">
                    Submit
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

export default NewUsernameForm
