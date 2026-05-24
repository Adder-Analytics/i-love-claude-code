'use client'

import { motion } from 'motion/react'

type Props = {
  onClick: () => void
  pending: boolean
}

export function LoveButton({ onClick, pending }: Props) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={pending}
      whileHover={{ scale: pending ? 1 : 1.03 }}
      whileTap={{ scale: pending ? 1 : 0.97 }}
      transition={{ type: 'spring', stiffness: 380, damping: 22 }}
      className="group relative inline-flex items-center justify-center rounded-full bg-ember-500 px-12 py-4 text-2xl font-medium text-night-950 ring-1 ring-ember-500 shadow-[0_0_40px_-8px_var(--color-ember-400)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember-300 disabled:cursor-not-allowed disabled:opacity-70 sm:px-16 sm:py-5 sm:text-3xl"
    >
      <span
        className="pointer-events-none absolute -inset-px rounded-full bg-linear-to-b from-white/30 to-transparent opacity-60"
        aria-hidden="true"
      />
      <span className="relative">{pending ? 'sending love…' : 'Yes'}</span>
    </motion.button>
  )
}
