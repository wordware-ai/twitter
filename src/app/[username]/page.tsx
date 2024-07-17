import React from 'react'

import { getUser } from '@/actions/actions'

const Page = async ({ params }: { params: { username: string } }) => {
  const data = await getUser({ username: params.username })

  return <pre className="whitespace-pre-wrap">data: {JSON.stringify(data, null, 2)}</pre>
}

export default Page
