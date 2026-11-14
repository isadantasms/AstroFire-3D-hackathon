// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/**
 * Pure helpers for the Home hero motion: star layers, rocket flight paths and colors.
 * All coordinates are in the hero SVG viewBox (1440 x 640).
 */

export const VIEW_W = 1440
export const VIEW_H = 640

/** The rocket must stay right of the centered title and buttons at every viewport. */
export const ROCKET_SAFE_MIN_X = 1120

export const ASCENT_MS = 5200
export const TRAIL_SEGMENTS = 56
export const FIRST_LAUNCH_DELAY_MS = 1300
export const CYCLE_MIN_MS = 12000
export const CYCLE_MAX_MS = 15000
export const SHOOTING_MIN_MS = 6000
export const SHOOTING_MAX_MS = 10000

/** Deterministic PRNG so the star field is identical on every render and in tests. */
export function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function between(rand: () => number, min: number, max: number) {
  return min + rand() * (max - min)
}

export interface Star {
  x: number
  y: number
  r: number
  o: number
  /** Present only for twinkling stars. */
  twinkle?: { duration: number; delay: number }
}

export interface StarLayerSpec {
  id: 'far' | 'mid' | 'near'
  count: number
  radius: [number, number]
  opacity: [number, number]
  twinkleRatio: number
  /** Seconds for one full horizontal drift loop (slower = farther). */
  driftSeconds: number
  /** Mouse parallax amplitude in px (nearer = larger). */
  depth: number
  seed: number
}

export const STAR_LAYERS: readonly StarLayerSpec[] = [
  { id: 'far', count: 120, radius: [0.35, 0.8], opacity: [0.25, 0.55], twinkleRatio: 0.15, driftSeconds: 420, depth: 3, seed: 11 },
  { id: 'mid', count: 60, radius: [0.6, 1.1], opacity: [0.4, 0.75], twinkleRatio: 0.25, driftSeconds: 260, depth: 7, seed: 23 },
  { id: 'near', count: 24, radius: [1.0, 1.7], opacity: [0.6, 0.95], twinkleRatio: 0.35, driftSeconds: 160, depth: 12, seed: 37 },
]

export function generateStars(spec: StarLayerSpec): Star[] {
  const rand = mulberry32(spec.seed)
  return Array.from({ length: spec.count }, () => {
    const star: Star = {
      x: rand() * VIEW_W,
      y: rand() * 560,
      r: between(rand, spec.radius[0], spec.radius[1]),
      o: between(rand, spec.opacity[0], spec.opacity[1]),
    }
    if (rand() < spec.twinkleRatio) {
      star.twinkle = { duration: between(rand, 2.8, 6.5), delay: between(rand, 0, 6) }
    }
    return star
  })
}

export interface Point {
  x: number
  y: number
}

export interface FlightPath {
  p0: Point
  p1: Point
  p2: Point
  p3: Point
}

/**
 * A curved climb starting below the horizon on the right and leaving through the
 * top-right corner. Control points only move rightwards, so x never drops below p0.x.
 */
export function makeFlightPath(rand: () => number): FlightPath {
  const sx = between(rand, 1150, 1260)
  return {
    p0: { x: sx, y: 700 },
    p1: { x: sx + between(rand, 0, 20), y: 440 },
    p2: { x: sx + between(rand, 60, 100), y: between(rand, 190, 230) },
    p3: { x: between(rand, 1500, 1560), y: -100 },
  }
}

export const DEFAULT_FLIGHT: FlightPath = makeFlightPath(mulberry32(2026))

/** Position on the cubic path and the rocket rotation (the rocket is drawn pointing up). */
export function pointAt(path: FlightPath, t: number): Point & { angle: number } {
  const u = 1 - t
  const { p0, p1, p2, p3 } = path
  const x = u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x
  const y = u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y
  const dx = 3 * u * u * (p1.x - p0.x) + 6 * u * t * (p2.x - p1.x) + 3 * t * t * (p3.x - p2.x)
  const dy = 3 * u * u * (p1.y - p0.y) + 6 * u * t * (p2.y - p1.y) + 3 * t * t * (p3.y - p2.y)
  return { x, y, angle: (Math.atan2(dy, dx) * 180) / Math.PI + 90 }
}

export function samplePath(path: FlightPath, segments: number): Point[] {
  return Array.from({ length: segments + 1 }, (_, i) => {
    const { x, y } = pointAt(path, i / segments)
    return { x, y }
  })
}

/** Accelerating launch: slow lift-off, faster climb. */
export function easeLaunch(p: number): number {
  const c = Math.min(1, Math.max(0, p))
  return 0.3 * c + 0.7 * c * c
}

export function lerpHex(a: string, b: string, t: number): string {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16))
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16))
  return `#${pa.map((v, i) => Math.round(v + (pb[i] - v) * t).toString(16).padStart(2, '0')).join('')}`
}

/** Brand colors for the trail (blue at lift-off, orange near the rocket). */
export const TRAIL_FROM = '#4c8dff'
export const TRAIL_TO = '#f28c28'
