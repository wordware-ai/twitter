export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_BASE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    'http://localhost:3000/'
  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`
  // Make sure to including trailing `/`.
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`
  return url
}

//TRUE if user has to pay for the service
//FALSE if paywall is disabled
export const PERSONALITY_PART1_PAYWALL = false
export const PAIRS_PAYWALL = true
