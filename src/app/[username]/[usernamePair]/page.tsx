import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Metadata } from 'next/types'
import { PiPlus } from 'react-icons/pi'

import { ProfileHighlight } from '@/components/analysis/profile-highlight'
import NewPairFormBothNames from '@/components/new-pair-form-both-names'
import Topbar from '@/components/top-bar'
import { getPair, getUser, insertPair } from '@/drizzle/queries'

import PairComponent from '../../../components/analysis/pair-component'

const PairPage = async ({ params }: { params: Promise<{ username: string; usernamePair: string }> }) => {
  const { username, usernamePair } = await params
  console.log('Page for', username, 'and', usernamePair)
  //ALWAYS SORT THE USER IDS SO WE CAN USE THEM AS KEYS
  const [username1, username2] = [username, usernamePair].sort()
  let pair = await getPair({ usernames: [username1, username2] })

  const [user1, user2] = await Promise.all([getUser({ username: username1 }), getUser({ username: username2 })])

  if (!user1 || !user2) return <div>Pair does not exist</div>

  // Self-heal: when both users exist but the pair row doesn't (direct URL
  // visit, or the creation flow was interrupted), create it on the fly
  if (!pair) {
    try {
      await insertPair({ usernames: [username1, username2] })
    } catch {
      // lost a race with a concurrent visitor — the row exists now
    }
    pair = await getPair({ usernames: [username1, username2] })
  }

  if (!pair) return <div>Pair does not exist</div>

  return (
    <div className="flex-center relative min-h-screen w-full flex-col gap-12 bg-desk px-4 py-28 sm:px-12 md:px-28 md:pt-24">
      <Topbar />
      <div className="flex-center flex-col gap-6">
        <div className="text-center text-xl font-light">
          Here&apos;s the <span className="font-medium">AI agent</span> analysis of your compatibility...
        </div>
        <div className="flex flex-col items-center justify-center gap-2 md:flex-row md:gap-8">
          <div className="w-full rounded-lg p-2 hover:bg-stone-200 md:w-5/12">
            <Link href={`/${username1}`}>
              <ProfileHighlight user={user1} />
            </Link>
          </div>
          <PiPlus size={36} />
          <div className="w-full rounded-lg p-2 hover:bg-stone-200 md:w-5/12">
            <Link href={`/${username2}`}>
              <ProfileHighlight user={user2} />
            </Link>
          </div>
        </div>
      </div>

      <PairComponent
        users={[user1, user2]}
        pair={pair}
      />
      <div className="my-8 flex w-full max-w-sm flex-col items-center space-y-4">
        <p className="text-lg">Check compatibility with someone else!</p>
        <NewPairFormBothNames />
      </div>
    </div>
  )
}

export default PairPage

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ username: string; usernamePair: string }>
  searchParams: Promise<{ section: string }>
}) {
  const { username, usernamePair } = await params
  const [username1, username2] = [username, usernamePair].sort()
  const [user1, user2] = await Promise.all([getUser({ username: username1 }), getUser({ username: username2 })])
  const pair = await getPair({ usernames: [username1, username2] })

  // Only 404 when a user is missing — a missing pair row is self-healed by the
  // page component, so metadata must not kill the request before that happens
  if (!user1 || !user2) return notFound()

  const imageParams = new URLSearchParams()
  const section = (await searchParams).section || 'about'
  // const section = 'about' //TODO: Hardcode about for now, to make it dynamic we need to design the full OG image
  // generator for all the section types
  const content = (pair?.analysis as any)?.[section]

  imageParams.set('name1', user1.name || '')
  imageParams.set('username1', user1.username || '')
  imageParams.set('picture1', user1.profilePicture || '')
  imageParams.set('name2', user2.name || '')
  imageParams.set('username2', user2.username || '')
  imageParams.set('picture2', user2.profilePicture || '')
  imageParams.set('section', section)
  imageParams.set('content', JSON.stringify(content))

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
