'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import confetti from 'canvas-confetti'
import { Counter } from './counter'
import { Globe, type GlobeMarker } from './globe'
import { LoveButton } from './love-button'
import { RecentCities } from './recent-cities'
import { ThankYou } from './thank-you'

type Point = {
  lat: number
  lng: number
  city: string
  country: string
  ts: number
}

type LoveState = {
  count: number
  points: Point[]
  cities: string[]
  hasVoted: boolean
}

type VoteResponse =
  | { ok: true; alreadyVoted: boolean; count: number; point: Point }
  | { ok: false; error: 'rate_limited'; retryAfter: number }

type Props = {
  initial: LoveState
}

const POLL_MS = 4000

function pointToMarker(point: Point, size = 0.03): GlobeMarker {
  return { location: [point.lat, point.lng], size }
}

function fireConfetti() {
  const ember = ['#ff8a4c', '#ffae7e', '#ffd4b8', '#ffffff']
  confetti({
    particleCount: 80,
    spread: 70,
    startVelocity: 35,
    origin: { y: 0.6 },
    colors: ember,
    scalar: 0.9,
  })
  setTimeout(() => {
    confetti({ particleCount: 40, spread: 100, startVelocity: 25, origin: { y: 0.55 }, colors: ember, scalar: 0.8 })
  }, 220)
}

export function LoveExperience({ initial }: Props) {
  const [state, setState] = useState<LoveState>(initial)
  const [pending, setPending] = useState(false)
  const [voted, setVoted] = useState(initial.hasVoted)
  const [alreadyVoted, setAlreadyVoted] = useState(false)
  const [errorNote, setErrorNote] = useState<string | null>(null)
  const ownPointRef = useRef<Point | null>(null)

  const markers = useMemo<GlobeMarker[]>(() => {
    const base = state.points.map((p) => pointToMarker(p))
    if (ownPointRef.current) base.unshift(pointToMarker(ownPointRef.current, 0.06))
    return base.slice(0, 200)
  }, [state.points])

  const refresh = useCallback(async (signal?: AbortSignal) => {
    try {
      const res = await fetch('/api/love', { signal, cache: 'no-store' })
      if (!res.ok) return
      const next = (await res.json()) as LoveState
      setState((prev) => ({
        count: Math.max(prev.count, next.count),
        points: next.points,
        cities: next.cities,
        hasVoted: next.hasVoted,
      }))
      if (next.hasVoted) setVoted(true)
    } catch {}
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const interval = window.setInterval(() => refresh(controller.signal), POLL_MS)
    return () => {
      controller.abort()
      window.clearInterval(interval)
    }
  }, [refresh])

  const onYes = useCallback(async () => {
    if (pending || voted) return
    setPending(true)
    setErrorNote(null)
    setState((prev) => ({ ...prev, count: prev.count + 1 }))
    try {
      const res = await fetch('/api/love', { method: 'POST' })
      const body = (await res.json()) as VoteResponse
      if (!body.ok) {
        setState((prev) => ({ ...prev, count: Math.max(0, prev.count - 1) }))
        setErrorNote('whoa — slow down. try again in a minute.')
        setPending(false)
        return
      }
      if (body.alreadyVoted) {
        setState((prev) => ({ ...prev, count: Math.max(prev.count - 1, body.count) }))
        setAlreadyVoted(true)
        setVoted(true)
        setPending(false)
        return
      }
      ownPointRef.current = body.point
      setState((prev) => ({ ...prev, count: Math.max(prev.count, body.count) }))
      fireConfetti()
      setVoted(true)
      setPending(false)
    } catch {
      setState((prev) => ({ ...prev, count: Math.max(0, prev.count - 1) }))
      setErrorNote('network hiccup. try again?')
      setPending(false)
    }
  }, [pending, voted])

  return (
    <div className="flex w-full flex-col items-center gap-6 sm:gap-7">
      <div className="flex w-full flex-col items-center gap-6 sm:gap-5 lg:flex-row lg:items-center lg:justify-center lg:gap-10 xl:gap-14">
        <div className="flex flex-col items-center gap-4 text-center sm:gap-5 lg:max-w-md lg:items-start lg:text-left">
          <h1 className="font-display text-balance text-5xl text-white sm:text-6xl lg:text-6xl xl:text-7xl">
            Do you love
            <br />
            <span className="text-ember-400">Claude Code?</span>
          </h1>

          <div className="flex min-h-16 items-center sm:min-h-20">
            <AnimatePresence mode="wait" initial={false}>
              {voted ? (
                <motion.div key="thanks" exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                  <ThankYou alreadyVoted={alreadyVoted} />
                </motion.div>
              ) : (
                <motion.div key="button" exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                  <LoveButton onClick={onYes} pending={pending} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {errorNote && <p className="text-sm text-ember-300/80">{errorNote}</p>}

          <p className="text-base text-white/60 sm:text-lg">
            <Counter value={state.count} className="font-medium tabular-nums text-white" /> souls and counting
          </p>
        </div>

        <div className="relative aspect-square w-[min(100%,42dvh,520px)] shrink-0 lg:w-[min(46vw,70dvh,540px)] xl:w-[min(48vw,80dvh,640px)]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,138,76,0.25),transparent_60%)] blur-2xl"
          />
          <Globe markers={markers} />
        </div>
      </div>

      <RecentCities cities={state.cities} />
    </div>
  )
}
