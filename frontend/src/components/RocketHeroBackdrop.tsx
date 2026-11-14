// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/**
 * Decorative, animated hero backdrop (aria-hidden).
 * - Three star layers drift at different speeds (seamless loop), some stars twinkle,
 *   a rare shooting star crosses the sky, and the layers follow the mouse slightly.
 * - An original rocket lifts off from behind the planet on the right, draws a
 *   blue-to-orange trail, exits top-right and repeats every 12-15 s. Its path never
 *   crosses the centered title and buttons (x >= ROCKET_SAFE_MIN_X).
 * - The horizon glow breathes and the dashed orbit turns slowly.
 * Only transform and opacity are animated. Everything stops with prefers-reduced-motion
 * and pauses while the tab is hidden. A dark central vignette keeps text contrast.
 */
import { useEffect, useMemo, useRef, useState, type CSSProperties, type RefObject } from 'react'
import {
  ASCENT_MS,
  between,
  CYCLE_MAX_MS,
  CYCLE_MIN_MS,
  DEFAULT_FLIGHT,
  easeLaunch,
  FIRST_LAUNCH_DELAY_MS,
  generateStars,
  lerpHex,
  makeFlightPath,
  pointAt,
  samplePath,
  SHOOTING_MAX_MS,
  SHOOTING_MIN_MS,
  STAR_LAYERS,
  TRAIL_FROM,
  TRAIL_SEGMENTS,
  TRAIL_TO,
  type FlightPath,
  type Star,
} from './hero/heroMotion'
import { usePageVisible, usePrefersReducedMotion } from './hero/useMotionPreferences'

const VIEWBOX = '0 0 1440 640'
/** Where the rocket rests when motion is reduced (fraction of its path). */
const STATIC_T = 0.55
/** Star positions are generated once (deterministic seeds). */
const LAYERS = STAR_LAYERS.map((layer) => ({ ...layer, stars: generateStars(layer) }))

export function RocketHeroBackdrop() {
  const reduced = usePrefersReducedMotion()
  const visible = usePageVisible()
  const motion = !reduced && visible
  const rootRef = useRef<HTMLDivElement | null>(null)

  useMouseParallax(rootRef, !reduced)

  return (
    <div
      ref={rootRef}
      className="hero-motion pointer-events-none absolute inset-0 overflow-hidden"
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
          <radialGradient id="hero-glow-orange" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(720 700) scale(820 300)">
            <stop offset="0" stopColor="var(--brand-orange)" stopOpacity="0.24" />
            <stop offset="1" stopColor="var(--brand-orange)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1440" height="640" fill="var(--bg-hero)" />
        <rect width="1440" height="640" fill="url(#hero-glow-blue)" />
        <rect width="1440" height="640" fill="url(#hero-glow-orange)" />
      </svg>

      {LAYERS.map((layer) => (
        <StarLayer key={layer.id} stars={layer.stars} depth={layer.depth} driftSeconds={layer.driftSeconds} />
      ))}

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

      <ShootingStars active={motion} />

      {/* Rocket and trail are drawn before the planet so lift-off happens behind the horizon. */}
      <svg className="absolute inset-0 size-full" viewBox={VIEWBOX} preserveAspectRatio="xMidYMid slice" focusable="false">
        <defs>
          <linearGradient id="hero-horizon-stroke" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="var(--brand-orange)" stopOpacity="0" />
            <stop offset="0.5" stopColor="var(--brand-orange)" stopOpacity="0.95" />
            <stop offset="1" stopColor="var(--brand-orange)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hero-planet-fill" x1="0" y1="560" x2="0" y2="640" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#111a2e" />
            <stop offset="1" stopColor="var(--bg-hero)" />
          </linearGradient>
        </defs>
        <RocketFlight motion={motion} />
        <ellipse cx="720" cy="900" rx="1100" ry="340" fill="url(#hero-planet-fill)" />
        <ellipse className="horizon-breathe hero-anim" cx="720" cy="900" rx="1104" ry="344" fill="none" stroke="var(--brand-amber)" strokeWidth="8" />
        <ellipse cx="720" cy="900" rx="1100" ry="340" fill="none" stroke="url(#hero-horizon-stroke)" strokeWidth="1.6" />
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

/** Sets --px/--py on the backdrop from the pointer position over the hero section. */
function useMouseParallax(rootRef: RefObject<HTMLDivElement | null>, enabled: boolean) {
  useEffect(() => {
    const root = rootRef.current
    const host = root?.parentElement
    if (!enabled || !root || !host) return
    let frame = 0
    const set = (px: number, py: number) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        root.style.setProperty('--px', px.toFixed(3))
        root.style.setProperty('--py', py.toFixed(3))
      })
    }
    const onMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect()
      set(((e.clientX - rect.left) / rect.width - 0.5) * 2, ((e.clientY - rect.top) / rect.height - 0.5) * 2)
    }
    const onLeave = () => set(0, 0)
    host.addEventListener('pointermove', onMove)
    host.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerleave', onLeave)
      root.style.removeProperty('--px')
      root.style.removeProperty('--py')
    }
  }, [rootRef, enabled])
}

