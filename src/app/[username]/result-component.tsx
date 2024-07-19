'use client'

import { useEffect, useRef, useState } from 'react'
import { PiCheckCircle, PiCircle, PiSpinner } from 'react-icons/pi'

import { processScrapedUser } from '@/actions/actions'
import { SelectUser } from '@/drizzle/schema'
import { parsePartialJson } from '@/lib/parse-partial-json'

import Result, { TwitterAnalysis } from './result'

type Steps = {
  profileScraped: boolean
  tweetScrapeStarted: boolean
  tweetScrapeCompleted: boolean
  wordwareStarted: boolean
  wordwareCompleted: boolean
}

const ResultComponent = ({ user }: { user: SelectUser }) => {
  const [steps, setSteps] = useState<Steps>({
    profileScraped: user.profileScraped || false,
    tweetScrapeStarted: user.tweetScrapeStarted || false,
    tweetScrapeCompleted: user.tweetScrapeCompleted || false,
    wordwareStarted: user.wordwareStarted || false,
    wordwareCompleted: user.wordwareCompleted || false,
  })

  const [result, setResult] = useState<TwitterAnalysis | undefined>((user.analysis as TwitterAnalysis) || undefined)
  const effectRan = useRef(false)

  useEffect(() => {
    if (effectRan.current) return
    effectRan.current = true
    ;(async () => {
      let tweets = user.tweets
      if (!user.tweetScrapeStarted) {
        setSteps((prev) => ({
          ...prev,
          tweetScrapeStarted: true,
        }))
        tweets = await processScrapedUser({ username: user.username })
        setSteps((prev) => ({
          ...prev,
          tweetScrapeCompleted: true,
        }))
      }
      if (!user.wordwareStarted) {
        setSteps((prev) => ({
          ...prev,
          wordwareStarted: true,
        }))
        await handleTweetAnalysis({
          tweets: JSON.stringify(user.tweets) || JSON.stringify(tweets),
          profilePicture: user.profilePicture || '',
          profileInfo: JSON.stringify(user.fullProfile),
          username: user.username,
        })
        setSteps((prev) => ({
          ...prev,
          wordwareCompleted: true,
        }))
      }
    })()
  }, [user])

  const handleTweetAnalysis = async (props: { tweets: string; profilePicture: string; profileInfo: string; username: string }) => {
    const response = await fetch('/api/wordware', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(props),
    })

    if (!response.body) {
      console.error('No response body')
      return
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let result = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        result += decoder.decode(value, { stream: true })

        const parsed = parsePartialJson(result) as TwitterAnalysis
        console.log(parsed)
        setResult(parsed)
      }
    } catch (error) {
      console.error('Error reading stream', error)
    } finally {
      reader.releaseLock()

      return parsePartialJson(result)
    }
  }

  return (
    <div>
      <div className="flex-center w-full gap-4">
        <div className="flex-center flex-col">
          <div>
            {steps.profileScraped ? (
              <PiCheckCircle
                className="text-green-500"
                size={24}
              />
            ) : (
              <PiCircle
                className="text-gray-500"
                size={24}
              />
            )}
          </div>
          <div>Profile </div>
        </div>
        <div className="flex-center flex-col">
          <div>
            {steps.tweetScrapeStarted ? (
              steps.tweetScrapeCompleted ? (
                <PiCheckCircle
                  className="text-green-500"
                  size={24}
                />
              ) : (
                <PiSpinner
                  className="animate-spin text-blue-500"
                  size={24}
                />
              )
            ) : (
              <PiCircle
                className="text-gray-500"
                size={24}
              />
            )}
          </div>
          <div>Tweets</div>
        </div>
        <div className="flex-center flex-col">
          <div>
            {steps.wordwareStarted ? (
              steps.wordwareCompleted ? (
                <PiCheckCircle
                  className="text-green-500"
                  size={24}
                />
              ) : (
                <PiSpinner
                  className="animate-spin text-blue-500"
                  size={24}
                />
              )
            ) : (
              <PiCircle
                className="text-gray-500"
                size={24}
              />
            )}
          </div>
          <div>Wordware</div>
        </div>
      </div>

      <Result userData={result} />
    </div>
  )
}

export default ResultComponent
