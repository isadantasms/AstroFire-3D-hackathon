// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/**
 * Scenario presets: INPUT combinations only (no results, no data claims).
 * Material ids exist in the backend catalog; 21 % O2 and 5 cm/s are the backend request defaults.
 * For measured conditions, load a row from the BASS-II experiment table instead.
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
  description: string
  material_id: string
  gravity_g: number
  o2_pct: number
  airflow_cm_s: number
}

export const SCENARIO_PRESETS: readonly ScenarioPreset[] = [
  {
    id: 'iss-quiescent',
    name: 'ISS · quiescent air',
    description: 'Microgravity with ventilation off',
    material_id: 'pmma_clear_slab',
    gravity_g: 0,
    o2_pct: 21,
    airflow_cm_s: 0,
  },
  {
    id: 'iss-ventilated',
    name: 'ISS · cabin airflow',
    description: 'Microgravity with forced ventilation',
    material_id: 'pmma_clear_slab',
    gravity_g: 0,
    o2_pct: 21,
    airflow_cm_s: 5,
  },
  {
    id: 'lunar-habitat',
    name: 'Lunar habitat',
    description: 'Crew textile at 0.16 g',
    material_id: 'cotton_fiberglass_sibal',
    gravity_g: 0.16,
    o2_pct: 21,
    airflow_cm_s: 5,
  },
  {
    id: 'mars-habitat',
    name: 'Martian habitat',
    description: 'Crew textile at 0.38 g',
    material_id: 'cotton_fiberglass_sibal',
    gravity_g: 0.38,
    o2_pct: 21,
    airflow_cm_s: 5,
  },
]

/** UI slider bounds (inputs remain within the schema limits of 0–100). */
export const O2_SLIDER = { min: 10, max: 40, step: 0.1 } as const
export const AIRFLOW_SLIDER = { min: 0, max: 50, step: 0.5 } as const
