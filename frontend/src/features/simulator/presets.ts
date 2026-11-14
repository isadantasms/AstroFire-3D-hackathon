// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/**
 * Scenario presets: the input conditions of the three sample payloads (src/mocks).
 * Presets without a matching scenario (e.g. a Mars habitat) stay out until data exists.
 */
import { presetName, SAMPLE_SCENARIOS } from '../../mocks/scenarios'

export interface GravityOption {
  value: number
  short: string
  label: string
}

/** Gravity levels named in contracts/simulation_schema.json (inputs.gravity_g description). */
export const GRAVITY_OPTIONS: readonly GravityOption[] = [
  { value: 0, short: 'ISS', label: 'ISS microgravity' },
  { value: 0.16, short: 'Moon', label: 'Lunar surface' },
  { value: 0.38, short: 'Mars', label: 'Martian surface' },
  { value: 1, short: 'Earth', label: 'Earth baseline' },
]

export interface ScenarioPreset {
  id: string
  name: string
  material_id: string
  gravity_g: number
  o2_pct: number
  airflow_cm_s: number
}

export const SCENARIO_PRESETS: readonly ScenarioPreset[] = SAMPLE_SCENARIOS.map((s) => ({
  id: s.scenario_id,
  name: presetName(s.scenario_id),
  material_id: s.inputs.material_id,
  gravity_g: s.inputs.gravity_g,
  o2_pct: s.inputs.o2_pct,
  airflow_cm_s: s.inputs.airflow_cm_s,
}))

/** UI slider bounds (inputs remain within the schema limits of 0–100). */
export const O2_SLIDER = { min: 10, max: 40, step: 0.1 } as const
export const AIRFLOW_SLIDER = { min: 0, max: 50, step: 0.5 } as const
