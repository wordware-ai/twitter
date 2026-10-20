import assert from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { MockLanguageModelV4, simulateReadableStream } from 'ai/test'

import { streamPersonalityAnalysis } from '../src/lib/analysis-stream'
import { parseJsonLoose } from '../src/lib/parse-json-loose'
import { fullPrompt, roastPrompt } from '../src/lib/prompts'
import { fullSchema } from '../src/lib/schemas'

const originalFetch = globalThis.fetch
const originalEnv = { ...process.env }
const usage = {
  inputTokens: { total: 1, noCache: 1, cacheRead: 0, cacheWrite: 0 },
  outputTokens: { total: 1, text: 1, reasoning: 0 },
}
const inputs = { full: true, profileInfo: '{"name":"Test Reader"}', tweetsMarkdown: 'I enjoy reading and writing in notebooks.' }
const productUrl = 'https://merchant.example/notebook'
const output = JSON.stringify({
  strengths: Array.from({ length: 5 }, () => ({ title: 'Curious', subtitle: 'Reads widely' })),
  weaknesses: Array.from({ length: 5 }, () => ({ title: 'Distracted', subtitle: 'Too many books' })),
  loveLife: 'Kind',
  money: 'Optimistic',
  health: 'Rest',
  biggestGoal: 'Write',
  colleaguePerspective: 'Thoughtful',
  pickupLines: ['One', 'Two', 'Three'],
  famousPersonComparison: 'A writer',
  previousLife: 'A reader',
  animal: 'Owl',
  fiftyDollarThing: `[Notebook](${productUrl}) costs $12.00 before shipping and tax.`,
  career: 'Writing',
  lifeSuggestion: 'Keep a journal',
})
type Call = { method: string; params?: { name?: string; arguments?: Record<string, unknown> }; id?: string | number }
type RequestRecord = { url: string; headers: Headers; request?: Call; method: string }

afterEach(() => {
  globalThis.fetch = originalFetch
  for (const key of Object.keys(process.env)) if (!(key in originalEnv)) delete process.env[key]
  Object.assign(process.env, originalEnv)
})

function isolate() {
  for (const key of ['PRODUCT_SEARCH_ENABLED', 'PARALLEL_API_KEY', 'AI_GATEWAY_API_KEY', 'OPENAI_API_KEY', 'ANTHROPIC_API_KEY']) delete process.env[key]
}

function installMcp({ fail = '', quota = false, unauthorized = false }: { fail?: string; quota?: boolean; unauthorized?: boolean } = {}) {
  const records: RequestRecord[] = []
  globalThis.fetch = async (url, init) => {
    const request = init?.body ? (JSON.parse(String(init.body)) as Call) : undefined
    records.push({ url: String(url), headers: new Headers(init?.headers), request, method: init?.method ?? 'GET' })
    if (unauthorized) return new Response('Unauthorized', { status: 401 })
    if (request?.method === fail) throw new Error('Fixture connection failure')
    if (request?.id === undefined) return new Response(null, { status: 202 })
    let result: unknown
    if (request.method === 'initialize') {
      result = { protocolVersion: '2025-03-26', capabilities: { tools: {} }, serverInfo: { name: 'fixture', version: '1.0' } }
    } else if (request.method === 'tools/list') {
      result = {
        tools: [
          {
            name: 'web_search',
            description: 'Search products',
            inputSchema: {
              type: 'object',
              properties: { objective: { type: 'string' }, search_queries: { type: 'array', items: { type: 'string' } }, session_id: { type: 'string' } },
              required: ['objective', 'search_queries'],
            },
          },
          {
            name: 'web_fetch',
            description: 'Read product pages',
            inputSchema: {
              type: 'object',
              properties: { urls: { type: 'array', items: { type: 'string', format: 'uri' } }, session_id: { type: 'string' } },
              required: ['urls'],
            },
          },
          { name: 'unrelated_tool', inputSchema: { type: 'object' } },
        ],
      }
    } else if (request.method === 'tools/call') {
      result = quota
        ? { isError: true, content: [{ type: 'text', text: 'Free anonymous quota exceeded. Retry later.' }] }
        : { content: [{ type: 'text', text: JSON.stringify({ results: [{ url: productUrl, title: 'Notebook', excerpts: ['$12.00 USD, in stock'] }] }) }] }
    } else throw new Error(`Unexpected MCP method ${request.method}`)
    return Response.json({ jsonrpc: '2.0', id: request.id, result }, { headers: { 'mcp-session-id': 'http-connection-id' } })
  }
  return records
}

