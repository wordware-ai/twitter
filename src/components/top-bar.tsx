import Link from 'next/link'
import { PiArrowUpRight, PiCaretLeft, PiUsersThree } from 'react-icons/pi'

import SaunaLogo from '@/components/logo'
import { Button } from '@/components/ui/button'

const Topbar = () => {
  return (
    <div className="flex-center fixed top-0 z-50 w-full border-b bg-white/80 py-2 shadow-[5px_5px_30px_rgba(190,190,190,0.15),-5px_-5px_30px_rgba(255,255,255,0.15)] backdrop-blur-sm">
      <div className="flex w-full flex-col items-center justify-between gap-4 px-2 md:flex-row md:px-12">
        <div className="hidden w-full items-center gap-2 md:flex">
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
          <Button
            size={'sm'}
            variant={'outline'}
            asChild>
            <Link
              className="flex-center gap-2"
              href={'/featured'}>
              <PiUsersThree />
              Featured Roasts
            </Link>
          </Button>
        </div>
        <div className="flex w-full items-center justify-center gap-3 whitespace-nowrap">
          Meet your AI coworker
          <a
            href="https://sauna.ai/"
            target="_blank">
            <SaunaLogo
              color="black"
              width={110}
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
              href="https://sauna.ai/"
              target="_blank"
              className="flex-center gap-2">
              <SaunaLogo
                emblemOnly
                color={'white'}
                width={12}
              />
              <p>
                Try <span className="hidden md:inline">Sauna</span>
              </p>
              <PiArrowUpRight />
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Topbar
