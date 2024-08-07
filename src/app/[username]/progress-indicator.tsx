import { PiCheckCircle, PiCircle, PiSpinner } from 'react-icons/pi'

import { cn } from '@/lib/utils'

import { TwitterAnalysis } from './analysis'
import { Steps } from './result-component'

export const ProgressIndicator = ({ steps, result, userUnlocked }: { steps: Steps; result: TwitterAnalysis | undefined; userUnlocked: boolean }) => {
  return (
    <div
      className={cn(
        'w-full max-w-[280px] flex-col items-center justify-center gap-4',
        steps.wordwareCompleted ? (!result?.loveLife && userUnlocked ? (steps.paidWordwareCompleted ? 'hidden' : 'flex') : 'hidden') : 'flex',
      )}>
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
