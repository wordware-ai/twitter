import Link from 'next/link'
import { PiPlus } from 'react-icons/pi'

import Marquee from '@/components/magicui/marquee'
import { cn } from '@/lib/utils'

import { UserCardData } from './top-list'

const ReviewCard = ({ user }: { user: UserCardData }) => {
  return (
    <Link href={`/${user.username}`}>
      <figure className={cn('relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4', 'border-gray-950/[.1] bg-white hover:bg-gray-950/[.05]')}>
        <div className="flex flex-row items-center gap-2">
          <img
            className="rounded-full"
            width="40"
            height="40"
            alt=""
            src={user.profilePicture!}
          />
          <div className="flex flex-col">
            <figcaption className="font-medium">{user.name}</figcaption>
            <p className="text-sm text-gray-500">@{user.username}</p>
          </div>
        </div>
        <blockquote className="mt-2 text-sm text-gray-500">{user.followers?.toLocaleString()} followers</blockquote>
      </figure>
    </Link>
  )
}

const PairCard = ({ user1, user2 }: { user1: UserCardData; user2: UserCardData }) => {
  return (
    <Link href={`/${user1.username}/${user2.username}`}>
      <figure className={cn('relative cursor-pointer overflow-hidden rounded-xl border p-4', 'border-gray-950/[.1] bg-white hover:bg-gray-950/[.05]')}>
        <div className="flex flex-row items-center justify-between gap-0">
          <div className="flex w-40 flex-col">
            <div className="flex flex-col items-center gap-2">
              <img
                className="rounded-full"
                width="40"
                height="40"
                alt=""
                src={user1.profilePicture!}
              />
              <div className="flex flex-col">
                <figcaption className="text-center font-medium">{user1.name}</figcaption>
                <p className="text-center text-sm text-gray-500">@{user1.username}</p>
              </div>
            </div>
            <blockquote className="mt-2 text-center text-sm text-gray-500">{user1.followers?.toLocaleString()} followers</blockquote>
          </div>

          <PiPlus />
          <div className="flex w-40 flex-col">
            <div className="flex flex-col items-center gap-2">
              <img
                className="rounded-full"
                width="40"
                height="40"
                alt=""
                src={user2.profilePicture!}
              />
              <div className="flex flex-col">
                <figcaption className="text-center font-medium">{user2.name}</figcaption>
                <p className="text-center text-sm text-gray-500">@{user2.username}</p>
              </div>
            </div>
            <blockquote className="mt-2 text-center text-sm text-gray-500">{user2.followers?.toLocaleString()} followers</blockquote>
          </div>
        </div>
      </figure>
    </Link>
  )
}

export function MarqueeUsers({ users, title }: { users: UserCardData[]; title: string }) {
  const firstRow = users.slice(0, users.length / 2)
  const secondRow = users.slice(users.length / 2)
  return (
    <div className="relative space-y-8">
      <h2 className="mb-4 text-center text-2xl md:text-2xl 2xl:text-4xl">{title}</h2>
      <div className="space-y-2">
        <Marquee
          pauseOnHover
          className="[--duration:50s]">
          {firstRow.map((user) => (
            <ReviewCard
              key={user.username}
              user={user}
            />
          ))}
        </Marquee>
        <Marquee
          reverse
          pauseOnHover
          className="[--duration:50s]">
          {secondRow.map((user) => (
            <ReviewCard
              key={user.username}
              user={user}
            />
          ))}
        </Marquee>
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white"></div>
    </div>
  )
}
export function MarqueePairs({ pairs, title }: { pairs: [UserCardData, UserCardData][]; title: string }) {
  const firstRow = pairs.slice(0, pairs.length / 2)
  const secondRow = pairs.slice(pairs.length / 2)
  return (
    <div className="relative space-y-8">
      <h2 className="mb-4 text-center text-2xl md:text-2xl 2xl:text-4xl">{title}</h2>
      <div className="space-y-2">
        <Marquee
          pauseOnHover
          className="[--duration:80s]">
          {firstRow.map((pair) => (
            <PairCard
              key={`${pair[0].username}-${pair[1].username}`}
              user1={pair[0]}
              user2={pair[1]}
            />
          ))}
        </Marquee>
        <Marquee
          reverse
          pauseOnHover
          className="[--duration:80s]">
          {secondRow.map((pair) => (
            <PairCard
              key={`${pair[0].username}-${pair[1].username}`}
              user1={pair[0]}
              user2={pair[1]}
            />
          ))}
        </Marquee>
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white"></div>
    </div>
  )
}
