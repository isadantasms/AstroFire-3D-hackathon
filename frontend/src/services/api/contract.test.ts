// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { describe, expect, it } from 'vitest'
import { mockSimulate } from './mockClient'
import { assertSimulationResponse, ContractValidationError } from './validate'
import { EXPERIMENTS_SNAPSHOT } from '../../data/experimentsSnapshot'
import { MATERIALS_SNAPSHOT } from '../../data/materialsSnapshot'
import { closestScenario, SAMPLE_SCENARIOS } from '../../mocks/scenarios'
import { SCENARIO_PRESETS } from '../../features/simulator/presets'

describe('contract validation (contracts/simulation_schema.json)', () => {
  it.each(SAMPLE_SCENARIOS.map((s) => [s.scenario_id, s] as const))('fixture %s passes the schema', (_id, scenario) => {
    expect(() => assertSimulationResponse(structuredClone(scenario))).not.toThrow()
  })

  it('every fixture material exists in the materials catalog', () => {
    const ids = new Set(MATERIALS_SNAPSHOT.map((m) => m.material_id))
    for (const s of SAMPLE_SCENARIOS) expect(ids.has(s.inputs.material_id)).toBe(true)
  })

  it('the three presets are the three fixture scenarios', () => {
    expect(SCENARIO_PRESETS.map((p) => p.name)).toEqual(['ISS · quiescent', 'Lunar habitat · ventilated', 'ISS · low oxygen'])
    for (const p of SCENARIO_PRESETS) {
      expect(mockSimulate({ ...p }).scenario_id).toBe(p.id)
    }
  })

  it('mock mode returns the scenario closest to the controls', () => {
    expect(closestScenario({ material_id: 'pmma_clear_slab', gravity_g: 0, o2_pct: 21, airflow_cm_s: 5 }).scenario_id).toBe(
      'scenario_01_iss_quiescent_0g_blue_sphere',
    )
    expect(
      closestScenario({ material_id: 'cotton_fiberglass_sibal', gravity_g: 0.38, o2_pct: 26, airflow_cm_s: 12 }).scenario_id,
    ).toBe('scenario_02_lunar_ventilated_elongated_soot')
    expect(closestScenario({ material_id: 'nomex_iii_fabric', gravity_g: 0, o2_pct: 14, airflow_cm_s: 1 }).scenario_id).toBe(
      'scenario_03_hypoxia_extinguished_below_loi',
    )
  })

  it('returns a copy, so the fixture cannot be mutated by the UI', () => {
    const a = mockSimulate({ material_id: 'pmma_clear_slab', gravity_g: 0, o2_pct: 21, airflow_cm_s: 0.5 })
    a.telemetry.flammability_score = 0
    expect(SAMPLE_SCENARIOS[0].telemetry.flammability_score).not.toBe(0)
  })

  it('rejects payloads with missing or extra fields', () => {
    const valid = structuredClone(SAMPLE_SCENARIOS[0])
    const { telemetry: _omit, ...missing } = valid
    void _omit
    expect(() => assertSimulationResponse(missing)).toThrow(ContractValidationError)
    expect(() => assertSimulationResponse({ ...valid, extra_field: 1 })).toThrow(ContractValidationError)
  })

  it('loads the real BASS-II dataset snapshot', () => {
    expect(EXPERIMENTS_SNAPSHOT.length).toBe(79)
    expect(EXPERIMENTS_SNAPSHOT.every((r) => r.gravity_g === 0)).toBe(true)
  })
})
