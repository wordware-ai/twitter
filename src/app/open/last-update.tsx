'use client'

const LastUpdate = ({ timestamp }: { timestamp: Date }) => {
  return (
    <p>
      Last update:{' '}
      {new Date(timestamp).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'shortGeneric',
      })}
    </p>
  )
}

export default LastUpdate
