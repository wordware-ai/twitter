import { Suspense } from 'react'
import Link from 'next/link'

import NewUsernameForm from '@/components/new-username-form'
import Quote from '@/components/quote'

import TopList from './top-list'

const Page = () => {
  return (
    <section>
      <div className="flex min-h-screen flex-col md:flex-row">
        <div className="flex flex-col justify-center bg-[#F9FAFB] p-8 md:w-1/2">
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
              <strong>to reveal the unique traits that make you, you.</strong>
              <br />
              <br />
              plus, we provide you with interesting insights about
              <br />
              your love life, goals, or how others perceive you.
            </p>
          </div>
          <div>
            <hr className="mb-4" />
            <p className="2xl:text-md mb-2 text-sm">
              this app is powered by Wordware.
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
