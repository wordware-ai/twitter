import { PiXLogo } from 'react-icons/pi'

import WordwareLogo from '@/components/logo'
import PHButton from '@/components/ph-button'
import { Button } from '@/components/ui/button'

import { TwitterAnalysis } from './analysis'

type ActionButtonsProps = {
  result: TwitterAnalysis | undefined
  username: string
}

const ActionButtons = ({ result, username }: ActionButtonsProps) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex-center flex-wrap gap-4">
        <PHButton text="Support us!" />
        {result?.about && (
          <Button
            size={'sm'}
            asChild>
            <a
              target="_blank"
              className="flex-center gap-2"
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`this is my Twitter Personality analysis by AI Agent, built on @wordware_ai`)}&url=${encodeURIComponent(`https://twitter.wordware.ai/${username}`)}`}>
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
