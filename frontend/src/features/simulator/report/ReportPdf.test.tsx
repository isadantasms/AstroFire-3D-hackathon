// @vitest-environment node
// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { createRequire } from 'node:module'
import { describe, expect, it } from 'vitest'
import { renderToBuffer } from '@react-pdf/renderer'
import payloads from '../../../mocks/sample_3d_payloads.json'
import type { SimulationResponse } from '../../../types/contract'
import { withTestEstimate } from '../../../test/fixtures'
import { buildReport } from './reportModel'
import { ReportDocument } from './ReportPdf'
import { registerReportFonts } from './reportFonts'

const require = createRequire(import.meta.url)
registerReportFonts({
  sans400: require.resolve('@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff'),
  sans600: require.resolve('@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-600-normal.woff'),
  mono400: require.resolve('@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff'),
})

const SCENARIOS = payloads.scenarios as SimulationResponse[]
const CASES: [string, SimulationResponse, boolean][] = [
  ...SCENARIOS.map((s) => [s.scenario_id, s, true] as [string, SimulationResponse, boolean]),
  ['live payload with suppression estimate', withTestEstimate(SCENARIOS[1]), false],
]

describe('ReportDocument (PDF)', () => {
  it.each(CASES)(
    '%s renders a real A4 PDF with Plex fonts and vector charts',
    async (_id, s, mock) => {
      const report = buildReport(s, { mock, generatedAt: new Date(2026, 10, 15) })
      const buf = await renderToBuffer(ReportDocument({ report }))
      const raw = buf.toString('latin1')
      expect(raw.startsWith('%PDF-')).toBe(true)
      expect((raw.match(/\/Type \/Page\b/g) ?? []).length).toBeGreaterThanOrEqual(2)
      expect(raw).toMatch(/\/MediaBox \[0 0 595\.2\d* 841\.8\d*\]/)
      // Selectable text in IBM Plex Sans (body) and Plex Mono (numbers); charts are vector, not images.
      expect(raw).toMatch(/IBMPlexSans/)
      expect(raw).toMatch(/IBMPlexMono/)
      expect(raw).not.toMatch(/IBMPlexSerif/)
      expect(raw).not.toMatch(/\/Subtype \/Image/)
    },
    60_000,
  )
})
