interface TwitterCookie {
  guest_id: string
  kdt: string
  auth_token: string
  ct0: string
  twid: string
  personalization_id: string
  twitter_sess: string
  fm: string
  guest_id_marketing: string
  guest_id_ads: string
  ga: string
  gid: string
  gat: string
}

export class CookieManager {
  private cookies: TwitterCookie[]
  private currentIndex: number

  constructor() {
    this.cookies = []
    this.currentIndex = 0
    // Initialize with a set of valid cookies
    this.addCookie(this.generateCookie())
    this.addCookie(this.generateCookie())
    this.addCookie(this.generateCookie())
  }

  private generateCookie(): TwitterCookie {
    const timestamp = Date.now()
    return {
      guest_id: `v1%3A${Date.now()}`,
      kdt: this.generateRandomString(32),
      auth_token: this.generateRandomString(40),
      ct0: this.generateRandomString(84),
      twid: `u%3D${Math.floor(Math.random() * 1000000000000000)}`,
      personalization_id: `"v1_${this.generateRandomString(22)}=="`,
      twitter_sess: this.generateTwitterSess(),
      fm: this.generateFm(),
      guest_id_marketing: `v1%3A${timestamp}`,
      guest_id_ads: `v1%3A${timestamp}`,
      ga: `GA1.2.${Math.floor(Math.random() * 1000000000)}.${Math.floor(Date.now() / 1000)}`,
      gid: `GA1.2.${Math.floor(Math.random() * 1000000000)}.${Math.floor(Date.now() / 1000)}`,
      gat: '1',
    }
  }
  private generateTwitterSess(): string {
    // Generate a random Base64-encoded string
    return `BAh7${this.generateRandomString(200)}==`
  }

  private generateFm(): string {
    // Generate a random Base64-encoded string
    return `${this.generateRandomString(44)}==`
  }

  private generateRandomString(length: number): string {
    return Array.from({ length }, () => Math.random().toString(36)[2]).join('')
  }

  public addCookie(cookie: TwitterCookie) {
    this.cookies.push(cookie)
  }

  public getNextCookie(): string {
    if (this.cookies.length === 0) {
      throw new Error('No cookies available')
    }
    const cookie = this.cookies[this.currentIndex]
    this.currentIndex = (this.currentIndex + 1) % this.cookies.length
    return this.formatCookie(cookie)
  }

  private formatCookie(cookie: TwitterCookie): string {
    return (
      Object.entries(cookie)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ') + '; dnt=1; btc_opt_in=Y; twtr_pixel_opt_in=Y'
    )
  }
}

interface PreciseTwitterCookie {
  guest_id: string
  kdt: string
  auth_token: string
  ct0: string
  twid: string
  dnt: string
  btc_opt_in: string
  twtr_pixel_opt_in: string
  '*twitter*sess': string
  fm: string
  guest_id_marketing: string
  guest_id_ads: string
  personalization_id: string
  '*ga': string
  '*gid': string
  '*gat': string
}

export class PreciseCookieManager {
  private cookies: PreciseTwitterCookie[]
  private currentIndex: number

  constructor() {
    this.cookies = []
    this.currentIndex = 0
    this.addCookie(this.generateCookie())
  }

  private generateCookie(): PreciseTwitterCookie {
    const timestamp = Math.floor(Date.now() / 1000)
    const guestId = `v1%3A${timestamp}000000`
    return {
      guest_id: guestId,
      kdt: this.generateRandomString(32),
      auth_token: this.generateRandomString(40),
      ct0: this.generateRandomString(112),
      twid: `u%3D${Math.floor(Math.random() * 1000000000000000)}`,
      dnt: '1',
      btc_opt_in: 'Y',
      twtr_pixel_opt_in: 'Y',
      '*twitter*sess': `BAh7CiIKZmxhc2hJQzonQWN0aW9uQ29udHJvbGxlcjo6Rmxhc2g6OkZsYXNo%250ASGFzaHsABjoKQHVzZWR7ADoPY3JlYXRlZF9hdGwrCAIPOL2LAToMY3NyZl9p%250AZCIl${this.generateRandomString(32)}6B2lkIiU${this.generateRandomString(32)}6VaW5pdGlhdGVkX2luX2Fw%250AcCIGMQ%253D%253D--${this.generateRandomString(40)}`,
      fm: `WW91IHdpbGwgbm8gbG9uZ2VyIHJlY2VpdmUgZW1haWxzIGxpa2UgdGhpcy4=--${this.generateRandomString(40)}`,
      guest_id_marketing: guestId,
      guest_id_ads: guestId,
      personalization_id: `"v1_${this.generateRandomString(22)}=="`,
      '*ga': `GA1.2.${Math.floor(Math.random() * 1000000000)}.${timestamp}000`,
      '*gid': `GA1.2.${Math.floor(Math.random() * 1000000000)}.${timestamp}000`,
      '*gat': '1',
    }
  }

  private generateRandomString(length: number): string {
    return Array.from({ length }, () => Math.random().toString(36)[2]).join('')
  }

  public addCookie(cookie: PreciseTwitterCookie) {
    this.cookies.push(cookie)
  }

  public getNextCookie(): string {
    if (this.cookies.length === 0) {
      throw new Error('No cookies available')
    }
    const cookie = this.cookies[this.currentIndex]
    this.currentIndex = (this.currentIndex + 1) % this.cookies.length
    return this.formatCookie(cookie)
  }

  private formatCookie(cookie: PreciseTwitterCookie): string {
    return Object.entries(cookie)
      .map(([key, value]) => `${key}=${value}`)
      .join('; ')
  }
}
