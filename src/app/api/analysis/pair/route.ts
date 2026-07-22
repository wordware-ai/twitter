import { streamText } from 'ai'

import { getPair, getUser, updatePair } from '@/drizzle/queries'
import { AI_MODEL } from '@/lib/ai'
import { parseJsonLoose } from '@/lib/parse-json-loose'
import { compatibilityPrompt, formatTweetsMarkdown } from '@/lib/prompts'
import { compatibilitySchema } from '@/lib/schemas'
import { TweetType } from '@/types'

/**
 * Maximum duration for the API route execution (in seconds)
 */
export const maxDuration = 300
export const dynamic = 'force-dynamic'

/**
 * Streams a compatibility analysis for a pair of users via the Vercel AI
 * Gateway. Same streaming contract as /api/analysis: plain-text raw JSON
 * stream, final object persisted to `pairs.analysis`.
 */
export async function POST(request: Request) {
  const { usernames } = await request.json()

  const user1 = await getUser({ username: usernames[0] })
  const user2 = await getUser({ username: usernames[1] })
  const pair = await getPair({ usernames })

  if (!user1 || !user2) {
    throw Error(`User not found: ${usernames[0]} or ${usernames[1]}`)
  }

  if (!pair) {
    throw Error(`Pair not found: ${usernames[0]} and ${usernames[1]}`)
  }

  if (pair.wordwareCompleted || (pair.wordwareStarted && Date.now() - pair.wordwareStartedTime.getTime() < 3 * 60 * 1000)) {
    return Response.json({ error: 'Analysis already started' })
  }

  const tweetsMarkdown1 = formatTweetsMarkdown(user1.tweets as TweetType[], user1.username)
  const tweetsMarkdown2 = formatTweetsMarkdown(user2.tweets as TweetType[], user2.username)

  const { system, prompt } = compatibilityPrompt({
    name1: user1.name || user1.username,
    name2: user2.name || user2.username,
    profileInfo1: JSON.stringify(user1.fullProfile),
    tweetsMarkdown1,
    profileInfo2: JSON.stringify(user2.fullProfile),
    tweetsMarkdown2,
  })

  const startedAt = new Date()
  await updatePair({
    pair: {
      ...pair,
      wordwareStarted: true,
      wordwareStartedTime: startedAt,
    },
  })

  const resetStatus = async () => {
    await updatePair({
      pair: {
        ...pair,
        wordwareStarted: false,
        wordwareCompleted: false,
      },
    })
  }

  // Plain text mode on purpose — see /api/analysis: constrained decoding
  // flattens the voice; the prompt enumerates the exact keys instead
  const result = streamText({
    model: AI_MODEL,
    system,
    prompt,
    onEnd: async ({ text }) => {
      try {
        const output = parseJsonLoose(text)
        // Plain-text mode can occasionally drop a key — log it for observability
        // (the UI skips missing cards gracefully)
        const check = compatibilitySchema.safeParse(output)
        if (!check.success) {
          console.warn(`[${pair.user1lowercaseUsername}, ${pair.user2lowercaseUsername}] ⚠️ Output shape issues:`, check.error.issues.map((i) => i.path.join('.')).join(', '))
        }
        await updatePair({
          pair: {
            ...pair,
            wordwareStarted: true,
            wordwareStartedTime: startedAt,
            wordwareCompleted: true,
            analysis: output,
          },
        })
        console.log(`[${pair.user1lowercaseUsername}, ${pair.user2lowercaseUsername}] ✨ Compatibility analysis saved`)
      } catch (error) {
        console.error(`[${pair.user1lowercaseUsername}, ${pair.user2lowercaseUsername}] Error parsing or saving output:`, error)
        await resetStatus()
      }
    },
    onError: async ({ error }) => {
      console.error(`[${pair.user1lowercaseUsername}, ${pair.user2lowercaseUsername}] Compatibility generation failed:`, error)
      await resetStatus()
    },
  })

  return result.toTextStreamResponse()
}
