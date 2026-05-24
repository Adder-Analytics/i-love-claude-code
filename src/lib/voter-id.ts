import 'server-only'
import { cookies } from 'next/headers'

export const VOTER_COOKIE = 'iclc_id'
const TEN_YEARS = 60 * 60 * 24 * 365 * 10

export async function readVoterId(): Promise<string | null> {
  const jar = await cookies()
  return jar.get(VOTER_COOKIE)?.value ?? null
}

export async function readOrCreateVoterId(): Promise<{ id: string; isNew: boolean }> {
  const jar = await cookies()
  const existing = jar.get(VOTER_COOKIE)?.value
  if (existing) return { id: existing, isNew: false }
  const id = crypto.randomUUID()
  jar.set(VOTER_COOKIE, id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: TEN_YEARS,
  })
  return { id, isNew: true }
}
