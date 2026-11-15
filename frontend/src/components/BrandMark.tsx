// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { useId } from 'react'
import {
  BRAND_COLORS as C,
  BRAND_FLAME_D,
  BRAND_GAP_STROKE,
  BRAND_ORBIT as O,
  BRAND_ORBIT_FRONT_D,
  BRAND_ORBIT_STROKE,
  BRAND_SPARKLE_D,
} from './brandGeometry'

type Variant = 'dark' | 'light' | 'mono'

const ORBIT_COLOR: Record<Variant, string> = { dark: C.orbit, light: C.ink, mono: C.orange }
const SPARKLE_COLOR: Record<Variant, string> = { dark: '#FFFFFF', light: C.ink, mono: C.orange }

/**
 * AstroFire mark: a flame whose base becomes a hollow sphere (a microgravity flame ball),
 * crossed by a tilted orbit, with a four-point sparkle in the core.
 * AstroFire logo created with Claude Code (SI-assisted) and reviewed by the team.
 * Deliberately unrelated to any NASA insignia. Decorative next to the wordmark (the link carries the name).
 */
export function BrandMark({ size = 24, variant = 'dark' }: { size?: number; variant?: Variant }) {
  const uid = useId().replace(/:/g, '')
  const gradientId = `af-flame-${uid}`
  const maskId = `af-gap-${uid}`
  const orbit = ORBIT_COLOR[variant]

  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.amber} />
          <stop offset="0.62" stopColor={C.orange} />
        </linearGradient>
        {/* Cuts a gap in the flame where the front of the orbit crosses it. */}
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
          <rect width="32" height="32" fill="#fff" />
          <path d={BRAND_ORBIT_FRONT_D} fill="none" stroke="#000" strokeWidth={BRAND_GAP_STROKE} strokeLinecap="round" />
        </mask>
      </defs>
      <ellipse
        cx={O.cx}
        cy={O.cy}
        rx={O.rx}
        ry={O.ry}
        transform={`rotate(${O.rotate} ${O.cx} ${O.cy})`}
        fill="none"
        stroke={orbit}
        strokeWidth={BRAND_ORBIT_STROKE}
      />
      <path
        mask={`url(#${maskId})`}
        fill={variant === 'mono' ? C.orange : `url(#${gradientId})`}
        fillRule="evenodd"
        d={BRAND_FLAME_D}
      />
      <path d={BRAND_ORBIT_FRONT_D} fill="none" stroke={orbit} strokeWidth={BRAND_ORBIT_STROKE} strokeLinecap="round" />
      <path fill={SPARKLE_COLOR[variant]} d={BRAND_SPARKLE_D} />
    </svg>
  )
}

/** "Astro" in primary text, "Fire" in brand orange (IBM Plex Sans 600, -0.01em). */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`font-sans font-semibold tracking-[-0.01em] ${className}`}>
      <span className="text-[#E6ECF5]">Astro</span>
      <span className="text-[#F28C28]">Fire</span>
    </span>
  )
}
