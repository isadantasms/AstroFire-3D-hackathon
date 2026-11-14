// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/**
 * Mock fixture: the three sample payloads from unity-fire-simulation/Assets/Samples/sample_3d_payloads.json
 * (copied verbatim to ./sample_3d_payloads.json). Every scenario is validated against
 * contracts/simulation_schema.json when it is served; the UI labels it MOCK DATA.
 */
import fixture from './sample_3d_payloads.json'
import type { SimulationRequest, SimulationResponse } from '../types/contract'

/** Raw scenarios as stored in the fixture (validated at use, see services/api/mockClient.ts). */
export const SAMPLE_SCENARIOS = fixture.scenarios as unknown as readonly SimulationResponse[]

/** Display names for the scenarios, used as Simulator presets. */
const PRESET_NAMES: Record<string, string> = {
  scenario_01_iss_quiescent_0g_blue_sphere: 'ISS · quiescent',
  scenario_02_lunar_ventilated_elongated_soot: 'Lunar habitat · ventilated',
  scenario_03_hypoxia_extinguished_below_loi: 'ISS · low oxygen',
}

export function presetName(scenarioId: string): string {
  return PRESET_NAMES[scenarioId] ?? scenarioId
}

/**
 * Closest fixture scenario to the requested controls. Mismatched material weighs the most,
 * then gravity, oxygen and airflow, each normalized by a typical range.
 */
export function closestScenario(request: SimulationRequest): SimulationResponse {
  let best = SAMPLE_SCENARIOS[0]
  let bestScore = Number.POSITIVE_INFINITY
  for (const scenario of SAMPLE_SCENARIOS) {
    const i = scenario.inputs
    const score =
      (i.material_id === request.material_id ? 0 : 1) +
      Math.abs(i.gravity_g - request.gravity_g) * 2 +
      Math.abs(i.o2_pct - request.o2_pct) / 10 +
      Math.abs(i.airflow_cm_s - request.airflow_cm_s) / 20
    if (score < bestScore) {
      best = scenario
      bestScore = score
    }
  }
  return best
}
