import { PiArrowUpRight, PiGithubLogo } from 'react-icons/pi'

import { Button } from '@/components/ui/button'

import SaunaLogo from './logo'

const Callout = () => {
  return (
    <div className="flex-center relative w-full flex-col gap-12 bg-desk p-4 sm:p-12 md:p-24">
      <h2 className="mb-4 w-full text-center text-2xl text-stone-500 md:text-4xl lg:text-5xl xl:text-6xl">
        Built by the team behind <span className="text-foreground">Sauna</span>
      </h2>

      <div className="max-w-8xl relative flex w-full flex-col items-start gap-6 overflow-hidden rounded-3xl bg-forest p-10 font-light text-white md:flex-row lg:p-16">
        <div className="w-full text-5xl md:w-1/2">
          Where work
          <br />
          gets done
        </div>
        <div className="w-full md:w-1/2">
          <h3 className="mb-4 text-2xl">SAUNA</h3>
          <p className="mb-6 font-thin">
            Sauna is your AI coworker — it learns how you work, remembers what matters, and acts on it. Connected to the tools you already use, it drafts
            messages in your voice, tracks priorities, files tickets, and delivers briefings, so work moves forward even when you&apos;re not looking.
          </p>
          <h3 className="mb-4 text-2xl">MULTIPLAYER</h3>
          <p className="mb-6 font-thin">
            Unlike single-player AI tools, Sauna is built for teams: shared context, shared memory, and one agent your whole team can rely on — on the web, iOS,
            iMessage, Slack, and email.
          </p>
          <h3 className="mb-4 text-2xl">ALWAYS ON</h3>
          <p className="mb-6 font-thin">
            It runs in the cloud, so it keeps working while you&apos;re offline. The same kind of AI agent that just analyzed your Twitter personality can run
            your busywork.
          </p>
        </div>
      </div>

      <div className="flex-center flex-col gap-2 md:flex-row">
        <Button
          size={'lg'}
          variant={'default'}
          asChild>
          <a
            href="https://sauna.ai"
            target="_blank"
            className="flex-center gap-2">
            <SaunaLogo
              emblemOnly
              color={'white'}
              width={14}
            />
            Try Sauna
            <PiArrowUpRight />
          </a>
        </Button>

        <Button
          size={'lg'}
          variant={'outline'}
          asChild>
          <a
            href="https://github.com/wordware-ai/twitter"
            target="_blank"
            className="flex-center gap-2">
            <PiGithubLogo />
            GitHub Repo
          </a>
        </Button>
      </div>
    </div>
  )
}

export default Callout
