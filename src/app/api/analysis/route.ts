import { streamText } from 'ai'

import { getUser, updateUser } from '@/drizzle/queries'
import { AI_MODEL } from '@/lib/ai'
import { parseJsonLoose } from '@/lib/parse-json-loose'
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
  const startedAt = new Date()
  const startedObject = full
    ? { paidWordwareStarted: true, paidWordwareStartedTime: startedAt }
    : { wordwareStarted: true, wordwareStartedTime: startedAt }
  await updateUser({ user: { ...user, ...startedObject } })

  const existingAnalysis = user?.analysis as TwitterAnalysis

  const resetStatus = async () => {
    const statusObject = full ? { paidWordwareStarted: false, paidWordwareCompleted: false } : { wordwareStarted: false, wordwareCompleted: false }
    await updateUser({ user: { ...user, ...statusObject } })
  }

  // Plain text mode on purpose: structured-output (json_schema) constrained
  // decoding noticeably flattens the roast's voice. The prompts enumerate the
  // exact JSON keys and parsing is lenient (parseJsonLoose).
  const result = streamText({
    model: AI_MODEL,
    system,
    prompt,
    onEnd: async ({ text }) => {
      try {
        const output = parseJsonLoose(text)
        // Plain-text mode can occasionally drop a key — log it for observability
        const check = (full ? fullSchema : roastSchema).safeParse(output)
        if (!check.success) {
          console.warn(`[${user.username}] ⚠️ Output shape issues:`, check.error.issues.map((i) => i.path.join('.')).join(', '))
        }
        // Include the fresh started time: spreading the pre-generation `user`
        // would write the old timestamp back, making a just-regenerated
        // analysis still look stale to refreshStaleUser (regeneration loop)
        const statusObject = full
          ? { paidWordwareStarted: true, paidWordwareStartedTime: startedAt, paidWordwareCompleted: true }
          : { wordwareStarted: true, wordwareStartedTime: startedAt, wordwareCompleted: true }
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
