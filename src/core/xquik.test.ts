import assert from 'node:assert/strict'
import { afterEach, describe, it } from 'node:test'

import { fetchProfileXquik, fetchTweetsXquik, isXquikConfigured } from './xquik'

const originalFetch = globalThis.fetch

afterEach(() => {
  delete process.env.XQUIK_API_KEY
  globalThis.fetch = originalFetch
})

describe('Xquik data source', () => {
  it('sends the current contract and maps original posts', async () => {
    process.env.XQUIK_API_KEY = '  xq_test_key  '
    let request: { input: RequestInfo | URL; init?: RequestInit } | undefined

    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      request = { input, init }
      return new Response(
        JSON.stringify({
          tweets: [
            {
              author: { username: 'example_user' },
              createdAt: '2026-07-29T10:00:00Z',
              entities: {
                urls: [{ url: 'https://t.co/link', expanded_url: 'https://example.com/article' }],
              },
              likeCount: 4,
              quoteCount: 1,
              replyCount: 2,
              retweetCount: 3,
              text: 'Read https://t.co/link',
              viewCount: 5,
            },
            {
              isReply: true,
              text: 'Filtered reply',
            },
            {
              retweeted_tweet: { id: '1' },
              text: 'Filtered repost',
            },
          ],
        }),
      )
    }) as typeof fetch

    const tweets = await fetchTweetsXquik({ username: '@example_user' })

    assert.deepEqual(tweets, [
      {
        isRetweet: false,
        author: { userName: 'example_user' },
        createdAt: '2026-07-29T10:00:00Z',
        text: 'Read https://example.com/article',
        retweetCount: 3,
        replyCount: 2,
        likeCount: 4,
        quoteCount: 1,
        viewCount: 5,
      },
    ])
    assert.ok(request)

    const url = new URL(String(request.input))
    assert.equal(url.pathname, '/api/v1/x/tweets/search')
    assert.equal(url.searchParams.get('q'), 'from:example_user')
    assert.equal(url.searchParams.get('fromUser'), 'example_user')
    assert.equal(url.searchParams.get('replies'), 'exclude')
    assert.equal(url.searchParams.get('retweets'), 'exclude')
    assert.equal(url.searchParams.get('limit'), '20')
    assert.equal(url.searchParams.get('queryType'), 'Latest')

    const headers = new Headers(request.init?.headers)
    assert.equal(headers.get('x-api-key'), 'xq_test_key')
    assert.equal(headers.get('xquik-api-contract'), '2026-04-29')
    assert.equal(request.init?.cache, 'no-store')
  })

  it('maps profiles into the cached application shape', async () => {
    process.env.XQUIK_API_KEY = 'xq_test_key'
    globalThis.fetch = (async () =>
      new Response(
        JSON.stringify({
          id: '123',
          username: 'example_user',
          name: 'Example User',
          profilePicture: 'https://images.example/avatar_normal.jpg',
          description: 'Builder',
          location: 'Internet',
          followers: 42,
        }),
      )) as typeof fetch

    const result = await fetchProfileXquik({ username: 'example_user' })

    assert.equal(result.error, null)
    assert.deepEqual(result.data, {
      username: 'example_user',
      url: 'https://x.com/example_user',
      name: 'Example User',
      profilePicture: 'https://images.example/avatar_400x400.jpg',
      description: 'Builder',
      location: 'Internet',
      fullProfile: {
        twitterUserID: '123',
        id: '123',
        username: 'example_user',
        name: 'Example User',
        profilePicture: 'https://images.example/avatar_normal.jpg',
        description: 'Builder',
        location: 'Internet',
        followers: 42,
      },
      followers: 42,
    })
  })

  it('skips malformed handles before calling the API', async () => {
    process.env.XQUIK_API_KEY = 'xq_test_key'
    let fetchCalled = false
    globalThis.fetch = (async () => {
      fetchCalled = true
      return new Response()
    }) as typeof fetch

    await assert.rejects(fetchTweetsXquik({ username: 'user -filter:replies' }), /Invalid X username/)
    assert.equal(fetchCalled, false)
    assert.equal(isXquikConfigured(), true)
  })
})
