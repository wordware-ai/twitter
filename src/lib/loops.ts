import 'server-only'

export const createLoopsContact = async (email: string, userGroup?: string) => {
  const options = {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.LOOPS_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email,
      source: 'twitter-personality',
      subscribed: true,
      ...(userGroup && { userGroup }),
    }),
  }

  const response = await fetch('https://app.loops.so/api/v1/contacts/create', options)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || response.statusText)
  }

  return data
}
