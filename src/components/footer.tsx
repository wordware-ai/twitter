import { PiDiscordLogo, PiEnvelope, PiLinkedinLogo, PiXLogo } from 'react-icons/pi'

import WordwareLogo from './logo'

const Footer = () => {
  return (
    <div className="flex-center w-full flex-col gap-14 bg-[#0E0E0E] px-6 py-14 text-center text-white">
      <WordwareLogo
        color={'white'}
        width={200}
      />
      <div>
        <div className="flex-center flex-col gap-6 md:flex-row md:gap-8">
          <a
            href="mailto:hello@wordware.ai"
            target="_blank"
            className="flex-center gap-2 text-white">
            <PiEnvelope size={18} />
            Email us
          </a>

          <a
            href="https://discord.gg/6Zm5FGC2kR"
            target="_blank"
            className="flex-center gap-2 text-white">
            <PiDiscordLogo size={18} />
            Join Discord
          </a>

          <a
            href="https://x.com/wordware_ai"
            target="_blank"
            className="flex-center gap-2 text-white">
            <PiXLogo size={18} />X (fka. Twitter)
          </a>

          <a
            href="https://www.linkedin.com/company/wordware/"
            target="_blank"
            className="flex-center gap-2 text-white">
            <PiLinkedinLogo size={18} />
            LinkedIn
          </a>
        </div>
      </div>
      <div className="space-y-2">
        <div>Refund Policy</div>
        <p className="max-w-xl text-sm">
          If you wish to request a refund or discuss any issues regarding Twitter Personality purchase, please contact us at{' '}
          <a href="mailto:hello@wordware.ai">hello@wordware.ai</a>. Our team will assist you in resolving your concerns and processing any applicable refunds.
        </p>
      </div>

      <p className="text-xs">Copyright © 2024 HeyDaily Inc. (dba Wordware)</p>
    </div>
  )
}

export default Footer
