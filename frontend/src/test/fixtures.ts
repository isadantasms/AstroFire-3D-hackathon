// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import type { SimulationResponse } from '../types/contract'

/** TEST-ONLY suppression estimate: exercises the cycle; not physical values and never shown in the app. */
export function withTestEstimate(result: SimulationResponse, seconds = 3): SimulationResponse {
  return {
    ...result,
    suppression_estimate: {
      cooling_efficiency_pct: 1,
      estimated_flame_power_kw: 1,
      estimated_mist_volume_ml: 1,
      tank_capacity_used_pct: 1,
      estimated_discharge_seconds: seconds,
      confined_rack_note: 'TEST ONLY',
    },
  }
}
