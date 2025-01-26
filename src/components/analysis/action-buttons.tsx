import { PiXLogo } from 'react-icons/pi'

import WordwareLogo from '@/components/logo'
import linkedin from '@/components/logos/linkedin.svg'
import threads from '@/components/logos/threads.svg'
import whatsapp from '@/components/logos/whatsapp.svg'
import PHButton from '@/components/ph-button'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ActionButtonsProps = {
  shareActive: boolean
  text?: string
  url?: string
}

const ActionButtons = ({ shareActive, text, url }: ActionButtonsProps) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex-center flex-wrap gap-4">
        <PHButton text="Support us!" />
        {shareActive && (
          <Button
            size={'sm'}
            asChild>
            <a
              target="_blank"
              className="flex-center gap-2"
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text ?? `this is my Twitter Personality analysis by AI Agent, built on @wordware`)}&url=${encodeURIComponent(url ?? `https://twitter.wordware.ai/`)}`}>
              <PiXLogo /> Share
            </a>
          </Button>
        )}
        <Button
          size={'sm'}
          asChild>
          <a
            className="flex-center gap-2"
            target="_blank"
            href="https://wordware.ai/">
            <WordwareLogo
              emblemOnly
              color="white"
              width={20}
            />
            Wordware
          </a>
        </Button>
      </div>
      {shareActive && url && (
        <div className="flex-center gap-2">
          <span className="font-bold">Share:</span>
          <a
            target="_blank"
            className={cn(`flex-center flex-center h-8 gap-1 rounded-md p-1 text-sm text-black hover:bg-gray-200`)}
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text ?? `this is my Twitter Personality analysis by AI Agent, built on @wordware`)}&url=${encodeURIComponent(url ?? `https://twitter.wordware.ai/`)}`}>
            <PiXLogo /> Twitter
          </a>
          <a
            target="_blank"
            className={cn(`flex-center flex-center h-8 gap-1 rounded-md p-1 text-sm text-black hover:bg-gray-200`)}
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`this is my Twitter Personality analysis by AI Agent, built on @wordware\n\n ${url}`)}`}>
            <img
              src={whatsapp.src}
              alt="Whatsapp"
              width={24}
              height={24}
            />
            WhatsApp
          </a>
          <a
            target="_blank"
            className={cn(`flex-center flex-center h-8 gap-1 rounded-md p-[7px] text-sm text-black hover:bg-gray-200`)}
            href={`https://www.linkedin.com/feed/?shareActive=true&shareUrl=${encodeURIComponent(url ?? '')}&text=${encodeURIComponent(`This is my Twitter Personality analysis by AI Agent, built on @wordware #wordwareai`)}`}>
            <img
              src={linkedin.src}
              alt="LinkedIn"
              width={18}
              height={18}
            />
            LinkedIn
          </a>
          <a
            target="_blank"
            className={cn(`flex-center flex-center h-8 gap-1 rounded-md p-[7px] text-sm text-black hover:bg-gray-200`)}
            href={`https://www.threads.net/intent/post?text=${encodeURIComponent(`This is my Twitter Personality analysis by AI Agent, built on @wordware #wordwareai\n${url ?? ''}`)}`}>
            <img
              src={threads.src}
              alt="Threads"
              width={18}
              height={18}
            />
            Threads
          </a>
        </div>
      )}
    </div>
  )
}

export default ActionButtons
