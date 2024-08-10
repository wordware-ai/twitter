import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'
import { PiRobot } from 'react-icons/pi'

import { cardData } from '@/lib/wordware-config'

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
      console.warn('Failed to parse content:', e)
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
        backgroundColor: '#fafafa',
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
          <svg
            width={240}
            height={240 * 0.15}
            viewBox="0 0 293 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M13 0H0V44H13V43.1128L13.1923 43.3051L29.2584 27.239L45.3245 43.3051L45.5168 43.1128V44H58.5168V0H45.5168V25.1127L38.1924 17.7882L29.2584 26.7222L20.3245 17.7882L13 25.1127V0Z"
              fill="black"
            />
            <path
              d="M77.9484 34L71.5763 11.7304H76.7196L80.4059 27.2039H80.5907L84.6575 11.7304H89.0614L93.1174 27.2365H93.3131L96.9993 11.7304H102.143L95.7706 34H91.1818L86.941 19.4399H86.767L82.5371 34H77.9484ZM128.771 22.8652C128.771 25.2937 128.31 27.3597 127.39 29.0633C126.476 30.7668 125.229 32.0681 123.649 32.967C122.076 33.8586 120.307 34.3045 118.343 34.3045C116.364 34.3045 114.587 33.855 113.014 32.9561C111.441 32.0572 110.198 30.756 109.285 29.0524C108.371 27.3488 107.915 25.2864 107.915 22.8652C107.915 20.4367 108.371 18.3707 109.285 16.6671C110.198 14.9636 111.441 13.6659 113.014 12.7743C114.587 11.8754 116.364 11.4259 118.343 11.4259C120.307 11.4259 122.076 11.8754 123.649 12.7743C125.229 13.6659 126.476 14.9636 127.39 16.6671C128.31 18.3707 128.771 20.4367 128.771 22.8652ZM123.997 22.8652C123.997 21.2921 123.761 19.9655 123.29 18.8854C122.826 17.8053 122.17 16.9861 121.322 16.4279C120.474 15.8697 119.481 15.5906 118.343 15.5906C117.204 15.5906 116.211 15.8697 115.363 16.4279C114.515 16.9861 113.855 17.8053 113.384 18.8854C112.92 19.9655 112.688 21.2921 112.688 22.8652C112.688 24.4383 112.92 25.7649 113.384 26.845C113.855 27.9252 114.515 28.7443 115.363 29.3025C116.211 29.8607 117.204 30.1398 118.343 30.1398C119.481 30.1398 120.474 29.8607 121.322 29.3025C122.17 28.7443 122.826 27.9252 123.29 26.845C123.761 25.7649 123.997 24.4383 123.997 22.8652ZM137.158 34V11.7304H145.944C147.626 11.7304 149.061 12.0312 150.25 12.6329C151.446 13.2274 152.356 14.0719 152.979 15.1665C153.61 16.2539 153.925 17.5334 153.925 19.005C153.925 20.4838 153.606 21.7561 152.968 22.8217C152.33 23.8801 151.406 24.692 150.195 25.2574C148.992 25.8229 147.535 26.1056 145.824 26.1056H139.941V22.3215H145.063C145.962 22.3215 146.708 22.1983 147.303 21.9518C147.897 21.7053 148.34 21.3356 148.63 20.8427C148.927 20.3497 149.075 19.7372 149.075 19.005C149.075 18.2656 148.927 17.6421 148.63 17.1347C148.34 16.6273 147.894 16.243 147.292 15.9821C146.698 15.7139 145.947 15.5797 145.041 15.5797H141.866V34H137.158ZM149.184 23.8656L154.719 34H149.521L144.106 23.8656H149.184ZM170.046 34H162.152V11.7304H170.111C172.351 11.7304 174.28 12.1762 175.896 13.0679C177.513 13.9523 178.756 15.2245 179.626 16.8846C180.503 18.5447 180.942 20.531 180.942 22.8435C180.942 25.1632 180.503 27.1567 179.626 28.8241C178.756 30.4914 177.506 31.7709 175.875 32.6625C174.251 33.5542 172.308 34 170.046 34ZM166.86 29.9658H169.85C171.242 29.9658 172.413 29.7193 173.363 29.2264C174.32 28.7262 175.037 27.9542 175.516 26.9103C176.001 25.8591 176.244 24.5035 176.244 22.8435C176.244 21.1979 176.001 19.8532 175.516 18.8093C175.037 17.7654 174.323 16.997 173.374 16.504C172.424 16.0111 171.253 15.7646 169.861 15.7646H166.86V29.9658ZM193.504 34L187.132 11.7304H192.276L195.962 27.2039H196.147L200.214 11.7304H204.617L208.673 27.2365H208.869L212.555 11.7304H217.699L211.327 34H206.738L202.497 19.4399H202.323L198.093 34H193.504ZM226.714 34H221.668L229.356 11.7304H235.424L243.101 34H238.055L232.477 16.8194H232.303L226.714 34ZM226.398 25.2466H238.316V28.9219H226.398V25.2466ZM250.68 34V11.7304H259.466C261.148 11.7304 262.583 12.0312 263.772 12.6329C264.968 13.2274 265.878 14.0719 266.502 15.1665C267.132 16.2539 267.448 17.5334 267.448 19.005C267.448 20.4838 267.129 21.7561 266.491 22.8217C265.853 23.8801 264.929 24.692 263.718 25.2574C262.515 25.8229 261.058 26.1056 259.347 26.1056H253.464V22.3215H258.586C259.484 22.3215 260.231 22.1983 260.826 21.9518C261.42 21.7053 261.862 21.3356 262.152 20.8427C262.449 20.3497 262.598 19.7372 262.598 19.005C262.598 18.2656 262.449 17.6421 262.152 17.1347C261.862 16.6273 261.416 16.243 260.815 15.9821C260.22 15.7139 259.47 15.5797 258.564 15.5797H255.389V34H250.68ZM262.707 23.8656L268.241 34H263.044L257.629 23.8656H262.707ZM275.674 34V11.7304H290.68V15.6124H280.383V20.9188H289.908V24.8007H280.383V30.118H290.724V34H275.674Z"
              fill="black"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}
