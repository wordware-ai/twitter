import 'server-only'

import { unstable_cache as cache, unstable_noStore as noStore } from 'next/cache'
import { and, desc, eq, inArray } from 'drizzle-orm'

import { db } from './db'
import { InsertPair, InsertUser, pairs, SelectUser, users } from './schema'

export interface UserCardData {
  id: string
  username: string
  name: string | null
  profilePicture: string | null
  followers: number | null
}

export const getUser = async ({ username }: { username: SelectUser['username'] }) => {
  noStore()
  return await db.query.users.findFirst({ where: eq(users.lowercaseUsername, username.toLowerCase()) })
}

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

const topPairUsernames = [
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
  ['mrbeast', 'pewdiepie'],
  ['kingjames', 'lakers'],
  ['elonmusk', 'tesla'],
  ['rogerfederer', 'rafaelnadal'],
  ['nba', 'stephencurry30'],
]

const userCardColumns = {
  id: true,
  username: true,
  name: true,
  profilePicture: true,
  followers: true,
} as const

export const getTop = cache(
  async (): Promise<UserCardData[]> => {
    return db.query.users.findMany({
      where: eq(users.wordwareCompleted, true),
      orderBy: desc(users.followers),
      limit: 20,
      columns: userCardColumns,
    })
  },
  ['top-users'],
  { revalidate: 3600 },
)

export const getTopPairs = cache(
  async (): Promise<[UserCardData, UserCardData][]> => {
    // One query for every username, assembled into pairs afterwards
    const allUsernames = topPairUsernames.flat().map((u) => u.toLowerCase())
    const rows = await db.query.users.findMany({
      where: inArray(users.lowercaseUsername, allUsernames),
      columns: { ...userCardColumns, lowercaseUsername: true },
    })
    const byUsername = new Map(rows.map((r) => [r.lowercaseUsername, r]))

    return topPairUsernames
      .map(([username1, username2]) => {
        const user1 = byUsername.get(username1.toLowerCase())
        const user2 = byUsername.get(username2.toLowerCase())
        if (!user1 || !user2) return null
        return [user1, user2] as [UserCardData, UserCardData]
      })
      .filter((pair): pair is [UserCardData, UserCardData] => pair !== null)
  },
  ['top-pairs'],
  { revalidate: 3600 },
)

export const getFeatured = cache(
  async (): Promise<UserCardData[]> => {
    return await db.query.users.findMany({
      where: inArray(
        users.lowercaseUsername,
        featuredUsernames.map((u) => u.toLowerCase()),
      ),
      orderBy: desc(users.followers),
      columns: userCardColumns,
    })
  },
  ['featured-users'],
  { revalidate: 3600 },
)

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
