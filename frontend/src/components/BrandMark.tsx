// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/**
 * AstroFire mark: an orange flame with a blue microgravity flame-ball core.
 * Decorative next to the wordmark (the link carries the accessible name).
 * Deliberately unrelated to any NASA insignia.
 */
export function BrandMark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path
        d="M16 3C19 8 25 11 25 19A9 9 0 1 1 7 19C7 13 11 10 13 6C13.5 9 15 10.5 16.5 11C16 8 16 5 16 3Z"
        fill="#F28C28"
      />
      <circle cx="16" cy="20" r="4.5" fill="#0A101C" />
      <circle cx="16" cy="20" r="2.2" fill="#4C8DFF" />
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
