// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { useCallback } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'
import { defaultApiClient, type ApiClient, type Catalog } from '../services/api/client'
import { MissionControls } from '../features/simulator/controls/MissionControls'
import { FlameChamberPlaceholder } from '../features/simulator/chamber/FlameChamberPlaceholder'
import { ExperimentTable } from '../features/simulator/experiments/ExperimentTable'
import { ResultsColumn } from '../features/simulator/results/ResultsColumn'
import { useCatalog, useSimulation } from '../features/simulator/state/useSimulation'

export function SimulatorPage({ client = defaultApiClient }: { client?: ApiClient }) {
  const { state, dispatch, run, stale } = useSimulation(client)
  const onCatalogLoaded = useCallback(
    (catalog: Catalog) => dispatch({ type: 'catalogLoaded', materials: catalog.materials }),
    [dispatch],
  )
  const { catalogState, retryCatalog } = useCatalog(client, onCatalogLoaded)

  const mock = client.mode === 'mock'
  const catalog = catalogState.status === 'ready' ? catalogState.catalog : null
  const loading = state.status === 'loading'

  return (
    <div className="flex flex-col lg:h-[calc(100dvh-3.5rem)]">
      <h1 className="sr-only">Simulator</h1>

      {mock ? (
        <p
          data-testid="mock-mode-banner"
          className="flex items-center justify-center gap-2 border-b border-warning/60 bg-warning/10 px-4 py-1.5 text-center font-mono text-[0.6875rem] tracking-[0.06em] text-warning uppercase"
        >
          <AlertTriangle className="size-3.5 shrink-0" aria-hidden />
          Mock mode · simulation results are MOCK DATA, not NASA evidence · BASS-II table shows real
          repository records
        </p>
      ) : null}
      {catalog?.source === 'snapshot' && !mock ? (
        <p className="border-b border-subtle bg-panel px-4 py-1.5 text-center text-xs text-secondary">
          Live API unreachable for materials and experiments; showing the repository snapshot of BASS-II
          records.
        </p>
      ) : null}

      <div className="grid min-h-0 flex-1 gap-3 p-3 lg:grid-cols-[minmax(var(--console-left-min),var(--console-left-max))_minmax(0,1fr)_minmax(var(--console-right-min),var(--console-right-max))]">
        {/* Left: Mission Controls */}
        <aside aria-label="Mission controls" className="min-h-0 lg:overflow-y-auto">
          {catalogState.status === 'loading' ? (
            <p role="status" className="border border-subtle bg-panel p-4 font-mono text-xs text-secondary">
              Loading materials…
            </p>
          ) : null}
          {catalogState.status === 'error' ? (
            <div role="alert" className="border border-critical bg-panel p-4">
              <p className="text-sm text-critical">Could not load materials and experiments.</p>
              <p className="mt-1 text-xs text-secondary">{catalogState.message}</p>
              <button
                type="button"
                onClick={retryCatalog}
                className="mt-3 inline-flex items-center gap-1.5 border border-subtle px-3 py-1.5 text-xs text-primary"
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
              experiments={catalog.experiments}
              disabled={false}
              running={loading}
              dispatch={dispatch}
              onRun={run}
            />
          ) : null}
        </aside>

        {/* Center: 3D chamber + BASS-II matrix */}
        <div className="grid min-h-0 min-w-0 grid-cols-1 gap-3 lg:grid-rows-[minmax(0,1fr)_minmax(0,1fr)]">
          <FlameChamberPlaceholder
            params={state.result?.simulation_3d ?? null}
            loading={loading}
            stale={stale}
            mock={mock}
          />
          <div className="h-[28rem] min-h-0 min-w-0 lg:h-auto">
            {catalog ? (
              <ExperimentTable
                experiments={catalog.experiments}
                source={catalog.source}
                selectedMaterialId={state.draft.material_id}
                selectedTestId={state.draft.test_id}
                onSelect={(record) => dispatch({ type: 'selectExperiment', record })}
              />
            ) : (
              <div className="h-full border border-subtle bg-panel" />
            )}
          </div>
        </div>

        {/* Right: grounding, telemetry, copilot, citations */}
        <aside aria-label="Results" className="min-h-0 lg:overflow-y-auto">
          <ResultsColumn state={state} stale={stale} mock={mock} onRun={run} />
        </aside>
      </div>
    </div>
  )
}
