import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'I Love Claude Code',
    short_name: 'iloveclaudecode',
    description: 'One question. One button. Say yes if you love Claude Code.',
    start_url: '/',
    display: 'standalone',
    background_color: '#07080b',
    theme_color: '#07080b',
    icons: [{ src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' }],
  }
}
