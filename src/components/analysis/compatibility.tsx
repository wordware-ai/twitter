'use client'

import React from 'react'

import { Markdown } from '@/components/markdown'

import { compatibilityConfig } from '../../lib/wordware-config'
import AnalysisCard from './analysis-card'
import { WordwareCard } from './wordware-card'

export type CompatibilityAnalysis = {
  [key: string]: string | { title: string; subtitle: string }[] | string[] | undefined
  emojis: string
  about: string
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
  pairData: CompatibilityAnalysis | undefined
}

const Compatibility: React.FC<CompatibilityProps> = ({ unlocked, pairData }) => {
  // const streamingStarted = !!userData?.about

  return (
    <div className="w-full max-w-6xl">
      <div className="text-center text-4xl tracking-widest">{pairData?.emojis}</div>
      <div className="mb-16 mt-6 text-center">
        <div className="flex-center w-full">
          <div className="w-full max-w-xl text-lg font-light">
            <Markdown content={pairData?.about || ''} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        {compatibilityConfig.map((card, index) => (
          <React.Fragment key={card.contentKey}>
            {/* {streamingStarted && !unlocked && index === 1 && <PaywallCard />} */}
            {index === 1 && <WordwareCard />}
            {index === 7 && <WordwareCard />}
            <AnalysisCard
              {...card}
              content={pairData?.[card.contentKey] || ''}
              unlocked={unlocked}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export default Compatibility
