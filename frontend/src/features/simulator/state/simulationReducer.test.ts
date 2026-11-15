// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { describe, expect, it } from 'vitest'
import { mockSimulate } from '../../../services/api/mockClient'
import { EXPERIMENTS_SNAPSHOT } from '../../../data/experimentsSnapshot'
import type { SimulationResponse } from '../../../types/contract'
import {
  dischargeBlockedReason,
  initialSimulationState,
  isResultStale,
  simulationReducer,
  SUPPRESSION_UNAVAILABLE,
  toRequest,
  type SimulationState,
} from './simulationReducer'
import { withTestEstimate } from '../../../test/fixtures'
import { SCENARIO_PRESETS } from '../presets'

function runToSuccess(state: SimulationState, transform: (r: SimulationResponse) => SimulationResponse = (r) => r): SimulationState {
  const request = toRequest(state.draft)
  const started = simulationReducer(state, { type: 'runStarted', request })
  return simulationReducer(started, { type: 'runSucceeded', request, result: transform(mockSimulate(request)) })
}

describe('simulationReducer', () => {
  it('flags results as stale once the controls change, and fresh after re-run', () => {
    let state = runToSuccess(initialSimulationState())
    expect(isResultStale(state)).toBe(false)

    state = simulationReducer(state, { type: 'setOxygen', o2_pct: 18 })
    expect(isResultStale(state)).toBe(true)

    state = runToSuccess(state)
    expect(isResultStale(state)).toBe(false)
  })

  it('selecting a BASS-II row loads its exact conditions and test_id', () => {
    const record = EXPERIMENTS_SNAPSHOT[0]
    const state = simulationReducer(initialSimulationState(), { type: 'selectExperiment', record })
    expect(state.draft).toEqual({
      material_id: record.material_id,
      thickness_mm: record.thickness_mm,
      gravity_g: record.gravity_g,
      o2_pct: record.initial_o2_pct,
      airflow_cm_s: record.airflow_cm_s,
      test_id: record.test_id,
    })
    expect(toRequest(state.draft).test_id).toBe(record.test_id)
  })

  it('ignores a response for a request that is no longer pending', () => {
    const base = initialSimulationState()
    const first = toRequest(base.draft)
    const second = { ...first, o2_pct: 19 }
    let state = simulationReducer(base, { type: 'runStarted', request: first })
    state = simulationReducer(state, { type: 'runStarted', request: second })
    state = simulationReducer(state, { type: 'runSucceeded', request: first, result: mockSimulate(first) })
    expect(state.status).toBe('loading')
    expect(state.result).toBeNull()
  })

  it('chamber cycle: burning after a run, suppressing for the backend duration, then extinguished', () => {
    let state = runToSuccess(initialSimulationState(), (r) => withTestEstimate(r))
    expect(state.chamber.phase).toBe('burning')
    expect(dischargeBlockedReason(state)).toBeNull()

    state = simulationReducer(state, { type: 'dischargeStarted', at: 1000 })
    expect(state.chamber).toMatchObject({ phase: 'suppressing', dischargeMs: 3000, dischargeStartedAt: 1000 })

    // A timer from an older cycle must not end the current discharge.
    const stale = simulationReducer(state, { type: 'dischargeCompleted', cycle: state.chamber.cycle - 1 })
    expect(stale.chamber.phase).toBe('suppressing')

    state = simulationReducer(state, { type: 'dischargeCompleted', cycle: state.chamber.cycle })
    expect(state.chamber).toMatchObject({ phase: 'extinguished', extinguishedBy: 'suppression' })

    state = simulationReducer(state, { type: 'runStarted', request: toRequest(state.draft) })
    expect(state.chamber.phase).toBe('idle')
  })

  it('the low-oxygen scenario (oxygen_factor 0) is extinguished and cannot be discharged', () => {
    let state = simulationReducer(initialSimulationState(), {
      type: 'applyPreset',
      draft: { material_id: 'nomex_iii_fabric', gravity_g: 0, o2_pct: 13.5, airflow_cm_s: 2 },
      material: undefined,
    })
    state = runToSuccess(state, (r) => withTestEstimate(r))
    expect(state.result?.simulation_3d.oxygen_factor).toBe(0)
    expect(state.chamber).toMatchObject({ phase: 'extinguished', extinguishedBy: 'no_sustained_flame' })
    expect(dischargeBlockedReason(state)).toBe('No active flame to suppress.')
    expect(simulationReducer(state, { type: 'dischargeStarted', at: 0 }).chamber.phase).toBe('extinguished')
  })

  it('resets chamber from extinguished to idle when applying any of the 4 destination presets', () => {
    let state = runToSuccess(initialSimulationState(), (r) => withTestEstimate(r))
    state = simulationReducer(state, { type: 'dischargeStarted', at: 1000 })
    state = simulationReducer(state, { type: 'dischargeCompleted', cycle: state.chamber.cycle })
    expect(state.chamber.phase).toBe('extinguished')

    for (const preset of SCENARIO_PRESETS) {
      const next = simulationReducer(state, {
        type: 'applyPreset',
        draft: {
          material_id: preset.material_id,
          gravity_g: preset.gravity_g,
          o2_pct: preset.o2_pct,
          airflow_cm_s: preset.airflow_cm_s,
        },
        material: undefined,
      })
      expect(next.chamber.phase).toBe('idle')
      expect(next.chamber.extinguishedBy).toBeNull()
    }
  })

  it('a zero burn rate also means extinguished, even with a positive oxygen factor', () => {
    const state = runToSuccess(initialSimulationState(), (r) => ({
      ...r,
      simulation_3d: { ...r.simulation_3d, burn_rate_mm_s: 0, oxygen_factor: 0.5 },
    }))
    expect(state.chamber).toMatchObject({ phase: 'extinguished', extinguishedBy: 'no_sustained_flame' })
  })

  it('blocks the discharge when the payload has no suppression_estimate', () => {
    const state = runToSuccess(initialSimulationState())
    expect(state.result?.suppression_estimate).toBeUndefined()
    expect(dischargeBlockedReason(state)).toBe(SUPPRESSION_UNAVAILABLE)
    expect(simulationReducer(state, { type: 'dischargeStarted', at: 0 }).chamber.phase).toBe('burning')
  })

  it('blocks the discharge while results are stale', () => {
    let state = runToSuccess(initialSimulationState(), (r) => withTestEstimate(r))
    state = simulationReducer(state, { type: 'setAirflow', airflow_cm_s: 20 })
    expect(dischargeBlockedReason(state)).toMatch(/Re-run/)
  })

  it('omits thickness when it is pending (null)', () => {
    expect(toRequest(initialSimulationState().draft).thickness_mm).toBeUndefined()
  })
})
