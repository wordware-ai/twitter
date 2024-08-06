import { Suspense } from 'react'
import Link from 'next/link'
import { PiBrain, PiGithubLogo } from 'react-icons/pi'

import Quote from '@/app/quote'
import WordwareLogo from '@/components/logo'
import NewUsernameForm from '@/components/new-username-form'
import PHButton from '@/components/ph-button'
import { Button } from '@/components/ui/button'

import TopList from './top-list'

export const maxDuration = 181

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
            <p className="text-sm text-red-900">
              We&apos;re currently experiencing high demand.
              <br />
              Thank you for your patience as we work to accommodate all users.
            </p>

            <div className="mb-8 flex items-center pt-2">
              <Suspense>
                <NewUsernameForm />
              </Suspense>
            </div>

            <div className="mb-8 pt-8 text-base 2xl:text-lg">
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
                <li>finally, it&apos;ll create a website with the analysis</li>
              </ul>
            </div>
          </div>
          <div className="grow" />

          <div className="bottom-6 space-y-3 border-t">
            <div className="flex flex-col gap-2">
              <p className="mt-8 text-sm">
                <span
                  className="bg-clip-text font-bold text-transparent"
                  style={{ backgroundColor: '#CB9F9F' }}>
                  support the Wordware launch!
                </span>
              </p>
              <div className="flex flex-wrap gap-2">
                <PHButton />

                <Button
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
                <Button
                  asChild
                  variant={'outline'}>
                  <Link
                    href="/open"
                    className="flex items-center gap-2">
                    <PiBrain />
                    Stats
                  </Link>
                </Button>
              </div>
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
