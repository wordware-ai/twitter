import { PiXLogo } from 'react-icons/pi'

import WordwareLogo from '@/components/logo'
import PHButton from '@/components/ph-button'
import { Button } from '@/components/ui/button'

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
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text ?? `this is my Twitter Personality analysis by AI Agent, built on @wordware_ai`)}&url=${encodeURIComponent(url ?? `https://twitter.wordware.ai/`)}`}>
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
    </div>
  )
}

export default ActionButtons
