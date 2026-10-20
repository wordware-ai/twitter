import { streamText, type LanguageModel } from 'ai'

import { AI_MODEL } from './ai'
import { researchProduct } from './product-search'
import { fullPrompt, roastPrompt } from './prompts'

/** Shared by the API route and caller tests; research never enters the JSON stream. */
export async function streamPersonalityAnalysis({
  full,
  profileInfo,
  tweetsMarkdown,
  signal,
  model = AI_MODEL,
  onEnd,
  onError,
}: {
  full: boolean
  profileInfo: string
  tweetsMarkdown: string
  signal?: AbortSignal
  model?: LanguageModel
  onEnd?: (event: { text: string }) => Promise<void>
  onError?: (event: { error: unknown }) => Promise<void>
}) {
  let productResearch: string | undefined
  try {
    signal?.throwIfAborted()
    productResearch = full ? await researchProduct({ model, profileInfo, tweetsMarkdown, signal }) : undefined
    signal?.throwIfAborted()
  } catch (error) {
    await onError?.({ error })
    throw error
  }
  const { system, prompt } = full ? fullPrompt({ profileInfo, tweetsMarkdown, productResearch }) : roastPrompt({ profileInfo, tweetsMarkdown })

  return streamText({
    model,
    system,
    prompt,
    abortSignal: signal,
    onEnd,
    onError,
    onAbort: async () => onError?.({ error: signal?.reason ?? new DOMException('Analysis cancelled', 'AbortError') }),
  })
}