function scriptedModel(plan = ['web_search', 'web_fetch', 'web_search']) {
  let step = 0
  return new MockLanguageModelV4({
    modelId: 'explicit-scripted-model',
    doGenerate: async () => {
      const name = plan[step++]
      return {
        content: name
          ? [
              {
                type: 'tool-call' as const,
                toolCallId: `call-${step}`,
                toolName: name,
                input: JSON.stringify(
                  name === 'web_fetch'
                    ? { urls: [productUrl], session_id: 'model-must-not-own-id' }
                    : { objective: 'Find a notebook under 50 USD', search_queries: ['notebook price USD'], session_id: 'model-must-not-own-id' },
                ),
              },
            ]
          : [{ type: 'text' as const, text: 'Research complete' }],
        finishReason: { unified: name ? ('tool-calls' as const) : ('stop' as const), raw: undefined },
        usage,
        warnings: [],
      }
    },
    doStream: async () => ({
      stream: simulateReadableStream({
        chunks: [
          { type: 'text-start', id: 'final' },
          { type: 'text-delta', id: 'final', delta: output },
          { type: 'text-end', id: 'final' },
          { type: 'finish', finishReason: { unified: 'stop', raw: undefined }, usage },
        ],
      }),
    }),
  })
}

async function consume(options: Partial<Parameters<typeof streamPersonalityAnalysis>[0]> = {}, model = scriptedModel()) {
  let saved: unknown
  const stream = await streamPersonalityAnalysis({
    ...inputs,
    model,
    onEnd: async ({ text }) => {
      saved = parseJsonLoose(text)
    },
    ...options,
  })
  const body = await stream.toTextStreamResponse().text()
  await stream.text
  return { model, body, saved }
}

test('fresh no-key full resolver dispatches MCP tools and consumes a source-linked JSON stream', async () => {
  isolate()
  const records = installMcp()
  const { model, body, saved } = await consume()
  assert.equal(body, output)
  assert.deepEqual(saved, JSON.parse(output))
  assert.equal(fullSchema.safeParse(saved).success, true)
  assert.equal(model.doGenerateCalls.length, 3)
  assert.equal(model.doStreamCalls.length, 1)
  assert.deepEqual(model.doGenerateCalls[0].toolChoice, { type: 'tool', toolName: 'web_search' })
  assert.deepEqual(
    model.doGenerateCalls[0].tools?.map((t) => t.name),
    ['web_search', 'web_fetch'],
  )
  const finalPrompt = JSON.stringify(model.doStreamCalls[0].prompt)
  assert.ok(finalPrompt.includes(productUrl))
  assert.ok(finalPrompt.includes('$12.00 USD'))
  assert.ok(finalPrompt.includes('never personality claims'))
  assert.ok(!body.includes('Research complete'))
  const calls = records.filter((r) => r.request?.method === 'tools/call')
  assert.deepEqual(
    calls.map((r) => r.request?.params?.name),
    ['web_search', 'web_fetch', 'web_search'],
  )
  assert.deepEqual(calls[1].request?.params?.arguments?.urls, [productUrl])
  const ids = calls.map((r) => r.request?.params?.arguments?.session_id)
  assert.equal(new Set(ids).size, 1)
  assert.match(String(ids[0]), /^[0-9a-f-]{36}$/)
  assert.notEqual(ids[0], 'model-must-not-own-id')
  assert.notEqual(ids[0], 'http-connection-id')
  assert.ok(records.some((r) => r.method === 'DELETE'))
  for (const record of records) {
    assert.equal(record.url, 'https://search.parallel.ai/mcp')
    assert.match(record.headers.get('user-agent') ?? '', /twitter-personality\/0.1.0/)
    assert.equal(record.headers.get('authorization'), null)
  }
})

