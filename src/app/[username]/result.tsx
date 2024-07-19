'use client'

import {
  PiBarbell,
  PiBrain,
  PiChatTeardrop,
  PiFire,
  PiFlame,
  PiHandsPraying,
  PiHeart,
  PiLightbulb,
  PiMoney,
  PiMoon,
  PiPawPrint,
  PiPlant,
  PiRocket,
  PiSmiley,
  PiStar,
  PiUsers,
  PiWallet,
} from 'react-icons/pi'

import { Card, CardContent } from '@/components/ui/card'

import AnalysisCard from './analysis-card'

export type TwitterAnalysis = {
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
}

export default function Result({ userData }: { userData: TwitterAnalysis | undefined }) {
  return (
    <div className="w-full max-w-6xl">
      <div className="mb-16 mt-12 text-center">
        <div className="flex-center w-full">
          <div className="w-full max-w-lg italic">{userData?.about}</div>
        </div>

        <div className="mx-auto mt-10 px-5 py-10 text-center md:text-left">
          <div className="w-full border-t border-gray-300" />
          <div className="mt-10 flex flex-col items-center justify-between md:flex-row">
            <h3 className="mb-6 text-base font-normal md:text-lg">Would you like to get your own profile? try here</h3>
            <a
              href="https://twitter.wordware.ai/"
              className="w-full rounded-none bg-black px-4 py-2 text-xs font-semibold text-white">
              try with your own twitter!
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {cardData.map((card, index) => (
          <AnalysisCard
            key={index}
            title={card.title}
            icon={card.icon}
            content={userData?.[card.contentKey] || ''}
            colorClass={card.colorClass}
            color={card.color}
            colSpan={card.colSpan || 1}
          />
        ))}
      </div>

      {/* <Footer /> */}
    </div>
  )
}

const cardData = [
  {
    title: 'Strengths',
    icon: PiFlame,
    contentKey: 'strengths',
    colorClass: 'text-orange-500',
    color: 'orange',
  },
  {
    title: 'Weaknesses',
    icon: PiMoon,
    contentKey: 'weaknesses',
    colorClass: 'text-blue-500',
    color: 'blue',
  },
  {
    title: 'Love Life',
    icon: PiHeart,
    contentKey: 'loveLife',
    colorClass: 'text-red-500',
    color: 'red',
  },
  {
    title: 'Money',
    icon: PiMoney,
    contentKey: 'money',
    colorClass: 'text-green-500',
    color: 'green',
  },
  {
    title: 'Health',
    icon: PiBarbell,
    contentKey: 'health',
    colorClass: 'text-indigo-500',
    color: 'indigo',
  },
  {
    title: "Other's Perspective",
    icon: PiUsers,
    contentKey: 'colleaguePerspective',
    colorClass: 'text-yellow-500',
    color: 'yellow',
  },
  {
    title: 'Biggest Goal',
    icon: PiRocket,
    contentKey: 'biggestGoal',
    colorClass: 'text-purple-500',
    color: 'purple',
  },
  {
    title: 'Famous Person like You',
    icon: PiStar,
    contentKey: 'famousPersonComparison',
    colorClass: 'text-emerald-500',
    color: 'emerald',
  },
  {
    title: 'Pickup Lines',
    icon: PiChatTeardrop,
    contentKey: 'pickupLines',
    colorClass: 'text-pink-500',
    color: 'pink',
  },
  {
    title: 'Previous Life',
    icon: PiHandsPraying,
    contentKey: 'previousLife',
    colorClass: 'text-gray-500',
    color: 'gray',
  },
  {
    title: 'Animal',
    icon: PiPawPrint,
    contentKey: 'animal',
    colorClass: 'text-sky-500',
    color: 'sky',
  },
  {
    title: 'Thing to Buy',
    icon: PiWallet,
    contentKey: 'fiftyDollarThing',
    colorClass: 'text-fuchsia-500',
    color: 'fuchsia',
  },
  {
    title: 'Your Career',
    icon: PiLightbulb,
    contentKey: 'career',
    colorClass: 'text-amber-500',
    color: 'amber',
  },
  {
    title: 'Life Suggestion',
    icon: PiPlant,
    contentKey: 'lifeSuggestion',
    colorClass: 'text-teal-500',
    color: 'teal',
  },
  {
    title: 'Roast',
    icon: PiFire,
    contentKey: 'roast',
    colorClass: 'text-red-500',
    color: 'red',
    colSpan: 2,
  },
]
