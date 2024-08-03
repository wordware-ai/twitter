'use server'

import { unstable_cache as cache } from 'next/cache'

export const getInsights = cache(
  async (): Promise<{ trafficData: Array<{ timestamp: string; traffic: number }> }> => {
    const response = await fetch(`https://app.posthog.com/api/projects/${process.env.POSTHOG_PROJECT_ID}/insights/1771705`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.POSTHOG_PERSONAL_API_KEY}`,
      },
    })
    const data = await response.json()
    const insights = data.result[0]

    const startDate = new Date('2024-07-29T05:00:00Z')
    const trafficData = insights.data
      .map((traffic: number, index: number) => {
        const [date, time] = insights.days[index].split(' ')
        const timestamp = `${date}T${time}Z`

        return {
          timestamp,
          traffic,
        }
      })
      .filter((item: { timestamp: string; traffic: number }) => new Date(item.timestamp) >= startDate)
      .slice(0, -1)

    return { trafficData }
  },
  ['insights'],
  { revalidate: 3600 }, // Cache for 1 hour (3600 seconds)
)
