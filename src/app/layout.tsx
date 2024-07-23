import { Inter } from 'next/font/google'

import './globals.css'

import Callout from '@/components/callout'
import Footer from '@/components/footer'
import { NewsletterForm } from '@/components/newsletter-form'
import { getURL } from '@/lib/config'
import { cn } from '@/lib/utils'

import siteMetadata from './metadata'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  metadataBase: new URL(getURL()),
  title: {
    template: `%s • AI Agent Twitter Personality`,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, 'bg-[#F9FAFB] font-light')}>
        {children}
        <section className="w-full">
          <Callout />
        </section>
        <section className="pb-24">
          <NewsletterForm />
        </section>
        <Footer />
      </body>
    </html>
  )
}
