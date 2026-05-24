import { ImageResponse } from 'next/og'
import { KEYS, redis } from '@/lib/redis'

export const runtime = 'edge'
export const alt = 'Do you love Claude Code?'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const formatter = new Intl.NumberFormat('en-US')

export default async function OpengraphImage() {
  const count = (await redis.get<number>(KEYS.count).catch(() => 0)) ?? 0

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#07080b',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
          backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(255,138,76,0.25), transparent 60%)',
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 4, color: 'rgba(255,255,255,0.4)', marginBottom: 32 }}>
          ILOVECLAUDECODE.COM
        </div>
        <div
          style={{
            fontSize: 120,
            lineHeight: 1.05,
            textAlign: 'center',
            fontFamily: 'serif',
            fontStyle: 'italic',
            color: '#ffae7e',
          }}
        >
          Do you love
          <br />
          Claude Code?
        </div>
        <div style={{ marginTop: 48, fontSize: 32, color: 'rgba(255,255,255,0.6)' }}>
          <span style={{ color: 'white', fontWeight: 600 }}>{formatter.format(count)}</span> souls and counting
        </div>
      </div>
    ),
    size,
  )
}
