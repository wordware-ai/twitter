import { getUser, updateUser } from '@/actions/actions'

export async function POST(request: Request) {
  const { tweets, profilePicture, profileInfo, username } = await request.json()
  const user = await getUser({ username })
  if (user.wordwareStarted) {
    return Response.json({ error: 'Wordware already started' })
  }
  await updateUser({
    user: {
      ...user,
      wordwareStarted: true,
    },
  })

  const runResponse = await fetch('https://app.wordware.ai/api/released-app/aa3d8ee8-2042-4237-8e9f-d497844b6d91/run', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.WORDWARE_API_KEY}`,
    },
    body: JSON.stringify({
      inputs: {
        tweets,
        profilePicture,
        profileInfo,
        version: '^1.4',
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
              console.log('✨ here:')
              console.log(value.values.output)
              try {
                console.log('parsing:')
                const parsedOutput = JSON.parse(value.values.output)
                console.log('🟣 | file: route.ts:87 | start | parsedOutput:', parsedOutput)
                await updateUser({
                  user: {
                    ...user,
                    wordwareStarted: true,
                    wordwareCompleted: true,
                    analysis: parsedOutput,
                  },
                })
                console.log('Analysis saved to database')
              } catch (error) {
                console.error('Error parsing or saving output:', error)
              }
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
