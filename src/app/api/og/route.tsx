import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'
import { PiRobot } from 'react-icons/pi'

import { cardData } from '@/lib/analysis-config'

import { SaunaLogoOG } from './sauna-logo-og'

export const runtime = 'edge'
const light = fetch(new URL('./Inter-Light.ttf', import.meta.url)).then((res) => res.arrayBuffer())
const bold = fetch(new URL('./Inter-SemiBold.ttf', import.meta.url)).then((res) => res.arrayBuffer())

/**
 * Handles GET requests to generate Open Graph images.
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<ImageResponse|Response>} The generated image or an error response.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const picture = searchParams.get('picture') || ''
  const name = searchParams.get('name') || ''
  const username = searchParams.get('username') || ''
  const content = searchParams.get('content') || ''
  const section = searchParams.get('section') || ''

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
        fonts: [
          { name: 'Inter', data: await bold, weight: 600 },
          { name: 'Inter', data: await light, weight: 300 },
        ],
      },
    ) as any
  } catch (error) {
    console.error('Failed to generate OG image:', error)
    return new Response(`Failed to generate OG image`, { status: 500 })
  }
}

/**
 * Generates the Open Graph image content.
 * @param {Object} params - The parameters for generating the OG image.
 * @param {string} params.picture - URL of the user's profile picture.
 * @param {string} params.name - User's name.
 * @param {string} params.username - User's username.
 * @param {string} params.content - Content to be displayed in the image.
 * @param {string} params.section - Section identifier for styling.
 * @returns {React.ReactElement} The React element representing the OG image.
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
  const {
    icon: Icon,
    bg,
    colorClass,
    title,
  } = cardData.find((card) => card.contentKey === section) || {
    icon: PiRobot,
    bg: 'bg-white',
    colorClass: 'text-gray-800',
    title: 'Persona',
  }

  /**
   * Renders the content based on its type and structure.
   * @returns {React.ReactElement} The rendered content.
   */
  const renderContent = () => {
    try {
      const parsedContent = JSON.parse(content)
      if (Array.isArray(parsedContent)) {
        return (
          <div
            tw=" flex"
            style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {parsedContent.slice(0, 3).map((item, index) => (
              <div
                key={index}
                tw="mt-3"
                style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ fontSize: '38px', fontWeight: 300, width: typeof item === 'string' ? '100%' : '25%' }}>
                  {typeof item === 'string' ? item : item.title}
                </div>
                {typeof item !== 'string' && <div style={{ fontSize: '32px', fontWeight: 300, width: '75%' }}>{item.subtitle?.replace(/\*/g, '')}</div>}
              </div>
            ))}
          </div>
        )
      } else if (typeof parsedContent === 'object') {
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {Object.entries(parsedContent).map(([key, value], index) => (
              <div
                key={index}
                style={{ fontSize: '38px', fontWeight: 300 }}>
                <span>{key}:</span> {typeof value === 'string' ? value.replace(/\*/g, '') : ''}
              </div>
            ))}
          </div>
        )
      }
    } catch (e) {
      console.log('ℹ️ OG content parse error, moving to fallback', e)
    }

    // Fallback for unparseable content
    return (
      <div style={{ fontSize: '38px', fontWeight: 300 }}>
        {content ? (content.length > 300 ? content.slice(0, 300).replace(/\*/g, '') + '...' : content.replace(/\*/g, '')) : ''}
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        padding: '48px',
        backgroundColor: '#FAFAF9',
        fontFamily: 'Inter, sans-serif',
      }}>
      <div
        tw={`${bg === 'bg-white' ? bg : `${bg} bg-opacity-10`} `}
        style={{
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '16px',
          padding: '36px',
          // paddingBottom: '44px',
          paddingTop: '36px',
          height: '100%',
          position: 'relative',
          border: '1px solid #e5e7eb',
        }}>
        {/* Header section */}
        <div
          tw="border-b border-gray-300"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            // borderBottom: '1px solid #0d0d0d',
            paddingBottom: '26px',
          }}>
          <div
            tw={`${colorClass}`}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon size={36} /> <span tw="text-3xl">My {title} by the AI Agent</span>
          </div>
        </div>

        {/* Content section */}
        <div
          tw="items-center font-light"
          style={{ marginTop: '24px', color: '#1a1a1a', display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
          {renderContent()}
        </div>

        {/* User info section */}
        <div
          style={{
            position: 'absolute',
            top: '24px',
            right: '48px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}>
          {picture && (
            <img
              src={picture}
              alt="Profile picture"
              style={{ width: '64px', height: '64px', borderRadius: '50%' }}
            />
          )}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              tw="font-bold"
              style={{ fontWeight: 'bold', fontSize: '20px' }}>
              {name}
            </div>
            <div
              tw="font-bold "
              style={{ display: 'flex', fontSize: '18px', color: '#7e7e7e' }}>
              @{username}
            </div>
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            right: '48px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}>
          <SaunaLogoOG width={200} />
        </div>
      </div>
    </div>
  )
}
