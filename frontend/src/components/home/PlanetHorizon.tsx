// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/**
 * The planet horizon at the base of the hero (aria-hidden). It is placed inside the hero
 * and scrolls with the page at the same speed (no parallax). The orange arc's apex sits
 * ARC_ABOVE_HERO_BOTTOM px above the hero's bottom edge; the arc is flat enough that,
 * across the content column, it stays above the hero's bottom edge, so the next section
 * (which starts ~96px below the hero) never touches it. The planet's dark body below the
 * arc fades into the page background and its glow breathes, with no straight edge.
 */

/** Distance from the arc's apex to the hero's bottom edge, in px. */
const ARC_ABOVE_HERO_BOTTOM = 120

const SVG_H = 900
const APEX_Y = 120 // apex of the ellipse inside the SVG
const CX = 720
const RX = 1300
const RY = 520
const CY = APEX_Y + RY

export function PlanetHorizon() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0"
      style={{ top: `calc(100% - ${ARC_ABOVE_HERO_BOTTOM + APEX_Y}px)`, height: SVG_H }}
      aria-hidden="true"
      data-testid="planet-horizon"
    >
      {/* Glow above the arc, dissolving into the section below. */}
      <div
        className="absolute left-1/2 h-[700px] w-[1700px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgb(242_140_40/0.18),rgb(242_140_40/0.05)_55%,transparent)]"
        style={{ top: APEX_Y }}
      />
      <svg className="absolute inset-0 size-full" viewBox={`0 0 1440 ${SVG_H}`} preserveAspectRatio="none" focusable="false">
        <defs>
          <linearGradient id="planet-body" x1="0" y1={APEX_Y} x2="0" y2="760" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#111a2e" />
            <stop offset="0.45" stopColor="#0d1424" stopOpacity="0.85" />
            <stop offset="1" stopColor="#0a101c" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="planet-rim" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="var(--brand-orange)" stopOpacity="0" />
            <stop offset="0.5" stopColor="var(--brand-orange)" stopOpacity="0.95" />
            <stop offset="1" stopColor="var(--brand-orange)" stopOpacity="0" />
          </linearGradient>
          {/* Everything fades towards the bottom so nothing ends in a hard cut. */}
          <linearGradient id="planet-fade" x1="0" y1={APEX_Y} x2="0" y2="800" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="white" />
            <stop offset="0.45" stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="planet-mask">
            <rect width="1440" height={SVG_H} fill="url(#planet-fade)" />
          </mask>
        </defs>
        <g mask="url(#planet-mask)">
          <ellipse cx={CX} cy={CY} rx={RX} ry={RY} fill="url(#planet-body)" />
          <ellipse
            className="horizon-breathe hero-anim"
            cx={CX}
            cy={CY}
            rx={RX + 4}
            ry={RY + 4}
            fill="none"
            stroke="var(--brand-amber)"
            strokeWidth="8"
            vectorEffect="non-scaling-stroke"
          />
          <ellipse cx={CX} cy={CY} rx={RX} ry={RY} fill="none" stroke="url(#planet-rim)" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
        </g>
      </svg>
    </div>
  )
}
