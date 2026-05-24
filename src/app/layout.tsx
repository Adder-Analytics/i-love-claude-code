import type { Metadata, Viewport } from 'next'
import { Instrument_Serif } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-instrument-serif',
})

const SITE_URL = 'https://iloveclaudecode.com'
const TITLE = 'Do you love Claude Code?'
const DESCRIPTION = 'One question. One button. Say yes if you love Claude Code — and watch the love light up around the world.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: '%s · iloveclaudecode.com' },
  description: DESCRIPTION,
  applicationName: 'iloveclaudecode.com',
  keywords: ['Claude Code', 'Anthropic', 'Claude', 'AI coding', 'developer tools', 'AI agents', 'pair programming'],
  authors: [{ name: 'Adder' }],
  creator: 'Adder',
  publisher: 'Adder',
  category: 'technology',
  formatDetection: { telephone: false, email: false, address: false },
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: 'iloveclaudecode.com',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    shortcut: ['/favicon.svg'],
  },
  manifest: '/manifest.webmanifest',
}

export const viewport: Viewport = {
  themeColor: '#07080b',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'iloveclaudecode.com',
  url: SITE_URL,
  description: DESCRIPTION,
  inLanguage: 'en',
  publisher: { '@type': 'Organization', name: 'Adder', url: 'https://adder.dev' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="isolate flex min-h-full flex-col bg-night-950 text-white">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
