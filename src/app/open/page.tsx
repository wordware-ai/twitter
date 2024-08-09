import { getStatistics } from '@/actions/actions'
import { getMostVisited, getTraffic } from '@/actions/posthog'
import Topbar from '@/components/top-bar'

import Authors from './authors'
import { CumulativeUsersChart, TrafficChart, UniqueUsersChart } from './charts'
import LastUpdate from './last-update'
import MostVisited from './most-visited'

export const maxDuration = 180

const Page = async () => {
  console.time('open')
  const { chartData, timestamp } = await getStatistics()
  const { trafficData } = await getTraffic()
  const { mostVisited } = await getMostVisited()
  console.timeEnd('open')

  return (
    <div className="flex-center w-full flex-col gap-12 px-2 pb-12 pt-28 md:pt-20">
      <Topbar />
      <div className="w-full max-w-4xl space-y-6">
        <div className="space-y-4">
          <h1 className="text-start text-4xl font-bold">Open Project</h1>
          <LastUpdate timestamp={timestamp} />
          <p>
            Twitter Personality by Wordware is a fully Open Project, which not only the code is open source, but we&apos;re also happy to share all the critical
            metrics and statistics.
          </p>
        </div>
        <div className="space-y-4">
          <h2 className="text-start text-2xl font-bold">Creators</h2>
          <p>This project was brought to life by Wordware.</p>
          <Authors />
        </div>

        <div className="space-y-4">
          <h2 className="text-start text-2xl font-bold">Cumulative users</h2>
          <p>
            Our project launched on Product Hunt and Twitter simultaneously. While it initially gained little traction on Product Hunt, it unexpectedly went
            viral on Twitter. This chart shows the rapid user growth that followed as the app gained popularity.
          </p>
          <CumulativeUsersChart chartData={chartData} />
        </div>
        <div className="space-y-4">
          <h2 className="text-start text-2xl font-bold">User growth hour-by-hour</h2>
          <p>
            This chart illustrates the influx of users hour-by-hour. As the project blew up, it caught us off guard and we had to throttle the service multiple
            times.
          </p>
          <UniqueUsersChart chartData={chartData} />
        </div>
        <div className="space-y-4">
          <h2 className="text-start text-2xl font-bold">Website traffic</h2>
          <p>Data provided by Posthog</p>
          <TrafficChart chartData={trafficData} />
        </div>
        <div className="space-y-4">
          <h2 className="text-start text-2xl font-bold">Most Visited Personalities</h2>
          <p>Data provided by Posthog</p>
          <MostVisited mostVisited={mostVisited} />
        </div>
      </div>
    </div>
  )
}

export default Page
