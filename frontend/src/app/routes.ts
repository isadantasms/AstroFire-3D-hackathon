// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/** Primary site navigation. SI usage lives on the Home; sources and credits on Documentation. */
export const NAV_ITEMS = [
  { to: '/', label: 'Home', end: true },
  { to: '/simulator', label: 'Simulator', end: false },
  { to: '/documentation', label: 'Documentation', end: false },
] as const

/** Deep links used across pages (footer, CTAs). /research redirects to /documentation. */
export const LINKS = {
  simulator: '/simulator',
  documentation: '/documentation',
  fullDocumentation: '/documentation#full-documentation',
  siUsage: '/#si-usage',
  credits: '/documentation#credits',
} as const

/**
 * Full technical documentation (PDF).
 * TODO(docs): set to the published PDF (e.g. a file in frontend/public/docs/). While it is null, the
 * Documentation page shows its download button and SI link as disabled ("Coming soon"), and the Home
 * links open the Documentation page instead.
 */
export const DOCUMENTATION_PDF_URL: string | null = null

/**
 * Fragment that opens the SI section of the PDF.
 * TODO(docs): match the named destination (or page number) used in the published PDF.
 */
export const DOCUMENTATION_SI_FRAGMENT = '#nameddest=si-disclosure'

/** Link to the SI section of the PDF, or null while the PDF is not published. */
export const DOCUMENTATION_SI_URL: string | null = DOCUMENTATION_PDF_URL
  ? `${DOCUMENTATION_PDF_URL}${DOCUMENTATION_SI_FRAGMENT}`
  : null
