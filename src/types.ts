export type TweetType = {
  isRetweet: boolean
  author: { userName: string }
  createdAt: string
  text: string
  retweetCount: number
  replyCount: number
  likeCount: number
  quoteCount: number
  viewCount: number
}

export type DatabaseUser = {
  username: string
  url: string
  name: string
  profilePicture: string
  description: string
  location: string
  fullProfile: object
  followers: number
}

export type TwitterAnalysis = {
  [key: string]: string | { title: string; subtitle: string }[] | string[] | undefined
  about?: string
  roast?: string
  strengths?: { title: string; subtitle: string }[]
  weaknesses?: { title: string; subtitle: string }[]
  loveLife?: string
  money?: string
  health?: string
  biggestGoal?: string
  colleaguePerspective?: string
  pickupLines?: string[]
  famousPersonComparison?: string
  previousLife?: string
  animal?: string
  fiftyDollarThing?: string
  career?: string
  lifeSuggestion?: string
  emojis?: string
}

export type CompatibilityAnalysis = {
  [key: string]: string | string[] | { [key: string]: string[] | string } | undefined
  mbti: {
    profile1: string
    profile2: string
  }
  about: string
  crazy: string
  drama: string
  emojis: string
  divorce: string
  marriage: string
  '3rd_wheel': string
  free_time: string
  red_flags: {
    profile1: string[]
    profile2: string[]
  }
  dealbreaker: string
  green_flags: {
    profile1: string[]
    profile2: string[]
  }
  follower_flex: string
  risk_appetite: string
  love_languages: string
  secret_desires: string
  friends_forever: string
  jealousy_levels: string
  attachment_style: string
  values_alignment: string
  breakup_percentage: string
  overall_compatibility: string
  personality_type_match: string
  emotional_compatibility: string
  financial_compatibility: string
  communication_style_compatibility: string
}

export type Steps = {
  profileScraped: boolean
  tweetScrapeStarted: boolean
  tweetScrapeCompleted: boolean
  wordwareStarted: boolean
  wordwareCompleted: boolean
  paidWordwareStarted: boolean
  paidWordwareCompleted: boolean
}
