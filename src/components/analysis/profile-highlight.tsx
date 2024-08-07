import { SelectUser } from '@/drizzle/schema'
import { extractDescription } from '@/lib/utils'

export const ProfileHighlight = ({ user }: { user: SelectUser }) => (
  <div className="flex gap-4">
    <div className="flex-center grow">
      <img
        src={user.profilePicture || ''}
        alt="profile image"
        className="max-h-24 min-h-24 w-full min-w-24 max-w-24 rounded-full border border-gray-300"
        width={96}
        height={96}
      />
    </div>

    <div className="flex flex-col gap-1">
      <div className="text-xl font-bold">
        {user.name} <span className="text-base font-normal text-gray-500">@{user.username}</span>
      </div>
      <div className="text-gray-500">{user.location}</div>
      <div className="max-w-sm text-sm">{extractDescription({ fullProfile: user.fullProfile })}</div>
    </div>
  </div>
)
