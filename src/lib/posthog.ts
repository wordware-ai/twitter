import 'server-only'

import { unstable_cache as cache } from 'next/cache'

export const getTraffic = cache(
  async (): Promise<{ trafficData: Array<{ timestamp: string; traffic: number }> }> => {
    try {
      const response = await fetch(`https://app.posthog.com/api/projects/${process.env.POSTHOG_PROJECT_ID}/insights/1771705`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.POSTHOG_PERSONAL_API_KEY}`,
        },
        cache: 'no-store',
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
    } catch (error) {
      console.error('Error fetching traffic data:', error)
      return { trafficData: [] }
    }
  },
  ['traffic-posthog'],
  { revalidate: 3600 }, // Cache for 1 hour (3600 seconds).
  // Posthog Insights won't be refetched until someone opens the insight via UI.
)

export const getMostVisited = cache(
  async (): Promise<{ mostVisited: Array<{ name: string; visits: number }> }> => {
    try {
      const response = await fetch(`https://app.posthog.com/api/projects/${process.env.POSTHOG_PROJECT_ID}/insights/1771725`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.POSTHOG_PERSONAL_API_KEY}`,
        },
        cache: 'no-store',
      })
      const data = await response.json()
      const insights = data.result
      const filteredInsights = insights.filter((item: any) => item.label !== 'open')
      const mostVisited = filteredInsights
        .map((item: any) => ({
          name: item.label.replace('/', ''),
          visits: item.aggregated_value,
        }))
        .filter((item: { name: string; visits: number }) => item.name !== undefined)

      return { mostVisited }
    } catch (error) {
      console.error('Error fetching most visited data:', error)
      return { mostVisited: [] }
    }
  },
  ['visits-posthog'],
  { revalidate: 3600 }, // Cache for 1 hour (3600 seconds)
  // Posthog Insights won't be refetched until someone opens the insight via UI.
)
