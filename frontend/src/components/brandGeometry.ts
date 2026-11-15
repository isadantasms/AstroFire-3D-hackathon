// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/**
 * Geometry of the AstroFire logo (32×32 box), shared by BrandMark, the PDF report and public/brand/*.svg.
 * Base ring: outer radius 10, inner radius 6 (ring ≈ 20% of the diameter). Orbit stroke 3, no end dot.
 */
export const BRAND_FLAME_D =
  'M16 30A10 10 0 0 1 6 20C6 16 7.6 13 9.8 10.6C10.6 12 11.4 12.6 12.4 12.8C12.2 9.6 13.6 7.2 15.2 5.4C16 4.5 16.4 3.8 16.4 3.2C19.4 5.4 21 8.2 20.8 11C22 10.4 22.8 9.4 23.2 8.2C25.2 11 26 15 26 20A10 10 0 0 1 16 30ZM22 20A6 6 0 1 0 10 20A6 6 0 1 0 22 20Z'
/** Front half of the orbit, drawn over the flame. */
export const BRAND_ORBIT_FRONT_D = 'M2.28 24.99A14.6 4.6 -20 0 0 29.72 15.01'
/** Full orbit ellipse (drawn behind the flame). */
export const BRAND_ORBIT = { cx: 16, cy: 20, rx: 14.6, ry: 4.6, rotate: -20 } as const
export const BRAND_ORBIT_STROKE = 3
/** Width of the gap cut into the flame where the front of the orbit crosses it. */
export const BRAND_GAP_STROKE = 5.6
export const BRAND_SPARKLE_D = 'M16 16.4Q16.7 19.3 19.6 20Q16.7 20.7 16 23.6Q15.3 20.7 12.4 20Q15.3 19.3 16 16.4Z'
export const BRAND_COLORS = {
  amber: '#F2B544',
  orange: '#F28C28',
  orbit: '#E6ECF5',
  /** Orbit and sparkle on light backgrounds (PDF, white pages). */
  ink: '#0A101C',
} as const
