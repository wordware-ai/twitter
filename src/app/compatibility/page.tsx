import { Suspense } from 'react'
import { Metadata } from 'next'
import { PiGithubLogo, PiXLogo } from 'react-icons/pi'

import NewPairFormBothNames from '@/components/new-pair-form-both-names'
import NewUsernameForm from '@/components/new-username-form'
import { Button } from '@/components/ui/button'

export const maxDuration = 181

export const metadata: Metadata = {
  openGraph: {
    images: [
      {
        url: '/social/og-pairs.png', // Replace with your actual image path
        width: 1200,
        height: 630,
        alt: 'Twitter Compatibility Check',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/social/og-pairs.png'], // Replace with your actual image path
  },
}

const Page = () => {
  return (
    <section className="">
      <div className="flex flex-col md:flex-row">
        <div className="relative mx-auto flex min-h-[80svh] w-full max-w-3xl flex-col justify-center bg-desk p-8 sm:p-12 md:p-16">
          <div className="grow" />

          <div>
            <div>
              <div className="mb-8 flex w-full flex-col pt-2">
                <h1 className="mb-8 text-4xl md:text-5xl 2xl:text-5xl">
                  discover your
                  <span className="font-medium text-steel"> compatibility</span>{' '}
                </h1>
                <div className="flex w-full items-center">
                  <Suspense>
                    <NewPairFormBothNames />
                  </Suspense>
                </div>
              </div>
              <h1 className="mb-8 text-4xl md:text-5xl 2xl:text-5xl">
                or check <br />
                <div className="flex items-center gap-2">
                  <PiXLogo className="min-w-[40px]" /> <span className="hidden md:block">twitter</span>
                  <span className="font-medium text-forest">personality</span>
                </div>
              </h1>

              <div className="mb-8 flex w-full flex-col pt-2">
                <div className="flex w-full items-center">
                  <Suspense>
                    <NewUsernameForm />
                  </Suspense>
                </div>
              </div>
            </div>

            <div className="mb-8 pt-8 text-base">
              An AI agent by{' '}
              <a
                className="font-medium underline-offset-4 hover:underline"
                target="_blank"
                href="https://sauna.ai">
                Sauna
              </a>{' '}
              will:
              <ul className="mt-2 list-disc space-y-1 pl-8">
                <li>find your Twitter account online</li>
                <li>read your profile and tweets</li>
                <li>use frontier AI models to analyse your personality</li>
                <li>create a shareable page with your personality or compatibility analysis</li>
              </ul>
            </div>
          </div>
          <div className="grow" />

          <div className="bottom-6 space-y-3 border-t">
            <div className="flex flex-col gap-2">
              <div className="mt-8 flex flex-wrap gap-2">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Page
