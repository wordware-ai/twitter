import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'
import { PiRobot } from 'react-icons/pi'

import { cardData } from '@/app/[username]/config'

// Set the runtime to 'edge' for optimal performance
export const runtime = 'edge'
// Uncomment the following line if you need dynamic behavior
// export const dynamic = 'force-dynamic'

/**
 * Handles GET requests to generate Open Graph images
 * @param {NextRequest} request - The incoming request object
 * @returns {Promise<ImageResponse|Response>} The generated image or an error response
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const picture = searchParams.get('picture') || ''
  const name = searchParams.get('name') || ''
  const username = searchParams.get('username') || ''
  const content = searchParams.get('content') || ''
  const emojis = searchParams.get('emojis') || ''
  const section = searchParams.get('section') || ''

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

/**
 * Generates the Open Graph image content
 * @param {Object} params - The parameters for generating the OG image
 * @param {string} params.picture - URL of the profile picture
 * @param {string} params.name - User's name
 * @param {string} params.username - User's username
 * @param {string} params.content - Content to be displayed in the image
 * @param {string} params.section - Section identifier for styling
 * @returns {React.ReactElement} The React element representing the OG image
 */
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
  // Attempt to parse the content as JSON
  try {
    const parsedContent = JSON.parse(content)
    console.log('🟣 | file: route.tsx:78 | parsedContent:', parsedContent)
  } catch (e) {
    console.log('Failed to parse content:', e)
  }

  // Determine the icon, background, and color classes based on the section
  const Icon = cardData.filter((card) => card.contentKey === section)[0]?.icon || PiRobot
  const bgClass = cardData.filter((card) => card.contentKey === section)[0]?.bg || 'bg-white-100 border border-black '
  const colorClass = cardData.filter((card) => card.contentKey === section)[0]?.colorClass || 'text-gray-800'
  const title = cardData.filter((card) => card.contentKey === section)[0]?.title || 'Persona'

  /**
   * Renders the content based on its type (array, object, or string)
   * @returns {React.ReactElement} The rendered content
   */
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
                  <div
                    tw="text-2xl"
                    style={{ fontWeight: 300 }}>
                    {item}
                  </div>
                ) : (
                  <div tw="flex mt-3 items-start">
                    <div
                      tw="text-2xl w-1/4"
                      style={{ fontWeight: 300 }}>
                      {item.title}
                    </div>
                    <div
                      tw="text-2xl ml-4 text-gray-800 w-3/4"
                      style={{ fontWeight: 300 }}>
                      {item.subtitle?.replace(/\*/g, '')}
                    </div>
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
                <span
                  tw="text-3xl"
                  style={{ fontWeight: 300 }}>
                  {key}:
                </span>{' '}
                {typeof value === 'string' ? value.replace(/\*/g, '') : ''}
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
    return (
      <div
        tw="text-3xl"
        style={{ fontWeight: 300 }}>
        {content?.length > 500 ? content.slice(0, 500).replace(/\*/g, '') + '...' : content?.replace(/\*/g, '')}
      </div>
    )
  }

  // Return the main component structure
  return (
    <div tw="flex flex-col w-full h-full p-12 bg-gray-100 ">
      <div tw={`flex flex-col bg-white relative h-full border rounded-2xl pb-12 px-12 pt-6 bg-opacity-10 ${bgClass}`}>
        {/* User info section */}
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
          {/* Title section */}
          <div tw={`text-4xl h-24 flex items-center  ${colorClass}`}>
            <Icon size={36} /> <span tw="pl-6">My {title} by the AI Agent</span>
          </div>

          {/* Content section */}
          <div tw="mt-6 flex items-center grow">{renderContent()}</div>
        </div>
      </div>
    </div>
  )
}
