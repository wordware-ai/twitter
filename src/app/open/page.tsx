import { formatDistance } from 'date-fns'

import { getStatistics } from '@/actions/actions'

import { CumulativeUsersChart, UniqueUsersChart } from './charts'

const Page = async () => {
  const { chartData, timestamp } = await getStatistics()

  return (
    <div className="flex-center w-full flex-col gap-12 px-2 py-12">
      <div className="w-full max-w-4xl space-y-6">
        <div className="space-y-4">
          <h1 className="text-start text-4xl font-bold">Open Project</h1>
          <p>Last update: {formatDistance(timestamp, new Date(), { addSuffix: true })}</p>
          <p>
            Twitter Personality by Wordware is a fully Open Project, which not only the code is open source, but we&apos;re also happy to share all the critical
            metrics and statistics.
          </p>
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
      </div>
    </div>
  )
}

export default Page
