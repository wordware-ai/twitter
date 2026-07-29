import assert from 'node:assert/strict'
import { afterEach, describe, it } from 'node:test'

import { fetchTweets, fetchTweetsByUsername, fetchUserDataBySocialData } from './social-data'

const originalFetch = globalThis.fetch

afterEach(() => {
  globalThis.fetch = originalFetch
})

describe('SocialData request URLs', () => {
  it('keeps user input inside its intended path or query value', async () => {
    const requestedUrls: string[] = []
    globalThis.fetch = (async (input: RequestInfo | URL) => {
      const url = String(input)
      requestedUrls.push(url)

      if (new URL(url).pathname.endsWith('/tweets-and-replies') || new URL(url).pathname.endsWith('/search')) {
        return new Response(JSON.stringify({ tweets: [] }))
      }

      return new Response(
        JSON.stringify({
          id_str: '123',
          screen_name: 'example_user',
          url: 'https://x.com/example_user',
          name: 'Example User',
          profile_image_url_https: 'https://images.example/avatar.jpg',
          description: '',
          location: '',
          followers_count: 1,
        }),
      )
    }) as typeof fetch

    await fetchTweets('user/value?admin=true')
    await fetchTweetsByUsername('alice&type=Top')
    await fetchUserDataBySocialData({ username: 'profile/name?admin=true' })

    assert.equal(new URL(requestedUrls[0]).pathname, '/twitter/user/user%2Fvalue%3Fadmin%3Dtrue/tweets-and-replies')

    const searchUrl = new URL(requestedUrls[1])
    assert.equal(searchUrl.searchParams.get('query'), 'from:alice&type=Top -filter:replies')
    assert.equal(searchUrl.searchParams.get('type'), 'Latest')
    assert.equal([...searchUrl.searchParams].length, 2)

    assert.equal(new URL(requestedUrls[2]).pathname, '/twitter/user/profile%2Fname%3Fadmin%3Dtrue')
  })
})
