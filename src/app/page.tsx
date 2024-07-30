import { Suspense } from 'react'
import Link from 'next/link'
import { PiGithubLogo } from 'react-icons/pi'

import Quote from '@/app/quote'
import WordwareLogo from '@/components/logo'
import NewUsernameForm from '@/components/new-username-form'
import { Button } from '@/components/ui/button'

import TopList from './top-list'

export const maxDuration = 300

const Page = () => {
  return (
    <section>
      <div className="flex flex-col md:flex-row">
        <div className="relative flex min-h-screen flex-col justify-center bg-[#F9FAFB] p-8 sm:p-12 md:w-1/2 md:p-16 lg:p-24">
          <h2 className="flex items-center justify-start gap-4">
            Powered by{' '}
            <a
              href="https://wordware.ai/"
              target="_blank">
              <WordwareLogo
                color="black"
                width={134}
              />
            </a>
          </h2>
          <div className="grow" />

          <div>
            <h1 className="mb-8 text-4xl md:text-5xl 2xl:text-6xl">
              discover your <br />
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundColor: '#CB9F9F' }}>
                {' '}
                twitter{' '}
              </span>
              personality
            </h1>

            <div className="mb-8 flex items-center pt-2">
              <Suspense>
                <NewUsernameForm />
              </Suspense>
            </div>

            <p className="mb-8 pt-8 text-base 2xl:text-lg">
              we built an AI agent that analyzes your tweets
              <br />
              <span className="font-medium">to reveal the unique traits that make you, you.</span>
              <br />
              <br />
              plus, we provide you with interesting insights about
              <br />
              your love life, goals, or how others perceive you.
            </p>
          </div>
          <div className="grow" />

          <div className="bottom-6 space-y-3 border-t">
            <p className="pt-3 text-sm">
              this app is powered by Wordware - an IDE for building AI agents.
              <br />
              you can build your own AI app in ~15 minutes.{' '}
              <span
                className="bg-clip-text font-bold text-transparent"
                style={{ backgroundColor: '#CB9F9F' }}>
                <Link
                  href="https://www.wordware.ai/"
                  target="_blank"
                  rel="noopener noreferrer">
                  try here!
                </Link>
              </span>
            </p>
            <div className="flex items-center justify-start gap-2">
              <Button
                size={'sm'}
                variant={'outline'}
                asChild>
                <a
                  href={`https://app.wordware.ai/share/${process.env.WORDWARE_PROMPT_ID}/playground`}
                  target="_blank"
                  className="flex-center gap-2">
                  <WordwareLogo
                    emblemOnly
                    color={'black'}
                    width={12}
                  />
                  Duplicate this AI Agent
                </a>
              </Button>
              <Button
                size={'sm'}
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
            <div className="flex flex-col gap-2">
              <p className="mt-8 text-sm">
                <span
                  className="bg-clip-text font-bold text-transparent"
                  style={{ backgroundColor: '#CB9F9F' }}>
                  support the Wordware launch this Friday!
                </span>
              </p>
              <a
                href="https://www.producthunt.com/posts/wordware-yc-s24?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-wordware&#0045;yc&#0045;s24"
                target="_blank">
                <img
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=474117&theme=dark"
                  alt="Wordware&#0032;&#0040;YC&#0032;S24&#0041; - web&#0045;hosted&#0032;IDE&#0032;for&#0032;building&#0032;AI&#0032;agents | Product Hunt"
                  style={{ width: '166px', height: '36px' }}
                  width={166}
                  height={36}
                />
              </a>
            </div>
          </div>
        </div>
        <div className="flex h-full w-full items-center justify-center bg-[#F6F0F0] md:h-auto md:w-1/2">
          <div className="hidden md:block">
            <Quote />
          </div>
        </div>
      </div>
      <TopList />
    </section>
  )
}

export default Page
