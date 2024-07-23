'use client'

import { Markdown } from '@/components/markdown'

import AnalysisCard from './analysis-card'
import { cardData } from './config'

export type TwitterAnalysis = {
  [key: string]: string | { title: string; subtitle: string }[] | string[] | undefined
  about?: string
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
  roast?: string
  emojis?: string
}

export default function Result({ userData }: { userData: TwitterAnalysis | undefined }) {
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
          <AnalysisCard
            key={index}
            contentKey={card.contentKey}
            title={card.title}
            icon={card.icon}
            content={userData?.[card.contentKey] || ''}
            colorClass={card.colorClass}
            // color={card.color}
            wide={card.wide}
            bg={card.bg}
          />
        ))}
      </div>
    </div>
  )
}
