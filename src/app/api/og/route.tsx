import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const picture = searchParams.get('picture') || 'https://pbs.twimg.com/profile_images/1726431958891466752/JaDcBy6P_400x400.jpg'
  const name = searchParams.get('name') || 'Kyzo'
  const username = searchParams.get('username') || '@ky__zo'
  const content =
    searchParams.get('content') ||
    `Based on our AI agent's analysis of your tweets, Kyzo is a **30-year-old male digital nomad** and **solopreneur** currently living in Bali, Indonesia. He's an **ex-COO turned indie hacker** and **NextJS developer** who shares his journey of building products.`
  const emojis = searchParams.get('emojis') || `👨‍💻🏝️🚀💼🌴`
  const section = searchParams.get('section') || 'about'

  try {
    return new ImageResponse(
      generateOG({
        picture,
        name,
        username,
        content,
        emojis,
        section,
      }),
      {
        width: 1200,
        height: 630,
      },
    ) as any
  } catch (error) {
    console.log('🟣 | file: route.tsx:34 | GET | error:', error)
    return new Response(`Failed to generate OG `, { status: 500 })
  }
}

function generateOG({
  picture,
  name,
  username,
  content,
  emojis,
  section,
}: {
  picture: string
  name: string
  username: string
  content: string
  emojis: string
  section: string
}): React.ReactElement {
  return (
    <div tw="flex flex-col w-full h-full p-12 bg-white ">
      <div tw="flex flex-col bg-white justify-center rounded-2xl p-4 ">
        <div tw="flex items-center gap-6">
          {picture && (
            <img
              src={picture}
              alt="Profile picture"
              tw="w-24 h-24 rounded-full  mb-4"
            />
          )}
          <div tw="flex ml-6 flex-col items-start justify-center ">
            <div tw="font-bold text-2xl">{name}</div>
            <div tw="text-xl">{username}</div>
          </div>
        </div>

        <div
          tw="flex flex-col rounded-2xl p-12 mt-12 "
          style={{
            border: '1px rgba(156,163,175,0.3)',
          }}>
          <div tw="text-2xl flex">This is my AI Twitter {section.charAt(0).toUpperCase() + section.slice(1)} Analysis:</div>
          <div tw="font-bold text-4xl mt-6  flex">{emojis}</div>
          <div tw="font-bold text-xl mt-6 flex">{content}</div>
        </div>
      </div>
    </div>
  )
}
