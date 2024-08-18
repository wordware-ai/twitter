import React from 'react'
import Link from 'next/link'

import WordwareLogo from '@/components/logo'
import { getFeatured, getTop } from '@/drizzle/queries'

const wordwareBoys = ['kozerafilip', 'bertie_ai', 'unable0_']

export interface UserCardData {
  id: string
  username: string
  name: string | null
  profilePicture: string | null
  followers: number | null
}

/**
 * UserCard component displays a card with user information.
 *
 * @param {Object} props - The component props
 * @param {SelectUser} props.user - The user object containing user details
 * @returns {JSX.Element} A link component containing user information
 */
export const UserCard = ({ user }: { user: UserCardData }) => (
  <Link
    href={`/${user.username}`}
    key={user.id}
    className="relative block w-full rounded-lg border bg-white p-4 shadow-[5px_5px_30px_rgba(190,190,190,0.15),-5px_-5px_30px_rgba(255,255,255,0.15)] transition-all duration-100 hover:shadow-[5px_5px_30px_rgba(190,190,190,0.3),-5px_-5px_30px_rgba(255,255,255,0.3)]">
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

      {wordwareBoys.includes(user.username) && (
        <div className="absolute bottom-4 right-4">
          <WordwareLogo
            emblemOnly
            color="black"
            width={20}
          />
        </div>
      )}
    </div>
  </Link>
)

/**
 * UserGrid component displays a grid of UserCard components.
 *
 * @param {Object} props - The component props
 * @param {UserCardData[]} props.users - An array of user objects to display
 * @param {string} props.title - The title for the grid section
 * @returns {JSX.Element} A div containing a title and a grid of UserCard components
 */
const UserGrid = ({ users, title }: { users: UserCardData[]; title: string }) => (
  <div className="flex-center w-full flex-col gap-4">
    <h2 className="mb-4 text-2xl md:text-2xl 2xl:text-4xl">{title}</h2>
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

/**
 * TopList is an async component that fetches and displays top and featured users.
 *
 * @returns {Promise<JSX.Element>} A div containing UserGrid components for top and featured users
 */
const TopList = async () => {
  // Fetch top users from the backend
  const top = await getTop()

  // Fetch featured users from the backend
  const featured = await getFeatured()

  return (
    <div className="flex-center w-full flex-col gap-16 p-4 py-40 sm:p-12 md:p-24">
      {/* Display grid of top users */}
      <UserGrid
        users={top}
        title="Most Popular"
      />
      {/* Display grid of featured users */}
      <UserGrid
        users={featured}
        title="AI Agents Luminaries"
      />
    </div>
  )
}

export default TopList
