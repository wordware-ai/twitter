import React from 'react'
import { useParams } from 'next/navigation'
import { IconType } from 'react-icons'
import { PiXLogo } from 'react-icons/pi'

import { Markdown } from '@/components/markdown'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type ContentItem = {
  title: string
  subtitle: string
}

type ContentType = string | string[] | ContentItem[] | { [key: string]: string }

interface AnalysisCardProps {
  title: string
  icon: IconType
  content: ContentType
  contentKey: string
  colorClass: string
  color?: string
  wide?: boolean
  bg?: string
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ title, icon: Icon, content, colorClass, contentKey, wide = false, bg }) => {
  const { username } = useParams()

  const renderContent = () => {
    if (typeof content === 'string') {
      return (
        <div className="space-y-2">
          <Markdown content={content || ''} />
        </div>
      )
    } else if (Array.isArray(content)) {
      return (
        <ul className="list-none space-y-2">
          {content.map((item, index) => (
            <li key={index}>
              {typeof item === 'string' ? (
                item
              ) : (
                <>
                  <span className="font-semibold">{item.title}:</span> {item.subtitle}
                </>
              )}
            </li>
          ))}
        </ul>
      )
    } else if (typeof content === 'object') {
      return (
        <ul className="list-none space-y-2">
          {Object.entries(content).map(([key, value], index) => (
            <li key={index}>
              <span className="font-semibold">{key}:</span> {value}
            </li>
          ))}
        </ul>
      )
    }
    return null
  }

  if (!content) return null

  return (
    <Card className={cn(`relative w-full overflow-hidden rounded-2xl border bg-opacity-5 px-4 pb-4`, bg, wide && `sm:col-span-2`)}>
      <CardHeader className="flex w-full flex-col items-start">
        <CardTitle className="flex w-full items-center justify-between py-2 pb-4 text-2xl">
          <div className="flex items-center gap-2">
            <span className={`text-xl font-light ${colorClass}`}>{title}</span>
            <Icon
              className="ml-3 mr-3"
              size={26}
            />
          </div>
          <Button
            // size={'md'}
            variant={'ghost'}
            className="border border-transparent transition-all duration-100 hover:border-black hover:bg-transparent"
            asChild>
            <a
              target="_blank"
              className={cn(`flex-center gap-2 text-lg`, colorClass)}
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`AI says this is my Twitter Personality: 👀`)}&url=${encodeURIComponent(`https://twitter.wordware.ai/${username}?section=${contentKey}`)}`}>
              <PiXLogo /> Share
            </a>
          </Button>
        </CardTitle>
        <div className="w-full border-b border-gray-300" />
      </CardHeader>
      <CardContent className="flex flex-col text-gray-700">{renderContent()}</CardContent>
      {/* <div className={`${gradientClass} absolute bottom-0 -z-10 h-20 w-full`} /> */}
    </Card>
  )
}

export default AnalysisCard
