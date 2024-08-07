import { useEffect, useState } from 'react'

import { SelectUser } from '@/drizzle/schema'
import { Steps, useTwitterAnalysis } from '@/hooks/twitter-analysis'

export type CompatibilitySteps = {
  user1Steps: Steps
  user2Steps: Steps
  compatibilityAnalysisStarted: boolean
  compatibilityAnalysisCompleted: boolean
}

export const useCompatibilityAnalysis = (user1: SelectUser, user2: SelectUser) => {
  const { steps: user1Steps, result: user1Result } = useTwitterAnalysis(user1, true)
  const { steps: user2Steps, result: user2Result } = useTwitterAnalysis(user2, true)
  const [compatibilityResult, setCompatibilityResult] = useState<any>(null)
  const [steps, setSteps] = useState<CompatibilitySteps>({
    user1Steps,
    user2Steps,
    compatibilityAnalysisStarted: false,
    compatibilityAnalysisCompleted: false,
  })

  useEffect(() => {
    if (user1Steps.wordwareCompleted && user2Steps.wordwareCompleted && !steps.compatibilityAnalysisStarted) {
      setSteps((prev) => ({ ...prev, compatibilityAnalysisStarted: true }))
      // Here you would call your compatibility analysis API
      // For now, we'll just simulate it with a timeout
      setTimeout(() => {
        setCompatibilityResult({
          foo: 'bar',
        })
        setSteps((prev) => ({ ...prev, compatibilityAnalysisCompleted: true }))
      }, 3000)
    }
  }, [user1Steps, user2Steps, steps.compatibilityAnalysisStarted])

  return { steps, user1Steps, user1Result, user2Steps, user2Result, compatibilityResult }
}
