// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/** Primary site navigation. SI usage and the team live on the Home; credits on Research & Data. */
export const NAV_ITEMS = [
  { to: '/', label: 'Home', end: true },
  { to: '/simulator', label: 'Simulator', end: false },
  { to: '/research', label: 'Research & Data', end: false },
] as const

/** Deep links used across pages (footer, CTAs). */
export const LINKS = {
  simulator: '/simulator',
  research: '/research',
  siUsage: '/#si-usage',
  team: '/#team',
  credits: '/research#credits',
} as const

/**
 * Technical documentation PDF for the Home "Documentation" button.
 * TODO(docs): set to the published PDF (e.g. a file in frontend/public/docs/). Until then the
 * button opens Research & Data.
 */
export const TECHNICAL_DOCS_PDF_URL: string | null = null
