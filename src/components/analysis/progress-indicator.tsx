import { PiCheckCircle, PiCircle, PiLockKey, PiSpinner } from 'react-icons/pi'

import { PERSONALITY_PART1_PAYWALL } from '@/lib/config'
import { cn } from '@/lib/utils'
import { Steps, TwitterAnalysis } from '@/types'

export const ProgressIndicator = ({
  steps,
  result,
  userUnlocked,
  disableAnalysis = false,
  compatibilityFinished = true,
}: {
  compatibilityFinished?: boolean
  steps: Steps
  result: TwitterAnalysis | undefined
  userUnlocked: boolean
  disableAnalysis?: boolean
}) => {
  const showProgressIndicator =
    !compatibilityFinished ||
    (disableAnalysis ? !steps.tweetScrapeCompleted : !steps.wordwareCompleted || (!result?.loveLife && userUnlocked && !steps.paidWordwareCompleted))

  return (
    <div className={cn('w-full max-w-[280px] flex-col items-center justify-center gap-4', showProgressIndicator ? 'flex' : 'hidden')}>
      {/* Profile check step */}
      <StepIndicator
        started={true}
        completed={steps.profileScraped}
        text="Checking who you are"
      />

      {/* Tweet scraping step */}
      <StepIndicator
        started={steps.tweetScrapeStarted}
        completed={steps.tweetScrapeCompleted}
        premium={true}
        unlocked={PERSONALITY_PART1_PAYWALL ? userUnlocked : true}
        text="Reading your Tweets"
      />

      {!disableAnalysis && (
        <>
          {/* Wordware analysis step */}
          <StepIndicator
            started={steps.wordwareStarted}
            completed={steps.wordwareCompleted}
            premium={true}
            unlocked={PERSONALITY_PART1_PAYWALL ? userUnlocked : true}
            text="Creating your Personality"
          />

          {!result?.loveLife && userUnlocked && (
            <StepIndicator
              started={steps.paidWordwareStarted}
              completed={steps.paidWordwareCompleted}
              premium={true}
              unlocked={userUnlocked}
              text="Extending your Personality"
            />
          )}
        </>
      )}
    </div>
  )
}

export const StepIndicator = ({
  started,
  completed,
  text,
  premium = false,
  unlocked = false,
}: {
  started?: boolean
  completed?: boolean
  text: string
  premium?: boolean
  unlocked?: boolean
}) => {
  return (
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
        <>
          {premium ? (
            !unlocked ? (
              <PiLockKey
                className="text-gray-500"
                size={24}
              />
            ) : (
              <PiCircle
                className="text-gray-500"
                size={24}
              />
            )
          ) : (
            <PiCircle
              className="text-gray-500"
              size={24}
            />
          )}
        </>
      )}
      <div>{text}</div>
    </div>
  )
}
