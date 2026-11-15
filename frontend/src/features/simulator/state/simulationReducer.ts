// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import type { ExperimentRecord, MaterialInfo } from '../../../types/catalog'
import type { SimulationRequest, SimulationResponse } from '../../../types/contract'

/** Editable scenario in the Mission Controls. */
export interface DraftInputs {
  material_id: string
  /** Fixed per material (or taken from a selected BASS-II record). null = pending. */
  thickness_mm: number | null
  gravity_g: number
  o2_pct: number
  airflow_cm_s: number
  /** Set when the scenario was loaded from a BASS-II row; cleared on any manual edit. */
  test_id: string | null
}

export type RunStatus = 'idle' | 'loading' | 'success' | 'error'

/** Simulate -> measure risk -> suppress cycle shown by the 3D chamber. */
export type ChamberPhase = 'idle' | 'burning' | 'suppressing' | 'extinguished'

export interface ChamberState {
  phase: ChamberPhase
  /** Why the flame is out: after a discharge, or because the run returned no sustained flame. */
  extinguishedBy: 'suppression' | 'no_sustained_flame' | null
  /** Discharge duration taken from suppression_estimate.estimated_discharge_seconds. */
  dischargeMs: number | null
  dischargeStartedAt: number | null
  /** Incremented on every successful run so timers from an older cycle are ignored. */
  cycle: number
}

export const IDLE_CHAMBER: ChamberState = {
  phase: 'idle',
  extinguishedBy: null,
  dischargeMs: null,
  dischargeStartedAt: null,
  cycle: 0,
}

export interface SimulationState {
  chamber: ChamberState
  draft: DraftInputs
  status: RunStatus
  result: SimulationResponse | null
  /** Request that produced `result` (used for stale detection). */
  lastRunRequest: SimulationRequest | null
  /** Request currently in flight. */
  pendingRequest: SimulationRequest | null
  error: { message: string; details: string[] } | null
}

/** Defaults mirror backend/app/schemas.py SimulationRequest defaults. */
export const DEFAULT_DRAFT: DraftInputs = {
  material_id: 'pmma_clear_slab',
  thickness_mm: null,
  gravity_g: 0,
  o2_pct: 21,
  airflow_cm_s: 5,
  test_id: null,
}

export type SimulationAction =
  | { type: 'catalogLoaded'; materials: MaterialInfo[] }
  | { type: 'setMaterial'; material: MaterialInfo }
  | { type: 'setGravity'; gravity_g: number }
  | { type: 'setOxygen'; o2_pct: number }
  | { type: 'setAirflow'; airflow_cm_s: number }
  | { type: 'applyPreset'; draft: Omit<DraftInputs, 'thickness_mm' | 'test_id'>; material: MaterialInfo | undefined }
  | { type: 'selectExperiment'; record: ExperimentRecord }
  | { type: 'runStarted'; request: SimulationRequest }
  | { type: 'runSucceeded'; request: SimulationRequest; result: SimulationResponse }
  | { type: 'runFailed'; request: SimulationRequest; message: string; details: string[] }
  | { type: 'dischargeStarted'; at: number }
  | { type: 'dischargeCompleted'; cycle: number }

export function initialSimulationState(): SimulationState {
  return {
    chamber: IDLE_CHAMBER,
    draft: DEFAULT_DRAFT,
    status: 'idle',
    result: null,
    lastRunRequest: null,
    pendingRequest: null,
    error: null,
  }
}

