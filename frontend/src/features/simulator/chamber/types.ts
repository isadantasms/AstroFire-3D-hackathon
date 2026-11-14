// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/**
 * Integration boundary for the 3D Flame Chamber module (Esquivel).
 * The 3D component receives these values as props (or, for the Unity build, via
 * postMessage) and renders the flame and suppression effects from them.
 */
import type { Simulation3D, SimulationResponse } from '../../../types/contract'
import type { ChamberPhase } from '../state/simulationReducer'

export type { ChamberPhase }

/**
 * Suppression values for the chamber, taken verbatim from the backend's
 * suppression_estimate (contracts/simulation_schema.json). Never filled with defaults.
 */
export interface ChamberSuppression {
  /** suppression_estimate.estimated_discharge_seconds */
  discharge_seconds: number
  /** suppression_estimate.estimated_mist_volume_ml */
  mist_volume_ml: number
  /** suppression_estimate.cooling_efficiency_pct, for the gravity below */
  cooling_efficiency_pct: number
  /** inputs.gravity_g of the run the estimate belongs to */
  gravity_g: number
}

/** What the 3D module needs to render one moment of the simulate -> suppress cycle. */
export interface ChamberRenderInput {
  phase: ChamberPhase
  /** simulation_3d of the latest valid result; null before the first run. */
  flame: Simulation3D | null
  /** null when the backend did not return a suppression_estimate. */
  suppression: ChamberSuppression | null
}

/** Message posted to the Unity WebGL iframe whenever the chamber state changes. */
export interface ChamberStateMessage extends ChamberRenderInput {
  type: 'APPLY_CHAMBER_STATE'
}

/** Builds the chamber suppression input from a result, or null if the backend sent none. */
export function toChamberSuppression(result: SimulationResponse | null): ChamberSuppression | null {
  const estimate = result?.suppression_estimate
  if (!result || !estimate) return null
  return {
    discharge_seconds: estimate.estimated_discharge_seconds,
    mist_volume_ml: estimate.estimated_mist_volume_ml,
    cooling_efficiency_pct: estimate.cooling_efficiency_pct,
    gravity_g: result.inputs.gravity_g,
  }
}
