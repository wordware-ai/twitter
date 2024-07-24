import { Inter } from 'next/font/google'

import './globals.css'

import Callout from '@/components/callout'
import Footer from '@/components/footer'
import { NewsletterForm } from '@/components/newsletter-form'
import { getURL } from '@/lib/config'
import Providers from '@/lib/providers'
import { cn } from '@/lib/utils'

import siteMetadata from './metadata'

// Initialize the Inter font with Latin subset
const inter = Inter({ subsets: ['latin'] })

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
    creator: 'wordware',
    images: [siteMetadata.socialBanner],
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
      <body className={cn(inter.className, 'bg-[#F9FAFB] font-light')}>
        <Providers>
          <>
            {/* Main content area */}
            {children}

            {/* Callout section */}
            <section className="w-full">
              <Callout />
            </section>

            {/* Newsletter form section */}
            <section className="pb-24">
              <NewsletterForm />
            </section>

            {/* Footer component */}
            <Footer />
          </>
        </Providers>
      </body>
    </html>
  )
}
