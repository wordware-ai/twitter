'use client'

import { SelectUser } from '@/drizzle/schema'
import { useCompatibilityAnalysis } from '@/hooks/compatibility-analysis'

import { ProgressIndicator, StepIndicator } from './progress-indicator'

const PairComponent = ({ users }: { users: SelectUser[] }) => {
  const [user1, user2] = users.sort()
  const { steps, user1Steps, user1Result, user2Steps, user2Result, compatibilityResult } = useCompatibilityAnalysis(user1, user2)

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
      <pre>{JSON.stringify(steps, null, 2)}</pre>
      <pre>{JSON.stringify(compatibilityResult, null, 2)}</pre>
    </div>
  )
}

export default PairComponent
