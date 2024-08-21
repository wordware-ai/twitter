'use client'

import { usePathname } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { PiSparkle, PiSpinner } from 'react-icons/pi'
import { toast } from 'sonner'
import { z } from 'zod'

import { handleNewUsername, handlePair } from '@/actions/actions'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cleanUsername } from '@/lib/utils'

const formSchema = z.object({
  username: z.string().min(2).max(50),
})

const NewPairForm = () => {
  const pathname = usePathname()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const cleanedUsername = cleanUsername(values.username)
    if (pathname.replace('/', '').toLowerCase() === cleanedUsername.toLowerCase()) {
      toast.error('You cannot pair with yourself')
      return
    }
    const response = await handleNewUsername({
      username: cleanedUsername,
      redirectPath: `${pathname}/${cleanedUsername}`,
    })

    if (response?.error) {
      toast.error(response.error)
      return
    }
    await handlePair({ usernames: [pathname.replace('/', ''), cleanedUsername], shouldRedirect: true })
  }

  return (
    <div className="flex-center w-full flex-col gap-4">
      <Form {...form}>
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
                      className="flex-center gap-2 rounded-l-none rounded-r-sm bg-black">
                      <PiSparkle />
                      Check Compatibility
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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

export default NewPairForm
