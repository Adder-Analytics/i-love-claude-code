'use client'

type Props = {
  cities: string[]
}

export function RecentCities({ cities }: Props) {
  if (cities.length === 0) {
    return <p className="text-xs uppercase tracking-wide text-white/30">no signal yet · be the first</p>
  }
  const display = cities.slice(0, 12)
  return (
    <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs uppercase tracking-wide text-white/40">
      <span className="text-ember-400/80">recent:</span>
      {display.map((city, i) => (
        <span key={`${city}-${i}`} className="inline-flex items-center gap-3">
          <span>{city}</span>
          {i < display.length - 1 && <span className="text-white/20">·</span>}
        </span>
      ))}
    </p>
  )
}
