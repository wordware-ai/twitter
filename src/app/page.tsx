import { Suspense } from 'react'
import Link from 'next/link'
import { PiGithubLogo } from 'react-icons/pi'

import Quote from '@/app/quote'
import WordwareLogo from '@/components/logo'
import NewUsernameForm from '@/components/new-username-form'
import { Button } from '@/components/ui/button'

import TopList from './top-list'

export const maxDuration = 180

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
              This is an AI Agent built with{' '}
              <a
                className="font-medium underline-offset-4 hover:underline"
                target="_blank"
                href="https://wordware.ai">
                Wordware
              </a>
              , it will:
              <ul className="mt-2 list-disc space-y-1 pl-8">
                <li>find your twitter account online</li>
                <li>an AI agent will read your tweets</li>
                <li>then it will use Large Language Models - like the ones in ChatGPT - to analyse your personality</li>
                <li>finally, it'll create a website with the analysis</li>
              </ul>
            </p>
          </div>
          <div className="grow" />

          <div className="bottom-6 space-y-3 border-t">
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
