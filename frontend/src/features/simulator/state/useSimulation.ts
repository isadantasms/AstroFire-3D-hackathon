// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import type { ApiClient, Catalog } from '../../../services/api/client'
import { ContractValidationError } from '../../../services/api/validate'
import {
  dischargeBlockedReason,
  initialSimulationState,
  isResultStale,
  simulationReducer,
  toRequest,
  type SimulationAction,
} from './simulationReducer'

export type CatalogState =
  | { status: 'loading' }
  | { status: 'ready'; catalog: Catalog }
  | { status: 'error'; message: string }

/** Loads materials + BASS-II records once (live API or repository snapshot). */
export function useCatalog(client: ApiClient, onLoaded: (catalog: Catalog) => void) {
  const [state, setState] = useState<CatalogState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)
  const onLoadedRef = useRef(onLoaded)

  useEffect(() => {
    onLoadedRef.current = onLoaded
  })

  useEffect(() => {
    const controller = new AbortController()
    client
      .loadCatalog(controller.signal)
      .then((catalog) => {
        setState({ status: 'ready', catalog })
        onLoadedRef.current(catalog)
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        setState({
          status: 'error',
          message: err instanceof Error ? err.message : 'Could not load materials and experiments.',
        })
      })
    return () => controller.abort()
  }, [client, attempt])

  const retry = useCallback(() => {
    setState({ status: 'loading' })
    setAttempt((n) => n + 1)
  }, [])

  return { catalogState: state, retryCatalog: retry }
}

/** Owns the scenario draft, the run lifecycle and stale-result detection. */
export function useSimulation(client: ApiClient) {
  const [state, dispatch] = useReducer(simulationReducer, undefined, initialSimulationState)
  const controllerRef = useRef<AbortController | null>(null)

  useEffect(() => () => controllerRef.current?.abort(), [])

  const run = useCallback(() => {
    const request = toRequest(state.draft)
    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller

    dispatch({ type: 'runStarted', request })
    client
      .simulate(request, controller.signal)
      .then((result) => dispatch({ type: 'runSucceeded', request, result }))
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        const details = err instanceof ContractValidationError ? err.details : []
        const message = err instanceof Error ? err.message : 'The simulation failed.'
        dispatch({ type: 'runFailed', request, message, details })
      })
  }, [client, state.draft])

  const send = useCallback((action: SimulationAction) => dispatch(action), [])

  // Suppressing lasts exactly the backend's estimated discharge time, then the flame is out.
  const { phase, dischargeMs, cycle } = state.chamber
  useEffect(() => {
    if (phase !== 'suppressing' || dischargeMs === null) return
    const timer = setTimeout(() => dispatch({ type: 'dischargeCompleted', cycle }), dischargeMs)
    return () => clearTimeout(timer)
  }, [phase, dischargeMs, cycle])

  const discharge = useCallback(() => dispatch({ type: 'dischargeStarted', at: Date.now() }), [])

  return {
    state,
    dispatch: send,
    run,
    discharge,
    stale: isResultStale(state),
    dischargeBlocked: dischargeBlockedReason(state),
  }
}
