'use client'

import React, { useEffect, useState } from 'react'
import { PiCheckCircle, PiCircle, PiSpinner, PiXLogo } from 'react-icons/pi'

import { processScrapedUser } from '@/actions/actions'
import WordwareLogo from '@/components/logo'
import PHButton from '@/components/ph-button'
import { Button } from '@/components/ui/button'
import { SelectUser } from '@/drizzle/schema'
import { parsePartialJson } from '@/lib/parse-partial-json'
import { cn } from '@/lib/utils'

import Result, { TwitterAnalysis } from './result'

const MINUTE = 60 * 1000

const ResultComponent = ({ user }: { user: SelectUser }) => {
  const [steps, setSteps] = useState({
    profileScraped: user.profileScraped || false,
    tweetScrapeStarted: user.tweetScrapeStarted || false,
    tweetScrapeCompleted: user.tweetScrapeCompleted || false,
    wordwareStarted: user.wordwareStarted || false,
    wordwareCompleted: user.wordwareCompleted || false,
    paidWordwareStarted: user.paidWordwareStarted || false,
    paidWordwareCompleted: user.paidWordwareCompleted || false,
  })

  const [result, setResult] = useState<TwitterAnalysis | undefined>(user.analysis as TwitterAnalysis)

  useEffect(() => {
    let tweetScrapeCompleted = user.tweetScrapeCompleted
    const runAnalysis = async () => {
      if (shouldStartTweetScrape()) {
        await startTweetScrape()
        tweetScrapeCompleted = true
      }

      if (shouldStartWordwareAnalysis(tweetScrapeCompleted)) {
        await startWordwareAnalysis(false)
      }

      if (shouldStartPaidWordwareAnalysis()) {
        await startWordwareAnalysis(true)
      }
    }

    runAnalysis()
  }, [user])

  const shouldStartTweetScrape = () => {
    return !user.tweetScrapeStarted || (!user.tweetScrapeCompleted && Date.now() - user.tweetScrapeStartedTime.getTime() > MINUTE)
  }

  const shouldStartWordwareAnalysis = (tweetScrapeCompleted: boolean | null) => {
    return (
      (tweetScrapeCompleted && !user.wordwareStarted) ||
      (tweetScrapeCompleted && !user.wordwareCompleted && Date.now() - user.wordwareStartedTime.getTime() > MINUTE)
    )
  }

  const shouldStartPaidWordwareAnalysis = () => {
    return (
      !user.paidWordwareCompleted &&
      (!result || !result.loveLife) &&
      ((user.unlocked && !user.paidWordwareStarted) ||
        (user.unlocked && !user.paidWordwareCompleted && Date.now() - user.paidWordwareStartedTime.getTime() > MINUTE))
    )
  }

  const startTweetScrape = async () => {
    setSteps((prev) => ({ ...prev, tweetScrapeStarted: true }))
    try {
      await processScrapedUser({ username: user.username })
      setSteps((prev) => ({ ...prev, tweetScrapeCompleted: true }))
    } catch (error) {
      console.error('Error processing scraped user:', error)
      window.location.href = 'https://tally.so/r/3lRoOp'
    }
  }

  const startWordwareAnalysis = async (isPaid: boolean) => {
    setSteps((prev) => ({ ...prev, ...(isPaid ? { paidWordwareStarted: true } : { wordwareStarted: true }) }))
    await handleTweetAnalysis({ username: user.username, full: isPaid })
    setSteps((prev) => ({ ...prev, ...(isPaid ? { paidWordwareCompleted: true } : { wordwareCompleted: true }) }))
  }

  const handleTweetAnalysis = async ({ username, full }: { username: string; full: boolean }) => {
    const response = await fetch('/api/wordware', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, full }),
    })

    if (!response.body) {
      console.error('No response body')
      return
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let resultText = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        resultText += decoder.decode(value, { stream: true })
        const parsed = parsePartialJson(resultText) as TwitterAnalysis
        const existingAnalysis = user.analysis as TwitterAnalysis
        setResult((prev) => ({ ...existingAnalysis, ...prev, ...parsed }))
      }
    } catch (error) {
      console.error('Error reading stream', error)
    } finally {
      reader.releaseLock()
    }
  }

  const prepareUserData = (result: TwitterAnalysis | undefined, unlocked: boolean): TwitterAnalysis | undefined => {
    if (!result || !result.roast) return result
    if (unlocked) return result
    return {
      ...result,
      ...placeholder,
      strengths: placeholder.strengths,
      weaknesses: placeholder.weaknesses,
      pickupLines: placeholder.pickupLines,
    }
  }

  const renderProgressStep = (started: boolean, completed: boolean, text: string) => (
    <div className="flex-center w-full gap-4">
      {started ? (
        completed ? (
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
      <div>{text}</div>
    </div>
  )

  return (
    <div className="flex-center flex-col gap-8">
      <div
        className={cn(
          'w-full max-w-[280px] flex-col items-center justify-center gap-4',
          steps.wordwareCompleted ? (!result?.loveLife && user.unlocked ? (steps.paidWordwareCompleted ? 'hidden' : 'flex') : 'hidden') : 'flex',
        )}>
        {renderProgressStep(steps.profileScraped, steps.profileScraped, 'Checking who you are')}
        {renderProgressStep(steps.tweetScrapeStarted, steps.tweetScrapeCompleted, 'Reading your Tweets')}
        {renderProgressStep(steps.wordwareStarted, steps.wordwareCompleted, 'Creating your Personality')}
        {!result?.loveLife && user.unlocked && renderProgressStep(steps.paidWordwareStarted, steps.paidWordwareCompleted, 'Extending your Personality')}
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex-center flex-wrap gap-4">
          <PHButton text="Support us!" />
          {result?.about && (
            <Button
              size={'sm'}
              asChild>
              <a
                target="_blank"
                className="flex-center gap-2"
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`this is my Twitter Personality analysis by AI Agent, built on @wordware_ai`)}&url=${encodeURIComponent(`https://twitter.wordware.ai/${user.username}`)}`}>
                <PiXLogo /> Share
              </a>
            </Button>
          )}
          <Button
            size={'sm'}
            asChild>
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

      <Result
        unlocked={user.unlocked || false}
        userData={prepareUserData(result, user.unlocked || false)}
      />

      {!result?.loveLife &&
        user.unlocked &&
        !steps.paidWordwareCompleted &&
        renderProgressStep(steps.paidWordwareStarted, steps.paidWordwareCompleted, 'Unlocking your Personality')}
    </div>
  )
}

export default ResultComponent

const placeholder = {
  money:
    '•••• •••••••••••••• •••••• ••• ••••••••••• •• •••••••••••• •• •••••••••• •••••••• ••• •••• ••• ••••••••• •••••••• ••• ••••• ••••••• • ••• •••••• •• •••••••• • ••••••••••••••••• •••• •••••••• •• •••• •••••• ••• ••••••••••• •• •••••••• •••••••••••• •••• •• ••• •• •••• •••••• ••••••••••••• •••• ••••••• •• •••••••• •••••• ••• ••• ••••• •••• •••••••',
  animal:
    '•••••••• •••• •• •••••••• ••••• •• •••••• ••••••••• ••••••••••• ••• ••••••• •• •••••••• •••••••• ••••• •••••••••••••• •• ••••••••• ••• ••••••• •••••• •• ••• •••• •••••••• •••• ••••• ••••• •••• •••• ••••• •• ••••• •••• ••••••••• ••••• •• ••••••••••• •••• •• •• •••••••• ••• •••••• ••• ••••••••••• •• •••• ••• ••••••••••• ••••• •••••• ••• ••••••• ••• •••••• ••• •••••••••• •• ••• •••••••••••• •••• ••••••••••',
  career:
    '•••••• ••• ••••• •••••• •••• ••• •••• •••• •• •• • ••••••••••••• ••••••••••• •••• •••• •••• •• ••••••••••• •• ••••••••••••• •••• •••••• ••••• •••••••• ••• ••••••• ••••••••••••• ••••• •• •••••••••• •• ••••••• •••• ••••••• ••••• ••••••••••• •••••• •••• ••••••• ••••• •• ••••••• ••••• ••••••• •••••••• •• •••••••••••••••• •••••••• •••••••••• •••••••• ••••••• •••• ••••••••••• •••••• ••• ••••••••••• ••••• • ••••••• ••••••• •••••••• ••••• ••••••••• ••• ••• ••••• •••• •••••• ••••••••••• •••• •••• •• ••••••••••• ••••••••••••',
  health:
    '•••• ••••••••• ••••••••• ••• •••• •• ••••••• ••• ••• ••••• ••••••• •••••• •••• •••••••• ••••••• ••••••••••• •••••••• •••••••••• ••••••• •••••••• ••• ••••••••• •••••• ••••••••••• •• •••••••• •••• ••••••••••• ••••••• ••••••• ••••••• •••• •• ••••••• ••• •••• •••••• ••••••••• ••••••••• • •••••• •••• •• • •••••• •••• •• ••• •••••••• ••••••••••••• •••••',
  loveLife:
    '••• ••••• ••••• ••• • ••••••••••• •••••••••• •••• ••••••• ••• •••••• •••• ••••• ••• ••••••••••• •••• ••• • ••••••• ••• ••••••••• •••• ••••• ••• •••••••• •••• •••••••••• • •••••••• •• ••••• •••• •••• •• • •••••••• •• ••••••• •••• ••••••• ••• ••••••••••• •••• ••••••••••••••• ••• •••• •••••• ••• •• •••••••• •••• ••••••• •••• •••••• •••• •••••• • ••••••••• ••• •••••••• ••••',
  strengths: [
    {
      title: '•••••••••• ••••••••',
      subtitle: '•••••••••• ••••••••• ••• ••••• •• •• ••• ••••••••••',
    },
    {
      title: '•••••••••••••• ••••••',
      subtitle: '•••••• •• •••••• ••• •••• ••••••••',
    },
    {
      title: '•••••••••• •••••••',
      subtitle: '•••••••• ••••••••••• •• ••• •••• •••••••••',
    },
    {
      title: '••••••••••••',
      subtitle: '••••• •• ••••••• ••• •••••••••••• ••• ••••••',
    },
    {
      title: '•••••• •••••••',
      subtitle: '•••••• •••••••• •• ••••• ••• •••••••',
    },
  ],
  weaknesses: [
    {
      title: '•••••••••••••',
      subtitle: '••• ••••••••••••• ••••••••• •• • ••••••• •••••••• •••••',
    },
    {
      title: '•••• ••••••• •••••••••',
      subtitle: '••••••••••• ••••••• •• ••••••• •••••• ••••••••••',
    },
    {
      title: '••••••••• ••••••••',
      subtitle: '•••••• ••••••••••• •••••• •••• •••••••• ••••',
    },
    {
      title: '•••••••• ••••••••',
      subtitle: '••• •••••••• •••• ••••••••••• •• ••••••••••• •••• •••••',
    },
    {
      title: '•••••••• •••••••••',
      subtitle: '••••••••••••• ••••••••• •• ••••••• •• ••••••••••',
    },
  ],
  biggestGoal:
    '•• ••••••••••••• ••• •• •••••••• •••• ••••••••••••• ••••••••••• •••• ••••••••••••• ••••••• ••••• •••• ••• •••• ••• ••••••••••• •• •••••• •••••••• •• ••••••••••',
  pickupLines: [
    '••• ••• • •••••• •••••••• ••••••• ••••••• ••• •• •••••• ••••••••••',
    '•• •••• •••• ••••••• ••••••• ••• ••••••• •••••••• • ••••••••••',
    '••• •••• •• • •••••••• ••••••• ••••••• •••••••• •••••••••••• •• •• ••••••',
  ],
  previousLife:
    '•• • •••••••• ••••• ••••• ••• •••••• •••••• •••••• •••• ••••• •• ••••••••••• •••••• ••• ••••••••••• • ••••••••• •••••••• •• ••••••••••• ••• • •••••••• •• •• ••••• •• ••••• ••••• •••• •• ••••• ••••••• •• •••••••• •••••• ••••••••••••• ••••• •••••••• • ••••• ••••••••••• •• ••• ••••• •••• ••••••• ••••• ••• •••• •••••••••• •• •••• ••••••••• • ••• •••• •••• •••••• •• ••••••••••• •••••',
  lifeSuggestion:
    '••••••• ••• ••• •• •••••••••• ••••••• ••• ••• •••• ••••• ••••• •••••••• •• ••••••• •••• ••••••• •• ••••••••• ••••••• ••••• •••••••••• •••• ••••••• •••• ••••••• •••••• ••• ••••••••••••• •••• •••• ••••••••• ••••••••••••• •••• •••••••• •••• ••••• •••• •••••••••••• •••••••• •••• •••• ••••• ••••••• •••••••• •• •••• •••••••••• ••• ••••••••• ••••••••••••',
  fiftyDollarThing:
    '• ••••••• ••••••••••• •••• ••••••••• ••••• •• •••• •••• •••••• ••• •• ••• •••••• •••• •• ••••• ••••••• ••••••••••••• ••••••••• • ••••••••••• ••••••••••••• •• •••• ••••••••• •••••• •• ••••• •••• •• •••••• •••• •••• ••• •••• •• •••••••• ••••••••••••••',
  colleaguePerspective:
    '•••••••• •••• ••••• •• •••• •••••• • ••••••••••••• • ••••••••••••• ••• ••••••••• •••••••••• ••• •••••••• •••••• •• ••••• ••• •• ••••••••• ••• •••• •••• ••••••• ••• •• ••••• •• ••••••• •••••• ••••• •••••• •••••• •••••••• ••• •••• ••• ••••• ••••• ••••• ••••• ••••••• •••••••• ••••• ••• •••• •• ••• ••••• •••••• •••• •• ••• •••• ••••• •• •••••• ••• •••• ••••• ••••• ••• •••••••••• ••••• ••• •• ••• •••••••• •••••',
  famousPersonComparison:
    '••• •••••• •••• •••• ••••• •••••••• ••• •••••• •• • •••••• ••••••••• •••• •••••••••••• •••••• •••••••• •• ••• •••• ••••• • ••••••••• ••••• ••• ••••••••••• • •••• •••••••• •• •••••••• •••••••••••• ••••••••••• ••• • •••••• •••••• •• ••• ••••••••••••• ••••• •• ••• •••• •••• •••• ••••••••• ••• ••••••••••• ••••• •• ••••••• •••••• •••••••• •••• • ••• •• •••••••• ••• •••••••••• ••••••••',
}
