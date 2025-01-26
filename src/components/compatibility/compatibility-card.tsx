import React, { useCallback } from 'react'
import { useParams } from 'next/navigation'
import { IconType } from 'react-icons'
import { PiXLogo } from 'react-icons/pi'

import WordwareLogo from '@/components/logo'
import linkedin from '@/components/logos/linkedin.svg'
import threads from '@/components/logos/threads.svg'
import whatsapp from '@/components/logos/whatsapp.svg'
import { Markdown } from '@/components/markdown'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

/**
 * Represents an item in the content array with a title and subtitle.
 */
type ContentItem = {
  title: string
  subtitle: string
}

/**
 * Defines the possible types for the content prop.
 * It can be a string, an array of strings, an array of ContentItems,
 * or an object with string keys and string values.
 */
type ContentType = string | string[] | ContentItem[] | { [key: string]: string | string[] }

/**
 * Props for the AnalysisCard component.
 */
interface AnalysisCardProps {
  names: string[]
  unlocked: boolean
  title: string
  icon: IconType
  content: ContentType
  contentKey: string
  colorClass: string
  color?: string
  wide?: boolean
  bg?: string
}

/**
 * AnalysisCard component displays a card with analysis content.
 * It can render different types of content based on the ContentType.
 */
const AnalysisCard: React.FC<AnalysisCardProps> = ({ names, unlocked, title, icon: Icon, content, colorClass, contentKey, wide = false, bg }) => {
  const isContentVisible = unlocked
  const { username, usernamePair } = useParams()

  const renderContent = useCallback(() => {
    if (typeof content === 'string') {
      // const displayContent = isContentVisible ? content : obfuscateContent(content)

      return (
        <div className={`space-y-2 ${!isContentVisible ? 'blur-sm' : ''}`}>
          {/* Use a key to force re-render when content changes */}
          <Markdown
            key={content}
            content={content || ''}
          />
        </div>
      )
    } else if (Array.isArray(content)) {
      return (
        <ul className={`list-none space-y-2 ${!isContentVisible ? 'blur-sm' : ''}`}>
          {content.map((item, index) => (
            <li
              key={index}
              className="pl-6">
              {typeof item === 'string' ? (
                item
              ) : (
                <>
                  <span className="font-semibold">{isContentVisible ? item.title : item.title}:</span> {isContentVisible ? item.subtitle : item.subtitle}
                </>
              )}
            </li>
          ))}
        </ul>
      )
    } else if (typeof content === 'object') {
      return (
        <div className={`flex w-full flex-col gap-4 md:flex-row ${!isContentVisible ? 'blur-sm' : ''}`}>
          {Object.entries(content).map(([key, value], index) => (
            <div
              className="w-full"
              key={index}>
              <span className="text-xl font-semibold">{key.replace('profile1', names[0]).replace('profile2', names[1])}:</span>
              {Array.isArray(value) ? (
                <ul className="list-disc pl-5">
                  {value.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="pl-6">
                      <Markdown
                        key={item}
                        content={item || ''}
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <Markdown
                  key={value}
                  content={value || ''}
                />
              )}
            </div>
          ))}
        </div>
      )
    }
    return null
  }, [content, isContentVisible, names])

  // If there's no content, don't render the card
  if (!content) return null

  return (
    <Card className={cn(`relative w-full overflow-hidden rounded-2xl border bg-opacity-5 px-4 pb-4`, bg, wide && `sm:col-span-2`)}>
      <div className="flex h-full flex-col justify-between">
        <div>
          <CardHeader className="flex w-full flex-col items-start">
            <CardTitle className="flex w-full items-center justify-between py-2 pb-4 text-2xl">
              <div className="flex items-center gap-2">
                <Icon
                  className={cn('', colorClass)}
                  size={26}
                />
                <span className={`text-xl font-light ${colorClass}`}>{title}</span>
              </div>
              {/* Share buttons */}
              <div className="flex items-center gap-2">
                <Button
                  size={'sm'}
                  variant={'ghost'}
                  className={`border border-transparent transition-all duration-100 hover:border-black hover:bg-transparent ${bg} `}
                  asChild>
                  <a
                    target="_blank"
                    className={cn(`flex-center rounded-md text-lg text-white`)}
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`here's our Twitter Compatibility Analysis for @${username} and @${usernamePair}, created by an AI Agent built on @wordware.\n\n`)}&url=${encodeURIComponent(`https://twitter.wordware.ai/${username}/${usernamePair}?section=${contentKey}`)}`}>
                    <PiXLogo /> Share
                  </a>
                </Button>

                <a
                  target="_blank"
                  className={cn(`flex-center rounded-md p-1 text-lg text-white hover:bg-gray-200`)}
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`here's our Twitter Compatibility Analysis for @${username} and @${usernamePair}, created by an AI Agent built on @wordware.\n\n https://twitter.wordware.ai/${username}/${usernamePair}?section=${contentKey}`)}`}>
                  <img
                    src={whatsapp.src}
                    alt="Whatsapp"
                    width={24}
                    height={24}
                  />
                </a>

                <a
                  target="_blank"
                  className={cn(`flex-center rounded-md p-[7px] text-lg text-white hover:bg-gray-200`)}
                  href={`https://www.linkedin.com/feed/?shareActive=true&shareUrl=${encodeURIComponent(`https://twitter.wordware.ai/${username}/${usernamePair}?section=${contentKey}`)}&text=${encodeURIComponent(`Here's our Twitter Compatibility Analysis for @${username} and @${usernamePair}, created by an AI Agent built on @wordware #wordwareai`)}`}>
                  <img
                    src={linkedin.src}
                    alt="LinkedIn"
                    width={18}
                    height={18}
                  />
                </a>
                <a
                  target="_blank"
                  className={cn(`flex-center rounded-md p-[7px] text-lg text-white hover:bg-gray-200`)}
                  href={`https://www.threads.net/intent/post?text=${encodeURIComponent(`Here's our Twitter Compatibility Analysis for @${username} and @${usernamePair}, created by an AI Agent built on @wordware #wordwareai\nhttps://twitter.wordware.ai/${username}/${usernamePair}?section=${contentKey}`)}`}>
                  <img
                    src={threads.src}
                    alt="Threads"
                    width={18}
                    height={18}
                  />
                </a>
              </div>
            </CardTitle>
            <div className="w-full border-b border-gray-300" />
          </CardHeader>
          <CardContent className="flex flex-col text-gray-700">{renderContent()}</CardContent>
        </div>
        <CardFooter className={`flex items-center justify-end space-x-2`}>
          <a href="https://wordware.ai?utm_source=twitterai">
            <WordwareLogo
              emblemOnly
              color={'black'}
              width={18}
            />
          </a>

          <span className="items-center text-xs">
            Made with{' '}
            <a
              href="https://wordware.ai?utm_source=twitterai"
              className="font-semibold underline-offset-4 hover:underline">
              Wordware
            </a>{' '}
            - AI superpowers for builders
          </span>
        </CardFooter>
      </div>
    </Card>
  )
}

export default AnalysisCard
