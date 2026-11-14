// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { describe, expect, it } from 'vitest'
import { buildMockResponse, MOCK_TAG } from './mockClient'
import { assertSimulationResponse, ContractValidationError } from './validate'
import { EXPERIMENTS_SNAPSHOT } from '../../data/experimentsSnapshot'

describe('contract validation (contracts/simulation_schema.json)', () => {
  it.each([
    ['quiescent 0g', { material_id: 'pmma_clear_slab', gravity_g: 0, o2_pct: 21, airflow_cm_s: 0 }, 'spherical'],
    ['ventilated', { material_id: 'pmma_clear_slab', gravity_g: 0, o2_pct: 21, airflow_cm_s: 5 }, 'elongated'],
    ['partial gravity', { material_id: 'cotton_fiberglass_sibal', gravity_g: 0.38, o2_pct: 21, airflow_cm_s: 0 }, 'elongated'],
  ] as const)('mock response for %s passes the schema', (_name, request, geometry) => {
    const response = assertSimulationResponse(buildMockResponse({ ...request }))
    expect(response.simulation_3d.flame_geometry).toBe(geometry)
  })

  it('mock below the catalog LOI is extinguished (oxygen_factor 0)', () => {
    const response = assertSimulationResponse(
      buildMockResponse({ material_id: 'nomex_iii_fabric', gravity_g: 0, o2_pct: 21, airflow_cm_s: 5 }),
    )
    expect(response.simulation_3d.oxygen_factor).toBe(0)
    expect(response.telemetry.risk_label).toBe('Safe (Extinguished Below LOI)')
  })

  it('every mock text field is tagged as MOCK DATA', () => {
    const response = buildMockResponse({ material_id: 'pmma_clear_slab', gravity_g: 0, o2_pct: 21, airflow_cm_s: 5 })
    for (const text of Object.values(response.safety_copilot)) {
      expect(text.startsWith(MOCK_TAG)).toBe(true)
    }
    for (const citation of response.nasa_citations) {
      expect(citation.finding.startsWith(MOCK_TAG)).toBe(true)
    }
  })

  it('rejects payloads with missing or extra fields', () => {
    const valid = buildMockResponse({ material_id: 'pmma_clear_slab', gravity_g: 0, o2_pct: 21, airflow_cm_s: 5 })
    const { telemetry: _omit, ...missing } = valid
    void _omit
    expect(() => assertSimulationResponse(missing)).toThrow(ContractValidationError)
    expect(() => assertSimulationResponse({ ...valid, extra_field: 1 })).toThrow(ContractValidationError)
  })

  it('loads the real BASS-II dataset snapshot', () => {
    expect(EXPERIMENTS_SNAPSHOT.length).toBe(79)
    expect(EXPERIMENTS_SNAPSHOT.every((r) => r.gravity_g === 0)).toBe(true)
  })
})
