import 'server-only'
import type { StoredPoint } from './redis'

const FALLBACK: StoredPoint = {
  lat: 51.5074,
  lng: -0.1278,
  city: 'Localhost',
  country: 'XX',
  ts: 0,
}

function parseNum(value: string | null): number | null {
  if (!value) return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

export function geoFromHeaders(headers: Headers): StoredPoint {
  const lat = parseNum(headers.get('x-vercel-ip-latitude'))
  const lng = parseNum(headers.get('x-vercel-ip-longitude'))
  const cityRaw = headers.get('x-vercel-ip-city')
  const country = headers.get('x-vercel-ip-country') ?? FALLBACK.country
  if (lat === null || lng === null) {
    return { ...FALLBACK, ts: Date.now() }
  }
  const city = cityRaw ? decodeURIComponent(cityRaw) : 'Somewhere'
  return { lat, lng, city, country, ts: Date.now() }
}

export function ipFromHeaders(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return headers.get('x-real-ip') ?? '127.0.0.1'
}
