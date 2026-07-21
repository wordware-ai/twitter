import 'server-only'

import { updateUser } from '@/drizzle/queries'
import { SelectUser } from '@/drizzle/schema'

import { fetchUserDataBySocialData } from './social-data'
import { fetchProfileXApi } from './x-api'

const ANALYSIS_MAX_AGE_MS = 182 * 24 * 60 * 60 * 1000 // ~6 months

/**
 * Lazily expire analyses older than ~6 months: archive the current analysis and
 * tweets into `analysisHistory`, refresh the profile (avatars from old scrapes
 * 404 — X rotates profile-image URLs), then reset the pipeline flags so the
 * visit re-scrapes and re-generates. The stale analysis stays in place (and on
 * screen) until the fresh one streams in over it.
 *
 * Deliberately NOT a server action (this module has no 'use server' directive):
 * it trusts the `user` row it's given and writes it back to the DB, so it must
 * only ever be called from server code, never exposed as an endpoint.
 */
export const refreshStaleUser = async ({ user }: { user: SelectUser }): Promise<SelectUser> => {
  if (!user.wordwareCompleted) return user
  if (Date.now() - user.wordwareStartedTime.getTime() < ANALYSIS_MAX_AGE_MS) return user

  // Safety valve: never archive the same user more than once a day, even if a
  // bug elsewhere leaves the started-time looking stale after a regeneration
  const existingHistory = (user.analysisHistory as { archivedAt?: string }[] | null) ?? []
  const lastArchivedAt = existingHistory[existingHistory.length - 1]?.archivedAt
  if (lastArchivedAt && Date.now() - new Date(lastArchivedAt).getTime() < 24 * 60 * 60 * 1000) return user

  const history = [...existingHistory, { archivedAt: new Date().toISOString(), analysis: user.analysis, tweets: user.tweets }]

  let { data: freshProfile } = await fetchProfileXApi({ username: user.username })
  if (!freshProfile) {
    ;({ data: freshProfile } = await fetchUserDataBySocialData({ username: user.username }))
  }
  const profileFields = freshProfile
    ? {
        name: freshProfile.name,
        profilePicture: freshProfile.profilePicture,
        description: freshProfile.description,
        location: freshProfile.location,
        followers: freshProfile.followers,
        fullProfile: freshProfile.fullProfile,
      }
    : {}

  const updated = {
    ...user,
    ...profileFields,
    analysisHistory: history,
    tweetScrapeStarted: false,
    tweetScrapeCompleted: false,
    wordwareStarted: false,
    wordwareCompleted: false,
    paidWordwareStarted: false,
    paidWordwareCompleted: false,
  }
  await updateUser({ user: updated })
  console.log(`[${user.username}] ♻️ Archived analysis from ${user.wordwareStartedTime.toISOString()}, refreshed profile, re-running scrape + roast`)
  return updated
}
