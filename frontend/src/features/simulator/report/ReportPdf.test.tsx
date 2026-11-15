// @vitest-environment node
// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { createRequire } from 'node:module'
import { describe, expect, it } from 'vitest'
import { renderToBuffer } from '@react-pdf/renderer'
import payloads from '../../../mocks/sample_3d_payloads.json'
import type { SimulationResponse } from '../../../types/contract'
import { buildReport } from './reportModel'
import { ReportDocument } from './ReportPdf'
import { registerReportFonts } from './reportFonts'

const require = createRequire(import.meta.url)
registerReportFonts({
  sans600: require.resolve('@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-600-normal.woff'),
  serif400: require.resolve('@fontsource/ibm-plex-serif/files/ibm-plex-serif-latin-400-normal.woff'),
  serif600: require.resolve('@fontsource/ibm-plex-serif/files/ibm-plex-serif-latin-600-normal.woff'),
  mono400: require.resolve('@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff'),
})

const SCENARIOS = payloads.scenarios as SimulationResponse[]

describe('ReportDocument (PDF)', () => {
  it.each(SCENARIOS.map((s) => [s.scenario_id, s] as const))(
    '%s renders a real multi-page A4 PDF',
    async (_id, s) => {
      const report = buildReport(s, { mock: true, generatedAt: new Date(2026, 10, 15) })
      const buf = await renderToBuffer(ReportDocument({ report }))
      const raw = buf.toString('latin1')
      expect(raw.startsWith('%PDF-')).toBe(true)
      const pages = raw.match(/\/Type \/Page\b/g) ?? []
      expect(pages.length).toBeGreaterThanOrEqual(2)
      // A4 media box (595.28 × 841.89 pt).
      expect(raw).toMatch(/\/MediaBox \[0 0 595\.2\d* 841\.8\d*\]/)
      // Text is embedded with the Plex fonts (selectable text, not an image).
      expect(raw).toMatch(/IBMPlexSerif/)
      expect(raw).not.toMatch(/\/Subtype \/Image/)
    },
    30_000,
  )
})
