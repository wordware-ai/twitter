'use client'

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'

if (typeof window !== 'undefined') {
  if (process.env.NEXT_PUBLIC_POSTHOG_KEY !== '...' && process.env.NEXT_PUBLIC_POSTHOG_HOST !== '...') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: '/ingest',
      // api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      disable_session_recording: true,
    })
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
