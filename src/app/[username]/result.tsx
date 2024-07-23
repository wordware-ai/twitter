'use client'

import {
  PiBarbell,
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
  PiStar,
  PiUsers,
  PiWallet,
} from 'react-icons/pi'

import { Markdown } from '@/components/markdown'

import AnalysisCard from './analysis-card'

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

const cardData = [
  {
    title: 'Strengths',
    icon: PiFlame,
    contentKey: 'strengths',
    colorClass: 'text-orange-500',
    color: 'orange',
    bg: 'bg-orange-500',
  },
  {
    title: 'Weaknesses',
    icon: PiMoon,
    contentKey: 'weaknesses',
    colorClass: 'text-blue-500',
    color: 'blue',
    bg: 'bg-blue-500',
  },
  {
    title: 'Love Life',
    icon: PiHeart,
    contentKey: 'loveLife',
    colorClass: 'text-red-500',
    color: 'red',
    bg: 'bg-red-500',
  },
  {
    title: 'Money',
    icon: PiMoney,
    contentKey: 'money',
    colorClass: 'text-green-500',
    color: 'green',
    bg: 'bg-green-500',
  },
  {
    title: 'Health',
    icon: PiBarbell,
    contentKey: 'health',
    colorClass: 'text-indigo-500',
    color: 'indigo',
    bg: 'bg-indigo-500',
  },
  {
    title: "Other's Perspective",
    icon: PiUsers,
    contentKey: 'colleaguePerspective',
    colorClass: 'text-yellow-500',
    color: 'yellow',
    bg: 'bg-yellow-500',
  },
  {
    title: 'Biggest Goal',
    icon: PiRocket,
    contentKey: 'biggestGoal',
    colorClass: 'text-purple-500',
    color: 'purple',
    bg: 'bg-purple-500',
  },
  {
    title: 'Famous Person like You',
    icon: PiStar,
    contentKey: 'famousPersonComparison',
    colorClass: 'text-emerald-500',
    color: 'emerald',
    bg: 'bg-emerald-500',
  },
  {
    title: 'Pickup Lines',
    icon: PiChatTeardrop,
    contentKey: 'pickupLines',
    colorClass: 'text-pink-500',
    color: 'pink',
    bg: 'bg-pink-500',
  },
  {
    title: 'Previous Life',
    icon: PiHandsPraying,
    contentKey: 'previousLife',
    colorClass: 'text-gray-500',
    color: 'gray',
    bg: 'bg-gray-500',
  },
  {
    title: 'Animal',
    icon: PiPawPrint,
    contentKey: 'animal',
    colorClass: 'text-sky-500',
    color: 'sky',
    bg: 'bg-sky-500',
  },
  {
    title: 'Thing to Buy',
    icon: PiWallet,
    contentKey: 'fiftyDollarThing',
    colorClass: 'text-fuchsia-500',
    color: 'fuchsia',
    bg: 'bg-fuchsia-500',
  },
  {
    title: 'Your Career',
    icon: PiLightbulb,
    contentKey: 'career',
    colorClass: 'text-amber-500',
    color: 'amber',
    bg: 'bg-amber-500',
  },
  {
    title: 'Life Suggestion',
    icon: PiPlant,
    contentKey: 'lifeSuggestion',
    colorClass: 'text-teal-500',
    color: 'teal',
    bg: 'bg-teal-500',
  },
  {
    title: 'Roast',
    icon: PiFire,
    contentKey: 'roast',
    colorClass: 'text-red-500',
    color: 'red',
    bg: 'bg-red-500',
    wide: true,
  },
]
