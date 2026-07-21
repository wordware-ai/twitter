import './globals.css'

import Callout from '@/components/callout'
import { DeveloperInfo } from '@/components/developer-info'
import Footer from '@/components/footer'
import { getURL } from '@/lib/config'
import Providers from '@/lib/providers'
import { cn } from '@/lib/utils'

import siteMetadata from './metadata'

/**
 * Metadata configuration for the application
 * This object defines various metadata properties used for SEO and social sharing
 */
export const metadata = {
  metadataBase: new URL(getURL()),
  title: {
    template: `%s’s Twitter Personality Analysis by AI Agent`,
    default: siteMetadata.title,
  },
  description: siteMetadata.description,
  keywords: siteMetadata.keywords,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: siteMetadata.title,
    description: siteMetadata.description,
    creator: 'sauna',
    images: [siteMetadata.socialBanner],
  },
  /* <meta name="google-site-verification" content="voWl21V26444ofs1ojAqhH1UdOTEWBvJQHp9jADLDQU" /> */
  verification: {
    google: 'voWl21V26444ofs1ojAqhH1UdOTEWBvJQHp9jADLDQU',
  },
}

/**
 * RootLayout component
 * This component serves as the main layout wrapper for the entire application
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be rendered within the layout
 * @returns {JSX.Element} The root layout structure of the application
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Sans Flex is not yet available via next/font — load it directly per the Sauna brand guidelines */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:wght@400..700&family=Inter:wght@300..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('bg-desk font-sans font-light')}>
        <Providers>
          <>
            {/* Main content area */}
            {children}

            {/* Callout section */}
            <section className="w-full">
              <Callout />
            </section>

            {/* Footer component */}
            <Footer />
            <DeveloperInfo />
          </>
        </Providers>
      </body>
    </html>
  )
}
