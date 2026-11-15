// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/**
 * Report charts as lists of simple vector shapes, drawn identically by the panel (SVG) and the PDF
 * (react-pdf <Svg>). Colours are semantic tokens resolved per theme, so the panel stays dark and the
 * PDF stays print-friendly. Risk bands match the site (DESIGN.md): 0–35, 36–70, 71–100.
 */
import { fmt } from '../../../lib/format'
import type { ReportModel } from './reportModel'

export type ColorToken =
  'ink' | 'text' | 'muted' | 'grid' | 'bg' | 'blue' | 'amber' | 'orange' | 'nominal' | 'warning' | 'critical' | 'focus'

export const CHART_THEMES: Record<'dark' | 'light', Record<ColorToken, string>> = {
  dark: {
    ink: '#E6ECF5',
    text: '#9AA8BD',
    muted: '#64748B',
    grid: '#1E293B',
    bg: '#0A101C',
    blue: '#4C8DFF',
    amber: '#F2B544',
    orange: '#F28C28',
    nominal: '#10B981',
    warning: '#F59E0B',
    critical: '#EF4444',
    focus: '#38BDF8',
  },
  light: {
    ink: '#0F172A',
    text: '#334155',
    muted: '#64748B',
    grid: '#CBD5E1',
    bg: '#F8FAFC',
    blue: '#2563EB',
    amber: '#D97706',
    orange: '#F28C28',
    nominal: '#059669',
    warning: '#D97706',
    critical: '#DC2626',
    focus: '#0284C7',
  },
}

export type Shape =
  | { kind: 'rect'; x: number; y: number; w: number; h: number; fill: ColorToken; opacity?: number; stroke?: ColorToken; rx?: number }
  | { kind: 'line'; x1: number; y1: number; x2: number; y2: number; stroke: ColorToken; width?: number; dash?: string }
  | {
      kind: 'circle'
      cx: number
      cy: number
      r: number
      fill?: ColorToken
      stroke?: ColorToken
      width?: number
      opacity?: number
      dash?: string
    }
  | { kind: 'path'; d: string; fill?: ColorToken; stroke?: ColorToken; width?: number; opacity?: number }
  | {
      kind: 'text'
      x: number
      y: number
      text: string
      size: number
      fill: ColorToken
      anchor?: 'start' | 'middle' | 'end'
      bold?: boolean
    }

export interface Chart {
  width: number
  height: number
  label: string
  shapes: Shape[]
}

/* ------------------------------------------------------------------ */
/* Figure 1: flammability score on the 0–100 risk bar                 */
/* ------------------------------------------------------------------ */

export function riskBarChart(score: number): Chart {
  const x0 = 10
  const w = 300
  const x = (v: number) => x0 + (w * Math.min(Math.max(v, 0), 100)) / 100
  const bands: { from: number; to: number; fill: ColorToken; label: string }[] = [
    { from: 0, to: 35, fill: 'nominal', label: 'Nominal 0–35' },
    { from: 35, to: 70, fill: 'warning', label: 'Moderate 36–70' },
    { from: 70, to: 100, fill: 'critical', label: 'Critical 71–100' },
  ]
  const shapes: Shape[] = []
  for (const b of bands) {
    shapes.push({
      kind: 'rect',
      x: x(b.from),
      y: 20,
      w: x(b.to) - x(b.from) - 1,
      h: 10,
      fill: b.fill,
      opacity: score <= b.to && score > b.from - (b.from === 0 ? 1 : 0) ? 0.9 : 0.3,
    })
    shapes.push({ kind: 'text', x: (x(b.from) + x(b.to)) / 2, y: 44, text: b.label, size: 8, fill: 'text', anchor: 'middle' })
  }
  shapes.push({ kind: 'path', d: `M${x(score) - 4} 12L${x(score) + 4} 12L${x(score)} 18Z`, fill: 'ink' })
  shapes.push({ kind: 'line', x1: x(score), y1: 18, x2: x(score), y2: 32, stroke: 'ink', width: 1.4 })
  shapes.push({ kind: 'text', x: x(score), y: 9, text: `${score}/100`, size: 8, fill: 'ink', anchor: 'middle', bold: true })
  return { width: 320, height: 52, label: `Flammability score ${score} of 100 on the risk bar`, shapes }
}

/* ------------------------------------------------------------------ */
/* Figure 2: annotated flame schematic                                */
/* ------------------------------------------------------------------ */

