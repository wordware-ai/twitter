import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const Quote: React.FC = () => {
  return (
    <div className="font-inter flex flex-col items-center space-y-8 rounded-lg p-8 text-center">
      <p className="text-3xl font-normal text-[#1a1a1a]">
        omg, this is spot on!
        <br />
        how does twitter know
        <br />
        me so well?!
      </p>
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src="https://pbs.twimg.com/profile_images/1720918552721661952/Opqp--Su_400x400.jpg" />
          <AvatarFallback>FK</AvatarFallback>
        </Avatar>
        <div className="pt-3 text-lg font-medium text-[#1a1a1a]">
          Filip Kozera{' '}
          <span className="text-gray-500">
            <a
              href="https://x.com/kozerafilip"
              target="_blank">
              (@kozerafilip)
            </a>
          </span>
        </div>
        <div className="text-md text-gray-500">CEO & Co-founder, Wordware</div>
      </div>
    </div>
  )
}

export default Quote
