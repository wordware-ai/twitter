import { fetchAndParseSocialDataTweets } from '@/actions/social-data'

const Page = async () => {
  const data = await fetchAndParseSocialDataTweets('945756809356300294')
  // const [data, setData] = useState<any>(null)

  // useEffect(() => {
  //   const fetchData = async () => {
  //     // const data = await fetchUserData({ screenName: 'ky__zo' })

  //     setData(data)
  //   }

  //   fetchData()
  // }, [])

  return (
    <div className="flex-center">
      <pre className="max-w-lg whitespace-pre-wrap text-xs text-black">{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

export default Page
