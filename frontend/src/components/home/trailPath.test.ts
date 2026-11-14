// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { describe, expect, it } from 'vitest'
import { buildTrail, sampleAtY, trailBand } from './trailPath'

const MARKERS = [900, 1500, 2100, 2600, 3000]

describe('scroll rocket trail geometry', () => {
  it.each([1024, 1280, 1440, 1920])('stays in the right margin, outside the content column, at %ipx', (width) => {
    const layout = buildTrail({ width, startY: 600, markerYs: MARKERS })
    const { min, max } = trailBand(width)
    const contentRight = (width + Math.min(width, 1152)) / 2 - 24
    expect(min).toBeGreaterThan(contentRight)
    for (const s of layout.samples) {
      expect(s.x).toBeGreaterThanOrEqual(min - 0.01)
      expect(s.x).toBeLessThanOrEqual(max + 0.01)
    }
  })

  it('descends monotonically through one marker per section', () => {
    const layout = buildTrail({ width: 1440, startY: 600, markerYs: MARKERS })
    expect(layout.markers.map((m) => m.y)).toEqual(MARKERS)
    expect(layout.endY).toBe(3000)
    for (let i = 1; i < layout.samples.length; i++) {
      expect(layout.samples[i].y).toBeGreaterThanOrEqual(layout.samples[i - 1].y)
    }
  })

  it('finds the rocket position for any scroll height and points it downwards', () => {
    const layout = buildTrail({ width: 1440, startY: 600, markerYs: MARKERS })
    expect(sampleAtY(layout, 0).y).toBe(600)
    expect(sampleAtY(layout, 99999).y).toBe(3000)
    const mid = sampleAtY(layout, 1800)
    expect(mid.y).toBe(1800)
    expect(mid.angle).toBeGreaterThan(90)
    expect(mid.angle).toBeLessThan(270)
  })
})
