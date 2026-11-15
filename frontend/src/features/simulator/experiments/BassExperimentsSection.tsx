// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { useCallback, useState } from 'react'
import { ChevronDown, Table2 } from 'lucide-react'
import { defaultApiClient, type ApiClient } from '../../../services/api/client'
import { useCatalog } from '../state/useSimulation'
import { ExperimentTable } from './ExperimentTable'
import { SOURCE_LINE } from './source'

/**
 * BASS-II records (live API, or the repository snapshot) for the Documentation page.
 * With `collapsible`, the table starts closed behind "Show table (N records)"; N is the number of
 * records actually loaded, never typed by hand.
 */
export function BassExperimentsSection({
  client = defaultApiClient,
  collapsible = false,
}: {
  client?: ApiClient
  collapsible?: boolean
}) {
  const noop = useCallback(() => {}, [])
  const { catalogState } = useCatalog(client, noop)
  const [open, setOpen] = useState(!collapsible)

  if (catalogState.status === 'error') {
    return (
      <p role="alert" className="border border-critical bg-panel p-4 text-sm text-critical">
        Could not load the BASS-II records.
      </p>
    )
  }
  if (catalogState.status !== 'ready') {
    return (
      <p role="status" className="border border-subtle bg-panel p-4 text-xs text-secondary">
        Loading BASS-II records…
      </p>
    )
  }

  const { experiments, source } = catalogState.catalog
  if (open) {
    return (
      <div>
        <ExperimentTable experiments={experiments} source={source} />
        {collapsible ? (
          <button
            type="button"
            aria-expanded="true"
            onClick={() => setOpen(false)}
            className="mt-3 inline-flex items-center gap-1.5 text-xs text-secondary hover:text-primary"
          >
            <ChevronDown className="size-3.5 rotate-180" aria-hidden />
            Hide table
          </button>
        ) : null}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-subtle bg-panel p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-subtle text-label" aria-hidden>
          <Table2 className="size-4" strokeWidth={1.75} />
        </span>
        <div>
          <p className="text-sm font-medium text-primary">BASS-II experiment matrix</p>
          <p className="mt-1 text-[0.6875rem] leading-relaxed text-muted">{SOURCE_LINE}</p>
        </div>
      </div>
      <button
        type="button"
        aria-expanded="false"
        onClick={() => setOpen(true)}
        className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg border border-subtle px-3.5 py-2 text-xs text-primary transition-colors hover:border-label sm:self-auto"
      >
        <ChevronDown className="size-3.5" aria-hidden />
        Show table ({experiments.length} records)
      </button>
    </div>
  )
}
