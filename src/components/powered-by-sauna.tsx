import { PiArrowUpRight } from 'react-icons/pi'

import SaunaLogo from '@/components/logo'
import { Button } from '@/components/ui/button'

const PoweredBySauna: React.FC = () => {
  return (
    <div className="flex flex-col items-center space-y-8 rounded-lg p-8 text-center">
      <div className="flex flex-col items-center p-8">
        Powered by{' '}
        <a
          className="mt-4"
          href="https://sauna.ai/"
          target="_blank">
          <SaunaLogo
            color="black"
            width={340}
          />
        </a>
        <p className="my-12 text-2xl font-normal text-ink">— The first multiplayer AI —</p>
        <div className="mt-4 max-w-md space-y-4 text-lg">
          <p>An AI coworker that learns how you work, remembers what matters, and acts on it.</p>
          <p>The same kind of agent that just read your tweets can run your busywork:</p>
          <div className="pt-4">
            <Button
              variant={'outline'}
              asChild>
              <a
                href="https://sauna.ai/"
                target="_blank"
                className="flex-center gap-2">
                <SaunaLogo
                  emblemOnly
                  color={'black'}
                  width={12}
                />
                Meet Sauna
                <PiArrowUpRight />
              </a>
            </Button>
            <div className="mt-2 text-sm text-gray-500">sauna.ai</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PoweredBySauna
