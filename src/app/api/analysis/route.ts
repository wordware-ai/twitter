import { Output, streamText } from 'ai'
import { z } from 'zod'

import { getUser, updateUser } from '@/drizzle/queries'
import { AI_MODEL } from '@/lib/ai'
import { formatTweetsMarkdown, fullPrompt, roastPrompt } from '@/lib/prompts'
import { fullSchema, roastSchema } from '@/lib/schemas'
import { TweetType, TwitterAnalysis } from '@/types'

/**
 * Maximum duration for the API route execution (in seconds)
 */
export const maxDuration = 300
export const dynamic = 'force-dynamic'

/**
 * Streams a personality analysis for a scraped user via the Vercel AI Gateway.
 *
 * Contract (unchanged from the original Wordware route): the response body is a
 * plain-text stream of the raw JSON as it is generated; the client accumulates
 * it and renders with parsePartialJson. The final object is merged into
 * `users.analysis` server-side. The `wordware*` status columns keep their
 * historical names so all cached rows remain valid.
 */
export async function POST(request: Request) {
  const { username, full } = await request.json()

  const user = await getUser({ username })

  if (!user) {
    throw Error(`User not found: ${username}`)
  }

  // Dedupe guard: skip if this part is already done, or started very recently.
  if (!full) {
    if (user.wordwareCompleted || (user.wordwareStarted && Date.now() - user.wordwareStartedTime.getTime() < 3 * 60 * 1000)) {
      return Response.json({ error: 'Analysis already started' })
    }
  }

  if (full) {
    if (user.paidWordwareCompleted || (user.paidWordwareStarted && Date.now() - user.paidWordwareStartedTime.getTime() < 3 * 60 * 1000)) {
      return Response.json({ error: 'Analysis already started' })
    }
  }

  const tweets = user.tweets as TweetType[]
  const tweetsMarkdown = formatTweetsMarkdown(tweets, username)
  const profileInfo = JSON.stringify(user.fullProfile)

  const { system, prompt } = full ? fullPrompt({ profileInfo, tweetsMarkdown }) : roastPrompt({ profileInfo, tweetsMarkdown })

  // Mark generation as started (reset in onError below if it fails)
  const startedObject = full
    ? { paidWordwareStarted: true, paidWordwareStartedTime: new Date() }
    : { wordwareStarted: true, wordwareStartedTime: new Date() }
  await updateUser({ user: { ...user, ...startedObject } })

  const existingAnalysis = user?.analysis as TwitterAnalysis

  const resetStatus = async () => {
    const statusObject = full ? { paidWordwareStarted: false, paidWordwareCompleted: false } : { wordwareStarted: false, wordwareCompleted: false }
    await updateUser({ user: { ...user, ...statusObject } })
  }

  const result = streamText({
    model: AI_MODEL,
    system,
    prompt,
    // The two run types share one route; widen the union so TS accepts either schema
    output: Output.object({ schema: (full ? fullSchema : roastSchema) as unknown as z.ZodType<Record<string, unknown>> }),
    onEnd: async ({ text }) => {
      try {
        const output = JSON.parse(text)
        const statusObject = full
          ? { paidWordwareStarted: true, paidWordwareCompleted: true }
          : { wordwareStarted: true, wordwareCompleted: true }
        await updateUser({
          user: {
            ...user,
            ...statusObject,
            analysis: {
              ...existingAnalysis,
              ...output,
            },
          },
        })
        console.log(`[${user.username}] ✨ Analysis ${full ? '(full)' : '(roast)'} saved`)
      } catch (error) {
        console.error(`[${user.username}] Error parsing or saving analysis output:`, error)
        await resetStatus()
      }
    },
    onError: async ({ error }) => {
      console.error(`[${user.username}] Analysis generation failed:`, error)
      await resetStatus()
    },
  })

  return result.toTextStreamResponse()
}
