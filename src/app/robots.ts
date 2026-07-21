import type { MetadataRoute } from 'next'

import { getURL } from '@/lib/config'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Keep crawlers out of API routes; user pages are governed by their own
      // noindex meta tags
      disallow: ['/api/'],
    },
    sitemap: `${getURL()}sitemap.xml`,
  }
}
