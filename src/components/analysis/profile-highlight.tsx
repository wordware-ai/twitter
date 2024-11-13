import { SelectUser } from '@/drizzle/schema'
import { extractDescription } from '@/lib/utils'

export const ProfileHighlight = ({ user }: { user: SelectUser }) => (
  
  <article className="flex gap-4">
    <div className="flex-center grow">
      <img
        src={user.profilePicture || '/default-profile.png'}
        alt={`Profile picture of ${user.name}`}
        className="max-h-24 min-h-24 w-full min-w-24 max-w-24 rounded-full border border-gray-300"
        width={96}
        height={96}
        loading="lazy"
      />
    </div>

    <div className="flex flex-col gap-1">
      <header className="flex flex-col text-xl font-bold">
        <h1 itemProp="name">{user.name}</h1>
        <span
          className="text-base font-normal text-gray-500"
          itemProp="alternateName">
          @{user.username}
        </span>
      </header>
      {user.location && (
        <div
          className="text-gray-500"
          itemProp="location">
          {user.location}
        </div>
      )}
    
      <p
        className="max-w-sm text-sm"
        itemProp="description">
        {extractDescription({ fullProfile: user.fullProfile })}
      </p>
    </div>
  </article>
)
