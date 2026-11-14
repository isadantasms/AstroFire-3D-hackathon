// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
// Source: NASA PSI, BASS-II (PSI-25), DOI 10.60555/4qc4-de67, CC0-1.0
import { useMemo, useState, type ReactNode } from 'react'
import { Tag } from '../../../components/ConsolePanel'
import { fmt } from '../../../lib/format'
import type { CatalogSource, ExperimentRecord } from '../../../types/catalog'

interface ExperimentTableProps {
  experiments: ExperimentRecord[]
  source: CatalogSource
  selectedMaterialId: string
  selectedTestId: string | null
  onSelect: (record: ExperimentRecord) => void
}

export function ExperimentTable({
  experiments,
  source,
  selectedMaterialId,
  selectedTestId,
  onSelect,
}: ExperimentTableProps) {
  const [onlySelectedMaterial, setOnlySelectedMaterial] = useState(false)

  const rows = useMemo(
    () => (onlySelectedMaterial ? experiments.filter((r) => r.material_id === selectedMaterialId) : experiments),
    [experiments, onlySelectedMaterial, selectedMaterialId],
  )

  return (
    <section
      id="experiments"
      aria-labelledby="experiments-title"
      className="flex h-full min-h-0 flex-col border border-subtle bg-panel"
    >
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-subtle px-4 py-2">
        <div className="flex items-center gap-2">
          <h2 id="experiments-title" className="label-mono">
            BASS-II experiment matrix
          </h2>
          <span className="font-mono text-xs text-muted">
            {rows.length}/{experiments.length}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-1.5 text-xs whitespace-nowrap text-secondary">
            <input
              type="checkbox"
              checked={onlySelectedMaterial}
              onChange={(e) => setOnlySelectedMaterial(e.target.checked)}
              className="accent-[var(--border-focus)]"
            />
            Selected material only
          </label>
          <Tag tone="focus">Observed · NASA BASS-II</Tag>
          {source === 'snapshot' ? <Tag>Repository snapshot</Tag> : <Tag>Live API</Tag>}
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full border-collapse text-left text-xs">
          <caption className="sr-only">
            BASS-II test records. Select a row to load its conditions into the mission controls.
          </caption>
          <thead className="sticky top-0 z-10 bg-elevated">
            <tr className="text-secondary">
              <Th>Test ID</Th>
              <Th>Material</Th>
              <Th numeric>Thick. mm</Th>
              <Th numeric>Flow cm/s</Th>
              <Th numeric>O2 %</Th>
              <Th numeric>Spread mm/s</Th>
              <Th>Outcome</Th>
              <Th>Source</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const selected = r.test_id === selectedTestId
              return (
                <tr
                  key={r.test_id}
                  tabIndex={0}
                  aria-selected={selected}
                  onClick={() => onSelect(r)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onSelect(r)
                    }
                  }}
                  className={`cursor-pointer border-b border-subtle transition-colors outline-none focus-visible:bg-elevated focus-visible:shadow-[inset_2px_0_0_var(--border-focus)] ${
                    selected ? 'bg-elevated shadow-[inset_2px_0_0_var(--border-focus)]' : 'hover:bg-elevated/60'
                  }`}
                >
                  <Td mono>{r.test_id}</Td>
                  <Td>
                    <span className="block max-w-48 truncate" title={r.material_name}>
                      {r.material_name}
                    </span>
                  </Td>
                  <Td mono numeric>{fmt(r.thickness_mm, 2)}</Td>
                  <Td mono numeric>{fmt(r.airflow_cm_s, 1)}</Td>
                  <Td mono numeric>{fmt(r.initial_o2_pct, 1)}</Td>
                  <Td mono numeric>
                    {r.spread_rate_mm_s === null ? (
                      <span title="Not reported in this record">—</span>
                    ) : (
                      fmt(r.spread_rate_mm_s, 3)
                    )}
                  </Td>
                  <Td>
                    <span className="block max-w-56 truncate" title={r.notes}>
                      {r.outcome}
                    </span>
                  </Td>
                  <Td>
                    <span className="block max-w-40 truncate text-muted" title={`${r.source_table} · PI: ${r.pi_group}`}>
                      {r.source_table.replace('NASA/TM-20210011385 ', '')}
                    </span>
                  </Td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {rows.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-muted">No BASS-II records for this material.</p>
        ) : null}
      </div>
      <p className="border-t border-subtle px-4 py-1.5 text-[0.6875rem] text-muted">
        Source: NASA PSI BASS-II (PSI-25), DOI 10.60555/4qc4-de67, CC0-1.0 · tables from NASA/TM-20210011385.
        Select a row to load its conditions; then run the simulation.
      </p>
    </section>
  )
}

function Th({ children, numeric }: { children: ReactNode; numeric?: boolean }) {
  return (
    <th scope="col" className={`border-b border-subtle px-3 py-2 font-mono text-[0.625rem] font-medium tracking-[0.08em] whitespace-nowrap uppercase ${numeric ? 'text-right' : ''}`}>
      {children}
    </th>
  )
}

function Td({ children, mono, numeric }: { children: ReactNode; mono?: boolean; numeric?: boolean }) {
  return (
    <td className={`px-3 py-1.5 whitespace-nowrap text-primary ${mono ? 'font-mono' : ''} ${numeric ? 'text-right' : ''}`}>
      {children}
    </td>
  )
}
