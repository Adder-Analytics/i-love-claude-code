import { LoveExperience } from '@/components/love-experience'
import { Starfield } from '@/components/starfield'
import { KEYS, LIMITS, redis, type StoredPoint } from '@/lib/redis'
import { readVoterId } from '@/lib/voter-id'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function parsePoints(raw: unknown[]): StoredPoint[] {
  const out: StoredPoint[] = []
  for (const item of raw) {
    if (typeof item === 'string') {
      try {
        out.push(JSON.parse(item) as StoredPoint)
      } catch {}
    } else if (item && typeof item === 'object') {
      out.push(item as StoredPoint)
    }
  }
  return out
}

async function loadInitial() {
  const voterId = await readVoterId()
  const [countRaw, pointsRaw, citiesRaw, votedRaw] = await Promise.all([
    redis.get<number>(KEYS.count),
    redis.lrange(KEYS.points, 0, LIMITS.maxPoints - 1),
    redis.lrange(KEYS.cities, 0, LIMITS.maxCities - 1),
    voterId ? redis.get<string>(KEYS.voted(voterId)) : Promise.resolve(null),
  ])

  return {
    count: countRaw ?? 0,
    points: parsePoints(pointsRaw as unknown[]),
    cities: (citiesRaw as string[]) ?? [],
    hasVoted: Boolean(votedRaw),
  }
}

export default async function Page() {
  const initial = await loadInitial().catch(() => ({
    count: 0,
    points: [],
    cities: [],
    hasVoted: false,
  }))

  return (
    <main className="relative isolate min-h-dvh overflow-hidden bg-night-950 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_50%_20%,rgba(255,138,76,0.18),transparent_55%)]"
      />
      <Starfield />

      <div className="relative z-10 mx-auto flex min-h-dvh max-w-2xl flex-col items-center justify-between px-6 pb-12 pt-16 sm:pt-24">
        <header className="text-xs uppercase tracking-wide text-white/40">iloveclaudecode.com</header>

        <LoveExperience initial={initial} />

        <footer className="mt-12 text-xs text-white/30">
          made with{' '}
          <a
            href="https://claude.com/claude-code"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-ember-400/40 underline-offset-4 hover:text-white/60"
          >
            Claude Code
          </a>
          {' · '}
          <a
            href="https://github.com/Adder-Analytics/i-love-claude-code"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-white/20 underline-offset-4 hover:text-white/60"
          >
            source
          </a>
        </footer>
      </div>
    </main>
  )
}
