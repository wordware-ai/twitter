import React from 'react'
import Link from 'next/link'

import { getFeatured, getTop } from '@/actions/actions'

const TopList = async () => {
  const top = await getTop()
  const featured = await getFeatured()
  return (
    <div className="flex-center w-full flex-col gap-12 p-4 py-40 sm:p-12 md:p-24">
      <h2 className="mb-4 text-2xl md:text-2xl 2xl:text-4xl">Popular Tweeters</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {top.map((user) => (
          <Link
            href={`/${user.username}`}
            key={user.id}
            className="block rounded-lg border bg-white p-4 shadow-[5px_5px_30px_rgba(190,190,190,0.15),-5px_-5px_30px_rgba(255,255,255,0.15)] transition-all duration-100 hover:shadow-[5px_5px_30px_rgba(190,190,190,0.3),-5px_-5px_30px_rgba(255,255,255,0.3)]">
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
            </div>
          </Link>
        ))}
      </div>
      <h2 className="mb-4 text-2xl md:text-2xl 2xl:text-4xl">Featured Tweeters</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {featured.map((user) => (
          <Link
            href={`/${user.username}`}
            key={user.id}
            className="block rounded-lg border bg-white p-4 shadow-[5px_5px_30px_rgba(190,190,190,0.15),-5px_-5px_30px_rgba(255,255,255,0.15)] transition-all duration-100 hover:shadow-[5px_5px_30px_rgba(190,190,190,0.3),-5px_-5px_30px_rgba(255,255,255,0.3)]">
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
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default TopList