test('explicit disable and roast preserve original prompts and never access MCP', async () => {
  isolate()
  const records = installMcp()
  process.env.PRODUCT_SEARCH_ENABLED = 'false'
  process.env.PARALLEL_API_KEY = 'configured-but-disabled'
  const full = await consume()
  assert.equal(full.model.doGenerateCalls.length, 0)
  assert.equal(full.model.doStreamCalls[0].prompt[0].content, fullPrompt(inputs).system)
  delete process.env.PRODUCT_SEARCH_ENABLED
  const roast = await consume({ full: false })
  assert.equal(roast.model.doGenerateCalls.length, 0)
  assert.equal(roast.model.doStreamCalls[0].prompt[0].content, roastPrompt(inputs).system)
  assert.equal(records.length, 0)
})

test('explicit credentials are used without anonymous fallback; model selection is retained', async () => {
  isolate()
  process.env.PARALLEL_API_KEY = 'fixture-explicit-key'
  const records = installMcp()
  const { model } = await consume()
  assert.equal(model.modelId, 'explicit-scripted-model')
  assert.ok(model.doGenerateCalls.length && model.doStreamCalls.length)
  assert.ok(records.every((r) => r.headers.get('authorization') === 'Bearer fixture-explicit-key'))
})

test('explicit authentication failure is reported without retrying anonymously', async () => {
  isolate()
  process.env.PARALLEL_API_KEY = 'fixture-invalid-key'
  const records = installMcp({ unauthorized: true })
  const { model } = await consume()
  assert.ok(records.length > 0)
  assert.ok(records.every((r) => r.headers.get('authorization') === 'Bearer fixture-invalid-key'))
  assert.equal(model.doGenerateCalls.length, 0)
  assert.ok(JSON.stringify(model.doStreamCalls[0].prompt).includes('Live product pricing is unavailable'))
})

test('new and concurrent full analyses isolate research IDs through their production resolver', async () => {
  isolate()
  const records = installMcp()
  await Promise.all([consume(), consume()])
  await consume()
  const calls = records.filter((r) => r.request?.method === 'tools/call')
  const counts = new Map<unknown, number>()
  for (const call of calls) {
    const id = call.request?.params?.arguments?.session_id
    counts.set(id, (counts.get(id) ?? 0) + 1)
  }
  assert.equal(counts.size, 3)
  assert.deepEqual([...counts.values()], [3, 3, 3])
})

test('discovery failure preserves JSON generation with honest unavailable-price guidance', async () => {
  isolate()
  installMcp({ fail: 'tools/list' })
  const { model, body } = await consume()
  assert.equal(body, output)
  assert.equal(model.doGenerateCalls.length, 0)
  assert.ok(JSON.stringify(model.doStreamCalls[0].prompt).includes('Live product pricing is unavailable'))
})

test('tool quotas stay within the bounded loop and keep one run ID without fabricated evidence', async () => {
  isolate()
  const records = installMcp({ quota: true })
  const { model } = await consume()
  const calls = records.filter((r) => r.request?.method === 'tools/call')
  assert.equal(calls.length, 3)
  assert.equal(new Set(calls.map((r) => r.request?.params?.arguments?.session_id)).size, 1)
  assert.ok(JSON.stringify(model.doStreamCalls[0].prompt).includes('Live product pricing is unavailable'))
  assert.ok(!JSON.stringify(model.doStreamCalls[0].prompt).includes('$12.00 USD'))
})

test('parallel model tool calls cannot exceed the research network-call budget', async () => {
  isolate()
  const records = installMcp()
  const model = scriptedModel()
  let first = true
  model.doGenerate = async () => {
    const callTools = first
    first = false
    return {
      content: callTools
        ? Array.from({ length: 5 }, (_, i) => ({
            type: 'tool-call' as const,
            toolCallId: `parallel-${i}`,
            toolName: 'web_search',
            input: JSON.stringify({ objective: 'Notebook price', search_queries: ['notebook price USD'] }),
          }))
        : [{ type: 'text' as const, text: 'Done' }],
      finishReason: { unified: callTools ? ('tool-calls' as const) : ('stop' as const), raw: undefined },
      usage,
      warnings: [],
    }
  }
  await consume({}, model)
  assert.equal(records.filter((r) => r.request?.method === 'tools/call').length, 3)
})

