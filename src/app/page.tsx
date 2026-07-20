import { Suspense } from 'react'
import Link from 'next/link'
import { PiGithubLogo, PiUsersThree, PiXLogo } from 'react-icons/pi'

import NewPairFormBothNames from '@/components/new-pair-form-both-names'
import NewUsernameForm from '@/components/new-username-form'
import PoweredBySauna from '@/components/powered-by-sauna'
import { Button } from '@/components/ui/button'

export const maxDuration = 181

// follow tag
export async function generateMetadata({ searchParams }: { searchParams: Promise<{ ref?: string; u?: string }> }) {
  // Allow following only for specific query parameters
  const { ref, u } = await searchParams
  const allowedRefs = ['blog.wordware.ai', 'sauna.ai', 'www.sauna.ai']
  const isAllowedRef = ref && allowedRefs.includes(ref)
  const isRobotsQuery = u === 'robots.txt'
  // if robots.txt or blog.wordware.ai, allow following
  if (isAllowedRef || isRobotsQuery) {
    return {
      robots: {
        index: true,
        follow: true,
      },
    }
  }

  // For all other cases, default to no follow
  return {
    robots: {
      index: false,
      follow: false,
    },
  }
}

const Page = () => {
  return (
    <>
      {/* <Head>
        <meta name="google-site-verification" content="voWl21V26444ofs1ojAqhH1UdOTEWBvJQHp9jADLDQU" />
    </Head> */}
      <section className="">
        <div className="flex flex-col md:flex-row">
          <div className="relative flex min-h-[80svh] flex-col items-center justify-center bg-desk p-8 sm:p-12 md:w-1/2 md:p-16">
            <div className="grow" />

            <div className="w-full max-w-xl">
              <div>
                <h1 className="mb-8 text-4xl md:text-5xl 2xl:text-5xl">
                  discover your <br />
                  <div className="flex items-center gap-2">
                    <PiXLogo className="min-w-[40px]" /> <span className="hidden md:block">twitter</span>
                    <span className="rounded-xl bg-lichen px-3 font-medium text-forest">personality</span>
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
                    or check <span className="rounded-xl bg-azure px-3 font-medium text-white">compatibility</span>{' '}
                  </h1>
                  <div className="flex w-full items-center">
                    <Suspense>
                      <NewPairFormBothNames />
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

            <div className="bottom-6 w-full max-w-xl space-y-3 border-t">
              <div className="flex flex-col gap-2">
                <div className="mt-8 flex flex-wrap gap-2">
                  <Button
                    variant={'outline'}
                    asChild>
                    <Link
                      href="/featured"
                      className="flex-center gap-2">
                      <PiUsersThree />
                      Featured Roasts
                    </Link>
                  </Button>
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
          <div className="hidden w-full items-center justify-center bg-canvas md:flex md:w-1/2">
            <PoweredBySauna />
          </div>
        </div>
      </section>
    </>
  )
}

export default Page
