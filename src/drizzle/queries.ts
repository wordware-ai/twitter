import 'server-only'

import { unstable_cache as cache, unstable_noStore as noStore } from 'next/cache'
import { and, desc, eq, inArray, sql } from 'drizzle-orm'

import { UserCardData } from '@/app/top-list'

import { db } from './db'
import { InsertPair, InsertUser, pairs, SelectUser, users } from './schema'

export const getUser = async ({ username }: { username: SelectUser['username'] }) => {
  noStore()
  return await db.query.users.findFirst({ where: eq(users.lowercaseUsername, username.toLowerCase()) })
}

export const getUserCached = cache(
  async ({ username }: { username: SelectUser['username'] }) => {
    return await db.query.users.findFirst({ where: eq(users.lowercaseUsername, username.toLowerCase()) })
  },
  ['user-cache'],
)

export const getAuthors = cache(async (): Promise<UserCardData[]> => {
  return [
    {
      id: '2',
      username: 'bertie_ai',
      name: 'Robert Chandler',
      profilePicture: 'https://pbs.twimg.com/profile_images/1582852165831229440/PijbiUGm_400x400.jpg',
      followers: 0,
    },
    {
      id: '3',
      username: 'kozerafilip',
      name: 'Filip Kozera',
      profilePicture: 'https://pbs.twimg.com/profile_images/1720918552721661952/Opqp--Su_400x400.jpg',
      followers: 0,
    },
    {
      id: '6',
      username: 'unable0_',
      name: 'Kamil Ruczynski',
      profilePicture: 'https://pbs.twimg.com/profile_images/1737521497525088258/WylWyvQn_400x400.jpg',
      followers: 0,
    },
    {
      id: '4',
      username: 'pio_sce',
      name: 'Pio Scelina',
      profilePicture: 'https://pbs.twimg.com/profile_images/1693591650818244608/ts3JYlzY_400x400.jpg',
      followers: 0,
    },
    {
      id: '5',
      username: 'danny_hunt_code',
      name: 'Danny Hunt',
      profilePicture: 'https://pbs.twimg.com/profile_images/1826288753368846337/SU3kpd4N_400x400.jpg',
      followers: 0,
    },

    {
      id: '7',
      username: 'ky__zo',
      name: 'Kyzo',
      profilePicture: 'https://pbs.twimg.com/profile_images/1726431958891466752/JaDcBy6P_400x400.jpg',
      followers: 0,
    },
  ]
}, ['authors-users'])

const featuredUsernames = [
  'yoheinakajima',
  'MattPRD',
  'benparr',
  'jowyang',
  'saranormous',
  'swyx',
  'azeem',
  'unable0_',
  'bertie_ai',
  'kozerafilip',
  'AlexReibman',
  'bentossell',
]

export const getTop = cache(async (): Promise<UserCardData[]> => {
  return db.query.users.findMany({
    where: eq(users.wordwareCompleted, true),
    orderBy: desc(users.followers),
    limit: 20,
    columns: {
      id: true,
      username: true,
      name: true,
      profilePicture: true,
      followers: true,
    },
  })
}, ['top-users'])

const topPairs = [
  ['leeerob', 'rauchg'],
  ['t3dotgg', 'theprimeagen'],
  ['beyonce', 'sc'],
  ['cristiano', 'realmadrid'],
  ['taylorswift13', 'tkelce'],
  ['barackobama', 'michelleobama'],
  ['tomholland1996', 'zendaya'],
  ['billgates', 'melindagates'],
  ['blakelively', 'vancityreynolds'],
  ['giseleofficial', 'tombrady'],
  ['camila_cabello', 'shawnmendes'],
  ['ninja', 'pokimanelol'],
  ['conangray', 'oliviarodrigo'],
  ['mrbeast', 'pewdiepie'],
  ['kingjames', 'lakers'],
  ['narendramodi', 'pmoindia'],
  ['elonmusk', 'tesla'],
  ['rogerfederer', 'rafaelnadal'],
  ['markruffalo', 'chrishemsworth'],
  ['nba', 'stephencurry30'],
  ['ronnie2k', 'nba2k'],
]

export const getTopPairs = cache(async (): Promise<[UserCardData, UserCardData][]> => {
  const pairPromises = topPairs.map(async ([username1, username2]) => {
    const [user1, user2] = await Promise.all([
      db.query.users.findFirst({
        where: eq(users.lowercaseUsername, username1.toLowerCase()),
        columns: {
          id: true,
          username: true,
          name: true,
          profilePicture: true,
          followers: true,
        },
      }),
      db.query.users.findFirst({
        where: eq(users.lowercaseUsername, username2.toLowerCase()),
        columns: {
          id: true,
          username: true,
          name: true,
          profilePicture: true,
          followers: true,
        },
      }),
    ])

    if (!user1 || !user2) {
      console.warn(`One or both users not found: ${username1}, ${username2}`)
      return null
    }

    return [user1, user2] as [UserCardData, UserCardData]
  })

  const pairs = await Promise.all(pairPromises)
  return pairs.filter((pair): pair is [UserCardData, UserCardData] => pair !== null)
}, ['top-pairs-4'])

