'use client'

import { useEffect, useRef, useState } from 'react'
import { PiCheckCircle, PiCircle, PiSpinner, PiXLogo } from 'react-icons/pi'

import { processScrapedUser } from '@/actions/actions'
import WordwareLogo from '@/components/logo'
import { Button } from '@/components/ui/button'
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
    let tweetScrapeCompleted = user.tweetScrapeCompleted
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
        tweetScrapeCompleted = true
      }
      if (tweetScrapeCompleted && !user.wordwareStarted) {
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
    <div className="flex-center flex-col gap-8">
      <div className="flex-center w-full max-w-[280px] flex-col gap-4">
        <div className="flex-center w-full gap-4">
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

          <div>Checking who you are</div>
        </div>
        <div className="flex-center w-full gap-4">
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

          <div>Reading your Tweets</div>
        </div>
        <div className="flex-center w-full gap-4">
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

          <div>Creating your Personality</div>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <h2 className="flex-center mt-6 gap-4 text-xl font-light">
          Your Twitter Personality, created with
          <a
            href="https://wordware.ai/"
            target="_blank">
            <WordwareLogo
              color="black"
              width={134}
            />
          </a>
        </h2>
        <div className="flex-center gap-4">
          <Button asChild>
            <a
              target="_blank"
              className="flex-center gap-2"
              href={`https://twitter.com/${user.username}`}>
              <PiXLogo /> Profile
            </a>
          </Button>
          {result?.about && (
            <Button asChild>
              <a
                target="_blank"
                className="flex-center gap-2"
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`AI says this is my Twitter Personality: 👀

${result?.about}

What's yours?

https://twitter.wordware.ai/${user.username}`)}`}>
                <PiXLogo /> Share
              </a>
            </Button>
          )}

          <Button asChild>
            <a
              className="flex-center gap-2"
              target="_blank"
              href="https://wordware.ai/">
              <WordwareLogo
                emblemOnly
                color="white"
                width={20}
              />
              Wordware
            </a>
          </Button>
        </div>
      </div>

      <Result userData={result} />
    </div>
  )
}

export default ResultComponent
