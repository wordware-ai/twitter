'use client'

import { SelectPair, SelectUser } from '@/drizzle/schema'
import { useCompatibilityAnalysis } from '@/hooks/compatibility-analysis'

import ActionButtons from './action-buttons'
import Compatibility from './compatibility'
import { ProgressIndicator, StepIndicator } from './progress-indicator'

const PairComponent = ({ users, pair }: { users: SelectUser[]; pair: SelectPair }) => {
  const [user1, user2] = users.sort()
  const { steps, user1Steps, user1Result, user2Steps, user2Result, compatibilityResult } = useCompatibilityAnalysis(user1, user2, pair)

  return (
    <div className="flex-center w-full flex-col gap-8">
      <div className="flex-center w-full gap-8">
        <div className="w-1/2">
          <ProgressIndicator
            steps={user1Steps}
            result={user1Result}
            disableAnalysis={true}
            userUnlocked={user1.unlocked || false}
          />
        </div>
        <div className="w-1/2">
          <ProgressIndicator
            steps={user2Steps}
            result={user2Result}
            disableAnalysis={true}
            userUnlocked={user2.unlocked || false}
          />
        </div>
      </div>
      <StepIndicator
        started={steps.compatibilityAnalysisStarted}
        completed={steps.compatibilityAnalysisCompleted}
        text="Compatibility Analysis"
      />
      <ActionButtons
        shareActive={!!compatibilityResult?.about}
        text={`this is my and ${user2.username}'s Compatibility analysis by AI Agent, built on @wordware_ai`}
        url={`https://twitter.wordware.ai/${user1.username}/${user2.username}`}
      />
      <Compatibility
        pairAnalysis={compatibilityResult}
        unlocked={false}
      />
      <pre className="max-w-lg whitespace-pre-wrap">{JSON.stringify(compatibilityResult, null, 2)}</pre>
    </div>
  )
}

export default PairComponent
