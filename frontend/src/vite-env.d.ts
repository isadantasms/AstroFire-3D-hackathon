// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** "mock" (default) serves placeholder simulation results; "live" calls the FastAPI backend. */
  readonly VITE_API_MODE?: 'mock' | 'live'
  /** Backend base URL for live mode, e.g. http://localhost:8000 */
  readonly VITE_API_BASE_URL?: string
  /** Unity WebGL build URL for the optional 3D view (served locally by StartWebGL.cmd). */
  readonly VITE_WEBGL_URL?: string
  /** "true" shows the chamber developer controls (also enabled with ?dev in the URL). */
  readonly VITE_CHAMBER_DEV_CONTROLS?: string
  /** "static" forces the static chamber view (default: Unity WebGL, with static fallback). */
  readonly VITE_CHAMBER_VIEW?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
