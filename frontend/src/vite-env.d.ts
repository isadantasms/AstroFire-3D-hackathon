// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** "mock" (default) serves placeholder simulation results; "live" calls the FastAPI backend. */
  readonly VITE_API_MODE?: 'mock' | 'live'
  /** Backend base URL for live mode, e.g. http://localhost:8000 */
  readonly VITE_API_BASE_URL?: string
  /** Unity WebGL build URL for the optional 3D view (served locally by StartWebGL.cmd). */
  readonly VITE_WEBGL_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
