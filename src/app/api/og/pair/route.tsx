import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'
import { PiRobot } from 'react-icons/pi'

import { compatibilityConfig } from '@/lib/analysis-config'

import { SaunaLogoOG } from '../sauna-logo-og'

export const runtime = 'edge'
const light = fetch(new URL('./Inter-Light.ttf', import.meta.url)).then((res) => res.arrayBuffer())
const bold = fetch(new URL('./Inter-SemiBold.ttf', import.meta.url)).then((res) => res.arrayBuffer())

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const picture1 = searchParams.get('picture1') || ''
  const name1 = searchParams.get('name1') || ''
  const username1 = searchParams.get('username1') || ''
  const picture2 = searchParams.get('picture2') || ''
  const name2 = searchParams.get('name2') || ''
  const username2 = searchParams.get('username2') || ''
  const content = searchParams.get('content') || ''
  const section = searchParams.get('section') || ''

  try {
    return new ImageResponse(
      generatePairOG({
        picture1,
        name1,
        username1,
        picture2,
        name2,
        username2,
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

function generatePairOG({
  picture1,
  name1,
  username1,
  picture2,
  name2,
  username2,
  content,
  section,
}: {
  picture1: string
  name1: string
  username1: string
  picture2: string
  name2: string
  username2: string
  content: string
  section: string
}): React.ReactElement {
  const {
    icon: Icon,
    bg,
    colorClass,
    title,
  } = compatibilityConfig.find((card) => card.contentKey === section) || {
    icon: PiRobot,
    bg: 'bg-white',
    colorClass: 'text-gray-800',
    title: 'Compatibility',
  }

  const renderContent = () => {
    try {
      const parsedContent = JSON.parse(content)
      if (typeof parsedContent === 'string') {
        return <div style={{ fontSize: '28px', fontWeight: 300 }}>{parsedContent.length > 250 ? parsedContent.slice(0, 250) + '...' : parsedContent}</div>
      } else if (Array.isArray(parsedContent)) {
        return (
          <div
            tw="flex"
            style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {parsedContent.slice(0, 3).map((item, index) => (
              <div
                key={index}
                tw="mt-3"
                style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ fontSize: '32px', fontWeight: 300, width: typeof item === 'string' ? '100%' : '25%' }}>
                  {typeof item === 'string' ? item : item.title}
                </div>
                {typeof item !== 'string' && <div style={{ fontSize: '28px', fontWeight: 300, width: '75%' }}>{item.subtitle?.replace(/\*/g, '')}</div>}
              </div>
            ))}
          </div>
        )
      } else if (typeof parsedContent === 'object') {
        return (
          // <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          //   {Object.entries(parsedContent).map(([key, value], index) => (
          //     <div
          //       key={index}
          //       style={{ fontSize: '32px', fontWeight: 300 }}>
          //       <span>{key}:</span> {typeof value === 'string' ? value.replace(/\*/g, '') : ''}
          //     </div>
          //   ))}
          // </div>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', maxWidth: '100%' }}>
            {Object.entries(parsedContent).map(([key, value], index) => {
              return (
                <div
                  key={index}
                  style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '24px', fontWeight: 300 }}>
                  <div style={{ display: 'flex', fontWeight: 600 }}>{key.replace('profile1', name1).replace('profile2', name2).replace(/\*/g, '')}:</div>{' '}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {Array.isArray(value) ? (
                      <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '2px', gap: '10px' }}>
                        {value.slice(0, 2).map((item, i) => (
                          <div
                            key={i}
                            style={{ display: 'flex' }}>
                            {typeof item === 'string' ? item.replace(/\*/g, '') : ''}
                          </div>
                        ))}
                        {value.length > 2 && <li>...</li>}
                      </div>
                    ) : typeof value === 'string' ? (
                      value.length > 100 ? (
                        value.slice(0, 100).replace(/\*/g, '') + '...'
                      ) : (
                        value.replace(/\*/g, '')
                      )
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )
      }
    } catch (e) {
      console.warn('Failed to parse content:', e)
    }

    return (
      <div style={{ fontSize: '32px', fontWeight: 300 }}>
        {content ? (content.length > 250 ? content.slice(0, 250).replace(/\*/g, '') + '...' : content.replace(/\*/g, '')) : ''}
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
            paddingBottom: '26px',
          }}>
          <div
            tw={`${colorClass}`}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon size={36} /> <span tw="text-3xl">Our {title}</span>
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
            gap: '24px',
          }}>
          {/* User 1 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {picture1 && (
              <img
                src={picture1}
                alt="Profile picture 1"
                style={{ width: '64px', height: '64px', borderRadius: '50%' }}
              />
            )}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div
                tw="font-bold"
                style={{ fontWeight: 'bold', fontSize: '20px' }}>
                {name1}
              </div>
              <div
                tw="font-bold "
                style={{ display: 'flex', fontSize: '18px', color: '#7e7e7e' }}>
                @{username1}
              </div>
            </div>
          </div>
          {/* User 2 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {picture2 && (
              <img
                src={picture2}
                alt="Profile picture 2"
                style={{ width: '64px', height: '64px', borderRadius: '50%' }}
              />
            )}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div
                tw="font-bold"
                style={{ fontWeight: 'bold', fontSize: '20px' }}>
                {name2}
              </div>
              <div
                tw="font-bold "
                style={{ display: 'flex', fontSize: '18px', color: '#7e7e7e' }}>
                @{username2}
              </div>
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
