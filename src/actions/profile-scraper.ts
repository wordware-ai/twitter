'use server'

import { JSDOM } from 'jsdom'
import { getRandom } from 'random-useragent'

// import { CookieManager, PreciseCookieManager } from './cookie-manager'
// import { CookieManager } from './cookie-manager'

type DatabaseUser = {
  username: string
  url: string
  name: string
  profilePicture: string
  description: string
  location: string
  fullProfile: object
  followers: number
}

type TwitterUserData = {
  created_at: string
  default_profile: boolean
  default_profile_image: boolean
  description: string
  entities: {
    description: {
      urls: Array<{
        display_url: string
        expanded_url: string
        url: string
        indices: [number, number]
      }>
    }
    url: {
      urls: Array<{
        display_url: string
        expanded_url: string
        url: string
        indices: [number, number]
      }>
    }
  }
  fast_followers_count: number
  favourites_count: number
  followers_count: number
  friends_count: number
  has_custom_timelines: boolean
  is_translator: boolean
  listed_count: number
  location: string
  media_count: number
  name: string
  normal_followers_count: number
  pinned_tweet_ids_str: string[]
  possibly_sensitive: boolean
  profile_banner_url: string
  profile_image_url_https: string
  profile_interstitial_type: string
  screen_name: string
  statuses_count: number
  translator_type: string
  url: string
  verified: boolean
  withheld_in_countries: string[]
}

async function getGuestToken(): Promise<string> {
  try {
    const response = await fetch('https://api.x.com/1.1/guest/activate.json', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_API_TOKEN}`,
      },
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data.guest_token
  } catch (error) {
    console.error('Error getting guest token:', error)
    throw new Error('Failed to obtain guest token')
  }
}

async function getUserData(screenName: string, guestToken: string): Promise<any> {
  const url = 'https://api.x.com/graphql/Ps2fF6e0c3Q19L63EhJX_Q/UserByScreenName'
  const headers = {
    Authorization: `Bearer ${process.env.TWITTER_API_TOKEN}`,
    'x-guest-token': guestToken,
    'Content-Type': 'application/json',
  }
  const params = new URLSearchParams({
    variables: JSON.stringify({ screen_name: screenName, withSafetyModeUserFields: true }),
    features: JSON.stringify({
      hidden_profile_subscriptions_enabled: true,
      rweb_tipjar_consumption_enabled: true,
      responsive_web_graphql_exclude_directive_enabled: true,
      verified_phone_label_enabled: false,
      subscriptions_verification_info_is_identity_verified_enabled: true,
      subscriptions_verification_info_verified_since_enabled: true,
      highlights_tweets_tab_ui_enabled: true,
      responsive_web_twitter_article_notes_tab_enabled: true,
      subscriptions_feature_can_gift_premium: true,
      creator_subscriptions_tweet_preview_api_enabled: true,
      responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
      responsive_web_graphql_timeline_navigation_enabled: true,
    }),
    fieldToggles: JSON.stringify({ withAuxiliaryUserLabels: false }),
  })

  try {
    const response = await fetch(`${url}?${params}`, { headers })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.warn('Error fetching user data:', error)
    throw new Error('getUserData: Failed to fetch user data')
  }
}

export async function fetchUserData({ screenName }: { screenName: string }): Promise<{ data: DatabaseUser | null; error: string | null }> {
  try {
    const guestToken = await getGuestToken()
    const userData = await getUserData(screenName, guestToken)

    const user = userData.data.user.result.legacy as TwitterUserData

    const databaseUser: DatabaseUser = {
      username: user.screen_name,
      url: user.url,
      name: user.name,
      profilePicture: user.profile_image_url_https.replace('_normal.', '_400x400.'),
      description: user.description,
      location: user.location,
      fullProfile: user,
      followers: user.followers_count,
    }

    return { data: databaseUser, error: null }
  } catch (error) {
    console.warn('fetchUserData: Error fetching user data:', error)
    return {
      data: null,
      error: error instanceof Error ? error.message : 'No profile found',
    }
  }
}
// const cookieManager = new CookieManager()
// const preciseCookieManager = new PreciseCookieManager()

export async function fetchTimelineProfile(screenName: string): Promise<string> {
  const guestToken = await getGuestToken()
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
    'x-guest-token': guestToken,
  }

  try {
    const response = await fetch(`${url}?${params}`, { headers })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.text()
  } catch (error) {
    console.error('Error fetching timeline profile:', error)
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

type TweetType = {
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
