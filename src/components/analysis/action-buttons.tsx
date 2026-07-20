import { PiXLogo } from 'react-icons/pi'

import SaunaLogo from '@/components/logo'
import linkedin from '@/components/logos/linkedin.svg'
import threads from '@/components/logos/threads.svg'
import whatsapp from '@/components/logos/whatsapp.svg'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getURL } from '@/lib/config'

type ActionButtonsProps = {
  shareActive: boolean
  text?: string
  url?: string
}

const ActionButtons = ({ shareActive, text, url }: ActionButtonsProps) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex-center flex-wrap gap-4">
        {shareActive && (
          <Button
            size={'sm'}
            asChild>
            <a
              target="_blank"
              className="flex-center gap-2"
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text ?? `this is my Twitter Personality analysis by Sauna's AI agent`)}&url=${encodeURIComponent(url ?? getURL())}`}>
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
            href="https://sauna.ai/">
            <SaunaLogo
              emblemOnly
              color="white"
              width={20}
            />
            Sauna
          </a>
        </Button>
      </div>
      {shareActive && url && (
        <div className="flex-center gap-2">
          <span className="font-bold">Share:</span>
          <a
            target="_blank"
            className={cn(`flex-center flex-center h-8 gap-1 rounded-md p-1 text-sm text-black hover:bg-gray-200`)}
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text ?? `this is my Twitter Personality analysis by Sauna's AI agent`)}&url=${encodeURIComponent(url ?? getURL())}`}>
            <PiXLogo /> Twitter
          </a>
          <a
            target="_blank"
            className={cn(`flex-center flex-center h-8 gap-1 rounded-md p-1 text-sm text-black hover:bg-gray-200`)}
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`this is my Twitter Personality analysis by Sauna's AI agent\n\n ${url}`)}`}>
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
            href={`https://www.linkedin.com/feed/?shareActive=true&shareUrl=${encodeURIComponent(url ?? '')}&text=${encodeURIComponent(`This is my Twitter Personality analysis by Sauna's AI agent`)}`}>
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
            href={`https://www.threads.net/intent/post?text=${encodeURIComponent(`This is my Twitter Personality analysis by Sauna's AI agent\n${url ?? ''}`)}`}>
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
