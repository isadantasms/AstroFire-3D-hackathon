// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/**
 * Decorative hero backdrop (aria-hidden): star field, soft blue and orange glows,
 * an orange planetary horizon, a dashed orbit and an original rocket climbing on a
 * diagonal with a blue-to-orange trail. A dark central vignette keeps text contrast.
 * Static by design: no animation, no WebGL.
 */

/** Deterministic PRNG so the star field is identical on every render and in tests. */
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const STARS = (() => {
  const rand = mulberry32(2026)
  return Array.from({ length: 140 }, () => ({
    x: rand() * 1440,
    y: rand() * 520,
    r: 0.4 + rand() * 1.1,
    o: 0.25 + rand() * 0.6,
  }))
})()

export function RocketHeroBackdrop() {
  return (
    <svg
      className="absolute inset-0 size-full"
      viewBox="0 0 1440 640"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="hero-glow-blue" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(150 40) scale(620 460)">
          <stop offset="0" stopColor="var(--brand-blue)" stopOpacity="0.2" />
          <stop offset="1" stopColor="var(--brand-blue)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hero-glow-orange" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(720 700) scale(820 300)">
          <stop offset="0" stopColor="var(--brand-orange)" stopOpacity="0.26" />
          <stop offset="1" stopColor="var(--brand-orange)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hero-horizon-stroke" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--brand-orange)" stopOpacity="0" />
          <stop offset="0.5" stopColor="var(--brand-orange)" stopOpacity="0.95" />
          <stop offset="1" stopColor="var(--brand-orange)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="hero-planet-fill" x1="0" y1="560" x2="0" y2="640" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#111a2e" />
          <stop offset="1" stopColor="var(--bg-hero)" />
        </linearGradient>
        <linearGradient id="hero-trail" x1="0" y1="22" x2="-150" y2="520" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--brand-orange)" stopOpacity="0.9" />
          <stop offset="0.45" stopColor="var(--brand-blue)" stopOpacity="0.45" />
          <stop offset="1" stopColor="var(--brand-blue)" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="hero-vignette" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(720 300) scale(560 300)">
          <stop offset="0" stopColor="var(--bg-hero)" stopOpacity="0.88" />
          <stop offset="0.6" stopColor="var(--bg-hero)" stopOpacity="0.55" />
          <stop offset="1" stopColor="var(--bg-hero)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1440" height="640" fill="var(--bg-hero)" />

      <g fill="var(--text-primary)">
        {STARS.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} opacity={s.o} />
        ))}
      </g>

      <rect width="1440" height="640" fill="url(#hero-glow-blue)" />
      <rect width="1440" height="640" fill="url(#hero-glow-orange)" />

      {/* Dashed orbit */}
      <ellipse
        cx="720"
        cy="540"
        rx="780"
        ry="210"
        transform="rotate(-7 720 540)"
        fill="none"
        stroke="var(--brand-blue-light)"
        strokeOpacity="0.28"
        strokeWidth="1"
        strokeDasharray="2 9"
      />

      {/* Planetary horizon */}
      <circle cx="720" cy="2160" r="1600" fill="url(#hero-planet-fill)" />
      <circle cx="720" cy="2160" r="1600" fill="none" stroke="url(#hero-horizon-stroke)" strokeWidth="1.6" />
      <circle cx="720" cy="2160" r="1606" fill="none" stroke="var(--brand-amber)" strokeOpacity="0.18" strokeWidth="6" />

      {/* Rocket climbing on a diagonal, with its trail */}
      <g transform="translate(1300 110) rotate(42)">
        <path d="M-5 22 Q-40 280 -150 520 L-138 522 Q-22 280 5 22 Z" fill="url(#hero-trail)" />
        <path d="M-3 18 L0 40 L3 18 Z" fill="var(--brand-amber)" />
        <path d="M0 -34 C9 -24 10 -8 9 14 L-9 14 C-10 -8 -9 -24 0 -34 Z" fill="var(--text-primary)" />
        <circle cx="0" cy="-11" r="3.6" fill="var(--bg-hero)" stroke="var(--brand-blue)" strokeWidth="1.4" />
        <path d="M-9 2 L-17 19 L-9 14 Z" fill="var(--brand-orange)" />
        <path d="M9 2 L17 19 L9 14 Z" fill="var(--brand-orange)" />
        <rect x="-5" y="14" width="10" height="4" fill="var(--text-muted)" />
      </g>

      <rect width="1440" height="640" fill="url(#hero-vignette)" />
    </svg>
  )
}
