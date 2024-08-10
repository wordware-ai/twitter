import React from 'react'
import { notFound } from 'next/navigation'
import { Metadata } from 'next/types'
import { PiPlus } from 'react-icons/pi'

import { getPair, getUser } from '@/actions/actions'
import Topbar from '@/components/top-bar'

import PairComponent from '../../../components/analysis/pair-component'
import { ProfileHighlight } from '../../../components/analysis/profile-highlight'

const PairPage = async ({ params: { username, usernamePair } }: { params: { username: string; usernamePair: string } }) => {
  //ALWAYS SORT THE USER IDS SO WE CAN USE THEM AS KEYS
  const [username1, username2] = [username, usernamePair].sort()
  const pair = await getPair({ usernames: [username1, username2] })
  const [user1, user2] = await Promise.all([getUser({ username: username1 }), getUser({ username: username2 })])

  if (!user1 || !user2 || !pair) return <div>Pair does not exist</div>

  return (
    <div className="flex-center relative min-h-screen w-full flex-col gap-12 bg-[#F9FAFB] px-4 py-28 sm:px-12 md:px-28 md:pt-24">
      <Topbar />
      <div className="flex-center flex-col gap-6">
        <div className="text-center text-xl font-light">
          Here&apos;s the <span className="font-medium">AI agent</span> analysis of your compatibility...
        </div>
        <div className="flex flex-col items-center gap-2 md:flex-row md:gap-8">
          <div className="w-full md:w-5/12">
            <ProfileHighlight user={user1} />
          </div>
          <PiPlus size={36} />
          <div className="w-full md:w-5/12">
            <ProfileHighlight user={user2} />
          </div>
        </div>
      </div>

      <PairComponent
        users={[user1, user2]}
        pair={pair}
      />
    </div>
  )
}

export default PairPage

export async function generateMetadata({ params }: { params: { username: string; usernamePair: string }; searchParams: { section: string } }) {
  const [username1, username2] = [params.username, params.usernamePair].sort()
  const [user1, user2] = await Promise.all([getUser({ username: username1 }), getUser({ username: username2 })])
  const pair = await getPair({ usernames: [username1, username2] })

  if (!user1 || !user2 || !pair) return notFound()

  const imageParams = new URLSearchParams()
  // const section = searchParams.section || 'about'
  const section = 'about' //TODO: Hardcode about for now, to make it dynamic we need to design the full OG image generator for all the section types
  const content = (pair.analysis as any)?.[section]

  imageParams.set('name1', user1.name || '')
  imageParams.set('username1', user1.username || '')
  imageParams.set('picture1', user1.profilePicture || '')
  imageParams.set('name2', user2.name || '')
  imageParams.set('username2', user2.username || '')
  imageParams.set('picture2', user2.profilePicture || '')
  imageParams.set('section', section)
  imageParams.set('content', content)

  const image = {
    alt: 'Pair Banner',
    url: `/api/og/pair?${imageParams.toString()}`,
    width: 1200,
    height: 630,
  }

  return {
    title: `${user1.name} & ${user2.name}`,
    description: `Check out our compatibility analysis for ${user1.name} and ${user2.name}.`,
    openGraph: {
      url: section ? `/${username1}/${username2}?section=${section}` : `/${username1}/${username2}`,
      images: image,
    },
    twitter: {
      images: image,
    },
  } satisfies Metadata
}
