// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/**
 * AstroFire 3D logo (64×64 box): a simple rocket inside an orange ring. Concept generated with ChatGPT;
 * simplified vector artwork recreated with Claude Code. The geometry lives in brandGeometry.json so the
 * site, the PDF report and the files in public/brand/ all draw the same shapes.
 */
import geometry from './brandGeometry.json'

export const BRAND = geometry

export const BRAND_COLORS = {
  amber: '#F2B544',
  orange: '#F28C28',
  ink: '#0A101C',
} as const

export type BrandVariant = 'dark' | 'light'

/** Rocket body and porthole colours per background (light = PDF and white pages). */
export const BRAND_VARIANT_COLORS: Record<BrandVariant, { body: string; porthole: string }> = {
  dark: { body: '#E6ECF5', porthole: '#0A101C' },
  light: { body: '#0A101C', porthole: '#FFFFFF' },
}
