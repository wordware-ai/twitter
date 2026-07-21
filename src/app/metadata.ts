import { getURL } from '@/lib/config'

export const siteMetadata = {
  title: 'Twitter Personality - AI Roast & Personality Test by Sauna',
  author: 'Sauna',
  headerTitle: 'Twitter Personality',
  description:
    'Twitter Personality is an advanced AI-powered Twitter personality analysis and roast tool. The AI agent reads your profile and tweets, roasts you, and reveals personality traits, communication patterns, and behavioral insights — plus fun extras like your spirit animal and famous personality match. The viral Twitter roast, formerly by Wordware, now built by Sauna — your AI coworker.',
  keywords: [
    'twitter personality',
    'twitter personality analysis',
    'twitter personality test',
    'twitter personality ai',
    'twitter roast',
    'twitter roast ai',
    'ai roast',
    'twitter profile ai',
    'twitter compatibility',
    'wordware twitter',
    'wordware twitter roast',
    'wordware ai',
    'sauna ai',
    'sauna twitter roast',
  ],
  // dynamic twitter description
  twitter: (username?: string) =>
    username
      ? `Check out ${username}'s Twitter personality analysis! See their strengths, communication patterns, and unique traits. Get fun insights like spirit animal, famous personality match, and more. Built with Sauna (sauna.ai).`
      : 'AI-powered Twitter personality analysis that reveals your strengths, communication patterns, and unique traits. Get fun insights like your spirit animal, famous personality match, and more. Built with Sauna (sauna.ai).',
  language: 'en-us',
  theme: 'light',
  siteUrl: new URL(getURL()),
  socialBanner: '/social/og.png',
  locale: 'en-US',
}

// If you need a default export as well:
export default siteMetadata
