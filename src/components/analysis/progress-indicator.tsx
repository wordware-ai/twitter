import { PiCheckCircle, PiCircle, PiSpinner } from 'react-icons/pi'

import { Steps } from '@/hooks/twitter-analysis'
import { cn } from '@/lib/utils'

import { TwitterAnalysis } from './analysis'

export const ProgressIndicator = ({
  steps,
  result,
  userUnlocked,
  disableAnalysis = false,
}: {
  steps: Steps
  result: TwitterAnalysis | undefined
  userUnlocked: boolean
  disableAnalysis?: boolean
}) => {
  const showProgressIndicator = disableAnalysis
    ? !steps.tweetScrapeCompleted
    : !steps.wordwareCompleted || (!result?.loveLife && userUnlocked && !steps.paidWordwareCompleted)

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
        text="Reading your Tweets"
      />

      {!disableAnalysis && (
        <>
          {/* Wordware analysis step */}
          <StepIndicator
            started={steps.wordwareStarted}
            completed={steps.wordwareCompleted}
            text="Creating your Personality"
          />

          {!result?.loveLife && userUnlocked && (
            <StepIndicator
              started={steps.paidWordwareStarted}
              completed={steps.paidWordwareCompleted}
              text="Extending your Personality"
            />
          )}
        </>
      )}
    </div>
  )
}

export const StepIndicator = ({ started, completed, text }: { started?: boolean; completed?: boolean; text: string }) => {
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
        <PiCircle
          className="text-gray-500"
          size={24}
        />
      )}
      <div>{text}</div>
    </div>
  )
}
