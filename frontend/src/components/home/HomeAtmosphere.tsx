// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/**
 * Decorative layer behind the whole Home (aria-hidden): the planet's orange glow
 * dissolving below the hero, and stars that continue past the hero, rarer and
 * fainter the further down they are, until they fade out behind the cards.
 */
import { mulberry32 } from '../hero/heroMotion'

const STARS = (() => {
  const rand = mulberry32(512)
  const stars: { x: number; y: number; r: number; o: number; twinkle?: number }[] = []
  for (let i = 0; i < 160; i++) {
    const depth = rand() // 0 = just below the hero, 1 = far down the page
    const x = rand() * 1440
    const keep = rand() < (1 - depth) ** 2.2
    const r = 0.4 + rand() * 0.9
    const tw = rand()
    if (!keep) continue
    stars.push({
      x,
      y: depth * 1300,
      r,
      o: 0.15 + 0.55 * (1 - depth),
      twinkle: tw < 0.18 ? 3 + tw * 20 : undefined,
    })
  }
  return stars
})()

export function HomeAtmosphere() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-[2000px] overflow-hidden" aria-hidden="true">
      {/* Planet glow, centered on the hero's bottom edge and fading downwards. */}
      <div className="absolute top-[640px] left-1/2 h-[760px] w-[1700px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgb(242_140_40/0.2),rgb(242_140_40/0.06)_55%,transparent)]" />
      <svg
        className="absolute top-[600px] left-0 h-[1300px] w-full [mask-image:linear-gradient(to_bottom,black,black_35%,transparent)]"
        viewBox="0 0 1440 1300"
        preserveAspectRatio="xMidYMin slice"
        focusable="false"
      >
        <g fill="var(--text-primary)">
          {STARS.map((s, i) => (
            <circle
              key={i}
              cx={s.x}
              cy={s.y}
              r={s.r}
              fillOpacity={s.o}
              className={s.twinkle ? 'star-twinkle hero-anim' : undefined}
              style={s.twinkle ? { animationDuration: `${s.twinkle.toFixed(2)}s` } : undefined}
            />
          ))}
        </g>
      </svg>
    </div>
  )
}
