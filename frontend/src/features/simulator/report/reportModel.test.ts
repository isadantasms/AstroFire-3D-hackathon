// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { describe, expect, it } from 'vitest'
import payloads from '../../../mocks/sample_3d_payloads.json'
import type { SimulationResponse } from '../../../types/contract'
import { withTestEstimate } from '../../../test/fixtures'
import { EXPERIMENTS_SNAPSHOT } from '../../../data/experimentsSnapshot'
import { buildReport, humanize, isSustainedOutcome, reportFileName, type ReportModel } from './reportModel'
import { flameSchematic, regimeMap, riskBarChart } from './reportCharts'
import { toPdf } from './pdfText'

const SCENARIOS = payloads.scenarios as SimulationResponse[]
const AT = new Date(2026, 10, 15, 9, 5)

/** Every visible string of the report, to check wording rules. */
function allText(r: ReportModel): string {
  return [
    r.title,
    r.subtitle,
    r.abstract,
    r.groundingLabel,
    r.groundingMeaning,
    r.flame.text,
    r.flame.mechanism,
    r.interpretation,
    r.suppression.action,
    r.suppression.note ?? '',
    r.terrestrial,
    r.limitations,
    r.neighbors.note,
    ...r.kpis.flatMap((k) => [k.label, k.value, k.unit, k.detail]),
    ...r.parameters.flatMap((p) => [p.label, p.value, p.unit]),
    ...r.telemetry.flatMap((m) => [m.label, m.value, m.unit, m.meaning]),
  ].join('\n')
}

