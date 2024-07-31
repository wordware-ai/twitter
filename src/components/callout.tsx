// import { PiGithubLogo } from 'react-icons/pi'

import { PiGithubLogo } from 'react-icons/pi'

import { Button } from '@/components/ui/button'

import WordwareLogo from './logo'

const Callout = () => {
  return (
    <div className="flex-center relative w-full flex-col gap-12 bg-[#F9FAFB] p-4 sm:p-12 md:p-24">
      <h2 className="mb-4 w-full text-center text-2xl text-stone-500 md:text-4xl lg:text-5xl xl:text-6xl">
        This is a <span className="text-black">WordApp</span> - Wordware application
      </h2>

      <div className="max-w-8xl relative flex w-full flex-col items-start gap-6 overflow-hidden rounded-3xl bg-black bg-gradient-to-r p-10 font-light text-white md:flex-row lg:p-16">
        <div className="w-full text-5xl md:w-1/2">Word... what?</div>
        <div className="w-full md:w-1/2">
          <h3 className="mb-4 text-2xl">WORDWARE</h3>
          <p className="mb-6 font-thin">
            It’s a tool (an IDE) that enables you to quickly build custom AI agents for specific use cases like legal contract generation, marketing content
            automation, invoice analysis, candidate screening, generating PRDs, and many more. We call applications built on Wordware ‘WordApps’ because you can
            create them using natural language—in other words, using words (pun intended).
          </p>
          <h3 className="mb-4 text-2xl">WHO IS IT FOR</h3>
          <p className="mb-6 font-thin">
            Most of our clients are cross-functional teams, including less technical members, who need to collaborate with engineers on LLM applications, such
            as assessing prompt outputs, and care about the speed of iterations.
          </p>
          <h3 className="mb-4 text-2xl">WHY</h3>
          <p className="mb-6 font-thin">
            Often, the domain expert—not the engineer—knows what good LLM output looks like. For example, lawyers building legal SaaS need to be deeply involved
            in the process, and working directly in the codebase or going back-and-forth with engineers isn’t the way to go.
          </p>
        </div>
      </div>
      <div className="max-w-8xl relative flex w-full flex-col items-start gap-6 overflow-hidden rounded-3xl bg-stone-300 bg-gradient-to-r p-10 font-light text-black md:flex-row lg:p-16">
        <div className="w-full text-5xl md:w-1/2">I&apos;m technical</div>
        <div className="w-full md:w-1/2">
          <p className="mb-6 font-light">
            Then you’ll appreciate <span className="font-bold">the speed of building complex AI agents without messy LLM abstractions</span>, as well as our
            advanced capabilities like loops, conditional logic (IF-Else), structured generation (JSON mode), and custom code execution, allowing you to connect
            to virtually any API.
          </p>
        </div>
      </div>
      <div className="flex-center flex-col gap-2 md:flex-row">
        <Button
          size={'lg'}
          variant={'default'}
          asChild>
          <a
            href={process.env.NEXT_PUBLIC_SHARED_APP_URL}
            target="_blank"
            className="flex-center gap-2">
            <WordwareLogo
              emblemOnly
              color={'white'}
              width={12}
            />
            Duplicate Wordware AI Agent
          </a>
        </Button>

        <Button
          size={'lg'}
          variant={'outline'}
          asChild>
          <a
            href="https://github.com/wordware-ai/twitter"
            target="_blank"
            className="flex-center gap-2">
            <PiGithubLogo />
            GitHub Repo
          </a>
        </Button>
      </div>
    </div>
  )
}

export default Callout
