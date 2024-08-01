import { neon } from '@neondatabase/serverless'
import { ActorRun, ApifyClient } from 'apify-client'
import { drizzle } from 'drizzle-orm/neon-http'
import { Resource } from 'sst'

import * as schema from '@/drizzle/schema'
import { users } from '@/drizzle/schema'
import { handler } from '@/workflow/utils/handler'

const apifyClient = new ApifyClient({
  token: Resource.ApifySecret.value,
})

const sql = neon(Resource.NeonDbUrl.value)
export const db = drizzle(sql, { schema })

export const scrapeProfilesWebhookCallback = handler(
  async (body) => {
    const run = body.resource as ActorRun

    console.log('Processing results for run', run.defaultDatasetId)

    const { items: profiles } = await apifyClient.dataset(run.defaultDatasetId).listItems()

    // De-duplicate profiles
    const uniqueProfiles = {}
    profiles.forEach((profile) => (uniqueProfiles[profile.userName.toLowerCase()] = profile))

    // Add to db
    for (const [username, profile] of Object.entries(uniqueProfiles)) {
      console.log('Inserting profile for', username)
      console.log(profile)

      const profilePicture = profile.profilePicture as string

      if (!profile || Object.keys(profile).length === 0) throw new Error('No profile found')

      const data = {
        username: username,
        url: profile.url as string,
        name: profile.name as string,
        profilePicture: profilePicture.replace('_normal.', '_400x400.'),
        description: profile.description as string,
        location: profile.location as string,
        fullProfile: profile as object,
        followers: profile.followers as number,
      }

      await db
        .insert(users)
        .values({
          ...data,
          profileScraped: true,
          lowercaseUsername: username,
          error: null,
        })
        .onConflictDoUpdate({ target: users.lowercaseUsername, set: data })
    }
  },
  { suppressLog: false },
)
