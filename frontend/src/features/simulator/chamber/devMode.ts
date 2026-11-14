// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/**
 * Chamber developer controls (Static placeholder / Unity WebGL / Standalone) are hidden
 * unless VITE_CHAMBER_DEV_CONTROLS=true or the page URL has ?dev (e.g. /simulator?dev=1).
 * The Unity WebGL 3D view is the default; VITE_CHAMBER_VIEW=static forces the static view.
 */
export function chamberDevControlsEnabled(search: string = typeof window === 'undefined' ? '' : window.location.search): boolean {
  if (import.meta.env.VITE_CHAMBER_DEV_CONTROLS === 'true') return true
  const value = new URLSearchParams(search).get('dev')
  return value !== null && value !== '0' && value !== 'false'
}

export function defaultChamberView(): 'webgl' | 'static' {
  // Unit tests never reach a local Unity server.
  if (import.meta.env.MODE === 'test') return 'static'
  return import.meta.env.VITE_CHAMBER_VIEW === 'static' ? 'static' : 'webgl'
}

/** How long to wait for UNITY_FIRE_SIMULATION_READY before falling back to the static view. */
export const UNITY_READY_TIMEOUT_MS = 30_000
