import React from 'react'
import { IconType } from 'react-icons'

import { Markdown } from '@/components/markdown'
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
  colorClass: string
  color: string
  wide?: boolean
  bg?: string
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ title, icon: Icon, content, colorClass, color, wide = false, bg }) => {
  const renderContent = () => {
    if (typeof content === 'string') {
      return (
        <div className="space-y-2 pl-4 pr-4">
          <Markdown content={content || ''} />
        </div>
      )
    } else if (Array.isArray(content)) {
      return (
        <ul className="list-none space-y-2 pl-4 pr-4">
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
        <ul className="list-none space-y-2 pl-4 pr-4">
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

  // const backgroundColor = `bg-${color}-50`
  const gradientClass = `bg-gradient-to-b from-white to-${color}-50`
  if (!content) return null

  return (
    <Card className={cn(`)] relative w-full overflow-hidden rounded-2xl border bg-opacity-5 pb-2 pt-2`, bg, wide && `sm:col-span-2`)}>
      <CardHeader className="flex w-full flex-col items-start p-4 pb-2 pl-8 pr-8">
        <CardTitle className="flex items-center py-2 pb-4 text-2xl">
          <span className={`text-xl font-light ${colorClass}`}>{title}</span>
          <Icon
            className="ml-3 mr-3"
            size={26}
          />
        </CardTitle>
        <div className="w-full border-b border-gray-300" />
      </CardHeader>
      <CardContent className="flex flex-col p-4 pt-3 text-gray-700">{renderContent()}</CardContent>
      <div className={`${gradientClass} absolute bottom-0 -z-10 h-20 w-full`} />
    </Card>
  )
}

export default AnalysisCard
