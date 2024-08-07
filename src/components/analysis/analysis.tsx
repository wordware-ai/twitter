'use client'

import React from 'react'

import { Markdown } from '@/components/markdown'

import { cardData } from '../../lib/wordware-config'
import AnalysisCard from './analysis-card'
import { PaywallCard } from './paywall-card'
import { WordwareCard } from './wordware-card'

export type TwitterAnalysis = {
  [key: string]: string | { title: string; subtitle: string }[] | string[] | undefined
  about?: string
  roast?: string
  strengths?: { title: string; subtitle: string }[]
  weaknesses?: { title: string; subtitle: string }[]
  loveLife?: string
  money?: string
  health?: string
  biggestGoal?: string
  colleaguePerspective?: string
  pickupLines?: string[]
  famousPersonComparison?: string
  previousLife?: string
  animal?: string
  fiftyDollarThing?: string
  career?: string
  lifeSuggestion?: string
  emojis?: string
}

type AnalysisProps = {
  unlocked: boolean
  userData: TwitterAnalysis | undefined
}

const Analysis: React.FC<AnalysisProps> = ({ unlocked, userData }) => {
  // const streamingStarted = !!userData?.about

  return (
    <div className="w-full max-w-6xl">
      <div className="text-center text-4xl tracking-widest">{userData?.emojis}</div>
      <div className="mb-16 mt-6 text-center">
        <div className="flex-center w-full">
          <div className="w-full max-w-xl text-lg font-light">
            <Markdown content={userData?.about || ''} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        {cardData.map((card, index) => (
          <React.Fragment key={card.contentKey}>
            {!unlocked && index === 1 && <PaywallCard />}
            {index === 1 && <WordwareCard />}
            {index === 7 && <WordwareCard />}
            <AnalysisCard
              {...card}
              content={userData?.[card.contentKey] || ''}
              unlocked={unlocked}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export { Analysis }
