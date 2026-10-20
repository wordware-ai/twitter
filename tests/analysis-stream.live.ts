/** Optional live anonymous MCP smoke through the maintained analysis caller.
 * The model is scripted: this checks runtime dispatch, not model quality.
 */
import assert from 'node:assert/strict'
import { MockLanguageModelV4, simulateReadableStream } from 'ai/test'

import { streamPersonalityAnalysis } from '../src/lib/analysis-stream'
import { parseJsonLoose } from '../src/lib/parse-json-loose'

async function main() {
  for (const key of ['PARALLEL_API_KEY', 'PRODUCT_SEARCH_ENABLED', 'AI_GATEWAY_API_KEY', 'OPENAI_API_KEY', 'ANTHROPIC_API_KEY']) delete process.env[key]
  const originalFetch = globalThis.fetch
  const requests: { url: string; method?: string; rpc?: string; tool?: string; arguments?: unknown; userAgent: string | null; status: number; body: string }[] =
    []
  globalThis.fetch = async (url, init) => {
    const headers = new Headers(init?.headers)
    assert.equal(String(url), 'https://search.parallel.ai/mcp')
    assert.match(headers.get('user-agent') ?? '', /twitter-personality/)
    assert.equal(headers.get('authorization'), null)
    const rpc = init?.body ? JSON.parse(String(init.body)) : undefined
    const record = {
      url: String(url),
      method: init?.method,
      rpc: rpc?.method,
      tool: rpc?.params?.name,
      arguments: rpc?.params?.arguments,
      userAgent: headers.get('user-agent'),
      status: 0,
      body: '',
    }
    requests.push(record)
    try {
      const response = await originalFetch(url, init)
      record.status = response.status
      record.body = await response.clone().text()
      return response
    } catch (error) {
      record.body = String(error) + (error instanceof Error && error.cause ? `; ${String(error.cause)}` : '')
      throw error
    }
  }
  const usage = { inputTokens: { total: 1, noCache: 1, cacheRead: 0, cacheWrite: 0 }, outputTokens: { total: 1, text: 1, reasoning: 0 } }
  let step = 0
  let finalPrompt = ''
  const model = new MockLanguageModelV4({
    modelId: 'scripted-live-MCP-smoke',
    doGenerate: async ({ prompt }) => {
      const sourceUrl = JSON.stringify(prompt).match(/https?:\/\/[^"\\\s]+/)?.[0]
      const name = step === 0 ? 'web_search' : step === 1 && sourceUrl ? 'web_fetch' : undefined
      step++
      return {
        content: name
          ? [
              {
                type: 'tool-call' as const,
                toolCallId: `live-${step}`,
                toolName: name,
                input: JSON.stringify(
                  name === 'web_search'
                    ? {
                        objective: 'Find an official merchant price in USD for a paper notebook under $50',
                        search_queries: ['paper notebook price USD official'],
                      }
                    : { urls: [sourceUrl] },
                ),
              },
            ]
          : [{ type: 'text' as const, text: 'Done' }],
        finishReason: { unified: name ? ('tool-calls' as const) : ('stop' as const), raw: undefined },
        usage,
        warnings: [],
      }
    },
    doStream: async ({ prompt }) => {
      finalPrompt = JSON.stringify(prompt)
      const text = JSON.stringify({ fiftyDollarThing: 'Scripted output: inspect retained lookup evidence; no price quality claim.' })
      return {
        stream: simulateReadableStream({
          chunks: [
            { type: 'text-start', id: 'final' },
            { type: 'text-delta', id: 'final', delta: text },
            { type: 'text-end', id: 'final' },
            { type: 'finish', finishReason: { unified: 'stop', raw: undefined }, usage },
          ],
        }),
      }
    },
  })
  let saved: unknown
  try {
    const stream = await streamPersonalityAnalysis({
      full: true,
      model,
      profileInfo: '{}',
      tweetsMarkdown: 'I like paper notebooks.',
      onEnd: async ({ text }) => {
        saved = parseJsonLoose(text)
      },
    })
    const output = await stream.toTextStreamResponse().text()
    assert.deepEqual(saved, JSON.parse(output))
    const quota = requests.some((r) => {
      if (r.status === 429) return true
      if (r.rpc !== 'tools/call') return false
      try {
        const result = JSON.parse(r.body).result
        return result?.isError === true && /quota|rate.?limit|too many requests/i.test(JSON.stringify(result))
      } catch {
        return false
      }
    })
    const unavailable = finalPrompt.includes('Live product pricing is unavailable')
    console.log(
      JSON.stringify(
        {
          observedAt: new Date().toISOString(),
          scriptedModel: true,
          outcome: quota ? 'anonymous_quota' : unavailable ? 'failed' : 'lookup_evidence_consumed',
          requests,
          finalPrompt,
          output,
        },
        null,
        2,
      ),
    )
    if (unavailable && !quota) throw new Error('Anonymous caller failed without an explicit quota response; inspect retained requests')
    assert.ok(requests.some((r) => r.tool === 'web_search') || quota)
    const calls = requests.filter((r) => r.tool)
    const ids = calls.map((r) => (r.arguments as { session_id: string }).session_id)
    if (ids.length) assert.equal(new Set(ids).size, 1)
  } finally {
    globalThis.fetch = originalFetch
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
