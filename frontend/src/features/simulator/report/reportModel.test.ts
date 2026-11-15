// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { describe, expect, it } from 'vitest'
import payloads from '../../../mocks/sample_3d_payloads.json'
import type { SimulationResponse } from '../../../types/contract'
import { withTestEstimate } from '../../../test/fixtures'
import { buildReport, NOT_AVAILABLE, reportFileName } from './reportModel'
import { flameFigure } from './flameFigure'

const SCENARIOS = payloads.scenarios as SimulationResponse[]
const AT = new Date(2026, 10, 15, 9, 5)

describe('buildReport', () => {
  it.each(SCENARIOS.map((s) => [s.scenario_id, s] as const))('%s: every value comes from the payload', (_id, s) => {
    const r = buildReport(s, { mock: true, generatedAt: AT })
    expect(r.scenarioId).toBe(s.scenario_id)
    expect(r.mode).toBe('Mock')
    expect(r.subtitle).toBe(`${s.inputs.environment_label} · ${s.inputs.material_name}`)
    // Abstract: environment, material, score + label, burn rate, O2 limit and the diagnosis.
    for (const part of [
      s.inputs.environment_label,
      s.inputs.material_name,
      `${s.telemetry.flammability_score}/100, rated "${s.telemetry.risk_label}"`,
      `${s.simulation_3d.burn_rate_mm_s.toFixed(2)} mm/s`,
      `${s.telemetry.oxygen_limit_pct.toFixed(1)}% O2`,
      s.safety_copilot.diagnosis,
    ]) {
      expect(r.abstract).toContain(part)
    }
    expect(r.parameters.map((p) => p.label)).toEqual(['Material', 'Material ID', 'Thickness', 'Gravity', 'Environment', 'Oxygen', 'Airflow'])
    expect(r.telemetry.find((m) => m.label === 'Oxygen limit')).toMatchObject({
      value: s.telemetry.oxygen_limit_pct.toFixed(1),
      unit: '% O2',
      meaning: 'Minimum oxygen needed to sustain the flame',
    })
    expect(r.interpretation).toBe(s.safety_copilot.diagnosis)
    expect(r.suppression.action).toBe(s.safety_copilot.suppression_action)
    expect(r.terrestrial).toBe(s.safety_copilot.terrestrial_spinoff)
    expect(r.limitations).toBe(s.safety_copilot.scientific_limitations)
    expect(r.references.map((ref) => [ref.n, ref.id, ref.url])).toEqual(s.nasa_citations.map((c, i) => [i + 1, c.id, c.url]))
    expect(r.cite).toBe('[1, 2]')
    // The sample payloads have no suppression_estimate yet.
    expect(r.suppression.sizing).toBeNull()
  })

  it('describes shape and color only through the contract mapping', () => {
    const [quiescent, lunar] = SCENARIOS
    expect(buildReport(quiescent, { mock: true, generatedAt: AT }).flame.text).toMatch(/spherical.*#3B82F6.*soot-free/)
    expect(buildReport(lunar, { mock: true, generatedAt: AT }).flame.text).toMatch(/elongated.*#F97316.*soot-heavy/)
  })

  it('scenario_03 (extinguished): no sustained flame and a ghost outline in the figure', () => {
    const r = buildReport(SCENARIOS[2], { mock: true, generatedAt: AT })
    expect(r.flame.burning).toBe(false)
    expect(r.flame.text).toMatch(/^No sustained flame/)
    const fig = flameFigure(r.flame.simulation)
    expect(fig.flame).toBeNull()
    expect(fig.ghost).not.toBeNull()
  })

  it('includes the suppression sizing only when the payload has it', () => {
    const r = buildReport(withTestEstimate(SCENARIOS[0]), { mock: false, generatedAt: AT })
    expect(r.mode).toBe('Live')
    expect(r.suppression.sizing?.map((m) => m.label)).toEqual(['Mist volume', 'Discharge time', 'Tank used', 'Cooling efficiency', 'Flame power'])
    expect(r.suppression.note).toBe('TEST ONLY')
  })

  it('reports missing citations as "Not available"', () => {
    const r = buildReport({ ...SCENARIOS[0], nasa_citations: [] }, { mock: true, generatedAt: AT })
    expect(r.dataSources).toBe(NOT_AVAILABLE)
    expect(r.cite).toBe('')
  })

  it('names the file astrofire-analysis-<scenario_id>-<YYYY-MM-DD>.pdf', () => {
    expect(reportFileName('scenario_03_hypoxia_extinguished_below_loi', AT)).toBe(
      'astrofire-analysis-scenario_03_hypoxia_extinguished_below_loi-2026-11-15.pdf',
    )
  })
})