function StarLayer({ stars, depth, driftSeconds }: { stars: Star[]; depth: number; driftSeconds: number }) {
  // Two identical tiles side by side; translating by -50% loops without a visible seam.
  return (
    <div className="parallax-layer absolute -inset-4" style={{ '--depth': depth } as CSSProperties}>
      <div className="star-drift hero-anim absolute inset-y-0 left-0 flex w-[200%]" style={{ animationDuration: `${driftSeconds}s` }}>
        <StarTile stars={stars} />
        <StarTile stars={stars} />
      </div>
    </div>
  )
}

function StarTile({ stars }: { stars: Star[] }) {
  return (
    <svg className="h-full w-1/2 shrink-0" viewBox={VIEWBOX} preserveAspectRatio="xMidYMid slice" focusable="false">
      <g fill="var(--text-primary)">
        {stars.map((s, i) => (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fillOpacity={s.o}
            className={s.twinkle ? 'star-twinkle hero-anim' : undefined}
            style={s.twinkle ? { animationDuration: `${s.twinkle.duration}s`, animationDelay: `${s.twinkle.delay}s` } : undefined}
          />
        ))}
      </g>
    </svg>
  )
}

interface ShootingStar {
  id: number
  top: number
  left: number
  angle: number
}

/** A thin, fast streak every 6-10 s at a random spot in the upper sky. */
function ShootingStars({ active }: { active: boolean }) {
  const [star, setStar] = useState<ShootingStar | null>(null)
  useEffect(() => {
    if (!active) return
    let timer = 0
    const schedule = () => {
      timer = window.setTimeout(() => {
        setStar({
          id: Date.now(),
          top: between(Math.random, 4, 30),
          left: between(Math.random, 25, 85),
          angle: between(Math.random, 148, 168),
        })
        schedule()
      }, between(Math.random, SHOOTING_MIN_MS, SHOOTING_MAX_MS))
    }
    schedule()
    return () => window.clearTimeout(timer)
  }, [active])
  if (!active || !star) return null
  return (
    <span
      key={star.id}
      className="shooting-star hero-anim"
      style={{ top: `${star.top}%`, left: `${star.left}%`, '--angle': `${star.angle}deg` } as CSSProperties}
    />
  )
}

/**
 * Rocket flight driven by requestAnimationFrame: only the group transform and the
 * trail segment opacities change. When motion stops, the rocket freezes where it is.
 */
