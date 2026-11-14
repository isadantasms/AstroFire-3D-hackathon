// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
export type ApiMode = 'mock' | 'live'

export const API_MODE: ApiMode = import.meta.env.VITE_API_MODE === 'live' ? 'live' : 'mock'

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000').replace(
  /\/+$/,
  '',
)

export const REQUEST_TIMEOUT_MS = 10_000
