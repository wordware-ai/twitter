import Image from 'next/image'
import Link from 'next/link'
import { PiUser } from 'react-icons/pi'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getUserCached } from '@/drizzle/queries'

const MostVisited = async ({ mostVisited }: { mostVisited: Array<{ name: string; visits: number }> }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Top 50</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {await Promise.all(
              mostVisited.slice(0, 50).map(async ({ name, visits }, index) => {
                const user = await getUserCached({ username: name })
                if (!user?.username) return null
                return (
                  <li
                    key={name}
                    className="flex items-center space-x-4">
                    <div>{index + 1}</div>
                    {user?.profilePicture ? (
                      <div className="relative h-12 w-12">
                        <Image
                          src={user.profilePicture}
                          alt={`${user.username}'s profile picture`}
                          width={48}
                          height={48}
                          className="z-10 rounded-full"
                        />
                        <PiUser className="absolute inset-2 -z-10 h-8 w-8 text-gray-400" />
                      </div>
                    ) : null}

                    <div>
                      <Link
                        href={`/${user?.username}`}
                        className="font-light text-gray-500 hover:underline">
                        @{user?.username}
                      </Link>
                      {/* <p className="text-sm text-gray-500">{name}</p> */}
                    </div>
                    <span className="ml-auto text-sm font-semibold">{visits} visits</span>
                  </li>
                )
              }),
            )}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Top 50-100</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {await Promise.all(
              mostVisited.slice(50, 100).map(async ({ name, visits }, index) => {
                const user = await getUserCached({ username: name })
                if (!user?.username) return null
                return (
                  <li
                    key={name}
                    className="flex items-center space-x-4">
                    <div>{index + 50 + 1}</div>
                    {user?.profilePicture && (
                      <Image
                        src={user.profilePicture}
                        alt={`${user.username}'s profile picture`}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                    )}
                    <div>
                      <Link
                        href={`/${user?.username}`}
                        className="font-light text-gray-500 hover:underline">
                        @{user?.username}
                      </Link>
                      {/* <p className="text-sm text-gray-500">{name}</p> */}
                    </div>
                    <span className="ml-auto text-sm font-semibold">{visits} visits</span>
                  </li>
                )
              }),
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

export default MostVisited
