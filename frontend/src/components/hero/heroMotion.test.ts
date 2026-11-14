// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { describe, expect, it } from 'vitest'
import {
  easeLaunch,
  generateStars,
  lerpHex,
  makeFlightPath,
  mulberry32,
  pointAt,
  ROCKET_SAFE_MIN_X,
  samplePath,
  STAR_LAYERS,
  VIEW_H,
  VIEW_W,
} from './heroMotion'

describe('hero motion helpers', () => {
  it('rocket paths stay right of the title and buttons on every visible point', () => {
    const rand = mulberry32(7)
    for (let n = 0; n < 200; n++) {
      const path = makeFlightPath(rand)
      for (const p of samplePath(path, 200)) {
        const onScreen = p.y >= 0 && p.y <= VIEW_H && p.x <= VIEW_W
        if (onScreen) expect(p.x).toBeGreaterThanOrEqual(ROCKET_SAFE_MIN_X)
      }
    }
  })

  it('rocket starts below the horizon and exits beyond the top-right corner', () => {
    const path = makeFlightPath(mulberry32(3))
    expect(pointAt(path, 0).y).toBeGreaterThan(VIEW_H)
    const end = pointAt(path, 1)
    expect(end.y).toBeLessThan(0)
    expect(end.x).toBeGreaterThan(VIEW_W)
  })

  it('successive flights start from slightly different points', () => {
    const rand = mulberry32(99)
    const starts = Array.from({ length: 5 }, () => makeFlightPath(rand).p0.x)
    expect(new Set(starts.map((x) => Math.round(x))).size).toBeGreaterThan(1)
  })

  it('star layers are deterministic, ordered by depth, with some twinkling stars', () => {
    const [far, mid, near] = STAR_LAYERS
    expect(far.depth).toBeLessThan(mid.depth)
    expect(mid.depth).toBeLessThan(near.depth)
    expect(far.driftSeconds).toBeGreaterThan(near.driftSeconds)
    expect(generateStars(mid)).toEqual(generateStars(mid))
    const twinkles = generateStars(near).filter((s) => s.twinkle)
    expect(twinkles.length).toBeGreaterThan(0)
    // Different durations so stars do not blink together.
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
