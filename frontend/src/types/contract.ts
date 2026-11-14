// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/**
 * TypeScript mirror of contracts/simulation_schema.json (MicrogravitySimulationContract).
 * The JSON schema is the source of truth; responses are validated against it at runtime
 * (see services/api/validate.ts). Keep this file in sync with the schema, never ahead of it.
 */
import type { GroundingStatus } from '../content/grounding'

export type FlameGeometry = 'spherical' | 'elongated'

export type RiskLabel =
  | 'Safe (Extinguished Below LOI)'
  | 'Moderate Alert'
  | 'High Risk'
  | 'Critical Flashover Risk'

export interface SimulationInputs {
  material_id: string
  material_name: string
  thickness_mm: number
  gravity_g: number
  environment_label: string
  o2_pct: number
  airflow_cm_s: number
}

export interface Simulation3D {
  flame_geometry: FlameGeometry
  burn_rate_mm_s: number
  flame_color_hex: string
  oxygen_factor: number
}

export interface Telemetry {
  flammability_score: number
  risk_label: RiskLabel
  oxygen_limit_pct: number
  co_ppm: number
  co2_pct: number
}

export interface SafetyCopilot {
  diagnosis: string
  suppression_action: string
  terrestrial_spinoff: string
  scientific_limitations: string
}

export interface NasaCitation {
  id: string
  title: string
  url: string
  finding: string
}

export interface SuppressionEstimate {
  cooling_efficiency_pct: number
  estimated_flame_power_kw: number
  estimated_mist_volume_ml: number
  tank_capacity_used_pct: number
  estimated_discharge_seconds: number
  confined_rack_note: string
}

export interface SimulationResponse {
  scenario_id: string
  grounding_status: GroundingStatus
  inputs: SimulationInputs
  simulation_3d: Simulation3D
  telemetry: Telemetry
  safety_copilot: SafetyCopilot
  nasa_citations: NasaCitation[]
  suppression_estimate?: SuppressionEstimate
}

/**
 * Request body for POST /api/simulate.
 * NOT part of contracts/simulation_schema.json: mirrors backend/app/schemas.py (SimulationRequest).
 */
export interface SimulationRequest {
  material_id: string
  thickness_mm?: number
  gravity_g: number
  o2_pct: number
  airflow_cm_s: number
  test_id?: string
}
