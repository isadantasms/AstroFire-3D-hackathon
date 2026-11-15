// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha & Elias
export type ApiMode = 'mock' | 'live'

const defaultMode: ApiMode = import.meta.env.PROD ? 'live' : 'mock'
const rawMode = import.meta.env.VITE_API_MODE || defaultMode
export const API_MODE: ApiMode = rawMode === 'live' ? 'live' : 'mock'

const defaultBaseUrl = import.meta.env.PROD ? '' : 'http://localhost:8000'
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? defaultBaseUrl).replace(
  /\/+$/,
  '',
)

export const REQUEST_TIMEOUT_MS = 10_000
