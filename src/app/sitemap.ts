import type { MetadataRoute } from 'next'

import { getURL } from '@/lib/config'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getURL()
  return [
    { url: base, changeFrequency: 'daily', priority: 1 },
    { url: `${base}compatibility`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}featured`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}terms`, changeFrequency: 'yearly', priority: 0.1 },
    { url: `${base}privacy`, changeFrequency: 'yearly', priority: 0.1 },
  ]
}
