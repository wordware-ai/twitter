import { useEffect, useRef, useState } from 'react'

import { processScrapedUser } from '@/actions/actions'
import { TwitterAnalysis } from '@/app/[username]/_components/analysis'
import { SelectUser } from '@/drizzle/schema'
import { parsePartialJson } from '@/lib/parse-partial-json'

export type Steps = {
  profileScraped: boolean
  tweetScrapeStarted: boolean
  tweetScrapeCompleted: boolean
  wordwareStarted: boolean
  wordwareCompleted: boolean
  paidWordwareStarted: boolean
  paidWordwareCompleted: boolean
}

/**
 * Custom hook for analyzing Twitter user data.
 *
 * @param {SelectUser} user - The user object containing Twitter profile information.
 * @param {boolean} [disableAnalysis=false] - Flag to disable the analysis process.
 * @returns {Object} An object containing the analysis steps and results.
 */
export const useTwitterAnalysis = (user: SelectUser, disableAnalysis: boolean = false) => {
  const [steps, setSteps] = useState<Steps>(initializeSteps(user))
  const [result, setResult] = useState<TwitterAnalysis | undefined>((user.analysis as TwitterAnalysis) || undefined)
  const effectRan = useRef(false)

  useEffect(() => {
    if (effectRan.current) return
    effectRan.current = true

    const runAnalysis = async () => {
      let tweetScrapeCompleted = user.tweetScrapeCompleted

      if (shouldRunTweetScrape(user)) {
        tweetScrapeCompleted = await runTweetScrape(user, setSteps)
      }

      if (disableAnalysis) return
      if (shouldRunWordwareAnalysis(user, tweetScrapeCompleted || false)) {
        await runWordwareAnalysis(user, setSteps)
      }

      if (shouldRunPaidWordwareAnalysis(user, result)) {
        await runPaidWordwareAnalysis(user, setSteps)
      }
    }

    runAnalysis()
  }, [])

  function initializeSteps(user: SelectUser): Steps {
    return {
      profileScraped: user.profileScraped || false,
      tweetScrapeStarted: user.tweetScrapeStarted || false,
      tweetScrapeCompleted: user.tweetScrapeCompleted || false,
      wordwareStarted: user.wordwareStarted || false,
      wordwareCompleted: user.wordwareCompleted || false,
      paidWordwareStarted: user.paidWordwareStarted || false,
      paidWordwareCompleted: user.paidWordwareCompleted || false,
    }
  }

  const handleTweetAnalysis = async (props: { username: string; full: boolean }) => {
    const response = await fetch('/api/wordware', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
        const existingAnalysis = user.analysis as TwitterAnalysis

        setResult({ ...existingAnalysis, ...parsed })
      }
    } catch (error) {
      console.error('Error reading stream', error)
    } finally {
      reader.releaseLock()
      return parsePartialJson(result)
    }
  }
  const shouldRunTweetScrape = (user: SelectUser): boolean => {
    return !user.tweetScrapeStarted || (!user.tweetScrapeCompleted && Date.now() - user.tweetScrapeStartedTime.getTime() > 1 * 60 * 1000)
  }

  const shouldRunWordwareAnalysis = (user: SelectUser, tweetScrapeCompleted: boolean): boolean => {
    return (
      (tweetScrapeCompleted && !user.wordwareStarted) ||
      (tweetScrapeCompleted && !user.wordwareCompleted && Date.now() - user.wordwareStartedTime.getTime() > 60 * 1000)
    )
  }

  const shouldRunPaidWordwareAnalysis = (user: SelectUser, result: TwitterAnalysis | undefined): boolean => {
    return (
      (!user.paidWordwareCompleted &&
        (!result || !result.loveLife) &&
        ((user.unlocked && !user.paidWordwareStarted) ||
          (user.unlocked && !user.paidWordwareCompleted && Date.now() - user.paidWordwareStartedTime.getTime() > 60 * 1000))) ||
      false
    )
  }

  const runTweetScrape = async (user: SelectUser, setSteps: React.Dispatch<React.SetStateAction<Steps>>): Promise<boolean> => {
    setSteps((prev) => ({ ...prev, tweetScrapeStarted: true }))
    try {
      await processScrapedUser({ username: user.username })
      setSteps((prev) => ({ ...prev, tweetScrapeCompleted: true }))
      return true
    } catch (error) {
      console.error('Error processing scraped user:', error)
      window.location.href = 'https://tally.so/r/3lRoOp'
      return false
    }
  }

  const runWordwareAnalysis = async (user: SelectUser, setSteps: React.Dispatch<React.SetStateAction<Steps>>) => {
    setSteps((prev) => ({ ...prev, wordwareStarted: true }))
    await handleTweetAnalysis({ username: user.username, full: false })
    setSteps((prev) => ({ ...prev, wordwareCompleted: true }))
  }

  const runPaidWordwareAnalysis = async (user: SelectUser, setSteps: React.Dispatch<React.SetStateAction<Steps>>) => {
    setSteps((prev) => ({ ...prev, paidWordwareStarted: true }))
    await handleTweetAnalysis({ username: user.username, full: true })
    setSteps((prev) => ({ ...prev, paidWordwareCompleted: true }))
  }

  return { steps, result }
}
