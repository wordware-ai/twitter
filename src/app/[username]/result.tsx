'use client'

import {
  PiBarbell,
  PiChatTeardrop,
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

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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
    <div>
      <div className="mb-16 mt-12 text-center">
        {/* <div className="mb-2 text-center md:px-8">
          <h1 className="mb-6 text-3xl text-[#0F172A] md:text-5xl">
            here is an AI agent&apos;s analysis of my
            <span className="bg-[#CB9F9F] bg-clip-text text-transparent"> twitter </span>
            personality!
          </h1>

          <div className="text-right">
            <div className="flex items-center justify-center md:justify-end">
              <span className="mr-2 text-base font-light md:text-lg">powered by</span>
              <a
                href="https://www.wordware.ai/"
                target="_blank"
                rel="noopener noreferrer">
                <img
                  src="https://app.wordware.ai/logo_black.svg"
                  alt="Wordware.ai Logo"
                  width={120}
                  height={28}
                />
              </a>
            </div>
          </div>
        </div> */}

        {/* <div className="mx-auto mb-10 px-5 py-10 text-center md:text-left">
          <div className="mt-10 flex flex-col items-center justify-between md:flex-row">
            <h3 className="mb-6 text-base font-normal md:text-lg">Would you like to get your own profile? try here</h3>
            <a
              href="https://twitter.wordware.ai/"
              className="w-full rounded-none bg-black px-4 py-2 text-xs font-semibold text-white">
              try with your own twitter!
            </a>
          </div>
        </div> */}

        <div>{userData?.about}</div>
        <div>{userData?.roast}</div>

        <div className="text-left">
          <Card className="relative mx-auto bg-white pb-2 pt-2 shadow-md">
            <CardHeader className="flex w-full flex-col items-start p-4 pb-2 pl-8 pr-8">
              <CardTitle className="flex items-center py-2 pb-4 text-2xl">
                <span className="font-semibold text-orange-500">strengths </span>
                <PiFlame
                  className="ml-3 mr-3"
                  size={26}
                />
              </CardTitle>
              <div className="w-full border-b border-gray-300" />
            </CardHeader>
            <CardContent className="flex flex-col p-4 pt-3 text-gray-700">
              <ul className="list-none space-y-2 pl-4 pr-4">
                {userData?.strengths?.map((strength, index) => (
                  <li key={index}>
                    <span className="font-semibold">{strength.title}:</span> {strength.subtitle}
                  </li>
                ))}
              </ul>
            </CardContent>
            <div className="absolute bottom-0 left-0 h-10 w-full bg-gradient-to-b from-transparent to-orange-50"></div>
          </Card>

          <Card className="relative mx-auto bg-white pb-2 pt-2 shadow-md">
            <CardHeader className="flex w-full flex-col items-start p-4 pb-2 pl-8 pr-8">
              <CardTitle className="flex items-center py-2 pb-4 text-2xl">
                <span className="font-semibold text-blue-500">weaknesses </span>
                <PiMoon
                  className="ml-3 mr-3"
                  size={26}
                />
              </CardTitle>
              <div className="w-full border-b border-gray-300" />
            </CardHeader>
            <CardContent className="flex flex-col p-4 pt-3 text-gray-700">
              <ul className="list-none space-y-2 pl-4 pr-4">
                {userData?.weaknesses?.map((weakness, index) => (
                  <li key={index}>
                    <span className="font-semibold">{weakness.title}:</span> {weakness.subtitle}
                  </li>
                ))}
              </ul>
            </CardContent>
            <div className="absolute bottom-0 left-0 h-10 w-full bg-gradient-to-b from-transparent to-blue-50"></div>
          </Card>

          <Card className="relative mx-auto bg-white pb-2 pt-2 shadow-md">
            <CardHeader className="flex w-full flex-col items-start p-4 pb-2 pl-8 pr-8">
              <CardTitle className="flex items-center py-2 pb-4 text-2xl">
                <span className="font-semibold text-red-500">Love Life</span>
                <PiHeart
                  className="ml-3 mr-3"
                  size={26}
                />
              </CardTitle>
              <div className="w-full border-b border-gray-300" />
            </CardHeader>
            <CardContent className="flex flex-col p-4 pt-3 text-gray-700">
              <p className="space-y-2 pl-4 pr-4">{userData?.loveLife}</p>
            </CardContent>
            <div className="absolute bottom-0 left-0 h-10 w-full bg-gradient-to-b from-transparent to-red-50"></div>
          </Card>

          <Card className="relative mx-auto bg-white pb-2 pt-2 shadow-md">
            <CardHeader className="flex w-full flex-col items-start p-4 pb-2 pl-8 pr-8">
              <CardTitle className="flex items-center py-2 pb-4 text-2xl">
                <span className="font-semibold text-green-500">Money</span>
                <PiMoney
                  className="ml-3 mr-3"
                  size={26}
                />
              </CardTitle>
              <div className="w-full border-b border-gray-300" />
            </CardHeader>
            <CardContent className="flex flex-col p-4 pt-3 text-gray-700">
              <p className="space-y-2 pl-4 pr-4">{userData?.money}</p>
            </CardContent>
            <div className="absolute bottom-0 left-0 h-10 w-full bg-gradient-to-b from-transparent to-green-50"></div>
          </Card>

          <Card className="relative mx-auto bg-white pb-2 pt-2 shadow-md">
            <CardHeader className="flex w-full flex-col items-start p-4 pb-2 pl-8 pr-8">
              <CardTitle className="flex items-center py-2 pb-4 text-2xl">
                <span className="font-semibold text-indigo-500">Health</span>
                <PiBarbell
                  className="ml-3 mr-3"
                  size={26}
                />
              </CardTitle>
              <div className="w-full border-b border-gray-300" />
            </CardHeader>
            <CardContent className="flex flex-col p-4 pt-3 text-gray-700">
              <p className="space-y-2 pl-4 pr-4">{userData?.health}</p>
            </CardContent>
            <div className="absolute bottom-0 left-0 h-10 w-full bg-gradient-to-b from-transparent to-indigo-50"></div>
          </Card>

          <Card className="relative mx-auto bg-white pb-2 pt-2 shadow-md">
            <CardHeader className="flex w-full flex-col items-start p-4 pb-2 pl-8 pr-8">
              <CardTitle className="flex items-center py-2 pb-4 text-2xl">
                <span className="font-semibold text-yellow-500">Other&apos;s Perspective</span>
                <PiUsers
                  className="ml-3 mr-3"
                  size={26}
                />
              </CardTitle>
              <div className="w-full border-b border-gray-300" />
            </CardHeader>
            <CardContent className="flex flex-col p-4 pt-3 text-gray-700">
              <p className="space-y-2 pl-4 pr-4">{userData?.colleaguePerspective}</p>
            </CardContent>
            <div className="absolute bottom-0 left-0 h-10 w-full bg-gradient-to-b from-transparent to-yellow-50"></div>
          </Card>

          <Card className="relative mx-auto bg-white pb-2 pt-2 shadow-md">
            <CardHeader className="flex w-full flex-col items-start p-4 pb-2 pl-8 pr-8">
              <CardTitle className="flex items-center py-2 pb-4 text-2xl">
                <span className="font-semibold text-purple-500">Biggest Goal</span>
                <PiRocket
                  className="ml-3 mr-3"
                  size={26}
                />
              </CardTitle>
              <div className="w-full border-b border-gray-300" />
            </CardHeader>
            <CardContent className="flex flex-col p-4 pt-3 text-gray-700">
              <p className="space-y-2 pl-4 pr-4">{userData?.biggestGoal}</p>
            </CardContent>
            <div className="absolute bottom-0 left-0 h-10 w-full bg-gradient-to-b from-transparent to-purple-50"></div>
          </Card>

          <Card className="relative mx-auto bg-white pb-2 pt-2 shadow-md">
            <CardHeader className="flex w-full flex-col items-start p-4 pb-2 pl-8 pr-8">
              <CardTitle className="flex items-center py-2 pb-4 text-2xl">
                <span className="font-semibold text-emerald-500">Famous Person like You</span>
                <PiStar
                  className="ml-3 mr-3"
                  size={26}
                />
              </CardTitle>
              <div className="w-full border-b border-gray-300" />
            </CardHeader>
            <CardContent className="flex flex-col p-4 pt-3 text-gray-700">
              <p className="space-y-2 pl-4 pr-4">{userData?.famousPersonComparison}</p>
            </CardContent>
            <div className="absolute bottom-0 left-0 h-10 w-full bg-gradient-to-b from-transparent to-emerald-50"></div>
          </Card>

          <Card className="relative mx-auto bg-white pb-2 pt-2 shadow-md">
            <CardHeader className="flex w-full flex-col items-start p-4 pb-2 pl-8 pr-8">
              <CardTitle className="flex items-center py-2 pb-4 text-2xl">
                <span className="font-semibold text-pink-500">Pickup Lines</span>
                <PiChatTeardrop
                  className="ml-3 mr-3"
                  size={26}
                />
              </CardTitle>
              <div className="w-full border-b border-gray-300" />
            </CardHeader>
            <CardContent className="flex flex-col p-4 pt-3 text-gray-700">
              <ul className="list-none space-y-2 pl-5">{userData?.pickupLines?.map((line, index) => <li key={index}>{line}</li>)}</ul>
            </CardContent>
            <div className="absolute bottom-0 left-0 h-10 w-full bg-gradient-to-b from-transparent to-pink-50"></div>
          </Card>

          <Card className="relative mx-auto bg-white pb-2 pt-2 shadow-md">
            <CardHeader className="flex w-full flex-col items-start p-4 pb-2 pl-8 pr-8">
              <CardTitle className="flex items-center py-2 pb-4 text-2xl">
                <span className="font-semibold text-gray-500">Previous Life</span>
                <PiHandsPraying
                  className="ml-3 mr-3"
                  size={26}
                />
              </CardTitle>
              <div className="w-full border-b border-gray-300" />
            </CardHeader>
            <CardContent className="flex flex-col p-4 pt-3 text-gray-700">
              <p className="space-y-2 pl-4 pr-4">{userData?.previousLife}</p>
            </CardContent>
            <div className="absolute bottom-0 left-0 h-10 w-full bg-gradient-to-b from-transparent to-gray-50"></div>
          </Card>

          <Card className="relative mx-auto bg-white pb-2 pt-2 shadow-md">
            <CardHeader className="flex w-full flex-col items-start p-4 pb-2 pl-8 pr-8">
              <CardTitle className="flex items-center py-2 pb-4 text-2xl">
                <span className="font-semibold text-sky-500">Animal</span>
                <PiPawPrint
                  className="ml-3 mr-3"
                  size={26}
                />
              </CardTitle>
              <div className="w-full border-b border-gray-300" />
            </CardHeader>
            <CardContent className="flex flex-col p-4 pt-3 text-gray-700">
              <p className="space-y-2 pl-4 pr-4">{userData?.animal}</p>
            </CardContent>
            <div className="absolute bottom-0 left-0 h-10 w-full bg-gradient-to-b from-transparent to-sky-50"></div>
          </Card>

          <Card className="relative mx-auto bg-white pb-2 pt-2 shadow-md">
            <CardHeader className="flex w-full flex-col items-start p-4 pb-2 pl-8 pr-8">
              <CardTitle className="flex items-center py-2 pb-4 text-2xl">
                <span className="font-semibold text-fuchsia-500">Thing to Buy</span>
                <PiWallet
                  className="ml-3 mr-3"
                  size={26}
                />
              </CardTitle>
              <div className="w-full border-b border-gray-300" />
            </CardHeader>
            <CardContent className="flex flex-col p-4 pt-3 text-gray-700">
              <p className="space-y-2 pl-4 pr-4">{userData?.fiftyDollarThing}</p>
            </CardContent>
            <div className="absolute bottom-0 left-0 h-10 w-full bg-gradient-to-b from-transparent to-fuchsia-50"></div>
          </Card>

          <Card className="relative mx-auto bg-white pb-2 pt-2 shadow-md">
            <CardHeader className="flex w-full flex-col items-start p-4 pb-2 pl-8 pr-8">
              <CardTitle className="flex items-center py-2 pb-4 text-2xl">
                <span className="font-semibold text-amber-500">Your Career</span>
                <PiLightbulb
                  className="ml-3 mr-3"
                  size={26}
                />
              </CardTitle>
              <div className="w-full border-b border-gray-300" />
            </CardHeader>
            <CardContent className="flex flex-col p-4 pt-3 text-gray-700">
              <p className="space-y-2 pl-4 pr-4">{userData?.career}</p>
            </CardContent>
            <div className="absolute bottom-0 left-0 h-10 w-full bg-gradient-to-b from-transparent to-amber-50"></div>
          </Card>

          <Card className="relative mx-auto bg-white pb-2 pt-2 shadow-md">
            <CardHeader className="flex w-full flex-col items-start p-4 pb-2 pl-8 pr-8">
              <CardTitle className="flex items-center py-2 pb-4 text-2xl">
                <span className="font-semibold text-teal-500">Life Suggestion</span>
                <PiPlant
                  className="ml-3 mr-3"
                  size={26}
                />
              </CardTitle>
              <div className="w-full border-b border-gray-300" />
            </CardHeader>
            <CardContent className="flex flex-col p-4 pt-3 text-gray-700">
              <p className="space-y-2 pl-4 pr-4">{userData?.lifeSuggestion}</p>
            </CardContent>
            <div className="absolute bottom-0 left-0 h-10 w-full bg-gradient-to-b from-transparent to-teal-50"></div>
          </Card>
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

      {/* <Footer /> */}
    </div>
  )
}