describe('buildReport', () => {
  it.each(SCENARIOS.map((s) => [s.scenario_id, s] as const))('%s: content comes from the payload and follows the wording rules', (_id, s) => {
    const r = buildReport(s, { mock: true, generatedAt: AT })
    expect(r.title).toBe('Scenario Fire Safety Analysis')
    expect(r.subtitle).toBe(`${s.inputs.environment_label} · ${s.inputs.material_name}`)
    expect(r.mode).toBe('Mock')
    expect(r.mockNote).toBe('Sample text written with Gemini')

    // KPI strip: score + severity, burn rate, derived oxygen margin, data grounding.
    expect(r.kpis.map((k) => k.label)).toEqual(['Flammability score', 'Burn rate', 'Oxygen margin (ΔO₂)', 'Data grounding'])
    const margin = s.inputs.o2_pct - s.telemetry.oxygen_limit_pct
    expect(r.kpis[2].value).toBe(`${margin >= 0 ? '+' : '−'}${Math.abs(margin).toFixed(1)}`)
    expect(r.kpis[2].tag).toBe('derived')
    expect(r.kpis[2].detail).toMatch(margin >= 0 ? /^Above extinction limit/ : /^Below extinction limit/)
    expect(r.kpis[3].value).toBe(
      s.grounding_status === 'empirical_bass2' ? 'Direct empirical match (BASS-II)' : 'Interpolated (bounded by NTRS reports)',
    )

    // No NASA branding in titles, KPIs or labels; no code names, hex colours, LaTeX or loose "Not available".
    expect(`${r.title} ${r.subtitle} ${r.kpis.map((k) => k.label + k.value).join(' ')}`).not.toMatch(/NASA/)
    expect(allText(r)).not.toMatch(/\b[a-z]+_[a-z0-9_]+\b|#[0-9A-Fa-f]{6}|\$|\\text|Not available/)

    // References: the payload citations, plus the BASS-II dataset used by the map and context.
    expect(r.references.some((ref) => ref.url === 'https://doi.org/10.60555/4qc4-de67')).toBe(true)
    expect(r.cite).toBe('[1, 2]')
    expect(r.regime.points).toHaveLength(EXPERIMENTS_SNAPSHOT.length)
    expect(r.neighbors.rows).toHaveLength(3)
    expect(r.neighbors.sameMaterial).toBe(true)
    expect(r.neighbors.rows.every((row) => row.material_id === s.inputs.material_id)).toBe(true)
    expect(r.suppression.sizing).toBeNull()
  })

  it('rewrites code-style names in engine texts as physical notation', () => {
    const r = buildReport(SCENARIOS[0], { mock: true, generatedAt: AT })
    expect(r.interpretation).toContain('g = 0.00 g₀')
    expect(r.interpretation).not.toMatch(/gravity_g|airflow_cm_s/)
    expect(humanize('LOI $X_{O2}$ \\text{min} (#3B82F6) o2_pct')).toBe('LOI X_{O₂} min O₂')
  })

  it('describes the flame physically: diffusion, advection or no sustained flame', () => {
    const [quiescent, lunar, hypoxia] = SCENARIOS.map((s) => buildReport(s, { mock: true, generatedAt: AT }).flame)
    expect(quiescent.mechanism).toBe('Molecular diffusion')
    expect(quiescent.text).toMatch(/molecular diffusion.*blue/)
    expect(lunar.mechanism).toBe('Advective transport')
    expect(lunar.sooty).toBe(true)
    expect(hypoxia.burning).toBe(false)
    expect(hypoxia.text).toMatch(/below the oxygen limit \(17\.5% O₂\)/)
  })

  it('includes the suppression sizing only when the payload has it', () => {
    const r = buildReport(withTestEstimate(SCENARIOS[0]), { mock: false, generatedAt: AT })
    expect(r.mode).toBe('Live')
    expect(r.mockNote).toBeNull()
    expect(r.suppression.sizing?.map((m) => m.label)).toEqual(['Mist volume', 'Discharge time', 'Tank used', 'Cooling efficiency'])
    expect(r.suppression.note).toBe('TEST ONLY')
  })

  it('classifies BASS-II outcomes by their final state', () => {
    expect(isSustainedOutcome('Sustained Spread')).toBe(true)
    expect(isSustainedOutcome('Near-Quench Slow Spread')).toBe(true)
    expect(isSustainedOutcome('Sustained Spread -> Quench at 1.5 cm/s')).toBe(false)
    expect(isSustainedOutcome('No Ignition (Below LOI)')).toBe(false)
    expect(isSustainedOutcome('Blow-Off Extinction')).toBe(false)
  })

  it('names the file astrofire-analysis-<scenario_id>-<YYYY-MM-DD>.pdf', () => {
    expect(reportFileName('scenario_03_hypoxia_extinguished_below_loi', AT)).toBe(
      'astrofire-analysis-scenario_03_hypoxia_extinguished_below_loi-2026-11-15.pdf',
    )
  })
})

describe('report charts', () => {
  it('risk bar uses the site bands and marks the score', () => {
    const chart = riskBarChart(48)
    const labels = chart.shapes.flatMap((sh) => (sh.kind === 'text' ? [sh.text] : []))
    expect(labels).toEqual(['Nominal 0–35', 'Moderate 36–70', 'Critical 71–100', '48/100'])
  })

  it('regime map draws every BASS-II test, the 21% reference, the ≥ 30% band and this scenario', () => {
    const r = buildReport(SCENARIOS[1], { mock: true, generatedAt: AT })
    const chart = regimeMap(r.regime)
    const texts = chart.shapes.flatMap((sh) => (sh.kind === 'text' ? [sh.text] : []))
    expect(texts).toEqual(expect.arrayContaining(['21% O₂ (Earth air)', 'Exploration atmospheres (≥ 30% O₂)', 'This scenario', 'Airflow (cm/s)']))
    const dots = chart.shapes.filter((sh) => sh.kind === 'circle' && sh.r === 2.4)
    expect(dots.length).toBeGreaterThanOrEqual(EXPERIMENTS_SNAPSHOT.length)
  })

  it('schematic labels the mechanism, sample thickness and airflow', () => {
    const r = buildReport(SCENARIOS[1], { mock: true, generatedAt: AT })
    const texts = flameSchematic(r.flame).shapes.flatMap((sh) => (sh.kind === 'text' ? [sh.text] : []))
    expect(texts).toEqual(
      expect.arrayContaining(['Dominant mechanism: Advective transport', 'Sample · 0.30 mm thick', 'Airflow 15.0 cm/s →', 'Reaction zone: amber, sooty']),
    )
  })

  it('PDF text replaces symbols missing from the latin font subset', () => {
    expect(toPdf('ΔO₂ ≥ 30% at g = 0.00 g₀ →')).toBe('delta O2 >= 30% at g = 0.00 g ->')
  })
})
