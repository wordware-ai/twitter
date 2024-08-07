'use client'

import { useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'

import { PriceButton } from '@/components/analysis/paywall-card'
import { SelectUser } from '@/drizzle/schema'
import { useTwitterAnalysis } from '@/hooks/twitter-analysis'
import { analysisPlaceholder } from '@/lib/constants'

import NewPairForm from '../new-pair-form'
import ActionButtons from './action-buttons'
import { Analysis, TwitterAnalysis } from './analysis'
import { ProgressIndicator, StepIndicator } from './progress-indicator'

const ResultComponent = ({ user }: { user: SelectUser }) => {
  const { steps, result } = useTwitterAnalysis(user)
  const searchParams = useSearchParams()

  const paywallFlag = posthog.getFeatureFlag('paywall2') ?? searchParams.get('stripe')

  const prepareUserData = useCallback((result: TwitterAnalysis | undefined, unlocked: boolean): TwitterAnalysis | undefined => {
    if (!result) return undefined
    if (!result.roast) return result

    if (unlocked) return result

    // Merge placeholders with the result if not unlocked
    return {
      ...result,
      ...analysisPlaceholder,
      strengths: analysisPlaceholder.strengths,
      weaknesses: analysisPlaceholder.weaknesses,
      pickupLines: analysisPlaceholder.pickupLines,
    }
  }, [])

  return (
    <div className="flex-center flex-col gap-8">
      <ProgressIndicator
        steps={steps}
        result={result}
        userUnlocked={user.unlocked || false}
      />
      {!user.unlocked && (
        <PriceButton
          username={user.username}
          price={paywallFlag as string}
        />
      )}
      <ActionButtons
        shareActive={!!result?.about}
        text={`this is my Twitter Personality analysis by AI Agent, built on @wordware_ai`}
        url={`https://twitter.wordware.ai/${user.username}`}
      />

      {searchParams.get('password') === process.env.NEXT_PUBLIC_PAIR_PASSWORD && (
        <div className="flex-center w-full flex-col gap-4">
          <div className="text-center text-lg font-light">Add new user to find if you are compatible souls</div>
          <NewPairForm />
        </div>
      )}

      <Analysis
        unlocked={user.unlocked || false}
        userData={prepareUserData(result, user.unlocked || false)}
      />
      {!result?.loveLife && user.unlocked && (
        <StepIndicator
          started={steps.paidWordwareStarted}
          completed={steps.paidWordwareCompleted}
          text="Extending your Personality"
        />
      )}
    </div>
  )
}

export default ResultComponent
