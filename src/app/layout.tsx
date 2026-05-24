import type { Metadata, Viewport } from 'next'
import { Instrument_Serif } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-instrument-serif',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://iloveclaudecode.com'),
  title: 'Do you love Claude Code?',
  description: 'One question. One button. Say yes if you love Claude Code.',
  openGraph: {
    title: 'Do you love Claude Code?',
    description: 'One question. One button. Say yes.',
    url: 'https://iloveclaudecode.com',
    siteName: 'iloveclaudecode.com',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Do you love Claude Code?',
    description: 'One question. One button. Say yes.',
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
}

export const viewport: Viewport = {
  themeColor: '#07080b',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body className="isolate flex min-h-full flex-col bg-night-950 text-white">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
