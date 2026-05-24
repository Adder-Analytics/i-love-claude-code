import 'server-only'
import { Redis } from '@upstash/redis'

export const redis = Redis.fromEnv()

export const KEYS = {
  count: 'love:count',
  voted: (voterId: string) => `love:voted:${voterId}`,
  points: 'love:points',
  cities: 'love:cities',
} as const

export const LIMITS = {
  maxPoints: 500,
  maxCities: 30,
} as const

export type StoredPoint = {
  lat: number
  lng: number
  city: string
  country: string
  ts: number
}
