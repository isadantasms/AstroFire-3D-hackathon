// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/**
 * Original AstroFire 3D mark: a spherical microgravity flame ball inside an orange orbit arc.
 * Deliberately unrelated to any NASA insignia.
 */
export function BrandMark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <circle cx="16" cy="16" r="13" fill="none" stroke="var(--border-subtle)" strokeWidth="1.5" />
      <path
        d="M4.5 21.5 A13 13 0 0 1 26.5 7.5"
        fill="none"
        stroke="var(--brand-orange)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="16" cy="16" r="6.5" fill="none" stroke="var(--brand-blue)" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="3" fill="var(--brand-blue)" />
    </svg>
  )
}
