// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/**
 * MOCK client for UI development without a running backend.
 *
 * - Materials and BASS-II experiment rows are REAL repository data (snapshots).
 * - Simulation responses are MOCK DATA: fixed placeholder numbers and texts, shaped to pass
 *   contracts/simulation_schema.json. They are not engine output and not NASA evidence,
 *   and the UI labels them "MOCK DATA" wherever they appear.
 * Only the contract's own documented rules are applied (flame geometry/color selection,
 * oxygen_factor = 0 when o2_pct is below the material's catalog loi_min_pct).
 */
import { EXPERIMENTS_SNAPSHOT } from '../../data/experimentsSnapshot'
import { MATERIALS_SNAPSHOT } from '../../data/materialsSnapshot'
import type { SimulationRequest, SimulationResponse } from '../../types/contract'
import type { ApiClient } from './client'
import { assertSimulationResponse } from './validate'

export const MOCK_TAG = '[MOCK DATA]'

const MOCK_TEXT = {
  diagnosis: `${MOCK_TAG} Placeholder diagnosis for UI development. Switch to the live API for engine output.`,
  suppression: `${MOCK_TAG} Placeholder suppression guidance. Not engine output and not an operational procedure.`,
  spinoff: `${MOCK_TAG} Placeholder terrestrial application text.`,
  limitations: `${MOCK_TAG} Placeholder values shaped to the data contract. No physical model was run.`,
  finding: `${MOCK_TAG} Placeholder finding. The live API supplies the specific finding.`,
}

function environmentLabel(gravity: number): string {
  return `${MOCK_TAG} ${gravity.toFixed(2)} g`
}

export function buildMockResponse(request: SimulationRequest): SimulationResponse {
  const material =
    MATERIALS_SNAPSHOT.find((m) => m.material_id === request.material_id) ?? MATERIALS_SNAPSHOT[0]
  const record = request.test_id
    ? EXPERIMENTS_SNAPSHOT.find((r) => r.test_id === request.test_id)
    : undefined

  const thickness = request.thickness_mm ?? material.nominal_thickness_mm ?? 1
  const extinguished = request.o2_pct < material.loi_min_pct
  const quiescent0g = request.gravity_g === 0 && request.airflow_cm_s < 1
  const score = extinguished ? 10 : 50

  return {
    scenario_id: `mock_${material.material_id}_${request.test_id ?? 'custom'}`,
    grounding_status: record ? 'empirical_bass2' : 'interpolated_from_ntrs',
    inputs: {
      material_id: material.material_id,
      material_name: material.material_name,
      thickness_mm: thickness,
      gravity_g: request.gravity_g,
      environment_label: environmentLabel(request.gravity_g),
      o2_pct: request.o2_pct,
      airflow_cm_s: request.airflow_cm_s,
    },
    simulation_3d: {
      flame_geometry: quiescent0g ? 'spherical' : 'elongated',
      burn_rate_mm_s: extinguished ? 0 : 0.5,
      flame_color_hex: quiescent0g || extinguished ? '#3B82F6' : '#F97316',
      oxygen_factor: extinguished ? 0 : 0.5,
    },
    telemetry: {
      flammability_score: score,
      risk_label: extinguished ? 'Safe (Extinguished Below LOI)' : 'Moderate Alert',
      oxygen_limit_pct: material.loi_min_pct,
      co_ppm: 0,
      co2_pct: 0,
    },
    safety_copilot: {
      diagnosis: MOCK_TEXT.diagnosis,
      suppression_action: MOCK_TEXT.suppression,
      terrestrial_spinoff: MOCK_TEXT.spinoff,
      scientific_limitations: MOCK_TEXT.limitations,
    },
    nasa_citations: [
      {
        id: 'PSI-25 (DOI: 10.60555/4qc4-de67)',
        title: 'Burning and Suppression of Solids - II (BASS-II)',
        url: 'https://doi.org/10.60555/4qc4-de67',
        finding: MOCK_TEXT.finding,
      },
      {
        id: 'NASA/TM-20210011385',
        title: 'BASS-II Summary Report (Olson et al., 2021)',
        url: 'https://ntrs.nasa.gov/citations/20210011385',
        finding: MOCK_TEXT.finding,
      },
    ],
  }
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
      // Validate mock output too, so contract drift is caught during development.
      return assertSimulationResponse(buildMockResponse(request))
    },
  }
}