test('models without tool support retain final generation with estimated-price guidance', async () => {
  isolate()
  installMcp()
  const model = scriptedModel()
  model.doGenerate = async () => {
    throw new Error('This configured model does not support tools')
  }
  await consume({}, model)
  assert.equal(model.doStreamCalls.length, 1)
  assert.ok(JSON.stringify(model.doStreamCalls[0].prompt).includes('Live product pricing is unavailable'))
})

test('request cancellation during discovery aborts HTTP, resets caller state and prevents final generation', async () => {
  isolate()
  const controller = new AbortController()
  let observedSignal: AbortSignal | null | undefined
  globalThis.fetch = async (_url, init) => {
    observedSignal = init?.signal
    queueMicrotask(() => controller.abort(new DOMException('Client disconnected', 'AbortError')))
    return new Promise((_resolve, reject) => init?.signal?.addEventListener('abort', () => reject(init.signal?.reason), { once: true }))
  }
  let reset = false
  const model = scriptedModel()
  await assert.rejects(
    consume(
      {
        signal: controller.signal,
        onError: async () => {
          reset = true
        },
      },
      model,
    ),
    /Client disconnected/,
  )
  assert.equal(observedSignal?.aborted, true)
  assert.equal(reset, true)
  assert.equal(model.doStreamCalls.length, 0)
})

test('cancellation during tool execution aborts MCP and prevents final generation', async () => {
  isolate()
  installMcp()
  const fixture = globalThis.fetch
  const controller = new AbortController()
  let toolAborted = false
  globalThis.fetch = async (url, init) => {
    const request = init?.body ? (JSON.parse(String(init.body)) as Call) : undefined
    if (request?.method !== 'tools/call') return fixture(url, init)
    queueMicrotask(() => controller.abort(new DOMException('Cancelled during search', 'AbortError')))
    return new Promise((_resolve, reject) =>
      init?.signal?.addEventListener(
        'abort',
        () => {
          toolAborted = true
          reject(init.signal?.reason)
        },
        { once: true },
      ),
    )
  }
  const model = scriptedModel()
  await assert.rejects(consume({ signal: controller.signal }, model), /Cancelled during search/)
  assert.equal(toolAborted, true)
  assert.equal(model.doStreamCalls.length, 0)
})

test('cancellation of final JSON streaming resets the caller state', async () => {
  isolate()
  process.env.PRODUCT_SEARCH_ENABLED = 'false'
  const controller = new AbortController()
  let reset = false
  const model = scriptedModel()
  model.doStream = async ({ abortSignal }) => {
    assert.equal(abortSignal?.aborted, false)
    return {
      stream: new ReadableStream({
        start(stream) {
          queueMicrotask(() => {
            controller.abort(new DOMException('Disconnected during JSON', 'AbortError'))
            stream.close()
          })
        },
      }),
    }
  }
  const stream = await streamPersonalityAnalysis({
    ...inputs,
    model,
    signal: controller.signal,
    onError: async () => {
      reset = true
    },
  })
  await stream.toTextStreamResponse().text()
  assert.equal(reset, true)
})

test('research timeout cancels discovery and continues with an estimated-price instruction', async (t) => {
  isolate()
  t.mock.timers.enable({ apis: ['setTimeout'] })
  let observedSignal: AbortSignal | null | undefined
  globalThis.fetch = async (_url, init) => {
    observedSignal = init?.signal
    queueMicrotask(() => t.mock.timers.tick(20_000))
    return new Promise((_resolve, reject) => init?.signal?.addEventListener('abort', () => reject(init.signal?.reason), { once: true }))
  }
  const model = scriptedModel()
  const stream = await streamPersonalityAnalysis({ ...inputs, model })
  assert.equal(observedSignal?.aborted, true)
  t.mock.timers.reset()
  await stream.toTextStreamResponse().text()
  assert.ok(JSON.stringify(model.doStreamCalls[0].prompt).includes('Live product pricing is unavailable'))
})
