// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/**
 * MOCK client for UI development without a running backend.
 *
 * - Materials and BASS-II experiment rows are REAL repository data (snapshots).
 * - Run Simulation returns the closest of the three sample payloads in
 *   src/mocks/sample_3d_payloads.json, validated against contracts/simulation_schema.json.
 *   The values are not computed from the controls; the UI labels them MOCK DATA.
 */
import { EXPERIMENTS_SNAPSHOT } from '../../data/experimentsSnapshot'
import { MATERIALS_SNAPSHOT } from '../../data/materialsSnapshot'
import { closestScenario } from '../../mocks/scenarios'
import type { SimulationRequest, SimulationResponse } from '../../types/contract'
import type { ApiClient } from './client'
import { assertSimulationResponse } from './validate'

/** Closest sample scenario for a request, validated against the shared contract. */
export function mockSimulate(request: SimulationRequest): SimulationResponse {
  return assertSimulationResponse(structuredClone(closestScenario(request)))
}

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (ms <= 0) return resolve()
    const timer = setTimeout(resolve, ms)
    signal?.addEventListener('abort', () => {
      clearTimeout(timer)
      reject(new DOMException('Aborted', 'AbortError'))
    })
  })
}

export function createMockClient(latencyMs = 450): ApiClient {
  return {
    mode: 'mock',

    async loadCatalog() {
      return {
        materials: MATERIALS_SNAPSHOT.map(({ material_id, material_name, nominal_thickness_mm }) => ({
          material_id,
          material_name,
          nominal_thickness_mm,
        })),
        experiments: [...EXPERIMENTS_SNAPSHOT],
        source: 'snapshot',
      }
    },

    async simulate(request, signal) {
      await delay(latencyMs, signal)
      return mockSimulate(request)
    },
  }
}
