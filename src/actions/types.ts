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
