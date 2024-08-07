'use client'

import { SelectUser } from '@/drizzle/schema'
import { useCompatibilityAnalysis } from '@/hooks/compatibility-analysis'

import { ProgressIndicator } from '../_components/progress-indicator'

const PairComponent = ({ users }: { users: SelectUser[] }) => {
  const [user1, user2] = users.sort()
  const { steps, user1Steps, user1Result, user2Steps, user2Result, compatibilityResult } = useCompatibilityAnalysis(user1, user2)

  return (
    <div className="flex-center test-red w-full flex-col gap-8">
      <div className="flex-center test-red w-full gap-8">
        <div className="test-blue w-1/2">
          <ProgressIndicator
            steps={user1Steps}
            result={user1Result}
            disableAnalysis={true}
            userUnlocked={user1.unlocked || false}
          />
        </div>
        <div className="test-green w-1/2">
          <ProgressIndicator
            steps={user2Steps}
            result={user2Result}
            userUnlocked={user2.unlocked || false}
          />
        </div>
      </div>
      <pre>{JSON.stringify(steps, null, 2)}</pre>
      <pre>{JSON.stringify(compatibilityResult, null, 2)}</pre>
    </div>
  )
}

export default PairComponent
