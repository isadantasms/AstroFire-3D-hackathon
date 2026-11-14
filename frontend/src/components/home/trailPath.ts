// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/**
 * Geometry for the scroll-driven rocket trail on the Home page.
 * The trail lives in the right margin, outside the centered content column
 * (max-w-6xl = 1152px with 24px inner padding), and descends monotonically.
 */
import { pointAt, type FlightPath } from '../hero/heroMotion'

export const CONTENT_MAX_WIDTH = 1152
export const CONTENT_PADDING = 24
const GAP_FROM_CONTENT = 10
const GAP_FROM_EDGE = 10
const MAX_AMPLITUDE = 36
const SAMPLES_PER_SEGMENT = 40

export interface TrailPoint {
  x: number
  y: number
}

export interface TrailSample extends TrailPoint {
  /** Rotation for a rocket drawn pointing up (180 = pointing down). */
  angle: number
}

export interface TrailLayout {
  width: number
  startY: number
  endY: number
  d: string
  markers: TrailPoint[]
  samples: TrailSample[]
  band: { min: number; max: number }
}

/** Horizontal band between the content's right edge and the viewport edge. */
export function trailBand(width: number) {
  const container = Math.min(width, CONTENT_MAX_WIDTH)
  const contentRight = (width + container) / 2 - CONTENT_PADDING
  return { min: contentRight + GAP_FROM_CONTENT, max: width - GAP_FROM_EDGE }
}

/**
 * Builds a gentle S-curve from the hero down through one marker per section.
 * Each segment keeps vertical tangents, so x stays between its two end points
 * (inside the band) and y only increases.
 */
export function buildTrail({ width, startY, markerYs }: { width: number; startY: number; markerYs: number[] }): TrailLayout {
  const band = trailBand(width)
  const mid = (band.min + band.max) / 2
  const amp = Math.max(0, Math.min(MAX_AMPLITUDE, (band.max - band.min) / 2 - 8))
  const ys = markerYs.filter((y) => y > startY + 20).sort((a, b) => a - b)
  const points: TrailPoint[] = [
    { x: mid + amp, y: startY },
    ...ys.map((y, i) => ({ x: mid + (i % 2 === 0 ? -amp : amp), y })),
  ]

  const segments: FlightPath[] = []
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i]
    const b = points[i + 1]
    const half = (b.y - a.y) / 2
    segments.push({ p0: a, p1: { x: a.x, y: a.y + half }, p2: { x: b.x, y: b.y - half }, p3: b })
  }

  const d =
    `M${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}` +
    segments
      .map((s) => ` C${s.p1.x.toFixed(1)} ${s.p1.y.toFixed(1)} ${s.p2.x.toFixed(1)} ${s.p2.y.toFixed(1)} ${s.p3.x.toFixed(1)} ${s.p3.y.toFixed(1)}`)
      .join('')

  const samples: TrailSample[] = segments.length
    ? segments.flatMap((s, si) =>
        Array.from({ length: SAMPLES_PER_SEGMENT + (si === segments.length - 1 ? 1 : 0) }, (_, k) => {
          const p = pointAt(s, k / SAMPLES_PER_SEGMENT)
          return { x: p.x, y: p.y, angle: p.angle }
        }),
      )
    : [{ ...points[0], angle: 180 }]

  return {
    width,
    startY,
    endY: points[points.length - 1].y,
    d,
    markers: points.slice(1),
    samples,
    band,
  }
}

/** Point on the trail at a given height (the trail is monotonic in y). */
export function sampleAtY(layout: TrailLayout, y: number): TrailSample {
  const s = layout.samples
  if (y <= s[0].y) return s[0]
  if (y >= s[s.length - 1].y) return s[s.length - 1]
  let lo = 0
  let hi = s.length - 1
  while (hi - lo > 1) {
    const m = (lo + hi) >> 1
    if (s[m].y <= y) lo = m
    else hi = m
  }
  const a = s[lo]
  const b = s[hi]
  const t = b.y === a.y ? 0 : (y - a.y) / (b.y - a.y)
  return { x: a.x + (b.x - a.x) * t, y, angle: a.angle + (b.angle - a.angle) * t }
}
