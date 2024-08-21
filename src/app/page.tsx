import { Suspense } from 'react'
import Link from 'next/link'
import { PiBrain, PiGithubLogo, PiXLogo } from 'react-icons/pi'

import Quote from '@/app/quote'
import NewPairFormBothNames from '@/components/new-pair-form-both-names'
import NewUsernameForm from '@/components/new-username-form'
import PHButton from '@/components/ph-button'
import { Button } from '@/components/ui/button'

import TopList from './top-list'

export const maxDuration = 181

const Page = () => {
  return (
    <section className="">
      <div className="flex flex-col md:flex-row">
        <div className="relative flex min-h-[80svh] flex-col justify-center bg-[#F9FAFB] p-8 sm:p-12 md:w-1/2 md:p-16 lg:p-24">
          {/* <h2 className="flex items-center justify-start gap-4 pb-8">
            Powered by{' '}
            <a
              href="https://wordware.ai/"
              target="_blank">
              <WordwareLogo
                color="black"
                width={134}
              />
            </a>
          </h2> */}
          <div className="grow" />

          <div>
            <div>
              <h1 className="mb-8 text-4xl md:text-5xl 2xl:text-5xl">
                discover your <br />
                <div className="flex items-center gap-2">
                  <PiXLogo className="min-w-[40px]" /> <span className="hidden md:block">twitter</span>
                  <span
                    className="bg-clip-text text-transparent"
                    style={{ backgroundColor: '#CB9F9F' }}>
                    personality
                  </span>
                </div>
              </h1>

              <div className="mb-8 flex w-full flex-col pt-2">
                <div className="flex w-full items-center">
                  <Suspense>
                    <NewUsernameForm />
                  </Suspense>
                </div>
              </div>

              <div className="mb-8 flex w-full flex-col pt-2">
                <h1 className="mb-8 text-4xl md:text-5xl 2xl:text-5xl">
                  or check
                  <span
                    className="bg-clip-text text-transparent"
                    style={{ backgroundColor: '#6DB1BF' }}>
                    {' '}
                    compatibility
                  </span>{' '}
                </h1>
                <div className="flex w-full items-center">
                  <Suspense>
                    <NewPairFormBothNames />
                  </Suspense>
                </div>
              </div>
            </div>

            <div className="mb-8 pt-8 text-base">
              These are AI Agents built with{' '}
              <a
                className="font-medium underline-offset-4 hover:underline"
                target="_blank"
                href="https://wordware.ai">
                Wordware
              </a>
              , it will:
              <ul className="mt-2 list-disc space-y-1 pl-8">
                <li>find Twitter accounts online</li>
                <li>will read your profile and tweets</li>
                <li>then it will use Large Language Models - like the ones in ChatGPT - to analyse your personality</li>
                <li>finally, it&apos;ll create a website with the analysis of your personality or compatibility</li>
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
