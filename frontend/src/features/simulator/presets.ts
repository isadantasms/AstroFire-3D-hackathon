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
    id: 'iss_0g_quiescent_sphere',
    name: 'ISS 0g · Quiescent Sphere',
    description: '0.0g · 21% O2 · 0.4 cm/s blue diffusion ball',
    material_id: 'pmma_clear_slab',
    gravity_g: 0,
    o2_pct: 21,
    airflow_cm_s: 0.4,
  },
  {
    id: 'iss_0g_ventilated_goldilocks',
    name: 'ISS 0g · Goldilocks Flow',
    description: '0.0g · 21% O2 · 10 cm/s ventilated plume',
    material_id: 'pmma_thin_film',
    gravity_g: 0,
    o2_pct: 21,
    airflow_cm_s: 10,
  },
  {
    id: 'lunar_base_30o2_enriched',
    name: 'Lunar Base · 30% O2',
    description: '0.16g · 30% O2 · 15 cm/s exploration cabin',
    material_id: 'cotton_fiberglass_sibal',
    gravity_g: 0.16,
    o2_pct: 30,
    airflow_cm_s: 15,
  },
  {
    id: 'martian_habitat_038g',
    name: 'Martian Habitat · 0.38g',
    description: '0.38g · 24% O2 · 6 cm/s partial-g plume',
    material_id: 'pmma_rod',
    gravity_g: 0.38,
    o2_pct: 24,
    airflow_cm_s: 6,
  },
  {
    id: 'hypoxia_quenched_below_loi',
    name: 'Hypoxic Quench (< LOI)',
    description: '0.0g · 14.2% O2 · Nomex III safe state',
    material_id: 'nomex_iii_fabric',
    gravity_g: 0,
    o2_pct: 14.2,
    airflow_cm_s: 2,
  },
]

/** UI slider bounds (inputs remain within the schema limits of 0–100). */
export const O2_SLIDER = { min: 10, max: 40, step: 0.1 } as const
export const AIRFLOW_SLIDER = { min: 0, max: 50, step: 0.5 } as const
