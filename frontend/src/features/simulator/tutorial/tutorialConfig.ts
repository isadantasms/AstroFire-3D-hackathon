// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/** The tutorial opens on its own when the Simulator loads, except in tests. */
export function shouldAutoOpenTutorial(): boolean {
  return import.meta.env.MODE !== 'test'
}
