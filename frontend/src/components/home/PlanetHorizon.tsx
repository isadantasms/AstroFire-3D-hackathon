// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/**
 * The planet horizon as the bridge between the hero and the next section (aria-hidden).
 * The orange arc sits at the hero's base; the planet's dark body below it fades into the
 * page background, and its glow dissolves downwards, so no straight edge or color step
 * appears. While scrolling, the planet rises a little slower than the content (light
 * parallax, transform only); its glow breathes. Static with reduced motion.
 * Painted above the fixed sky (so the rocket can pass behind the horizon) and below content.
 */
import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '../hero/useMotionPreferences'

/** Fraction of the scroll the planet lags behind (0 = moves with content). */
const PARALLAX = 0.25

export function PlanetHorizon() {
  const reduced = usePrefersReducedMotion()
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    let frame = 0
    const update = () => {
      frame = 0
      const y = Math.min(window.scrollY, 1600) * PARALLAX
      el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      el.style.transform = ''
    }
  }, [reduced])

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-x-0 top-[440px] h-[900px] will-change-transform"
      aria-hidden="true"
      data-testid="planet-horizon"
    >
      {/* Glow above the arc, dissolving into the sections below. */}
      <div className="absolute top-[200px] left-1/2 h-[760px] w-[1700px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgb(242_140_40/0.2),rgb(242_140_40/0.06)_55%,transparent)]" />
      <svg className="absolute inset-0 size-full" viewBox="0 0 1440 900" preserveAspectRatio="none" focusable="false">
        <defs>
          <linearGradient id="planet-body" x1="0" y1="120" x2="0" y2="760" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#111a2e" />
            <stop offset="0.45" stopColor="#0d1424" stopOpacity="0.85" />
            <stop offset="1" stopColor="#0a101c" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="planet-rim" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="var(--brand-orange)" stopOpacity="0" />
            <stop offset="0.5" stopColor="var(--brand-orange)" stopOpacity="0.95" />
            <stop offset="1" stopColor="var(--brand-orange)" stopOpacity="0" />
          </linearGradient>
          {/* The arc itself fades towards the bottom so its sides never end in a hard cut. */}
          <linearGradient id="planet-fade" x1="0" y1="120" x2="0" y2="760" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="white" />
            <stop offset="0.5" stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="planet-mask">
            <rect width="1440" height="900" fill="url(#planet-fade)" />
          </mask>
        </defs>
        <g mask="url(#planet-mask)">
          <ellipse cx="720" cy="1020" rx="1150" ry="900" fill="url(#planet-body)" />
          <ellipse
            className="horizon-breathe hero-anim"
            cx="720"
            cy="1020"
            rx="1154"
            ry="904"
            fill="none"
            stroke="var(--brand-amber)"
            strokeWidth="8"
            vectorEffect="non-scaling-stroke"
          />
          <ellipse cx="720" cy="1020" rx="1150" ry="900" fill="none" stroke="url(#planet-rim)" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
        </g>
      </svg>
    </div>
  )
}
