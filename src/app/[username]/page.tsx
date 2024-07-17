import React from 'react'

import { getUser, scrapeTweets } from '@/actions/actions'

const Page = async ({ params }: { params: { username: string } }) => {
  const data = await getUser({ username: params.username })

  if (!data) {
    return <div>User not found</div>
  }

  const tweets = await scrapeTweets({ username: params.username })

  return (
    <div>
      <pre className="whitespace-pre-wrap">data: {JSON.stringify(data, null, 2)}</pre>
      <div>
        <pre className="whitespace-pre-wrap">tweets: {JSON.stringify(tweets, null, 2)}</pre>
      </div>
    </div>
  )
}

export default Page
