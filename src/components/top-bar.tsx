import Link from 'next/link'
import { PiCaretLeft, PiXLogo } from 'react-icons/pi'

import WordwareLogo from '@/components/logo'
// import PHButton from '@/components/ph-button'
import { Button } from '@/components/ui/button'

const Topbar = () => {
  return (
    <div className="flex-center fixed top-0 z-50 w-full border-b bg-white/80 py-2 shadow-[5px_5px_30px_rgba(190,190,190,0.15),-5px_-5px_30px_rgba(255,255,255,0.15)] backdrop-blur-sm">
      <div className="flex w-full flex-col items-center justify-between gap-4 px-2 md:flex-row md:px-12">
        <div className="hidden w-full md:flex">
          <Button
            size={'sm'}
            variant={'outline'}
            asChild>
            <Link
              className="flex-center gap-2"
              href={'/'}>
              <PiCaretLeft />
              Homepage
            </Link>
          </Button>
        </div>
        <div className="flex w-full items-center justify-center gap-2 whitespace-nowrap">
          Build your AI App for free in
          <a
            href="https://wordware.ai/"
            target="_blank">
            <WordwareLogo
              color="black"
              width={134}
            />
          </a>
        </div>
        <div className="flex w-full items-center justify-between gap-2 md:justify-end">
          <Button
            size={'sm'}
            variant={'outline'}
            asChild>
            <Link
              className="flex-center gap-2 md:hidden"
              href={'/'}>
              <PiCaretLeft />
            </Link>
          </Button>
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
                Duplicate <span className="hidden md:inline">this</span> AI Agent
              </p>
            </a>
          </Button>
          {/* <PHButton text="Support us!" /> */}
          <Button
            size={'sm'}
            variant={'outline'}
            asChild>
            <a
              href="https://x.com/wordware_ai"
              target="_blank"
              className="flex-center gap-2">
              <PiXLogo size={18} />
              <p>
                Follow <span className="hidden md:inline">us</span>
              </p>
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Topbar
