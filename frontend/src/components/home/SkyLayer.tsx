// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/**
 * Fixed sky behind the whole Home (aria-hidden, pointer-events: none):
 * - three star layers (far, mid, near) drifting at different speeds in a seamless loop,
 *   with per-star twinkle, a light mouse parallax and a rare shooting star;
 * - the hero rocket crossing the screen every 15-20 s on a different curved path, its
 *   blue-to-orange trail drawn behind it and then fading. One rocket at a time.
 * The layer sits behind all content (cards and text paint on top). Star density is the
 * same everywhere because the layer is fixed to the viewport.
 * Only transform and opacity are animated. Reduced motion: still stars, no rocket, no
 * shooting stars. Everything pauses while the tab is hidden.
 */
import { useEffect, useMemo, useRef, useState, type CSSProperties, type RefObject } from 'react'
import {
  between,
  CYCLE_MAX_MS,
  CYCLE_MIN_MS,
  easeLaunch,
  FIRST_FLIGHT_DELAY_MS,
  FLIGHT_MS,
  generateStars,
  lerpHex,
  makeSkyFlight,
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
} from '../hero/heroMotion'
import { usePageVisible, usePrefersReducedMotion } from '../hero/useMotionPreferences'

const VIEWBOX = '0 0 1440 640'
/** Star positions are generated once (deterministic seeds). */
const LAYERS = STAR_LAYERS.map((layer) => ({ ...layer, stars: generateStars(layer) }))

export function SkyLayer() {
  const reduced = usePrefersReducedMotion()
  const visible = usePageVisible()
  const motion = !reduced && visible
  const rootRef = useRef<HTMLDivElement | null>(null)

  useWindowParallax(rootRef, !reduced)

  return (
    <div
      ref={rootRef}
      className="hero-motion pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      data-paused={visible ? 'false' : 'true'}
      data-testid="home-sky"
      aria-hidden="true"
    >
      {LAYERS.map((layer) => (
        <StarLayer key={layer.id} stars={layer.stars} depth={layer.depth} driftSeconds={layer.driftSeconds} />
      ))}
      <ShootingStars active={motion} />
      {!reduced ? <RocketFlyby motion={motion} /> : null}
    </div>
  )
}

/** Sets --px/--py from the pointer position over the window. */
function useWindowParallax(rootRef: RefObject<HTMLDivElement | null>, enabled: boolean) {
  useEffect(() => {
    const root = rootRef.current
    if (!enabled || !root) return
    let frame = 0
    const onMove = (e: PointerEvent) => {
      const px = (e.clientX / window.innerWidth - 0.5) * 2
      const py = (e.clientY / window.innerHeight - 0.5) * 2
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        root.style.setProperty('--px', px.toFixed(3))
        root.style.setProperty('--py', py.toFixed(3))
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
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

/** A thin, fast streak every 6-10 s at a random spot. */
function ShootingStars({ active }: { active: boolean }) {
  const [star, setStar] = useState<ShootingStar | null>(null)
  useEffect(() => {
    if (!active) return
    let timer = 0
    const schedule = () => {
      timer = window.setTimeout(() => {
        setStar({
          id: Date.now(),
          top: between(Math.random, 4, 60),
          left: between(Math.random, 15, 85),
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

function useViewportSize() {
  const [size, setSize] = useState(() => ({
    w: typeof window === 'undefined' ? 1440 : window.innerWidth,
    h: typeof window === 'undefined' ? 900 : window.innerHeight,
  }))
  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return size
}

/**
 * The hero rocket crossing the viewport. requestAnimationFrame changes only the
 * rocket's transform and the trail segments' opacity; the trail then fades out.
 */
function RocketFlyby({ motion }: { motion: boolean }) {
  const { w, h } = useViewportSize()
  const [flight, setFlight] = useState<{ id: number; path: FlightPath }>(() => ({
    id: 0,
    path: makeSkyFlight(Math.random, w, h, 'rise-right'),
  }))
  const points = useMemo(() => samplePath(flight.path, TRAIL_SEGMENTS), [flight.path])
  const rocketRef = useRef<SVGGElement | null>(null)
  const trailRef = useRef<SVGGElement | null>(null)
  const segRefs = useRef<(SVGLineElement | null)[]>([])

  useEffect(() => {
    const rocket = rocketRef.current
    const trail = trailRef.current
    if (!rocket || !trail) return
    // Start every cycle hidden with an empty trail.
    trail.style.transition = 'none'
    trail.style.opacity = '1'
    segRefs.current.forEach((seg) => seg && (seg.style.opacity = '0'))
    rocket.style.opacity = '0'
    if (!motion) return

    let raf = 0
    let cycleTimer = 0
    const launch = () => {
      void trail.getBoundingClientRect()
      trail.style.transition = ''
      rocket.style.opacity = '1'
      const start = performance.now()
      let shown = 0
      const frame = (now: number) => {
        const progress = Math.min(1, (now - start) / FLIGHT_MS)
        const t = easeLaunch(progress)
        const p = pointAt(flight.path, t)
        rocket.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${p.angle.toFixed(1)})`)
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
        }
      }
      raf = requestAnimationFrame(frame)
      cycleTimer = window.setTimeout(
        () => setFlight((f) => ({ id: f.id + 1, path: makeSkyFlight(Math.random, window.innerWidth, window.innerHeight) })),
        between(Math.random, CYCLE_MIN_MS, CYCLE_MAX_MS),
      )
    }
    const startTimer = window.setTimeout(launch, flight.id === 0 ? FIRST_FLIGHT_DELAY_MS : 0)
    return () => {
      window.clearTimeout(startTimer)
      window.clearTimeout(cycleTimer)
      cancelAnimationFrame(raf)
    }
  }, [motion, flight])

  return (
    <svg className="absolute inset-0 size-full" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" focusable="false" data-testid="sky-rocket">
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
      <g ref={rocketRef} opacity={0} transform={`translate(${flight.path.p0.x} ${flight.path.p0.y})`}>
        <path className="rocket-flame hero-anim" d="M-3.5 18 L0 34 L3.5 18 Z" fill="var(--brand-amber)" />
        <path d="M-2 18 L0 26 L2 18 Z" fill="var(--text-primary)" opacity="0.85" />
        <path d="M0 -34 C9 -24 10 -8 9 14 L-9 14 C-10 -8 -9 -24 0 -34 Z" fill="var(--text-primary)" />
        <circle cx="0" cy="-11" r="3.6" fill="var(--bg-hero)" stroke="var(--brand-blue)" strokeWidth="1.4" />
        <path d="M-9 2 L-17 19 L-9 14 Z" fill="var(--brand-orange)" />
        <path d="M9 2 L17 19 L9 14 Z" fill="var(--brand-orange)" />
        <rect x="-5" y="14" width="10" height="4" fill="var(--text-muted)" />
      </g>
    </svg>
  )
}
