'use client'

import { useEffect, useState } from 'react'
import { PiArrowUpBold } from 'react-icons/pi'

import PHButton from '@/components/ph-button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

const PHPopup = () => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}>
      {/* <DialogTrigger>Open</DialogTrigger> */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="w-full text-center">We need your help! 🤩 🙏</DialogTitle>
          <div className="space-y-4">
            <div className="space-y-2 text-sm">
              <p> Wordware just launched on Product Hunt!</p>

              <p>It would mean a lot to us if you could help us out by supporting us on Product Hunt.</p>

              <p>Team Wordware</p>
            </div>
            <div className="flex-center w-full flex-col gap-1">
              <PHButton />
              <div className="flex-center w-full gap-2">
                Click <PiArrowUpBold className="animate-bounce" /> here!
              </div>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default PHPopup
