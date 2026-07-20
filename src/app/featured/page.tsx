/* eslint-disable @next/next/no-img-element */
import { Metadata } from 'next'
import Link from 'next/link'
import { PiPlus } from 'react-icons/pi'

import SaunaLogo from '@/components/logo'
import Topbar from '@/components/top-bar'
import { getFeatured, getTop, getTopPairs, UserCardData } from '@/drizzle/queries'

export const maxDuration = 60
// Rendered per-request (the underlying queries are cached for an hour via
// unstable_cache) so builds don't need a database connection.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Featured Roasts',
  description: 'Interesting people who have been roasted by the AI agent — and popular compatibility pairings.',
}

const saunaTeam = ['kozerafilip', 'bertie_ai', 'unable0_']

const UserCard = ({ user }: { user: UserCardData }) => (
  <Link
    href={`/${user.username}`}
    key={user.id}
    className="relative block w-full rounded-lg border bg-paper p-4 shadow-[5px_5px_30px_rgba(190,190,190,0.15),-5px_-5px_30px_rgba(255,255,255,0.15)] transition-all duration-100 hover:shadow-[5px_5px_30px_rgba(190,190,190,0.3),-5px_-5px_30px_rgba(255,255,255,0.3)]">
    <div className="flex w-full items-center gap-4">
      <img
        src={user.profilePicture || ''}
        alt={user.name || user.username}
        width={50}
        height={50}
        className="rounded-full"
      />
      <div className="w-full">
        <p className="text-start font-semibold">{user.name || user.username}</p>
        <p className="text-start text-sm text-gray-500">@{user.username}</p>
        <p className="text-start text-sm text-gray-500">{user.followers?.toLocaleString()} followers</p>
      </div>

      {saunaTeam.includes(user.username) && (
        <div className="absolute bottom-4 right-4">
          <SaunaLogo
            emblemOnly
            color="black"
            width={16}
          />
        </div>
      )}
    </div>
  </Link>
)

const PairCard = ({ pair }: { pair: [UserCardData, UserCardData] }) => {
  const [user1, user2] = pair
  return (
    <Link
      href={`/${user1.username}/${user2.username}`}
      className="block w-full rounded-lg border bg-paper p-4 shadow-[5px_5px_30px_rgba(190,190,190,0.15),-5px_-5px_30px_rgba(255,255,255,0.15)] transition-all duration-100 hover:shadow-[5px_5px_30px_rgba(190,190,190,0.3),-5px_-5px_30px_rgba(255,255,255,0.3)]">
      <div className="flex w-full items-center justify-between gap-2">
        {[user1, user2].map((user, i) => (
          <div
            key={user.id}
            className={`flex w-5/12 items-center gap-3 ${i === 1 ? 'flex-row-reverse text-right' : ''}`}>
            <img
              src={user.profilePicture || ''}
              alt={user.name || user.username}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user.name || user.username}</p>
              <p className="truncate text-sm text-gray-500">@{user.username}</p>
            </div>
          </div>
        ))}
        <PiPlus className="absolute left-1/2 -translate-x-1/2 text-gray-400" />
      </div>
    </Link>
  )
}

const UserGrid = ({ users, title, subtitle }: { users: UserCardData[]; title: string; subtitle?: string }) => (
  <div className="flex-center w-full flex-col gap-2">
    <h2 className="text-2xl md:text-3xl">{title}</h2>
    {subtitle && <p className="mb-4 text-sm text-gray-500">{subtitle}</p>}
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
        />
      ))}
    </div>
  </div>
)

const Page = async () => {
  const [top, topPairs, featured] = await Promise.all([getTop(), getTopPairs(), getFeatured()])

  return (
    <div className="flex-center relative min-h-screen w-full flex-col gap-16 bg-desk px-4 py-28 sm:px-12 md:px-24 md:pt-24">
      <Topbar />

      <div className="flex-center flex-col gap-2 text-center">
        <h1 className="text-4xl md:text-5xl">
          featured <span className="rounded-xl bg-lichen px-3 font-medium text-forest">roasts</span>
        </h1>
        <p className="mt-4 max-w-xl text-gray-600">Interesting people who have been analyzed by the AI agent. Tap anyone to read their roast.</p>
      </div>

      <div className="flex w-full max-w-6xl flex-col gap-16">
        <UserGrid
          users={featured}
          title="Luminaries"
          subtitle="Founders, investors and builders the internet loves to roast"
        />

        <UserGrid
          users={top}
          title="Most Followed"
          subtitle="The biggest accounts analyzed so far"
        />

        <div className="flex-center w-full flex-col gap-2">
          <h2 className="text-2xl md:text-3xl">Popular Compatibilities</h2>
          <p className="mb-4 text-sm text-gray-500">Famous duos, put through the compatibility check</p>
          <div className="relative grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topPairs.map((pair) => (
              <div
                className="relative"
                key={pair[0].id + pair[1].id}>
                <PairCard pair={pair} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
