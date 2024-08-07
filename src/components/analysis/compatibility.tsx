'use client'

import React from 'react'
import { PiQuestion } from 'react-icons/pi'

import { Markdown } from '@/components/markdown'

import { compatibilityConfig } from '../../lib/wordware-config'
import AnalysisCard from './analysis-card'
import { WordwareCard } from './wordware-card'

export type CompatibilityAnalysis = {
  [key: string]: string | string[] | { [key: string]: string[] } | undefined
  twitter_names: string[]
  emojis: string
  about: string
  personality_type_match: string
  characteristics: string[]
  romantic_green_flags: {
    person1: string[]
    person2: string[]
  }
  romantic_red_flags: {
    person1: string[]
    person2: string[]
  }
  romantic_songs: string[]
  romantinc_dealbreaker: string
  secret_desires: string
  drama: string
  humor: string
  threat: string
  crazy: string
  dominant: string
  dynamic: string
  financial_compatibility: string
  emotional_compatibility: string
  communication_style_compatibility: string
  disagreements: string
  tension: string
  goals_alingment: string
  free_time: string
  best_idea_to_work: string
  making_millions_with_idea: string
  yc: string
  marriage: string
  divorce: string
  friends_forever: string
  breakup_percentage: string
  personality_assesments: string[]
  overall_compability: string
  business: string
}

type CompatibilityProps = {
  unlocked: boolean
  pairAnalysis: CompatibilityAnalysis | undefined
}

const Compatibility: React.FC<CompatibilityProps> = ({ pairAnalysis }) => {
  // const streamingStarted = !!userData?.about

  const renderAnalysisCards = () => {
    const configKeys = new Set(compatibilityConfig.map((card) => card.contentKey))
    const allCards = [...compatibilityConfig]

    // Add cards for properties not in compatibilityConfig
    if (pairAnalysis) {
      Object.keys(pairAnalysis).forEach((key) => {
        if (!configKeys.has(key) && key !== 'emojis' && key !== 'about' && key !== 'twitter_names') {
          allCards.push({
            title: key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
            icon: PiQuestion, // You might want to provide a default icon
            contentKey: key,
            color: 'text-gray-600',
            colorClass: 'text-gray-600',
            bg: 'bg-gray-100',
          })
        }
      })
    }

    return allCards.map((card, index) => (
      <React.Fragment key={card.contentKey}>
        {index === 1 && <WordwareCard />}
        {index === 7 && <WordwareCard />}
        <AnalysisCard
          {...card}
          content={pairAnalysis?.[card.contentKey] || ''}
          unlocked={true}
        />
      </React.Fragment>
    ))
  }

  return (
    <div className="w-full max-w-6xl">
      <div className="text-center text-4xl tracking-widest">{pairAnalysis?.emojis}</div>
      <div className="mb-16 mt-6 text-center">
        <div className="flex-center w-full">
          <div className="w-full max-w-xl text-lg font-light">
            <Markdown content={pairAnalysis?.about || ''} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">{renderAnalysisCards()}</div>
    </div>
  )
}

export default Compatibility
