import { Suspense } from 'react'
import { PiGithubLogo, PiXLogo } from 'react-icons/pi'

import NewPairFormBothNames from '@/components/new-pair-form-both-names'
import NewUsernameForm from '@/components/new-username-form'
import { Button } from '@/components/ui/button'

export const maxDuration = 181

// follow tag
export async function generateMetadata({ searchParams }: { searchParams: Promise<{ ref?: string; u?: string }> }) {
  // Allow following only for specific query parameters
  const { ref, u } = await searchParams
  const allowedRefs = ['blog.wordware.ai']
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
          <div className="relative mx-auto flex min-h-[80svh] w-full max-w-3xl flex-col justify-center bg-[#F9FAFB] p-8 sm:p-12 md:p-16">
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
    </>
  )
}

export default Page
