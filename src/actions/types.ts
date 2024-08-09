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
