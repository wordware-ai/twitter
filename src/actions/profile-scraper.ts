'use server'

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
