const STAR_COUNT = 60

const STARS = Array.from({ length: STAR_COUNT }, (_, i) => {
  const seed = (i * 9301 + 49297) % 233280
  const rand = (offset: number) => ((seed * (offset + 1)) % 100) / 100
  return {
    x: rand(1) * 100,
    y: rand(2) * 100,
    delay: rand(3) * 6,
    duration: 3 + rand(4) * 4,
    size: 1 + Math.round(rand(5) * 1.5),
  }
})

export function Starfield() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {STARS.map((star, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white motion-reduce:opacity-30"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: 0.4,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
