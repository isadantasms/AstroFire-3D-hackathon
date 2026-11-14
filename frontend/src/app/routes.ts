// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/** Primary site navigation. Order matches the approved information architecture. */
export const NAV_ITEMS = [
  { to: '/', label: 'Home', end: true },
  { to: '/simulator', label: 'Simulator', end: false },
  { to: '/research', label: 'Research & Data', end: false },
  { to: '/about', label: 'About & SI Usage', end: false },
] as const

/** Deep links used across pages (footer, CTAs). */
export const LINKS = {
  simulator: '/simulator',
  research: '/research',
  about: '/about',
  siUsage: '/about#si-usage',
  credits: '/about#credits',
} as const
