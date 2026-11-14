// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import type { CatalogSource, ExperimentRecord, MaterialInfo } from '../../types/catalog'
import type { SimulationRequest, SimulationResponse } from '../../types/contract'
import { API_BASE_URL, API_MODE, type ApiMode } from './config'
import { createLiveClient } from './liveClient'
import { createMockClient } from './mockClient'

export interface Catalog {
  materials: MaterialInfo[]
  experiments: ExperimentRecord[]
  source: CatalogSource
}

/** Single integration surface between the UI and the backend. */
export interface ApiClient {
  readonly mode: ApiMode
  loadCatalog(signal?: AbortSignal): Promise<Catalog>
  simulate(request: SimulationRequest, signal?: AbortSignal): Promise<SimulationResponse>
}

export function createApiClient(mode: ApiMode = API_MODE): ApiClient {
  return mode === 'live' ? createLiveClient(API_BASE_URL) : createMockClient()
}

/** Default client for the running app, chosen by VITE_API_MODE. */
export const defaultApiClient: ApiClient = createApiClient()
