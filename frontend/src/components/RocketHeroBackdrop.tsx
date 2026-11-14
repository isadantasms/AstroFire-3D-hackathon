// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/**
 * Hero-only decoration (aria-hidden): soft blue glow, slowly turning dashed orbit and a
 * dark central vignette that keeps the headline's contrast. The stars and the rocket live
 * in the fixed SkyLayer and the planet in PlanetHorizon, so they continue across the Home.
 * The bottom edge is masked out so nothing ends in a straight line.
 */
import type { CSSProperties } from 'react'
import { usePageVisible } from './hero/useMotionPreferences'

const VIEWBOX = '0 0 1440 640'

export function RocketHeroBackdrop() {
  const visible = usePageVisible()
  return (
    <div
      className="hero-motion pointer-events-none absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_bottom,black_78%,transparent)]"
      data-paused={visible ? 'false' : 'true'}
      data-testid="hero-backdrop"
      aria-hidden="true"
    >
      <svg className="absolute inset-0 size-full" viewBox={VIEWBOX} preserveAspectRatio="xMidYMid slice" focusable="false">
        <defs>
          <radialGradient id="hero-glow-blue" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(150 40) scale(620 460)">
            <stop offset="0" stopColor="var(--brand-blue)" stopOpacity="0.2" />
            <stop offset="1" stopColor="var(--brand-blue)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1440" height="640" fill="url(#hero-glow-blue)" />
      </svg>

      {/* Dashed orbit: a circle turning slowly, squashed into a tilted ellipse. */}
      <svg className="parallax-layer absolute inset-0 size-full" style={{ '--depth': 4 } as CSSProperties} viewBox={VIEWBOX} preserveAspectRatio="xMidYMid slice" focusable="false">
        <g transform="translate(720 540) rotate(-7) scale(1 0.27)">
          <circle
            className="orbit-spin hero-anim"
            r="780"
            fill="none"
            stroke="var(--brand-blue-light)"
            strokeOpacity="0.3"
            strokeWidth="1"
            strokeDasharray="2 9"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </svg>

      <svg className="absolute inset-0 size-full" viewBox={VIEWBOX} preserveAspectRatio="xMidYMid slice" focusable="false">
        <defs>
          <radialGradient id="hero-vignette" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(720 300) scale(560 300)">
            <stop offset="0" stopColor="var(--bg-hero)" stopOpacity="0.88" />
            <stop offset="0.6" stopColor="var(--bg-hero)" stopOpacity="0.55" />
            <stop offset="1" stopColor="var(--bg-hero)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1440" height="640" fill="url(#hero-vignette)" />
      </svg>
    </div>
  )
}
