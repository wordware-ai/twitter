import React from 'react'

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
      <CardContent className="flex flex-col space-y-2 text-gray-700">
        Wordware is a toolkit that enables anyone to build powerful AI Agents and applications with Natural Language.
        <br />
        <p>Build, iterate and deploy 20x faster with prebuilt tools, selection of all AI models, tracing, and more.</p>
        <br />
        <p>Finally, high-quality and reliable AI!</p>
        <div className="mt-8 py-4">
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
              <p>Sign up today</p>
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
