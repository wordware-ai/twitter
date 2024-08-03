'use client'

import React from 'react'

import { WordwareCard } from '@/app/[username]/wordware-card'
import { Markdown } from '@/components/markdown'

import AnalysisCard from './analysis-card'
import { cardData } from './config'
import { PaywallCard } from './paywall-card'

// import { PHCard } from './ph-card'

export type TwitterAnalysis = {
  [key: string]: string | { title: string; subtitle: string }[] | string[] | undefined
  about?: string
  roast?: string
  strengths?: {
    title: string
    subtitle: string
  }[]
  weaknesses?: {
    title: string
    subtitle: string
  }[]
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

export default function Result({ unlocked, userData }: { unlocked: boolean; userData: TwitterAnalysis | undefined }) {
  const streamingStarted = !!userData?.about
  return (
    <div className="w-full max-w-6xl">
      {/* Display emojis representing the user */}
      <div className="text-center text-4xl tracking-widest">{userData?.emojis}</div>
      {/* Display the general description about the user */}
      <div className="mb-16 mt-6 text-center">
        <div className="flex-center w-full">
          <div className="w-full max-w-xl text-lg font-light">
            <Markdown content={userData?.about || ''} />
          </div>
        </div>
      </div>
      {/* Display analysis cards */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        {cardData.map((card, index) => {
          console.log('index', index, 'card')

          return (
            <React.Fragment key={index}>
              {streamingStarted && !unlocked && index === 1 && <PaywallCard />}
              {index === 1 && <WordwareCard />}
              {/* {index === 1 && <PHCard name={name} />} */}
              {index === 7 && <WordwareCard />}
              <AnalysisCard
                contentKey={card.contentKey}
                title={card.title}
                icon={card.icon}
                content={userData?.[card.contentKey] || ''}
                colorClass={card.colorClass}
                // color={card.color} // Commented out, might be used in future iterations
                wide={card.wide}
                bg={card.bg}
                unlocked={unlocked}
              />
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
