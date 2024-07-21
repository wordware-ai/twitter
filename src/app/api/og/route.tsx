/* eslint-disable react/no-unknown-property -- Tailwind CSS `tw` property */
import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

// const bold = fetch(new URL('./inter-bold.woff', import.meta.url)).then((res) => res.arrayBuffer())

// const foreground = 'hsl(0 0% 98%)'
// const mutedForeground = 'hsl(0 0% 63.9%)'
// const background = 'rgba(10, 10, 10)'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const picture = searchParams.get('picture') || 'https://pbs.twimg.com/profile_images/1726431958891466752/JaDcBy6P_400x400.jpg'
  const name = searchParams.get('name') || 'Kyzo'
  const username = searchParams.get('username') || '@ky__zo'
  const about =
    searchParams.get('about') ||
    `Based on our AI agent's analysis of your tweets, Kyzo is a **30-year-old male digital nomad** and **solopreneur** currently living in Bali, Indonesia. He's an **ex-COO turned indie hacker** and **NextJS developer** who shares his journey of building products.`
  const emojis = searchParams.get('emojis') || `👨‍💻🏝️🚀💼🌴`

  try {
    return new ImageResponse(
      generateOG({
        picture,
        name,
        username,
        about,
        emojis,
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
  about,
  emojis,
}: {
  picture: string
  name: string
  username: string
  about: string
  emojis: string
}): React.ReactElement {
  return (
    <div tw="flex flex-col w-full h-full p-12 bg-white ">
      <div tw="flex flex-col bg-white justify-center rounded-2xl p-4 ">
        <div tw="flex items-center gap-6">
          {picture && (
            <img
              src={picture}
              alt="Profile picture"
              tw="w-24 h-24 rounded-full object-cover mb-4"
            />
          )}
          <div tw="flex ml-6 flex-col items-start justify-center ">
            <div tw="font-bold text-2xl">{name}</div>
            <div tw="text-xl">{username}</div>
          </div>
        </div>

        <div
          tw="flex flex-col rounded-2xl p-12 mt-12 gap-6 "
          style={{
            border: '1px rgba(156,163,175,0.3)',
            // background,
          }}>
          <div tw="text-2xl flex">This is my AI Twitter Personality:</div>
          <div tw="font-bold text-4xl mt-6  flex">{emojis}</div>
          <div tw="font-bold text-xl mt-6 flex">{about}</div>
        </div>
      </div>

      {/* <<div tw="flex flex-row items-center mt-auto p-4">
        svg
          fill="currentColor"
          height="60"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="60">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
          <path d="M5 3v4" />
          <path d="M19 17v4" />
          <path d="M3 5h4" />
          <path d="M17 19h4" />
        </svg> 
      </div>*/}
    </div>
  )
}
