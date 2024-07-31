import React from 'react'
import { CalendarDaysIcon } from 'lucide-react'
import { PiXLogo } from 'react-icons/pi'

import WordwareLogo from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export const WordwareCard: React.FC = () => {
  return (
    <Card className={cn(`relative w-full overflow-hidden rounded-2xl border bg-opacity-5 px-4 pb-4`)}>
      <CardHeader className="flex w-full flex-col items-start">
        <CardTitle className="flex w-full items-center justify-between py-2 pb-4 text-2xl">
          <div className="flex items-center gap-3">
            <WordwareLogo
              emblemOnly
              color={'black'}
              width={32}
            />
            <span className={`text-xl font-light text-gray-900`}>Building in AI?</span>
          </div>
        </CardTitle>
        <div className="w-full border-b border-gray-300" />
      </CardHeader>
      <CardContent className="flex flex-col text-gray-700">
        <p>
          <a
            href="https://wordware.ai"
            className="u font-semibold hover:underline">
            Wordware
          </a>{' '}
          (YC S24) is a native AI toolkit and IDE that helps you build high-quality LLM applications with natural language. Just like this one!
        </p>
        <div className="mt-8 space-y-4">
          <Button
            size={'sm'}
            variant={'default'}
            asChild>
            <a
              href={process.env.NEXT_PUBLIC_SHARED_APP_URL}
              target="_blank"
              className="flex-center gap-2">
              <WordwareLogo
                emblemOnly
                color={'white'}
                width={12}
              />
              <p>
                Remix <span className="hidden md:inline">this</span> Agent
              </p>
            </a>
          </Button>
          <Button
            size={'sm'}
            variant={'secondary'}
            asChild>
            <a
              href={`https://app.wordware.ai/register`}
              target="_blank"
              className="flex-center gap-2">
              <WordwareLogo
                emblemOnly
                color={'black'}
                width={12}
              />
              <p>Build your AI agent</p>
            </a>
          </Button>
          <Button
            size={'sm'}
            variant={'secondary'}
            asChild>
            <a
              href={`https://tally.so/r/nrEzZN`}
              target="_blank"
              className="flex-center gap-2">
              <CalendarDaysIcon className="h-4 w-4 shrink-0" />
              <p>
                Book<span className="hidden lg:inline"> a free</span> AI consultation
              </p>
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
