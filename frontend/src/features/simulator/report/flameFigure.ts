// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/**
 * Figure 1 geometry: an illustrative drawing of the simulated flame built from simulation_3d
 * (shape, color, burn rate, oxygen factor). Shared by the report panel (SVG) and the PDF (react-pdf Svg).
 * Illustrative only: sizes are scaled for legibility, not measured.
 */
import type { Simulation3D } from '../../../types/contract'
import { isBurning } from './reportModel'

export const FIGURE_VIEWBOX = { width: 320, height: 180 } as const

export interface FlameFigure {
  sample: { x: number; y: number; width: number; height: number }
  /** Outer envelope and inner core of the flame; null when there is no sustained flame. */
  flame: { outer: string; inner: string; color: string; opacity: number } | null
  /** Dashed outline where the flame would be, shown when it is extinguished. */
  ghost: { cx: number; cy: number; r: number } | null
  label: string
}

/** Circle as a path, so both renderers only need <path>. */
function circlePath(cx: number, cy: number, r: number): string {
  return `M${cx - r} ${cy}A${r} ${r} 0 1 0 ${cx + r} ${cy}A${r} ${r} 0 1 0 ${cx - r} ${cy}Z`
}

/** Plume stretched to the right (downstream), rounded around the sample. */
function plumePath(x0: number, cy: number, length: number, half: number): string {
  const tip = x0 + length
  return [
    `M${x0 - half * 0.6} ${cy}`,
    `C${x0 - half * 0.6} ${cy - half} ${x0 + length * 0.35} ${cy - half * 1.1} ${tip} ${cy - half * 0.15}`,
    `C${x0 + length * 0.35} ${cy + half * 0.8} ${x0 - half * 0.6} ${cy + half} ${x0 - half * 0.6} ${cy}Z`,
  ].join('')
}

export function flameFigure(sim: Simulation3D): FlameFigure {
  const cy = 92
  const burn = Math.min(Math.max(sim.burn_rate_mm_s, 0), 3)
  const opacity = 0.35 + 0.55 * Math.min(Math.max(sim.oxygen_factor, 0), 1)

  if (!isBurning(sim)) {
    return {
      sample: { x: 140, y: cy - 4, width: 40, height: 8 },
      flame: null,
      ghost: { cx: 160, cy, r: 34 },
      label: 'No sustained flame',
    }
  }

  if (sim.flame_geometry === 'spherical') {
    const r = 30 + burn * 10
    return {
      sample: { x: 145, y: cy - 4, width: 30, height: 8 },
      flame: { outer: circlePath(160, cy, r), inner: circlePath(160, cy, r * 0.62), color: sim.flame_color_hex, opacity },
      ghost: null,
      label: 'Spherical flame',
    }
  }

  const length = 120 + burn * 25
  return {
    sample: { x: 70, y: cy - 4, width: 40, height: 8 },
    flame: {
      outer: plumePath(95, cy, length, 34),
      inner: plumePath(95, cy, length * 0.62, 20),
      color: sim.flame_color_hex,
      opacity,
    },
    ghost: null,
    label: 'Elongated flame',
  }
}