export function simulationReducer(state: SimulationState, action: SimulationAction): SimulationState {
  switch (action.type) {
    case 'catalogLoaded': {
      const current = action.materials.find((m) => m.material_id === state.draft.material_id)
      const material = current ?? action.materials[0]
      if (!material || state.draft.test_id) return state
      return {
        ...state,
        draft: {
          ...state.draft,
          material_id: material.material_id,
          thickness_mm: material.nominal_thickness_mm,
        },
      }
    }
    case 'setMaterial':
      return {
        ...state,
        chamber: { ...IDLE_CHAMBER, cycle: state.chamber.cycle + 1 },
        draft: {
          ...state.draft,
          material_id: action.material.material_id,
          thickness_mm: action.material.nominal_thickness_mm,
          test_id: null,
        },
      }
    case 'setGravity':
      return {
        ...state,
        chamber: { ...IDLE_CHAMBER, cycle: state.chamber.cycle + 1 },
        draft: { ...state.draft, gravity_g: action.gravity_g, test_id: null },
      }
    case 'setOxygen':
      return { ...state, draft: { ...state.draft, o2_pct: action.o2_pct, test_id: null } }
    case 'setAirflow':
      return { ...state, draft: { ...state.draft, airflow_cm_s: action.airflow_cm_s, test_id: null } }
    case 'applyPreset':
      return {
        ...state,
        chamber: { ...IDLE_CHAMBER, cycle: state.chamber.cycle + 1 },
        draft: {
          ...action.draft,
          thickness_mm: action.material?.nominal_thickness_mm ?? null,
          test_id: null,
        },
      }
    case 'selectExperiment':
      return {
        ...state,
        draft: {
          material_id: action.record.material_id,
          thickness_mm: action.record.thickness_mm,
          gravity_g: action.record.gravity_g,
          o2_pct: action.record.initial_o2_pct,
          airflow_cm_s: action.record.airflow_cm_s,
          test_id: action.record.test_id,
        },
      }
    case 'runStarted':
      return {
        ...state,
        status: 'loading',
        pendingRequest: action.request,
        error: null,
        chamber: { ...IDLE_CHAMBER, cycle: state.chamber.cycle + 1 },
      }
    case 'runSucceeded': {
      if (!sameRequest(action.request, state.pendingRequest)) return state
      // No sustained flame when the oxygen factor or the burn rate is zero (below the oxygen limit).
      const { oxygen_factor, burn_rate_mm_s } = action.result.simulation_3d
      const flameActive = oxygen_factor > 0 && burn_rate_mm_s > 0
      return {
        ...state,
        status: 'success',
        result: action.result,
        lastRunRequest: action.request,
        pendingRequest: null,
        error: null,
        chamber: {
          phase: flameActive ? 'burning' : 'extinguished',
          extinguishedBy: flameActive ? null : 'no_sustained_flame',
          dischargeMs: null,
          dischargeStartedAt: null,
          cycle: state.chamber.cycle + 1,
        },
      }
    }
    case 'dischargeStarted': {
      const seconds = state.result?.suppression_estimate?.estimated_discharge_seconds
      if (state.chamber.phase !== 'burning' || seconds === undefined || seconds <= 0) return state
      return {
        ...state,
        chamber: {
          ...state.chamber,
          phase: 'suppressing',
          dischargeMs: seconds * 1000,
          dischargeStartedAt: action.at,
        },
      }
    }
    case 'dischargeCompleted':
      if (state.chamber.phase !== 'suppressing' || action.cycle !== state.chamber.cycle) return state
      return {
        ...state,
        chamber: { ...state.chamber, phase: 'extinguished', extinguishedBy: 'suppression' },
      }
    case 'runFailed':
      if (!sameRequest(action.request, state.pendingRequest)) return state
      return {
        ...state,
        status: 'error',
        pendingRequest: null,
        error: { message: action.message, details: action.details },
      }
  }
}

/** Builds the POST /api/simulate body from the current draft. */
export function toRequest(draft: DraftInputs): SimulationRequest {
  const request: SimulationRequest = {
    material_id: draft.material_id,
    gravity_g: draft.gravity_g,
    o2_pct: draft.o2_pct,
    airflow_cm_s: draft.airflow_cm_s,
  }
  if (draft.thickness_mm !== null) request.thickness_mm = draft.thickness_mm
  if (draft.test_id) request.test_id = draft.test_id
  return request
}

export function sameRequest(a: SimulationRequest | null, b: SimulationRequest | null): boolean {
  if (a === b) return true
  if (!a || !b) return false
  return (
    a.material_id === b.material_id &&
    a.thickness_mm === b.thickness_mm &&
    a.gravity_g === b.gravity_g &&
    a.o2_pct === b.o2_pct &&
    a.airflow_cm_s === b.airflow_cm_s &&
    (a.test_id ?? null) === (b.test_id ?? null)
  )
}

export const SUPPRESSION_UNAVAILABLE = 'Suppression estimate not available yet'

/**
 * Why the "Discharge FWM PFE" control is unavailable, or null when it can be used.
 * The discharge duration must come from the backend; it is never assumed.
 */
export function dischargeBlockedReason(state: SimulationState): string | null {
  if (!state.result) return 'Run a simulation first.'
  if (state.status === 'loading') return 'A simulation is running.'
  if (isResultStale(state)) return 'Parameters changed. Re-run the simulation first.'
  if (state.chamber.phase === 'suppressing') return 'Discharge in progress.'
  if (state.chamber.phase !== 'burning') return 'No active flame to suppress.'
  const seconds = state.result.suppression_estimate?.estimated_discharge_seconds
  if (seconds === undefined) return SUPPRESSION_UNAVAILABLE
  if (seconds <= 0) return 'The suppression estimate reports no discharge for this run.'
  return null
}

/** True when a result is on screen but the controls no longer match the run that produced it. */
export function isResultStale(state: SimulationState): boolean {
  if (!state.result || !state.lastRunRequest) return false
  return !sameRequest(toRequest(state.draft), state.lastRunRequest)
}
