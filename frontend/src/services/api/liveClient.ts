// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { EXPERIMENTS_SNAPSHOT } from '../../data/experimentsSnapshot'
import { MATERIALS_SNAPSHOT } from '../../data/materialsSnapshot'
import type { ExperimentRecord, MaterialInfo } from '../../types/catalog'
import type { SimulationRequest } from '../../types/contract'
import type { ApiClient, Catalog } from './client'
import { REQUEST_TIMEOUT_MS } from './config'
import { assertSimulationResponse } from './validate'

export class ApiRequestError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ApiRequestError'
  }
}

async function requestJson(url: string, init: RequestInit = {}, signal?: AbortSignal): Promise<unknown> {
  const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS)
  const combined = signal ? AbortSignal.any([signal, timeout]) : timeout
  let response: Response
  try {
    response = await fetch(url, { ...init, signal: combined })
  } catch (err) {
    if (signal?.aborted) throw err
    if (timeout.aborted) throw new ApiRequestError('The backend did not respond in time.')
    throw new ApiRequestError('The backend is unreachable. Check that the API is running.')
  }
  if (!response.ok) {
    throw new ApiRequestError(`The backend returned HTTP ${response.status}.`)
  }
  return response.json()
}

function snapshotCatalog(): Catalog {
  return {
    materials: MATERIALS_SNAPSHOT.map(({ material_id, material_name, nominal_thickness_mm }) => ({
      material_id,
      material_name,
      nominal_thickness_mm,
    })),
    experiments: [...EXPERIMENTS_SNAPSHOT],
    source: 'snapshot',
  }
}

export function createLiveClient(baseUrl: string): ApiClient {
  return {
    mode: 'live',

    async loadCatalog(signal) {
      try {
        const [materialsPayload, experimentsPayload] = await Promise.all([
          requestJson(`${baseUrl}/api/materials`, {}, signal) as Promise<{
            materials: (MaterialInfo & Record<string, unknown>)[]
          }>,
          requestJson(`${baseUrl}/api/experiments`, {}, signal) as Promise<{
            experiments: ExperimentRecord[]
          }>,
        ])
        return {
          materials: materialsPayload.materials.map((m) => ({
            material_id: m.material_id,
            material_name: m.material_name,
            nominal_thickness_mm:
              typeof m.nominal_thickness_mm === 'number' ? m.nominal_thickness_mm : null,
          })),
          experiments: experimentsPayload.experiments,
          source: 'api',
        }
      } catch (err) {
        if (signal?.aborted) throw err
        // Real repository records, clearly labeled as a snapshot in the UI.
        return snapshotCatalog()
      }
    },

    async simulate(request: SimulationRequest, signal?: AbortSignal) {
      const payload = await requestJson(
        `${baseUrl}/api/simulate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request),
        },
        signal,
      )
      return assertSimulationResponse(payload)
    },
  }
}
