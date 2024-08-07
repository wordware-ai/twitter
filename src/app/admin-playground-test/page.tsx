'use client'

import React, { useEffect, useState } from 'react'

import { getTweets } from '@/actions/profile-scraper'

const Page = () => {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTweets('ky__zo')
      setData(data)
    }

    fetchData()
  }, [])

  return (
    <div className="flex-center">
      <pre className="max-w-lg whitespace-pre-wrap text-black">{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

export default Page
