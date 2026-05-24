import { NextResponse } from 'next/server'
import { KEYS, LIMITS, redis, type StoredPoint } from '@/lib/redis'
import { ratelimit } from '@/lib/ratelimit'
import { geoFromHeaders, ipFromHeaders } from '@/lib/geo'
import { readOrCreateVoterId, readVoterId } from '@/lib/voter-id'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

type LovePayload = {
  count: number
  points: StoredPoint[]
  cities: string[]
  hasVoted: boolean
}

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

export async function GET(): Promise<NextResponse<LovePayload>> {
  const voterId = await readVoterId()
  const [countRaw, pointsRaw, citiesRaw, votedRaw] = await Promise.all([
    redis.get<number>(KEYS.count),
    redis.lrange(KEYS.points, 0, LIMITS.maxPoints - 1),
    redis.lrange(KEYS.cities, 0, LIMITS.maxCities - 1),
    voterId ? redis.get<string>(KEYS.voted(voterId)) : Promise.resolve(null),
  ])

  const body: LovePayload = {
    count: countRaw ?? 0,
    points: parsePoints(pointsRaw as unknown[]),
    cities: (citiesRaw as string[]) ?? [],
    hasVoted: Boolean(votedRaw),
  }

  return NextResponse.json(body, {
    headers: {
      'Cache-Control': 'public, s-maxage=2, stale-while-revalidate=10',
    },
  })
}

type VoteResponse =
  | { ok: true; alreadyVoted: boolean; count: number; point: StoredPoint }
  | { ok: false; error: 'rate_limited'; retryAfter: number }

export async function POST(request: Request): Promise<NextResponse<VoteResponse>> {
  const ip = ipFromHeaders(request.headers)
  const { id: voterId, isNew: isFreshCookie } = await readOrCreateVoterId()

  if (isFreshCookie) {
    const limit = await ratelimit.limit(ip)
    if (!limit.success) {
      return NextResponse.json(
        { ok: false, error: 'rate_limited', retryAfter: Math.ceil((limit.reset - Date.now()) / 1000) },
        { status: 429 },
      )
    }
  }

  const point = geoFromHeaders(request.headers)
  const setResult = await redis.set(KEYS.voted(voterId), '1', { nx: true })
  const isNewVoter = setResult === 'OK'

  if (!isNewVoter) {
    const count = (await redis.get<number>(KEYS.count)) ?? 0
    return NextResponse.json({ ok: true, alreadyVoted: true, count, point })
  }

  const pipeline = redis.pipeline()
  pipeline.incr(KEYS.count)
  pipeline.lpush(KEYS.points, JSON.stringify(point))
  pipeline.ltrim(KEYS.points, 0, LIMITS.maxPoints - 1)
  pipeline.lpush(KEYS.cities, `${point.city}, ${point.country}`)
  pipeline.ltrim(KEYS.cities, 0, LIMITS.maxCities - 1)
  const results = await pipeline.exec<[number, number, string, number, string]>()
  const count = results[0]

  return NextResponse.json({ ok: true, alreadyVoted: false, count, point })
}
