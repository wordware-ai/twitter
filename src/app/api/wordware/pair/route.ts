import { getPair, getUser, updatePair } from '@/drizzle/queries'

/**
 * Maximum duration for the API route execution (in seconds)
 */
export const maxDuration = 300
export const dynamic = 'force-dynamic'
export const runtime = 'edge'

type TweetType = {
  isRetweet: boolean
  author: { userName: string }
  createdAt: string
  text: string
  retweetCount: number
  replyCount: number
  likeCount: number
  quoteCount: number
  viewCount: number
}

export async function POST(request: Request) {
  // Extract username from the request body
  const { usernames } = await request.json()
  const timestamp = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  // Fetch user data and check if Wordware has already been started
  const user1 = await getUser({ username: usernames[0] })
  const user2 = await getUser({ username: usernames[1] })
  const pair = await getPair({ usernames })

  if (!user1 || !user2) {
    throw Error(`User not found: ${usernames[0]} or ${usernames[1]}`)
  }

  if (!pair) {
    throw Error(`Pair not found: ${usernames[0]} and ${usernames[1]}`)
  }

  if (pair.wordwareCompleted || (pair.wordwareStarted && Date.now() - pair.createdAt.getTime() < 3 * 60 * 1000)) {
    return Response.json({ error: 'Wordware already started' })
  }

  function formatTweet(tweet: TweetType) {
    // console.log('Formatting', tweet)
    const isRetweet = tweet.isRetweet ? 'RT ' : ''
    const author = tweet.author?.userName ?? ''
    const createdAt = tweet.createdAt
    const text = tweet.text
      .split('\n')
      .map((line) => `${line}`)
      .join(`\n> `)
    return `**${isRetweet}@${author} - ${createdAt}**

> ${text}

*retweets: ${tweet.retweetCount}, replies: ${tweet.replyCount}, likes: ${tweet.likeCount}, quotes: ${tweet.quoteCount}, views: ${tweet.viewCount}*`
  }

  // const timestamp = new Date().toLocaleTimeString('en-US', {
  //   hour: '2-digit',
  //   minute: '2-digit',
  //   second: '2-digit',
  //   hour12: false,
  // })

  const tweets1 = user1.tweets as TweetType[]
  const tweetsMarkdown1 = tweets1.map(formatTweet).join('\n---\n\n')

  const tweets2 = user2.tweets as TweetType[]
  const tweetsMarkdown2 = tweets2.map(formatTweet).join('\n---\n\n')

  // console.log('Tweeets 1', tweetsMarkdown1)
  // console.log('Tweeets 2', tweetsMarkdown2)

  // console.log('Profile 1', user1.fullProfile)
  // console.log('Profile 2', user2.fullProfile)

  const promptID = process.env.WORDWARE_PAIR_PROMPT_ID
  console.log('🟣 | file: route.ts:79 | POST | promptID:', promptID)

  if (!promptID) {
    throw Error(`No prompt id, please define WORDWARE_PAIR_PROMPT_ID environment variable`)
  }

  // Make a request to the Wordware API
  const runResponse = await fetch(`https://app.wordware.ai/api/released-app/${promptID}/run`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.WORDWARE_API_KEY}`,
    },
    body: JSON.stringify({
      inputs: {
        userOneProfile: JSON.stringify(user1.fullProfile),
        userOneTweets: `Tweets: ${tweetsMarkdown1}`,
        userTwoProfile: JSON.stringify(user2.fullProfile),
        userTwoTweets: `Tweets: ${tweetsMarkdown2}`,
      },
      version: '^1.10',
    }),
  })

  // console.log('🟣 | file: route.ts:40 | POST | runResponse:', runResponse)
  // Get the reader from the response body
  const reader = runResponse.body?.getReader()
  if (!reader || !runResponse.ok) {
    // console.error('No reader')
    console.log('🟣 | ERROR | file: route.ts:40 | POST | runResponse:', runResponse)
    return Response.json({ error: 'No reader' }, { status: 400 })
  }

  // Update user to indicate Wordware has started
  await updatePair({
    pair: {
      ...pair,
      wordwareStarted: true,
      wordwareStartedTime: new Date(),
    },
  })

  // Set up decoder and buffer for processing the stream
  const decoder = new TextDecoder()
  const encoder = new TextEncoder()
  let buffer: string[] = []
  let finalOutput = false

  // Create a readable stream to process the response
  const stream = new ReadableStream({
    async start(controller) {
      //Edge runtime requires to send a first chunk within the first 30 seconds. We send an empty string to keep the connection alive.
      controller.enqueue(encoder.encode(''))

      try {
        while (true) {
          const { done, value } = await reader.read()

          if (done) {
            controller.close()
            return
          }

          const chunk = decoder.decode(value)
          // console.log(`🟣 ${timestamp} | chunk:`, chunk)

          // Process the chunk character by character
          for (let i = 0, len = chunk.length; i < len; ++i) {
            const isChunkSeparator = chunk[i] === '\n'

            if (!isChunkSeparator) {
              buffer.push(chunk[i])
              continue
            }

            const line = buffer.join('').trimEnd()

            // Parse the JSON content of each line
            const content = JSON.parse(line)
            const value = content.value

            // Handle different types of messages in the stream
            if (value.type === 'generation') {
              if (value.state === 'start') {
                if (value.label === 'output') {
                  finalOutput = true
                }
                // console.log('\nNEW GENERATION -', value.label)
              } else {
                if (value.label === 'output') {
                  finalOutput = false
                }
                // console.log('\nEND GENERATION -', value.label)
              }
            } else if (value.type === 'chunk') {
              if (finalOutput) {
                console.log(`⏱️ ${timestamp}:`, value.value)
                controller.enqueue(encoder.encode(value.value ?? ''))
              }
            } else if (value.type === 'outputs') {
              console.log(`[${pair.user1lowercaseUsername}, ${pair.user2lowercaseUsername}] ✨ Wordware:`, value.values.output, '. Now parsing')
              try {
                // Update user with the analysis from Wordware
                await updatePair({
                  pair: {
                    ...pair,
                    wordwareStarted: true,
                    wordwareCompleted: true,
                    analysis: {
                      ...value.values.output,
                    },
                  },
                })
                // console.log('Analysis saved to database')
              } catch (error) {
                console.error('Error parsing or saving output:', error)

                await updatePair({
                  pair: {
                    ...pair,
                    wordwareStarted: false,
                    wordwareCompleted: false,
                  },
                })
              }
            }

            // Reset buffer for the next line
            buffer = []
          }
        }
      } finally {
        // Ensure the reader is released when done
        reader.releaseLock()
      }
    },
  })

  // Return the stream as the response
  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain' },
  })
}
