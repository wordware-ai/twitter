import { getStatistics } from '@/actions/actions'

import { CumulativeUsersChart, UniqueUsersChart } from './charts'

const Page = async () => {
  const chartData = await getStatistics()
  console.log('🟣 | file: page.tsx:7 | Page | chartData:', chartData)
  return (
    <div className="flex-center w-full flex-col gap-12 py-12">
      <CumulativeUsersChart chartData={chartData} />
      <UniqueUsersChart chartData={chartData} />
    </div>
  )
}

export default Page
