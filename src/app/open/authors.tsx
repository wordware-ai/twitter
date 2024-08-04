import { getAuthors } from '@/actions/actions'
import WordwareLogo from '@/components/logo'

const Authors = async () => {
  const authors = await getAuthors()
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
      {authors.map((user) => (
        <a
          target="_blank"
          href={`https://x.com/${user.username}`}
          key={user.id}
          className="relative block w-full cursor-pointer rounded-lg border bg-white p-2 shadow-[5px_5px_30px_rgba(190,190,190,0.15),-5px_-5px_30px_rgba(255,255,255,0.15)] transition-all duration-100 hover:shadow-[5px_5px_30px_rgba(190,190,190,0.3),-5px_-5px_30px_rgba(255,255,255,0.3)]">
          <div className="flex w-full items-center gap-2">
            <img
              src={user.profilePicture || ''}
              alt={user.name || user.username}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="w-full">
              <p className="text-start font-semibold">{user.name || user.username}</p>
              <p className="text-start text-sm text-gray-500">@{user.username}</p>
            </div>

            {!user.username.includes('ky__zo') && (
              <div className="absolute bottom-4 right-4">
                <WordwareLogo
                  emblemOnly
                  color="black"
                  width={20}
                />
              </div>
            )}
          </div>
        </a>
      ))}
    </div>
  )
}

export default Authors
