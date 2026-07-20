import 'server-only'

import { unstable_noStore as noStore } from 'next/cache'
import { and, eq } from 'drizzle-orm'

import { db } from './db'
import { InsertPair, InsertUser, pairs, SelectUser, users } from './schema'

export const getUser = async ({ username }: { username: SelectUser['username'] }) => {
  noStore()
  return await db.query.users.findFirst({ where: eq(users.lowercaseUsername, username.toLowerCase()) })
}

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
