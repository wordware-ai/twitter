import { JSDOM } from 'jsdom'
import { getRandom } from 'random-useragent'

import { TweetType } from '../types'

export async function fetchTimelineProfile(screenName: string): Promise<string> {
  // const guestToken = await getGuestToken()
  const url = `https://syndication.twitter.com/srv/timeline-profile/screen-name/${screenName}`
  const params = new URLSearchParams({
    dnt: 'false',
    embedId: 'twitter-widget-1',
    features:
      'eyJ0ZndfdGltZWxpbmVfbGlzdCI6eyJidWNrZXQiOltdLCJ2ZXJzaW9uIjpudWxsfSwidGZ3X2ZvbGxvd2VyX2NvdW50X3N1bnNldCI6eyJidWNrZXQiOnRydWUsInZlcnNpb24iOm51bGx9LCJ0ZndfdHdlZXRfZWRpdF9iYWNrZW5kIjp7ImJ1Y2tldCI6Im9uIiwidmVyc2lvbiI6bnVsbH0sInRmd19yZWZzcmNfc2Vzc2lvbiI6eyJidWNrZXQiOiJvbiIsInZlcnNpb24iOm51bGx9LCJ0ZndfZm9zbnJfc29mdF9pbnRlcnZlbnRpb25zX2VuYWJsZWQiOnsiYnVja2V0Ijoib24iLCJ2ZXJzaW9uIjpudWxsfSwidGZ3X21peGVkX21lZGlhXzE1ODk3Ijp7ImJ1Y2tldCI6InRyZWF0bWVudCIsInZlcnNpb24iOm51bGx9LCJ0ZndfZXhwZXJpbWVudHNfY29va2llX2V4cGlyYXRpb24iOnsiYnVja2V0IjoxMjA5NjAwLCJ2ZXJzaW9uIjpudWxsfSwidGZ3X3Nob3dfYmlyZHdhdGNoX3Bpdm90c19lbmFibGVkIjp7ImJ1Y2tldCI6Im9uIiwidmVyc2lvbiI6bnVsbH0sInRmd19kdXBsaWNhdGVfc2NyaWJlc190b19zZXR0aW5ncyI6eyJidWNrZXQiOiJvbiIsInZlcnNpb24iOm51bGx9LCJ0ZndfdXNlX3Byb2ZpbGVfaW1hZ2Vfc2hhcGVfZW5hYmxlZCI6eyJidWNrZXQiOiJvbiIsInZlcnNpb24iOm51bGx9LCJ0ZndfdmlkZW9faGxzX2R5bmFtaWNfbWFuaWZlc3RzXzE1MDgyIjp7ImJ1Y2tldCI6InRydWVfYml0cmF0ZSIsInZlcnNpb24iOm51bGx9LCJ0ZndfbGVnYWN5X3RpbWVsaW5lX3N1bnNldCI6eyJidWNrZXQiOnRydWUsInZlcnNpb24iOm51bGx9LCJ0ZndfdHdlZXRfZWRpdF9mcm9udGVuZCI6eyJidWNrZXQiOiJvbiIsInZlcnNpb24iOm51bGx9fQ%3D%3D',
    frame: 'false',
    hideBorder: 'false',
    hideFooter: 'false',
    hideHeader: 'false',
    hideScrollBar: 'false',
    lang: 'en',
    origin: 'https://publish.twitter.com/?buttonType=HashtagButton&query=https%3A%2F%2Ftwitter.com%2Felonmusk&widget=Timeline',
    sessionId: 'b4415d45af3b40351fa797593b9e1b79232222a6',
    showHeader: 'true',
    showReplies: 'false',
    transparent: 'false',
    widgetsVersion: '2615f7e52b7e0:1702314776716',
  })

  const headers = {
    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'accept-language': 'en-US,en;q=0.9',
    cookie: process.env.TWITTER_COOKIE!,
    // cookie: cookieManager.getNextCookie(),
    // cookie: preciseCookieManager.getNextCookie(),
    dnt: '1',
    priority: 'u=0, i',
    referer: 'https://publish.twitter.com/',
    'sec-ch-ua': '"Chromium";v="127", "Not)A;Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'iframe',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'same-site',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1',
    // 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
    'user-agent': getRandom(),
    //   'x-guest-token': guestToken,
  }

  try {
    const response = await fetch(`${url}?${params}`, { headers })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.text()
  } catch (error) {
    // console.log('⚠️ Error ', error)
    throw new Error('Failed to fetch timeline profile')
  }
}

export async function extractTweets(htmlContent: string): Promise<any[]> {
  // Create a DOM from the HTML content
  const dom = new JSDOM(htmlContent)
  const document = dom.window.document

  // Find the script tag containing the JSON data
  const scriptTag = document.querySelector('script#__NEXT_DATA__')

  if (!scriptTag) {
    throw new Error('Could not find script tag with tweet data')
  }

  // Parse the JSON data
  const jsonData = JSON.parse(scriptTag.textContent || '')

  // Navigate to the tweets array
  const tweets = jsonData.props.pageProps.timeline.entries.filter((entry: any) => entry.type === 'tweet').map((entry: any) => entry.content.tweet)

  //sort tweets by createt_at
  tweets.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  return tweets.slice(0, 12)
}

export async function getTweets(screenName: string) {
  const htmlContent = await fetchTimelineProfile(screenName)
  const tweets = await extractTweets(htmlContent)
  const parsedTweets = tweets.map(parseTweet)

  return parsedTweets
}

function parseTweet(tweet: any): TweetType {
  return {
    isRetweet: !!tweet.retweeted_status,
    author: {
      userName: tweet.user.screen_name,
    },
    createdAt: tweet.created_at,
    text: tweet.full_text || tweet.text,
    retweetCount: tweet.retweet_count,
    replyCount: tweet.reply_count,
    likeCount: tweet.favorite_count,
    quoteCount: tweet.quote_count,
    viewCount: tweet.view_count || 0, // Twitter doesn't always provide view count
  }
}
