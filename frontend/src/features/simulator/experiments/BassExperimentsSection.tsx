// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { useCallback } from 'react'
import { defaultApiClient, type ApiClient } from '../../../services/api/client'
import { useCatalog } from '../state/useSimulation'
import { ExperimentTable } from './ExperimentTable'

/** BASS-II records (live API, or the repository snapshot) for the Research & Data page. */
export function BassExperimentsSection({ client = defaultApiClient }: { client?: ApiClient }) {
  const noop = useCallback(() => {}, [])
  const { catalogState } = useCatalog(client, noop)

  return (
    <div>
      {catalogState.status === 'ready' ? (
        <ExperimentTable experiments={catalogState.catalog.experiments} source={catalogState.catalog.source} />
      ) : catalogState.status === 'error' ? (
        <p role="alert" className="border border-critical bg-panel p-4 text-sm text-critical">
          Could not load the BASS-II records.
        </p>
      ) : (
        <p role="status" className="border border-subtle bg-panel p-4 text-xs text-secondary">
          Loading BASS-II records…
        </p>
      )}
    </div>
  )
}
