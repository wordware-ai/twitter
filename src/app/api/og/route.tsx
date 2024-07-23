import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

import { cardData } from '@/app/[username]/config'

export const runtime = 'edge'

const strengths = [
  {
    title: 'Visionary Leadership',
    subtitle: 'Guides Supabase with innovative ideas and strategic thinking',
  },
  {
    title: 'Open-Source Advocate',
    subtitle: 'Strongly supports and contributes to the open-source community',
  },
  {
    title: 'Technical Expertise',
    subtitle: 'Deep knowledge of databases, particularly PostgreSQL',
  },
  {
    title: 'Community Builder',
    subtitle: 'Fosters a strong developer community around Supabase',
  },
  {
    title: 'Entrepreneurial Spirit',
    subtitle: 'Successfully navigates the startup ecosystem',
  },
]

// "loveLife": "The stars align for a partnership with someone who shares your passion for innovation and growth. Look for a partner who challenges your ideas and brings a fresh perspective to your tech-centric world. Their complementary skills in areas like design or business strategy could create a power couple dynamic that propels both of you to new heights.",

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const picture = searchParams.get('picture') || 'https://pbs.twimg.com/profile_images/1726431958891466752/JaDcBy6P_400x400.jpg'
  const name = searchParams.get('name') || 'Kyzo'
  const username = searchParams.get('username') || '@ky__zo'
  const content =
    searchParams.get('content') ||
    'The stars align for a partnership with someone who shares your passion for innovation and growth. Look for a partner who challenges your ideas and brings a fresh perspective to your tech-centric world. Their complementary skills in areas like design or business strategy could create a power couple dynamic that propels both of you to new heights.' ||
    JSON.stringify(strengths)
  const emojis = searchParams.get('emojis') || `👨‍💻🏝️🚀💼🌴`
  const section = searchParams.get('section') || 'strengths'

  console.log('Generating OG image with params:', { picture, name, username, content, emojis, section })

  try {
    return new ImageResponse(
      generateOG({
        picture,
        name,
        username,
        content,
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
  section,
}: {
  picture: string
  name: string
  username: string
  content: string
  section: string
}): React.ReactElement {
  try {
    const parsedContent = JSON.parse(content)
    console.log('🟣 | file: route.tsx:78 | parsedContent:', parsedContent)
  } catch (e) {
    console.log('Failed to parse content:', e)
  }
  const Icon = cardData.filter((card) => card.contentKey === section)[0].icon
  const bgClass = cardData.filter((card) => card.contentKey === section)[0].bg
  const colorClass = cardData.filter((card) => card.contentKey === section)[0].colorClass
  const title = cardData.filter((card) => card.contentKey === section)[0].title

  const renderContent = () => {
    try {
      const parsedContent = JSON.parse(content)
      if (Array.isArray(parsedContent)) {
        return (
          <div tw="flex flex-col ">
            {parsedContent.slice(0, 5).map((item, index) => (
              <div
                key={index}
                tw="flex flex-col">
                {typeof item === 'string' ? (
                  <div tw="text-3xl mt-6">{item}</div>
                ) : (
                  <div tw="flex mt-4 items-start">
                    <div tw="text-2xl font-semibold w-1/4">{item.title}</div>
                    <div tw="text-2xl ml-4 text-gray-800 w-3/4">{item.subtitle?.replace(/\*/g, '')}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      } else if (typeof parsedContent === 'object') {
        return (
          <ul tw="list-none space-y-2 ">
            {Object.entries(parsedContent).map(([key, value], index) => (
              <li key={index}>
                <span tw="font-semibold text-3xl">{key}:</span> {typeof value === 'string' ? value.replace(/\*/g, '') : ''}
              </li>
            ))}
          </ul>
        )
      }
    } catch (e) {
      console.log('Failed to parse content:', e)
      // If parsing fails, treat content as a string
    }

    // Default case: treat content as a string
    return <div tw="text-3xl whitespace-pre-wrap">{content?.length > 550 ? content.slice(0, 550).replace(/\*/g, '') + '...' : content?.replace(/\*/g, '')}</div>
  }

  return (
    <div tw="flex flex-col w-full h-full p-12 bg-gray-100 ">
      <div tw={`flex flex-col bg-white relative h-full border rounded-2xl pb-12 px-12 pt-6 bg-opacity-10 ${bgClass}`}>
        <div tw="flex justify-end absolute top-10 right-10 items-center ">
          {picture && (
            <img
              src={picture}
              alt="Profile picture"
              tw="w-20 h-20 rounded-full mb-4"
            />
          )}
          <div tw="flex ml-6 flex-col items-start justify-center ">
            <div tw="font-bold text-2xl">{name}</div>
            <div tw="text-xl">{username}</div>
          </div>
        </div>

        <div tw="flex flex-col">
          <div tw={`text-4xl h-28 flex items-center  ${colorClass}`}>
            <Icon size={32} /> <span tw="pl-6">{title} by the AI Agent</span>
          </div>
          {/* <div tw="border-b w-full border-gray-300" /> */}

          <div tw="mt-6 flex">{renderContent()}</div>
        </div>
      </div>
    </div>
  )
}