export const getFeatured = cache(async (): Promise<UserCardData[]> => {
  return await db.query.users.findMany({
    where: inArray(
      users.lowercaseUsername,
      featuredUsernames.map((u) => u.toLowerCase()),
    ),
    orderBy: desc(users.followers),
    columns: {
      id: true,
      username: true,
      name: true,
      profilePicture: true,
      followers: true,
    },
  })
}, ['featured-users'])

export const insertUser = async ({ user }: { user: InsertUser }) => {
  await db.insert(users).values(user)
}

export const updateUser = async ({ user }: { user: InsertUser }) => {
  if (!user.username) {
    throw new Error('Username is required for updating a user')
  }

  await db.update(users).set(user).where(eq(users.lowercaseUsername, user.lowercaseUsername))
}

export const unlockUser = async ({ username, unlockType }: { username: string; unlockType: 'email' | 'stripe' | 'free' }) => {
  try {
    const r = await db
      .update(users)
      .set({
        unlocked: true,
        unlockType: unlockType,
      })
      .where(eq(users.lowercaseUsername, username.toLowerCase()))
      .returning({
        id: users.id,
      })
    console.log('Updated', r)

    return { success: true }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'An unknown error occurred' }
  }
}

export const updatePair = async ({ pair }: { pair: InsertPair }) => {
  if (!pair.id) throw new Error('Pair ID is required for update')
  return await db.update(pairs).set(pair).where(eq(pairs.id, pair.id))
}

export const unlockPair = async ({ username1, username2, unlockType }: { username1: string; username2: string; unlockType: 'email' | 'stripe' | 'free' }) => {
  try {
    const [user1lowercaseUsername, user2lowercaseUsername] = [username1.toLowerCase(), username2.toLowerCase()].sort()

    const r = await db
      .update(pairs)
      .set({
        unlocked: true,
        unlockType: unlockType,
      })
      .where(and(eq(pairs.user1lowercaseUsername, user1lowercaseUsername), eq(pairs.user2lowercaseUsername, user2lowercaseUsername)))
      .returning({
        id: pairs.id,
      })
    console.log('Updated pair', r)

    return { success: true }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'An unknown error occurred' }
  }
}

export const getStatistics = cache(
  async () => {
    const result = await db.execute(sql`
      SELECT 
        DATE(created_at) AS date, 
        EXTRACT(HOUR FROM created_at) AS hour, 
        COUNT(DISTINCT id) AS unique_users_count
      FROM users
      GROUP BY DATE(created_at), EXTRACT(HOUR FROM created_at)
    `)

    let cumulative = 0
    const formattedResult = result.rows
      .map((row: any) => ({
        timestamp: `${row.date}T${row.hour.toString().padStart(2, '0')}:00:00Z`,
        unique: parseInt(row.unique_users_count),
        cumulative: 0, // We'll calculate this after sorting
      }))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

    formattedResult.forEach((item) => {
      cumulative += item.unique
      item.cumulative = cumulative
    })

    // Remove the last item from the array (which might be incomplete data for the current hour)
    const lastElement = formattedResult[formattedResult.length - 2] // Get the second to last element
    const lastTimestamp = lastElement ? new Date(lastElement.timestamp) : new Date()
    return { chartData: formattedResult.slice(0, -1), timestamp: lastTimestamp.toISOString() }
  },
  ['statistics'],
  { revalidate: 3600 }, // Cache for 1 hour (3600 seconds)
)

// export const getStatistics = cache(
//   async () => {
//     const result = await db.execute(sql`
//       SELECT
//         DATE(created_at) AS date,
//         EXTRACT(HOUR FROM created_at) AS hour,
//         COUNT(DISTINCT id) AS unique_users_count
//       FROM users
//       GROUP BY DATE(created_at), EXTRACT(HOUR FROM created_at)
//       ORDER BY DATE(created_at), EXTRACT(HOUR FROM created_at)
//     `)

//     let cumulative = 0
//     const formattedResult = result.rows.map((row: any) => {
//       cumulative += parseInt(row.unique_users_count)
//       return {
//         timestamp: `${row.date}T${row.hour.toString().padStart(2, '0')}:00:00Z`,
//         unique: parseInt(row.unique_users_count),
//         cumulative: cumulative,
//       }
//     })

//     // Remove the last item from the array (which might be incomplete data for the current hour)
//     const lastElement = formattedResult[formattedResult.length - 2] // Get the second to last element
//     const lastTimestamp = lastElement ? new Date(lastElement.timestamp) : new Date()
//     return { chartData: formattedResult.slice(0, -1), timestamp: lastTimestamp.toISOString() }
//   },
//   ['statistics'],
//   { revalidate: 3600 }, // Cache for 1 hour (3600 seconds)
// )

export const insertPair = async ({ usernames }: { usernames: string[] }) => {
  const [user1lowercaseUsername, user2lowercaseUsername] = [usernames[0].toLowerCase(), usernames[1].toLowerCase()].sort()

  return await db
    .insert(pairs)
    .values({
      user1lowercaseUsername,
      user2lowercaseUsername,
    })
    .returning()
}

export const getPair = async ({ usernames }: { usernames: string[] }) => {
  noStore()
  const [user1lowercaseUsername, user2lowercaseUsername] = [usernames[0].toLowerCase(), usernames[1].toLowerCase()].sort()

  return await db.query.pairs.findFirst({
    where: and(eq(pairs.user1lowercaseUsername, user1lowercaseUsername), eq(pairs.user2lowercaseUsername, user2lowercaseUsername)),
  })
}
