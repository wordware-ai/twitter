interface TwitterCookie {
  guest_id: string
  kdt: string
  auth_token: string
  ct0: string
  twid: string
  personalization_id: string
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
    return {
      guest_id: `v1%3A${Date.now()}`,
      kdt: this.generateRandomString(32),
      auth_token: this.generateRandomString(40),
      ct0: this.generateRandomString(84),
      twid: `u%3D${Math.floor(Math.random() * 1000000000000000)}`,
      personalization_id: `"v1_${this.generateRandomString(22)}=="`,
    }
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