function arrow(x1: number, y: number, x2: number): Shape[] {
  return [
    { kind: 'line', x1, y1: y, x2: x2 - 5, y2: y, stroke: 'focus', width: 1.4 },
    { kind: 'path', d: `M${x2 - 6} ${y - 3.5}L${x2} ${y}L${x2 - 6} ${y + 3.5}Z`, fill: 'focus' },
  ]
}

export function flameSchematic(flame: ReportModel['flame']): Chart {
  const cy = 92
  const zone: ColorToken = flame.sooty ? 'amber' : 'blue'
  const shapes: Shape[] = [{ kind: 'rect', x: 0, y: 0, w: 320, h: 170, fill: 'bg', rx: 8 }]
  shapes.push({ kind: 'text', x: 12, y: 18, text: `Dominant mechanism: ${flame.mechanism}`, size: 8.5, fill: 'ink', bold: true })

  if (flame.airflowCmS > 0) {
    const len = 14 + Math.min(flame.airflowCmS / 50, 1) * 34
    for (const y of flame.airflowCmS < 1 ? [cy] : [cy - 22, cy, cy + 22]) shapes.push(...arrow(18, y, 18 + len))
    shapes.push({ kind: 'text', x: 12, y: 150, text: `Airflow ${fmt(flame.airflowCmS, 1)} cm/s →`, size: 8, fill: 'focus' })
  }

  const sampleX = flame.shape === 'elongated' && flame.burning ? 92 : 135
  if (flame.burning && flame.shape === 'spherical') {
    shapes.push({ kind: 'circle', cx: 160, cy, r: 40, fill: zone, opacity: 0.22 })
    shapes.push({ kind: 'circle', cx: 160, cy, r: 26, fill: zone, opacity: 0.45 })
  } else if (flame.burning) {
    const plume = (len: number, half: number) =>
      `M${sampleX + 10} ${cy}C${sampleX + 10} ${cy - half} ${sampleX + 30 + len * 0.35} ${cy - half * 1.1} ${sampleX + 30 + len} ${cy - half * 0.1}C${sampleX + 30 + len * 0.35} ${cy + half * 0.8} ${sampleX + 10} ${cy + half} ${sampleX + 10} ${cy}Z`
    shapes.push({ kind: 'path', d: plume(150, 32), fill: zone, opacity: 0.25 })
    shapes.push({ kind: 'path', d: plume(95, 18), fill: zone, opacity: 0.5 })
  } else {
    shapes.push({ kind: 'circle', cx: 160, cy, r: 34, stroke: 'muted', width: 1, dash: '4 3' })
    shapes.push({ kind: 'text', x: 160, y: cy - 44, text: 'No sustained flame', size: 8.5, fill: 'text', anchor: 'middle' })
  }

  shapes.push({ kind: 'rect', x: sampleX, y: cy - 4, w: 50, h: 8, fill: 'muted' })
  shapes.push({
    kind: 'text',
    x: sampleX + 25,
    y: cy + 24 + ((flame.shape === 'spherical' && flame.burning) || !flame.burning ? 22 : 0),
    text: `Sample · ${fmt(flame.thicknessMm, 2)} mm thick`,
    size: 8,
    fill: 'text',
    anchor: 'middle',
  })
  if (flame.burning) {
    shapes.push({
      kind: 'text',
      x: 308,
      y: 150,
      text: flame.sooty ? 'Reaction zone: amber, sooty' : 'Reaction zone: blue, soot-free',
      size: 8,
      fill: zone,
      anchor: 'end',
    })
  }
  return { width: 320, height: 170, label: `Illustrative schematic: ${flame.mechanism.toLowerCase()}`, shapes }
}

/* ------------------------------------------------------------------ */
/* Figure 3: flammability regime map (O2 × airflow)                   */
/* ------------------------------------------------------------------ */

