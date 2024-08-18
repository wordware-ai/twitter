'use client'

import React from 'react'
import { PiQuestion } from 'react-icons/pi'

import { Markdown } from '@/components/markdown'
import { CompatibilityAnalysis } from '@/types'

import { compatibilityConfig } from '../../lib/wordware-config'
import CompatibilityCard from '../compatibility/compatibility-card'
import { CompatibilityPaywallCard } from './compatibility-paywall-card'
import { WordwareCard } from './wordware-card'

type CompatibilityProps = {
  names: string[]
  unlocked: boolean
  pairAnalysis: CompatibilityAnalysis | undefined
}

const Compatibility: React.FC<CompatibilityProps> = ({ pairAnalysis, unlocked, names }) => {
  // const streamingStarted = !!userData?.about
  const profile1Name = names[0] || 'Person 1'
  const profile2Name = names[1] || 'Person 2'

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
        {index === 1 && !unlocked && !pairAnalysis && <CompatibilityPaywallCard />}
        {index === 7 && <WordwareCard />}
        <CompatibilityCard
          names={[profile1Name, profile2Name]}
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
