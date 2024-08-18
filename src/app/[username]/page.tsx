import { Suspense } from 'react'
import { notFound, redirect } from 'next/navigation'
import { Metadata } from 'next/types'

import NewPairForm from '@/components/new-pair-form'
import NewUsernameForm from '@/components/new-username-form'
import { getUser } from '@/drizzle/queries'

import { ProfileHighlight } from '../../components/analysis/profile-highlight'
// import PHPopup from './ph-popup'
import ResultComponent from '../../components/analysis/result-component'
import Topbar from '../../components/top-bar'

export const maxDuration = 300
export const dynamic = 'force-dynamic'

// LEE Case 2
const Page = async ({ params }: { params: { username: string } }) => {
  const data = await getUser({ username: params.username })

  if (!data) {
    return redirect(`/?u=${params.username}`)
  }

  return (
    <div className="flex-center relative min-h-screen w-full flex-col gap-12 bg-[#F9FAFB] px-4 py-28 sm:px-12 md:px-28 md:pt-24">
      <Topbar />
      <div className="flex-center flex-col gap-6">
        <div className="text-center text-xl font-light">
          Here&apos;s the <span className="font-medium">AI agent</span> analysis of your personality...
        </div>
        <ProfileHighlight user={data} />
      </div>

      <ResultComponent user={data} />

      <div className="flex-center container mx-auto flex-col space-y-4 px-4">
        <div className="text-center text-2xl font-light">Try with your own profile</div>
        <div className="flex-center flex-col space-y-6">
          <div className="w-fit">
            <Suspense>
              <NewUsernameForm />
            </Suspense>
          </div>
          <p>— or see how compatible you are with someone else 💞💼💍🚩🚀 —</p>
          <NewPairForm />
        </div>
      </div>
    </div>
  )
}

export default Page

export async function generateMetadata({ params, searchParams }: { params: { username?: string }; searchParams: { section?: string } }) {
  if (!params.username) return notFound()
  const user = await getUser({ username: params.username })

  if (user == null) notFound()
  const imageParams = new URLSearchParams()

  const name = user?.name || ''
  const username = user?.username || ''
  const picture = user?.profilePicture || ''
  const section = searchParams.section || 'about'
  const content = (user.analysis as any)?.[section]
  const emojis = ((user.analysis as any)?.emojis || '').trim()

  imageParams.set('name', name)
  imageParams.set('username', username)
  imageParams.set('picture', picture)
  imageParams.set('content', typeof content === 'string' ? content : JSON.stringify(content))
  imageParams.set('emojis', emojis)
  imageParams.set('section', section)

  const image = {
    alt: 'Banner',
    url: `/api/og?${imageParams.toString()}`,
    width: 1200,
    height: 630,
  }

  return {
    title: `${name}`,
    description: `Check out ${name}'s analysis.`,
    openGraph: {
      url: section ? `/${username}?section=${section}` : `/${username}`,
      images: image,
    },
    twitter: {
      images: image,
    },
  } satisfies Metadata
}
