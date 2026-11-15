// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha & Pina
/**
 * Scenario presets: one validated active-combustion scenario per gravity regime
 * (ISS 0.00g, Moon 0.16g, Mars 0.38g, Earth 1.00g) paired with its primary NASA
 * BASS-II / Saffire reference material.
 */

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

export const SCENARIO_PRESETS: readonly ScenarioPreset[] = [
  {
    id: 'scenario_01_iss_quiescent_0g_blue_sphere',
    name: 'ISS · PMMA Slab',
    material_id: 'pmma_clear_slab',
    gravity_g: 0,
    o2_pct: 21,
    airflow_cm_s: 0.5,
  },
  {
    id: 'scenario_02_lunar_ventilated_elongated_soot',
    name: 'Moon · SIBAL Fabric',
    material_id: 'cotton_fiberglass_sibal',
    gravity_g: 0.16,
    o2_pct: 30,
    airflow_cm_s: 15,
  },
  {
    id: 'scenario_03_martian_habitat_pmma_rod',
    name: 'Mars · PMMA Rod',
    material_id: 'pmma_rod',
    gravity_g: 0.38,
    o2_pct: 24,
    airflow_cm_s: 6,
  },
  {
    id: 'scenario_04_earth_baseline_wax_candle',
    name: 'Earth · Wax Candle',
    material_id: 'japan_wax_candle',
    gravity_g: 1,
    o2_pct: 21,
    airflow_cm_s: 5,
  },
]

/** UI slider bounds (inputs remain within the schema limits of 0–100). */
export const O2_SLIDER = { min: 10, max: 40, step: 0.1 } as const
export const AIRFLOW_SLIDER = { min: 0, max: 50, step: 0.5 } as const
