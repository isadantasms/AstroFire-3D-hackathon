// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { describe, expect, it } from 'vitest'
import { buildMockResponse } from '../../../services/api/mockClient'
import { EXPERIMENTS_SNAPSHOT } from '../../../data/experimentsSnapshot'
import {
  initialSimulationState,
  isResultStale,
  simulationReducer,
  toRequest,
  type SimulationState,
} from './simulationReducer'

function runToSuccess(state: SimulationState): SimulationState {
  const request = toRequest(state.draft)
  const started = simulationReducer(state, { type: 'runStarted', request })
  return simulationReducer(started, { type: 'runSucceeded', request, result: buildMockResponse(request) })
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

  it('a manual edit after selecting a row clears the test_id', () => {
    let state = simulationReducer(initialSimulationState(), {
      type: 'selectExperiment',
      record: EXPERIMENTS_SNAPSHOT[0],
    })
    state = simulationReducer(state, { type: 'setAirflow', airflow_cm_s: 12 })
    expect(state.draft.test_id).toBeNull()
  })

  it('ignores a response for a request that is no longer pending', () => {
    const base = initialSimulationState()
    const first = toRequest(base.draft)
    const second = { ...first, o2_pct: 19 }
    let state = simulationReducer(base, { type: 'runStarted', request: first })
    state = simulationReducer(state, { type: 'runStarted', request: second })
    state = simulationReducer(state, { type: 'runSucceeded', request: first, result: buildMockResponse(first) })
    expect(state.status).toBe('loading')
    expect(state.result).toBeNull()
  })

  it('omits thickness when it is pending (null)', () => {
    expect(toRequest(initialSimulationState().draft).thickness_mm).toBeUndefined()
  })
})
