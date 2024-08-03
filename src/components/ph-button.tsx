'use client'

import { useEffect, useState } from 'react'

const PHButton = ({ text }: { text?: string }) => {
  const [countdown, setCountdown] = useState('')

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()

      const launchTime = new Date('2024-08-03T00:00:00-07:00') // Set to July 10th, 2023 at midnight PST

      const diff = launchTime.getTime() - now.getTime()

      if (diff <= 0) {
        setCountdown('Launched!')
        clearInterval(timer)
      } else {
        // const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)

        setCountdown(`${hours}h ${minutes}m ${seconds}s`)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex min-w-[167px] flex-row items-center justify-start gap-4">
      <a
        href="https://www.producthunt.com/posts/wordware-yc-s24?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-wordware&#0045;yc&#0045;s24"
        target="_blank">
        <img
          src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=474117&theme=light"
          alt="Audioscribe&#0032;&#0183;&#0032;AI&#0045;powered&#0032;Record&#0045;to&#0045;Text - open&#0045;source&#0032;AI&#0032;agent&#0032;built&#0032;on&#0032;Wordware | Product Hunt"
          style={{ width: '167px', height: '36px' }}
          width="167"
          height="36"
        />
      </a>

      <div className="hidden text-start text-sm font-bold text-[#ff6154]">
        {text ? text : `We're live!`}
        <br />
        {countdown && `${countdown}`}
      </div>
    </div>
  )
}

export default PHButton
