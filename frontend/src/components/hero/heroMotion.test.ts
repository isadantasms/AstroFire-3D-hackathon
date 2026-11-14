// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { describe, expect, it } from 'vitest'
import {
  CYCLE_MAX_MS,
  CYCLE_MIN_MS,
  easeLaunch,
  FLIGHT_KINDS,
  generateStars,
  lerpHex,
  makeSkyFlight,
  mulberry32,
  pointAt,
  STAR_LAYERS,
} from './heroMotion'

const W = 1440
const H = 900
const offscreen = (p: { x: number; y: number }) => p.x < 0 || p.x > W || p.y < 0 || p.y > H

describe('sky motion helpers', () => {
  it.each(FLIGHT_KINDS)('%s flight starts and ends off-screen and climbs', (kind) => {
    const rand = mulberry32(5)
    for (let n = 0; n < 20; n++) {
      const path = makeSkyFlight(rand, W, H, kind)
      const start = pointAt(path, 0)
      const end = pointAt(path, 1)
      expect(offscreen(start)).toBe(true)
      expect(offscreen(end)).toBe(true)
      expect(end.y).toBeLessThan(start.y)
    }
  })

  it('picks a different path from one flight to the next', () => {
    const rand = mulberry32(42)
    const flights = Array.from({ length: 12 }, () => makeSkyFlight(rand, W, H))
    expect(new Set(flights.map((f) => f.kind)).size).toBeGreaterThan(1)
    expect(new Set(flights.map((f) => Math.round(f.p0.x + f.p0.y))).size).toBeGreaterThan(6)
  })

  it('repeats every 15 to 20 seconds', () => {
    expect(CYCLE_MIN_MS).toBe(15000)
    expect(CYCLE_MAX_MS).toBe(20000)
  })

  it('star layers are deterministic, ordered by depth, with some twinkling stars', () => {
    const [far, mid, near] = STAR_LAYERS
    expect(far.depth).toBeLessThan(mid.depth)
    expect(mid.depth).toBeLessThan(near.depth)
    expect(far.driftSeconds).toBeGreaterThan(near.driftSeconds)
    expect(generateStars(mid)).toEqual(generateStars(mid))
    const twinkles = generateStars(near).filter((s) => s.twinkle)
    expect(twinkles.length).toBeGreaterThan(0)
    expect(new Set(twinkles.map((s) => s.twinkle!.duration.toFixed(2))).size).toBe(twinkles.length)
  })

  it('launch easing and trail colors run from blue to orange', () => {
    expect(easeLaunch(0)).toBe(0)
    expect(easeLaunch(1)).toBe(1)
    expect(easeLaunch(0.5)).toBeLessThan(0.5)
    expect(lerpHex('#4c8dff', '#f28c28', 0)).toBe('#4c8dff')
    expect(lerpHex('#4c8dff', '#f28c28', 1)).toBe('#f28c28')
  })
})
