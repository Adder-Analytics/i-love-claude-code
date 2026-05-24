'use client'

import { motion } from 'motion/react'

type Props = {
  alreadyVoted: boolean
}

export function ThankYou({ alreadyVoted }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="inline-flex flex-col items-center gap-2"
    >
      <div className="inline-flex items-center gap-3 rounded-full bg-white/5 px-8 py-3.5 text-lg text-white ring-1 ring-white/15 backdrop-blur-sm sm:text-xl">
        <span aria-hidden="true" className="text-ember-400">
          ♥
        </span>
        <span>{alreadyVoted ? 'you already said yes' : 'love received'}</span>
      </div>
      {alreadyVoted && <p className="text-sm text-white/40">one heart per person. that&apos;s the rule.</p>}
    </motion.div>
  )
}
