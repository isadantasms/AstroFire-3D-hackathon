// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import type { NasaCitation } from '../../../types/contract'

export const MOCK_TOOLTIP =
  'MOCK DATA. Mock mode returns the closest of three sample payloads (src/mocks/sample_3d_payloads.json), validated against contracts/simulation_schema.json. The values are not computed from your controls and are not live engine output. Sample text written with Gemini.'

/** "PSI-25 (DOI: 10.60555/4qc4-de67)" -> "PSI-25"; ids without a parenthesis stay as they are. */
export function shortCitationId(id: string): string {
  return id.split(' (')[0].trim()
}

/**
 * Brazilian sources (UFSC / VSB-30) are shown only once they are registered in docs/references.md.
 * TODO(references): add the registered citation id here when the UFSC (VSB-30) study is in the ledger.
 */
const REGISTERED_BRAZILIAN_SOURCES: readonly string[] = []

export function isCitationShown(c: NasaCitation): boolean {
  if (!/UFSC|VSB-30/i.test(`${c.id} ${c.title}`)) return true
  return REGISTERED_BRAZILIAN_SOURCES.includes(c.id)
}

/** DESIGN.md score bands: 0–35 nominal, 36–70 warning, 71–100 critical. */
export function riskBand(score: number): 'nominal' | 'warning' | 'critical' {
  if (score <= 35) return 'nominal'
  if (score <= 70) return 'warning'
  return 'critical'
}