export function regimeMap(regime: ReportModel['regime']): Chart {
  const left = 42
  const right = 308
  const top = 18
  const bottom = 186
  const X_MAX = 50
  const Y_MIN = 10
  const Y_MAX = 40
  const x = (v: number) => left + ((right - left) * Math.min(Math.max(v, 0), X_MAX)) / X_MAX
  const y = (v: number) => bottom - ((bottom - top) * (Math.min(Math.max(v, Y_MIN), Y_MAX) - Y_MIN)) / (Y_MAX - Y_MIN)
  const shapes: Shape[] = []

  // Enriched exploration atmospheres (≥ 30% O2) and the 21% O2 Earth-air reference.
  shapes.push({ kind: 'rect', x: left, y: y(40), w: right - left, h: y(30) - y(40), fill: 'orange', opacity: 0.08 })
  shapes.push({
    kind: 'text',
    x: right - 4,
    y: y(40) + 11,
    text: 'Exploration atmospheres (≥ 30% O₂)',
    size: 7.5,
    fill: 'orange',
    anchor: 'end',
  })
  for (const t of [10, 20, 30, 40]) {
    shapes.push({ kind: 'line', x1: left, y1: y(t), x2: right, y2: y(t), stroke: 'grid', width: 0.6 })
    shapes.push({ kind: 'text', x: left - 5, y: y(t) + 3, text: String(t), size: 7.5, fill: 'text', anchor: 'end' })
  }
  for (const t of [0, 10, 20, 30, 40, 50]) {
    shapes.push({ kind: 'line', x1: x(t), y1: bottom, x2: x(t), y2: bottom + 3, stroke: 'muted', width: 0.6 })
    shapes.push({ kind: 'text', x: x(t), y: bottom + 13, text: String(t), size: 7.5, fill: 'text', anchor: 'middle' })
  }
  shapes.push({ kind: 'line', x1: left, y1: bottom, x2: right, y2: bottom, stroke: 'muted', width: 0.8 })
  shapes.push({ kind: 'line', x1: left, y1: top, x2: left, y2: bottom, stroke: 'muted', width: 0.8 })
  shapes.push({ kind: 'line', x1: left, y1: y(21), x2: right, y2: y(21), stroke: 'focus', width: 0.9, dash: '4 3' })
  shapes.push({ kind: 'text', x: right - 4, y: y(21) - 4, text: '21% O₂ (Earth air)', size: 7.5, fill: 'focus', anchor: 'end' })
  shapes.push({ kind: 'text', x: (left + right) / 2, y: bottom + 26, text: 'Airflow (cm/s)', size: 8, fill: 'text', anchor: 'middle' })
  shapes.push({ kind: 'text', x: 6, y: top - 6, text: 'O₂ (%)', size: 8, fill: 'text' })

  // BASS-II tests: filled = sustained flame, hollow = extinguished or no ignition.
  for (const p of regime.points) {
    shapes.push(
      p.sustained
        ? { kind: 'circle', cx: x(p.airflow), cy: y(p.o2), r: 2.4, fill: 'orange', opacity: 0.8 }
        : { kind: 'circle', cx: x(p.airflow), cy: y(p.o2), r: 2.4, stroke: 'muted', width: 0.9 },
    )
  }

  // This scenario and its oxygen limit (from the payload; the engine's limit curve is not available here).
  const sx = x(regime.scenario.airflow)
  shapes.push({
    kind: 'line',
    x1: sx - 12,
    y1: y(regime.scenario.oxygenLimit),
    x2: sx + 12,
    y2: y(regime.scenario.oxygenLimit),
    stroke: 'critical',
    width: 1.4,
  })
  shapes.push({ kind: 'circle', cx: sx, cy: y(regime.scenario.o2), r: 5, stroke: 'ink', width: 1.8 })
  shapes.push({ kind: 'circle', cx: sx, cy: y(regime.scenario.o2), r: 1.6, fill: 'ink' })

  // Legend.
  const ly = 228
  shapes.push({ kind: 'circle', cx: left + 4, cy: ly - 3, r: 2.4, fill: 'orange', opacity: 0.8 })
  shapes.push({ kind: 'text', x: left + 10, y: ly, text: 'Sustained (BASS-II)', size: 7.5, fill: 'text' })
  shapes.push({ kind: 'circle', cx: left + 98, cy: ly - 3, r: 2.4, stroke: 'muted', width: 0.9 })
  shapes.push({ kind: 'text', x: left + 104, y: ly, text: 'Extinguished / no ignition', size: 7.5, fill: 'text' })
  shapes.push({ kind: 'circle', cx: left + 208, cy: ly - 3, r: 4, stroke: 'ink', width: 1.6 })
  shapes.push({ kind: 'text', x: left + 215, y: ly, text: 'This scenario', size: 7.5, fill: 'text' })
  shapes.push({ kind: 'line', x1: left, y1: ly + 11, x2: left + 10, y2: ly + 11, stroke: 'critical', width: 1.4 })
  shapes.push({ kind: 'text', x: left + 14, y: ly + 14, text: 'Oxygen limit of this scenario', size: 7.5, fill: 'text' })

  return { width: 320, height: 250, label: 'Flammability regime map: oxygen versus airflow with BASS-II tests and this scenario', shapes }
}
