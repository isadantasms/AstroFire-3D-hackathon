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

/**
 * Technical documentation PDF, shared by the Home "Documentation" button and the About page.
 * TODO(docs): set to the published PDF (e.g. a file in frontend/public/docs/). Until then the
 * Home button opens the About page and the About page shows "coming soon".
 */
export const TECHNICAL_DOCS_PDF_URL: string | null = null
