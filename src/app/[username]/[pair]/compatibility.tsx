'use client'

import React from 'react'

import { WordwareCard } from '@/app/[username]/wordware-card'
import { Markdown } from '@/components/markdown'

import AnalysisCard from '../analysis-card'

export type CompatibilityAnalysis = {
  [key: string]: string | { title: string; subtitle: string }[] | string[] | undefined
  personOnePersonality: string
  personTwoPersonality: string
  personalityTypeMatch: string
  characteristics: string
  threat: string
  crazy: string
  dynamic: string
  financialCompatibility: string
  emotionalCompatibility: string
  communicationstyleCompatibility: string
  disagreements: string
  goalsAligment: string
  freeTime: string
  breakupPercentage: string
  makingMillionsWithIdea: string
  bestIdeaToWork: string
  yc: string
  marriage: string
  divorce: string
  overallCompability: string
}

type CompatibilityProps = {
  unlocked: boolean
  userData: CompatibilityAnalysis | undefined
}

const Compatibility: React.FC<CompatibilityProps> = ({ unlocked, userData }) => {
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
            {/* {streamingStarted && !unlocked && index === 1 && <PaywallCard />} */}
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

export default Compatibility
