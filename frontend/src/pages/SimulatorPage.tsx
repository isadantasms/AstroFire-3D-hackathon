// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { useCallback, useMemo } from 'react'
import { RotateCcw } from 'lucide-react'
import { defaultApiClient, type ApiClient, type Catalog } from '../services/api/client'
import { MissionControls } from '../features/simulator/controls/MissionControls'
import { FlameChamberPlaceholder } from '../features/simulator/chamber/FlameChamberPlaceholder'
import { toChamberSuppression } from '../features/simulator/chamber/types'
import { ResultsColumn } from '../features/simulator/results/ResultsColumn'
import { useCatalog, useSimulation } from '../features/simulator/state/useSimulation'

export function SimulatorPage({ client = defaultApiClient }: { client?: ApiClient }) {
  const { state, dispatch, run, discharge, stale, dischargeBlocked } = useSimulation(client)
  const suppression = useMemo(() => toChamberSuppression(state.result), [state.result])
  const onCatalogLoaded = useCallback(
    (catalog: Catalog) => dispatch({ type: 'catalogLoaded', materials: catalog.materials }),
    [dispatch],
  )
  const { catalogState, retryCatalog } = useCatalog(client, onCatalogLoaded)

  const mock = client.mode === 'mock'
  const catalog = catalogState.status === 'ready' ? catalogState.catalog : null
  const loading = state.status === 'loading'
  const standbyMaterial = useMemo(() => {
    const found = catalog?.materials.find((m) => m.material_id === state.draft.material_id)
    return {
      material_id: state.draft.material_id,
      material_name: found?.material_name ?? state.draft.material_id,
      thickness_mm: state.draft.thickness_mm ?? found?.nominal_thickness_mm ?? 2,
      gravity_g: state.draft.gravity_g,
    }
  }, [catalog, state.draft.gravity_g, state.draft.material_id, state.draft.thickness_mm])

  return (
    <div className="flex flex-col bg-void lg:h-[calc(100dvh-3.5rem)]">
      <h1 className="sr-only">Simulator</h1>

      <div className="grid min-h-0 flex-1 gap-5 p-4 lg:grid-cols-[300px_minmax(0,1fr)_360px] lg:grid-rows-[minmax(0,1fr)] lg:gap-6 lg:px-6 xl:grid-cols-[300px_minmax(0,1fr)_400px]">
        {/* Left: Mission controls */}
        <aside aria-label="Mission controls" className="min-h-0 min-w-0">
          {catalogState.status === 'loading' ? (
            <p role="status" className="text-xs text-secondary">
              Loading materials…
            </p>
          ) : null}
          {catalogState.status === 'error' ? (
            <div role="alert" className="rounded-xl border border-critical/70 bg-panel p-4">
              <p className="text-sm text-critical">Could not load materials.</p>
              <p className="mt-1 text-xs text-secondary">{catalogState.message}</p>
              <button
                type="button"
                onClick={retryCatalog}
                className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-subtle px-3 py-1.5 text-xs text-primary"
              >
                <RotateCcw className="size-3.5" aria-hidden />
                Retry
              </button>
            </div>
          ) : null}
          {catalog ? (
            <MissionControls
              draft={state.draft}
              materials={catalog.materials}
              resultThicknessMm={state.result?.inputs.thickness_mm ?? null}
              running={loading}
              dispatch={dispatch}
              onRun={run}
            />
          ) : null}
        </aside>

        {/* Center: 3D chamber */}
        <div className="min-h-[28rem] min-w-0 lg:min-h-0">
          <FlameChamberPlaceholder
            phase={state.chamber.phase}
            flame={state.result?.simulation_3d ?? null}
            suppression={suppression}
            payload={state.result}
            standbyMaterial={standbyMaterial}
            extinguishedBy={state.chamber.extinguishedBy}
            dischargeStartedAt={state.chamber.dischargeStartedAt}
            dischargeBlocked={dischargeBlocked}
            onDischarge={discharge}
            loading={loading}
            stale={stale}
          />
        </div>

        {/* Right: results */}
        <aside aria-label="Results" className="min-h-0 min-w-0">
          <ResultsColumn state={state} stale={stale} mock={mock} onRun={run} />
        </aside>
      </div>
    </div>
  )
}
