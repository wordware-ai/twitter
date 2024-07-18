import { getUser } from '@/actions/actions'

import ResultComponent from './result-component'

const Page = async ({ params }: { params: { username: string } }) => {
  const data = await getUser({ username: params.username })

  if (!data) {
    return <div>User not found</div>
  }

  const extractDescription = ({ fullProfile }: { fullProfile: unknown }) => {
    if (typeof fullProfile !== 'object' || fullProfile === null) return ''

    const description = (fullProfile as any).description || ''
    const entities = (fullProfile as any).entities?.description

    if (!entities?.urls) return description

    return entities.urls.reduce((newDescription: string, url: any) => {
      return newDescription.replace(url.url, url.display_url)
    }, description)
  }

  const processedDescription = extractDescription({ fullProfile: data.fullProfile })

  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex-center flex-col gap-6 py-12">
        <div className="text-center text-xl font-bold">Let&apos;s see what stars think about you...</div>
        <div className="flex gap-4">
          <div className="flex-center grow">
            <img
              src={data.profilePicture || ''}
              alt="profile image"
              className="max-h-24 min-h-24 w-full min-w-24 max-w-24 rounded-full border border-gray-300"
              width={96}
              height={96}
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="text-xl font-bold">
              {data.name} <span className="text-base font-normal text-gray-500">@{data.username}</span>
            </div>
            <div className="text-gray-500">{data.location}</div>
            <div className="max-w-sm text-sm">{processedDescription}</div>
          </div>
        </div>
      </div>
      <ResultComponent user={data} />
    </div>
  )
}

export default Page
