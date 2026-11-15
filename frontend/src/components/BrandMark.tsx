// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { useId } from 'react'
import { BRAND as G, BRAND_COLORS as C, BRAND_VARIANT_COLORS, type BrandVariant } from './brandGeometry'

/**
 * AstroFire 3D mark: a simple rocket inside an orange ring, legible at small sizes.
 * Logo concept generated with ChatGPT; simplified vector artwork recreated with Claude Code and
 * reviewed by the team. Deliberately unrelated to any NASA insignia.
 * Decorative next to the wordmark (the link carries the accessible name).
 */
export function BrandMark({ size = 24, variant = 'dark' }: { size?: number; variant?: BrandVariant }) {
  const flameId = `af-flame-${useId().replace(/:/g, '')}`
  const v = BRAND_VARIANT_COLORS[variant]
  const p = G.porthole

  return (
    <svg width={size} height={size} viewBox={`0 0 ${G.viewBox} ${G.viewBox}`} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={flameId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.amber} />
          <stop offset="1" stopColor={C.orange} />
        </linearGradient>
      </defs>
      <path d={G.arc} fill="none" stroke={C.orange} strokeWidth={G.arcStroke} strokeLinecap="round" />
      <g transform={G.rocketTransform}>
        <path d={G.flame} fill={`url(#${flameId})`} />
        <path d={G.finL} fill={C.orange} />
        <path d={G.finR} fill={C.orange} />
        <path d={G.body} fill={v.body} />
        <circle cx={p.cx} cy={p.cy} r={p.r} fill={v.porthole} />
      </g>
    </svg>
  )
}

/** "Astro" in primary text, "Fire" in brand orange, "3D" muted and slightly smaller (IBM Plex Sans 600, -0.01em). */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`font-sans font-semibold tracking-[-0.01em] ${className}`}>
      <span className="text-[#E6ECF5]">Astro</span>
      <span className="text-[#F28C28]">Fire</span>
      <span className="text-[0.82em] text-[#9AA8BD]">{' 3D'}</span>
    </span>
  )
}
