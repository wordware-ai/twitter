import Link from 'next/link'
import { PiEnvelope, PiGlobe, PiXLogo } from 'react-icons/pi'

import SaunaLogo from './logo'

const Footer = () => {
  return (
    <div className="flex-center w-full flex-col gap-14 bg-forest px-6 py-14 text-center text-white">
      <SaunaLogo
        color={'white'}
        width={200}
      />
      <div>
        <div className="flex-center flex-col gap-6 md:flex-row md:gap-8">
          <a
            href="https://sauna.ai"
            target="_blank"
            className="flex-center gap-2 text-white">
            <PiGlobe size={18} />
            sauna.ai
          </a>

          <a
            href="mailto:roast@sauna.ai"
            target="_blank"
            className="flex-center gap-2 text-white">
            <PiEnvelope size={18} />
            Email us
          </a>

          <a
            href="https://x.com/wordware"
            target="_blank"
            className="flex-center gap-2 text-white">
            <PiXLogo size={18} />X (fka. Twitter)
          </a>
        </div>
      </div>
      <div className="space-y-2">
        <div>Refund Policy</div>
        <p className="max-w-xl text-sm">
          If you wish to request a refund or discuss any issues regarding Twitter Personality purchase, please contact us at{' '}
          <a href="mailto:roast@sauna.ai">roast@sauna.ai</a>. Our team will assist you in resolving your concerns and processing any applicable refunds.
        </p>
        <div className="space-x-4 pt-3">
          <Link
            className="underline-offset-4 hover:underline"
            href="/terms">
            terms & conditions
          </Link>
          <Link
            className="underline-offset-4 hover:underline"
            href="/privacy">
            privacy policy
          </Link>
        </div>
      </div>

      <p className="text-xs">Copyright © 2026 HeyDaily Inc. (dba Wordware) — Sauna</p>
    </div>
  )
}

export default Footer
