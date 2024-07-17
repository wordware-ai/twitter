'use client'

import React, { useState } from 'react'

import { scrapeTweets } from '@/actions/actions'

const ScrapeTweets = ({ username }: { username: string }) => {
  const [tweets, setTweets] = useState<any>('')
  const handleScrape = async () => {
    const tweets = await scrapeTweets({ username })
    setTweets(tweets)
  }
  return (
    <div>
      <pre>{JSON.stringify(tweets, null, 2)}</pre>
      <button onClick={handleScrape}>Scrape</button>
    </div>
  )
}

export default ScrapeTweets
