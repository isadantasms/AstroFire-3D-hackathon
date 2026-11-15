// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
// Source: NASA PSI, BASS-II (PSI-25), DOI 10.60555/4qc4-de67, CC0-1.0
import { useId, useMemo, useState, type ReactNode } from 'react'
import { Tag } from '../../../components/ConsolePanel'
import { fmt } from '../../../lib/format'
import type { CatalogSource, ExperimentRecord } from '../../../types/catalog'

interface ExperimentTableProps {
  experiments: ExperimentRecord[]
  source: CatalogSource
}

/** Rows shown before "Show all". */
const COLLAPSED_ROWS = 10

/** Read-only BASS-II record table (Research & Data), with a material filter and a collapsed view. */
export function ExperimentTable({ experiments, source }: ExperimentTableProps) {
  const filterId = useId()
  const tableId = useId()
  const [material, setMaterial] = useState('all')
  const [expanded, setExpanded] = useState(false)

  const materials = useMemo(() => {
    const seen = new Map<string, string>()
    for (const r of experiments) if (!seen.has(r.material_id)) seen.set(r.material_id, r.material_name)
    return [...seen.entries()]
  }, [experiments])

  const rows = useMemo(
    () => (material === 'all' ? experiments : experiments.filter((r) => r.material_id === material)),
    [experiments, material],
  )
  const visible = expanded ? rows : rows.slice(0, COLLAPSED_ROWS)

  return (
    <section
      id="experiments"
      aria-labelledby="experiments-title"
      className="border border-subtle bg-panel"
    >
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-subtle px-4 py-2">
        <div className="flex items-center gap-2">
          <h3 id="experiments-title" className="label-mono">
            BASS-II experiment matrix
          </h3>
          <span className="font-mono text-xs text-muted tabular-nums">
            {rows.length}/{experiments.length}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor={filterId} className="sr-only">
            Filter by material
          </label>
          <select
            id={filterId}
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="border border-subtle bg-void px-2 py-1 text-xs text-primary"
          >
            <option value="all">All materials</option>
            {materials.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
          <Tag tone="focus">Observed data · NASA PSI BASS-II</Tag>
          {source === 'snapshot' ? <Tag>Repository snapshot</Tag> : <Tag>Live API</Tag>}
        </div>
      </header>

      <div className="overflow-x-auto">
        <table id={tableId} className="w-full border-collapse text-left text-xs">
          <caption className="sr-only">BASS-II test records from the NASA PSI-25 dataset.</caption>
          <thead className="bg-elevated">
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
            {visible.map((r) => (
              <tr key={r.test_id} className="border-b border-subtle hover:bg-elevated/60">
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
                  <span className="block max-w-40 truncate text-[0.625rem] text-muted" title={`${r.source_table} · PI: ${r.pi_group}`}>
                    {r.source_table.replace('NASA/TM-20210011385 ', '')}
                  </span>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-muted">No BASS-II records for this material.</p>
        ) : null}
      </div>
      {rows.length > COLLAPSED_ROWS ? (
        <div className="border-t border-subtle px-4 py-2">
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls={tableId}
            onClick={() => setExpanded((v) => !v)}
            className="text-xs font-medium text-focus hover:underline"
          >
            {expanded ? 'Show fewer' : `Show all ${rows.length}`}
          </button>
        </div>
      ) : null}
      <p className="border-t border-subtle px-4 py-1.5 text-[0.6875rem] text-muted">
        Source: NASA PSI BASS-II (PSI-25), DOI 10.60555/4qc4-de67, CC0-1.0 · Olson et al., NASA/TM-20210011385{' '}
        <a href="#ref-1" className="text-focus hover:underline">
          [1]
        </a>
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
    <td className={`px-3 py-1.5 whitespace-nowrap text-primary ${mono ? 'font-mono tabular-nums' : ''} ${numeric ? 'text-right' : ''}`}>
      {children}
    </td>
  )
}
