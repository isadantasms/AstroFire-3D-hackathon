// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/**
 * Shapes for GET /api/materials and GET /api/experiments.
 * NOT part of contracts/simulation_schema.json: mirrors backend/app/main.py and
 * backend/data/bass2_empirical_verified.json (BASS-II record columns).
 */

export interface MaterialInfo {
  material_id: string
  material_name: string
  /** Fixed per material (backend catalog). null = not available in the repository: shown as pending. */
  nominal_thickness_mm: number | null
}

export interface ExperimentRecord {
  test_id: string
  source_table: string
  pi_group: string
  material_id: string
  material_name: string
  geometry: string
  thickness_mm: number
  width_cm: number | null
  flow_direction: string
  gravity_g: number
  airflow_cm_s: number
  initial_o2_pct: number
  final_o2_pct: number | null
  spread_rate_mm_s: number | null
  burn_time_min: number | null
  initial_co2_pct: number | null
  final_co2_pct: number | null
  initial_co_ppm: number | null
  final_co_ppm: number | null
  outcome: string
  notes: string
}

export type CatalogSource = 'api' | 'snapshot'
