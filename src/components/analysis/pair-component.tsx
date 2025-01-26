'use client'

import { useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'

import { SelectPair, SelectUser } from '@/drizzle/schema'
import { useCompatibilityAnalysis } from '@/hooks/use-compatibility-analysis'
import { PAIRS_PAYWALL } from '@/lib/config'

import ActionButtons from './action-buttons'
import Compatibility from './compatibility'
import { CompatibilityPriceButton } from './compatibility-paywall-card'
import { ProgressIndicator, StepIndicator } from './progress-indicator'

const PairComponent = ({ users, pair }: { users: SelectUser[]; pair: SelectPair }) => {
  const [user1, user2] = users.sort()
  const searchParams = useSearchParams()
  const { steps, user1Steps, user1Result, user2Steps, user2Result, compatibilityResult, unlocked } = useCompatibilityAnalysis(user1, user2, pair)
  const paywallFlag = posthog.getFeatureFlag('paywall2') ?? searchParams.get('stripe')

  return (
    <div className="flex-center w-full flex-col gap-8">
      <div className="flex w-full max-w-lg flex-col items-center justify-center gap-2 md:flex-row md:gap-8">
        <div className="w-1/2">
          <ProgressIndicator
            compatibilityFinished={!!compatibilityResult}
            steps={user1Steps}
            result={user1Result}
            disableAnalysis={true}
            userUnlocked={!PAIRS_PAYWALL || pair.unlocked || false}
          />
        </div>
        <div className="w-1/2">
          <ProgressIndicator
            compatibilityFinished={!!compatibilityResult}
            steps={user2Steps}
            result={user2Result}
            disableAnalysis={true}
            userUnlocked={!PAIRS_PAYWALL || pair.unlocked || false}
          />
        </div>
      </div>
      {!steps.compatibilityAnalysisCompleted && (
        <StepIndicator
          started={steps.compatibilityAnalysisStarted}
          completed={steps.compatibilityAnalysisCompleted}
          premium={!unlocked}
          text="Compatibility Analysis"
        />
      )}
      {!unlocked && !pair.analysis && <CompatibilityPriceButton price={paywallFlag as string} />}
      <ActionButtons
        shareActive={!!compatibilityResult?.about}
        text={`this is my and ${user2.username}'s Compatibility analysis by AI Agent, built on @wordware`}
        url={`https://twitter.wordware.ai/${user1.username}/${user2.username}`}
      />
      <Compatibility
        names={[user1.name || user1.username, user2.name || user2.username]}
        pairAnalysis={compatibilityResult}
        unlocked={unlocked}
      />
      {/* <pre className="max-w-lg whitespace-pre-wrap">{JSON.stringify(compatibilityResult, null, 2)}</pre> */}
    </div>
  )
}

export default PairComponent
