// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/** Fixed-decimal formatting for telemetry readouts; null/undefined render as an em dash. */
export function fmt(value: number | null | undefined, digits = 1): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '—'
  return value.toFixed(digits)
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
