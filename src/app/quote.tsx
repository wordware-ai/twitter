import WordwareLogo from '@/components/logo'
import { Button } from '@/components/ui/button'

const Quote: React.FC = () => {
  return (
    <div className="font-inter flex flex-col items-center space-y-8 rounded-lg p-8 text-center">
      <div className="flex flex-col items-center p-8">
        <WordwareLogo
          color="black"
          width={400}
        />
        <p className="my-12 text-2xl font-normal text-[#1a1a1a]">— The easiest way to build AI apps —</p>

        <div className="mt-4 space-y-4 text-lg">
          <p>The only programming language you need is plain English.</p>
          <p>Edit the AI powering this app and see how easy it is:</p>
          <div className="pt-4">
            <Button
              size={'sm'}
              variant={'outline'}
              asChild>
              <a
                href={process.env.NEXT_PUBLIC_SHARED_APP_URL}
                target="_blank"
                className="flex-center gap-2">
                <WordwareLogo
                  emblemOnly
                  color={'black'}
                  width={12}
                />
                Edit this AI app
              </a>
            </Button>
            <div className="mt-2 text-sm text-gray-500">No credit card required</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Quote
