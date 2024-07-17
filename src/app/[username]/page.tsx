import { getUser, scrapeTweets } from '@/actions/actions'

import Result from './result'
import ScrapeTweets from './scrape-tweets'

const Page = async ({ params }: { params: { username: string } }) => {
  const data = await getUser({ username: params.username })

  if (!data) {
    return <div>User not found</div>
  }

  return (
    <div>
      <pre className="whitespace-pre-wrap">data: {JSON.stringify(data, null, 2)}</pre>
      <div>{/* <pre className="whitespace-pre-wrap">tweets: {JSON.stringify(tweets, null, 2)}</pre> */}</div>
      <ScrapeTweets username={params.username} />
      {/* <Result userData={undefined} /> */}
    </div>
  )
}

export default Page
