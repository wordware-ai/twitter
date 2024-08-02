import React from 'react'

import WordwareLogo from '@/components/logo'
import PHButton from '@/components/ph-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export const PHCard: React.FC<{ name: string }> = ({ name }) => {
  return (
    <Card className={cn(`relative w-full overflow-hidden rounded-2xl border border-[#ff6154] bg-opacity-5 px-4 pb-4`)}>
      <CardHeader className="flex w-full flex-col items-start">
        <CardTitle className="flex w-full items-center justify-between py-2 pb-4 text-2xl">
          <div className="flex items-center gap-3">
            <WordwareLogo
              emblemOnly
              color={'black'}
              width={32}
            />
            <span className={`text-xl font-light text-[#ff6154]`}>Support us on Product Hunt!</span>
          </div>
        </CardTitle>
        <div className="w-full border-b border-[#ff6154]" />
      </CardHeader>
      <CardContent className="flex flex-col space-y-2 text-gray-700">
        <p>
          Hey {name}, <span className="font-medium">help us keeping this roast running by supporting our Product Hunt launch!</span>
        </p>
        <p>
          This project is costing us a lot of money to run - <span className="font-medium">and you can help us for free! It takes only 30 seconds!</span>
        </p>
        <div className="mt-8 py-2">
          <PHButton text="Support us on Product Hunt!" />
        </div>
        <p>Let&apos;s go! Your upvote can make a big difference in helping us reach more people and continue improving our AI services.</p>
      </CardContent>
    </Card>
  )
}
