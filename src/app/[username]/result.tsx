'use client'

import React from 'react'

import { WordwareCard } from '@/app/[username]/wordware-card'
import { Markdown } from '@/components/markdown'

import AnalysisCard from './analysis-card'
import { cardData } from './config'
import { PaywallCard } from './paywall-card'

/**
 * Represents the structure of a Twitter analysis result
 * @typedef {Object} TwitterAnalysis
 * @property {string} [about] - General description about the user
 * @property {Array<{title: string, subtitle: string}>} [strengths] - User's strengths
 * @property {Array<{title: string, subtitle: string}>} [weaknesses] - User's weaknesses
 * @property {string} [loveLife] - Analysis of user's love life
 * @property {string} [money] - Analysis of user's financial situation
 * @property {string} [health] - Analysis of user's health
 * @property {string} [biggestGoal] - User's biggest goal
 * @property {string} [colleaguePerspective] - How colleagues might perceive the user
 * @property {string[]} [pickupLines] - Pickup lines based on user's profile
 * @property {string} [famousPersonComparison] - Comparison to a famous person
 * @property {string} [previousLife] - Speculation about user's previous life
 * @property {string} [animal] - Animal that represents the user
 * @property {string} [fiftyDollarThing] - Suggestion for a $50 purchase
 * @property {string} [career] - Career analysis or suggestion
 * @property {string} [lifeSuggestion] - General life suggestion
 * @property {string} [roast] - Humorous roast of the user
 * @property {string} [emojis] - Emojis representing the user
 */
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

/**
 * Result component that displays the Twitter analysis
 * @param {Object} props - Component props
 * @param {TwitterAnalysis | undefined} props.userData - The analyzed user data
 * @returns {JSX.Element} The rendered Result component
 */
export default function Result({ unlocked, userData }: { unlocked: boolean; userData: TwitterAnalysis | undefined }) {
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
          if (!unlocked && index === 1) {
            return <PaywallCard key={index} />
          }
          if (index === 2) {
            return <WordwareCard key={index} />
          }
          return (
            <React.Fragment key={index}>
              {(unlocked || index !== 1) && (
                <AnalysisCard
                  key={index}
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
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
