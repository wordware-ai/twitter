export async function POST(request: Request) {
  const { transcript } = await request.json()

  const runResponse = await fetch('https://app.wordware.ai/api/prompt/a80ab6d8-c7a3-4eee-aaab-10d89cfe53db/run', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.WORDWARE_API_KEY}`,
    },
    body: JSON.stringify({
      inputs: {
        transcript,
      },
    }),
  })

  const reader = runResponse.body?.getReader()
  if (!reader) return Response.json({ error: 'No reader' })

  const decoder = new TextDecoder()
  let buffer: string[] = []
  let finalOutput = false

  const stream = new ReadableStream({
    async start(controller) {
      try {
        while (true) {
          const { done, value } = await reader.read()

          if (done) {
            controller.close()
            return
          }

          const chunk = decoder.decode(value)
          console.log('🟣 | file: route.ts:39 | start | chunk:', chunk)

          for (let i = 0, len = chunk.length; i < len; ++i) {
            const isChunkSeparator = chunk[i] === '\n'

            if (!isChunkSeparator) {
              buffer.push(chunk[i])
              continue
            }

            const line = buffer.join('').trimEnd()

            const content = JSON.parse(line)
            const value = content.value

            if (value.type === 'generation') {
              if (value.state === 'start') {
                if (value.label === 'output') {
                  finalOutput = true
                }
                console.log('\nNEW GENERATION -', value.label)
              } else {
                if (value.label === 'output') {
                  finalOutput = false
                }
                console.log('\nEND GENERATION -', value.label)
              }
            } else if (value.type === 'chunk') {
              if (finalOutput) {
                controller.enqueue(value.value ?? '')
              }
            } else if (value.type === 'outputs') {
              console.log(value)
            }

            buffer = []
          }
        }
      } finally {
        reader.releaseLock()
      }
    },
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain' },
  })
}