function RocketFlight({ motion }: { motion: boolean }) {
  const [flight, setFlight] = useState<{ id: number; path: FlightPath }>({ id: 0, path: DEFAULT_FLIGHT })
  const points = useMemo(() => samplePath(flight.path, TRAIL_SEGMENTS), [flight.path])
  const rocketRef = useRef<SVGGElement | null>(null)
  const trailRef = useRef<SVGGElement | null>(null)
  const segRefs = useRef<(SVGLineElement | null)[]>([])
  const lastT = useRef(STATIC_T)

  useEffect(() => {
    const rocket = rocketRef.current
    const trail = trailRef.current
    if (!rocket || !trail) return

    const place = (t: number) => {
      const p = pointAt(flight.path, t)
      rocket.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${p.angle.toFixed(1)})`)
    }
    const showTrailUpTo = (t: number) => {
      const visibleCount = Math.floor(t * TRAIL_SEGMENTS)
      segRefs.current.forEach((seg, i) => {
        if (seg) seg.style.opacity = i < visibleCount ? '1' : '0'
      })
    }

    if (!motion) {
      // Reduced motion or hidden tab: hold the current pose, no timers.
      place(lastT.current)
      showTrailUpTo(lastT.current)
      trail.style.transition = 'none'
      trail.style.opacity = '0.75'
      rocket.style.opacity = '1'
      return
    }

    let raf = 0
    let cycleTimer = 0
    // Reset to an empty trail before lift-off.
    trail.style.transition = 'none'
    trail.style.opacity = '1'
    showTrailUpTo(0)
    rocket.style.opacity = '0'

    const launch = () => {
      void trail.getBoundingClientRect()
      trail.style.transition = ''
      rocket.style.opacity = '1'
      const start = performance.now()
      let shown = 0
      const frame = (now: number) => {
        const progress = Math.min(1, (now - start) / ASCENT_MS)
        const t = easeLaunch(progress)
        lastT.current = t
        place(t)
        const target = Math.floor(t * TRAIL_SEGMENTS)
        for (; shown < target; shown++) {
          const seg = segRefs.current[shown]
          if (seg) seg.style.opacity = '1'
        }
        if (progress < 1) {
          raf = requestAnimationFrame(frame)
        } else {
          trail.style.opacity = '0' // fades out via the .rocket-trail transition
          rocket.style.opacity = '0'
          lastT.current = STATIC_T
        }
      }
      raf = requestAnimationFrame(frame)
      cycleTimer = window.setTimeout(
        () => setFlight((f) => ({ id: f.id + 1, path: makeFlightPath(Math.random) })),
        between(Math.random, CYCLE_MIN_MS, CYCLE_MAX_MS),
      )
    }

    const startTimer = window.setTimeout(launch, flight.id === 0 ? FIRST_LAUNCH_DELAY_MS : 0)
    return () => {
      window.clearTimeout(startTimer)
      window.clearTimeout(cycleTimer)
      cancelAnimationFrame(raf)
    }
  }, [motion, flight])

  const initial = pointAt(flight.path, STATIC_T)
  return (
    <g>
      <g ref={trailRef} className="rocket-trail">
        {points.slice(0, -1).map((p, i) => {
          const next = points[i + 1]
          const f = i / (TRAIL_SEGMENTS - 1)
          return (
            <line
              key={`${flight.id}-${i}`}
              ref={(el) => {
                segRefs.current[i] = el
              }}
              x1={p.x}
              y1={p.y}
              x2={next.x}
              y2={next.y}
              stroke={lerpHex(TRAIL_FROM, TRAIL_TO, f)}
              strokeOpacity={0.3 + 0.65 * f}
              strokeWidth={0.8 + 2.2 * f}
              strokeLinecap="round"
              opacity={0}
            />
          )
        })}
      </g>
      <g ref={rocketRef} transform={`translate(${initial.x} ${initial.y}) rotate(${initial.angle})`}>
        <path className="rocket-flame hero-anim" d="M-3.5 18 L0 34 L3.5 18 Z" fill="var(--brand-amber)" />
        <path d="M-2 18 L0 26 L2 18 Z" fill="var(--text-primary)" opacity="0.85" />
        <path d="M0 -34 C9 -24 10 -8 9 14 L-9 14 C-10 -8 -9 -24 0 -34 Z" fill="var(--text-primary)" />
        <circle cx="0" cy="-11" r="3.6" fill="var(--bg-hero)" stroke="var(--brand-blue)" strokeWidth="1.4" />
        <path d="M-9 2 L-17 19 L-9 14 Z" fill="var(--brand-orange)" />
        <path d="M9 2 L17 19 L9 14 Z" fill="var(--brand-orange)" />
        <rect x="-5" y="14" width="10" height="4" fill="var(--text-muted)" />
      </g>
    </g>
  )
}
