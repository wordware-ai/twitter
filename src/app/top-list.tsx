import React from 'react'
import Link from 'next/link'

import { getTop20 } from '@/actions/actions'

const TopList = async () => {
  const data = await getTop20()
  return (
    <div className="flex-center w-full flex-col gap-12 bg-[#F9FAFB] py-40">
      <h2 className="mb-4 text-2xl font-bold">Popular Tweeters</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data.map((user) => (
          <Link
            href={`/${user.username}`}
            key={user.id}
            className="block rounded-lg border bg-white p-4 transition-shadow hover:shadow-md">
            <div className="flex w-full flex-col items-center">
              <img
                src={user.profilePicture || ''}
                alt={user.name || user.username}
                width={50}
                height={50}
                className="rounded-full"
              />
              <div className="w-full">
                <p className="text-center font-semibold">{user.name || user.username}</p>
                <p className="text-center text-sm text-gray-500">@{user.username}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default TopList
