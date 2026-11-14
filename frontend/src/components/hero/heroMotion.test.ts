// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { describe, expect, it } from 'vitest'
import {
  avoidanceAlpha,
  CYCLE_MAX_MS,
  CYCLE_MIN_MS,
  easeLaunch,
  FLIGHT_KINDS,
  generateStars,
  lerpHex,
  makeSkyFlight,
  mulberry32,
  pointAt,
  samplePath,
  SIDE_BAND,
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

  it.each(FLIGHT_KINDS)('%s flight stays in the side bands, away from the central column', (kind) => {
    const rand = mulberry32(17)
    for (let n = 0; n < 30; n++) {
      const path = makeSkyFlight(rand, W, H, kind)
      for (const p of samplePath(path, 120)) {
        if (offscreen(p)) continue
        const inSides = p.x <= SIDE_BAND * W || p.x >= (1 - SIDE_BAND) * W
        expect(inSides).toBe(true)
      }
    }
  })

  it('fades out near content to avoid and is fully visible far from it', () => {
    const title = { left: 400, top: 200, right: 1040, bottom: 400 }
    expect(avoidanceAlpha(700, 300, [title])).toBe(0) // inside
    expect(avoidanceAlpha(1060, 300, [title])).toBe(0) // within the margin
    expect(avoidanceAlpha(1400, 300, [title])).toBe(1) // far away
    const mid = avoidanceAlpha(1040 + 48 + 36, 300, [title])
    expect(mid).toBeGreaterThan(0)
    expect(mid).toBeLessThan(1)
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
