// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/**
 * Chamber developer controls (Static placeholder / Unity WebGL / Standalone) are hidden
 * unless VITE_CHAMBER_DEV_CONTROLS=true or the page URL has ?dev (e.g. /simulator?dev=1).
 * VITE_CHAMBER_VIEW=webgl makes the Unity WebGL view the default instead of the static one.
 */
export function chamberDevControlsEnabled(search: string = typeof window === 'undefined' ? '' : window.location.search): boolean {
  if (import.meta.env.VITE_CHAMBER_DEV_CONTROLS === 'true') return true
  const value = new URLSearchParams(search).get('dev')
  return value !== null && value !== '0' && value !== 'false'
}

export function defaultChamberView(): 'webgl' | 'static' {
  return import.meta.env.VITE_CHAMBER_VIEW === 'webgl' ? 'webgl' : 'static'
}
