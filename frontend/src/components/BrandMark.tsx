// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { useId } from 'react'
import { BRAND_FLAME_D as FLAME_D, BRAND_ORBIT_FRONT_D as ORBIT_FRONT_D, BRAND_SPARKLE_D as SPARKLE_D } from './brandGeometry'

/**
 * AstroFire mark: a flame whose base becomes a hollow sphere (a microgravity flame ball),
 * crossed by a tilted orbit, with a small four-point sparkle in the core.
 * Original vector artwork; deliberately unrelated to any NASA insignia.
 * Decorative next to the wordmark (the link carries the accessible name).
 */
export function BrandMark({ size = 24, mono = false }: { size?: number; mono?: boolean }) {
  const uid = useId().replace(/:/g, '')
  const gradientId = `af-flame-${uid}`
  const maskId = `af-gap-${uid}`
  const orbit = mono ? '#F28C28' : '#E6ECF5'

  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F2B544" />
          <stop offset="0.62" stopColor="#F28C28" />
        </linearGradient>
        {/* Cuts a gap in the flame where the front of the orbit crosses it. */}
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
          <rect width="32" height="32" fill="#fff" />
          <path d={ORBIT_FRONT_D} fill="none" stroke="#000" strokeWidth="3.6" strokeLinecap="round" />
        </mask>
      </defs>
      <ellipse
        cx="16"
        cy="20.5"
        rx="14.8"
        ry="4.5"
        transform="rotate(-20 16 20.5)"
        fill="none"
        stroke={orbit}
        strokeWidth="1.5"
      />
      <path mask={`url(#${maskId})`} fill={mono ? '#F28C28' : `url(#${gradientId})`} fillRule="evenodd" d={FLAME_D} />
      <path d={ORBIT_FRONT_D} fill="none" stroke={orbit} strokeWidth="1.5" strokeLinecap="round" />
      <path fill={mono ? '#F28C28' : '#FFFFFF'} d={SPARKLE_D} />
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
