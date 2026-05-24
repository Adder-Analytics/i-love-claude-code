'use client'

import { useEffect, useRef } from 'react'
import { animate, useMotionValue } from 'motion/react'

type Props = {
  value: number
  className?: string
}

const formatter = new Intl.NumberFormat('en-US')

export function Counter({ value, className }: Props) {
  const motionValue = useMotionValue(value)
  const spanRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        if (spanRef.current) {
          spanRef.current.textContent = formatter.format(Math.round(latest))
        }
      },
    })
    return () => controls.stop()
  }, [value, motionValue])

  return (
    <span ref={spanRef} className={className}>
      {formatter.format(value)}
    </span>
  )
}
