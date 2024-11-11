import { getURL } from '@/lib/config'

export const siteMetadata = {
  title: 'Twitter Personality - AI Agent by Wordware',
  author: 'Wordware',
  headerTitle: 'Twitter Personality',
  description:
    'Twitter Personality is an advanced AI-powered tool that performs in-depth analysis of your Twitter activity, revealing personality traits, communication patterns, and behavioral insights. Understand your online presence, discover your unique social media voice, and gain valuable insights about how you engage with others on Twitter. Perfect for individuals, content creators, and professionals looking to better understand their digital persona.',
  // dynamic twitter description
  twitter: (username?: string) =>
    username
      ? `Check out ${username}'s Twitter personality analysis! See their strengths, communication patterns, and unique traits. Get fun insights like spirit animal, famous personality match, and more. Built with @wordware_ai.`
      : 'AI-powered Twitter personality analysis that reveals your strengths, communication patterns, and unique traits. Get fun insights like your spirit animal, famous personality match, and more. Built with @wordware_ai.',
  language: 'en-us',
  theme: 'light',
  siteUrl: new URL(getURL()),
  socialBanner: '/social/og.png',
  locale: 'en-US',
}

// If you need a default export as well:
export default siteMetadata
