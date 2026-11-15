// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Download, ExternalLink, X } from 'lucide-react'
import { FIGURE_VIEWBOX, flameFigure } from './flameFigure'
import {
  DISCLAIMER,
  FIGURE_CAPTION,
  formatDateTime,
  GUIDANCE_NOTE,
  NOT_AVAILABLE,
  SI_NOTE,
  type MetricRow,
  type ReportModel,
} from './reportModel'
import { GROUNDING } from '../../../content/grounding'

interface ReportPanelProps {
  report: ReportModel
  onClose: () => void
  onDownload: () => void
  downloading: boolean
  downloadError: string | null
}

/** Wide side panel (~60% of the screen) with the detailed scenario report. Closes with Esc or X. */
export function ReportPanel({ report, onClose, onDownload, downloading, downloadError }: ReportPanelProps) {
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      previous?.focus()
    }
  }, [onClose])

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end">
      <div data-testid="report-backdrop" className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex h-full w-full flex-col border-l border-subtle bg-hero shadow-2xl lg:w-[60vw]"
      >
        <header className="shrink-0 border-b border-subtle px-5 py-4 sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 id={titleId} className="text-lg font-semibold text-primary">
                {report.title}
              </h2>
              <p className="mt-1 font-mono text-xs break-all text-secondary">{report.scenarioId}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
                <span className="font-mono tabular-nums">{formatDateTime(report.generatedAt)}</span>
                <span aria-hidden>·</span>
                <span className={report.mock ? 'text-warning' : 'text-secondary'}>{report.mode}</span>
                <span
                  data-testid="report-grounding"
                  title={report.grounding.summary}
                  className={`rounded-md border px-1.5 py-0.5 text-[0.6875rem] ${GROUNDING[report.grounding.status].tone}`}
                >
                  {report.grounding.badge}
                </span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={onDownload}
                disabled={downloading}
                className="inline-flex items-center gap-1.5 rounded-lg border border-subtle px-3 py-1.5 text-xs text-primary transition-colors hover:border-label disabled:cursor-wait disabled:opacity-60"
              >
                <Download className="size-3.5" aria-hidden />
                {downloading ? 'Preparing PDF…' : 'Download PDF'}
              </button>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close report"
                className="rounded-lg border border-subtle p-1.5 text-secondary transition-colors hover:text-primary"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
          </div>
          {downloadError ? (
            <p role="alert" className="mt-2 text-xs text-critical">
              {downloadError}
            </p>
          ) : null}
        </header>

        <article data-testid="report-body" className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8">
          <div className="mx-auto max-w-3xl space-y-8 text-sm leading-relaxed text-secondary">
            <p className="text-base text-primary">{report.subtitle}</p>

            <section aria-labelledby="report-abstract" className="rounded-xl border border-subtle bg-panel/70 p-4">
              <h3 id="report-abstract" className="text-sm font-semibold text-primary">
                Abstract
              </h3>
              <p className="mt-2">{report.abstract}</p>
            </section>

            <ReportSection n={1} title="Scenario parameters">
              <DataTable
                headers={['Parameter', 'Value', 'Unit']}
                rows={report.parameters.map((r) => [r.label, r.value, r.unit || '—'])}
                monoColumns={[2]}
              />
            </ReportSection>

            <ReportSection n={2} title="Flammability telemetry">
              <MetricTable rows={report.telemetry} />
            </ReportSection>

            <ReportSection n={3} title="Flame behavior">
              <p>{report.flame.text}</p>
              <FlameFigureSvg report={report} />
            </ReportSection>

            <ReportSection n={4} title="Interpretation">
              <p>
                {report.interpretation} <Cite text={report.cite} />
              </p>
            </ReportSection>

            <ReportSection n={5} title="Suppression">
              <p>
                {report.suppression.action} <Cite text={report.cite} />
              </p>
              {report.suppression.sizing ? (
                <>
                  <h4 className="mt-4 text-xs font-medium text-primary">ISS FWM PFE suppression sizing</h4>
                  <MetricTable rows={report.suppression.sizing} />
                  {report.suppression.note ? <p className="mt-2 text-xs text-muted">{report.suppression.note}</p> : null}
                </>
              ) : (
                <p className="mt-3 text-xs text-muted" data-testid="report-sizing-unavailable">
                  Suppression sizing: {NOT_AVAILABLE}.
                </p>
              )}
              <p className="mt-3 text-xs text-warning">{GUIDANCE_NOTE}</p>
            </ReportSection>

            <ReportSection n={6} title="Terrestrial applications">
              <p>{report.terrestrial}</p>
            </ReportSection>

            <ReportSection n={7} title="Limitations and data grounding">
              <p>
                {report.limitations} <Cite text={report.cite} />
              </p>
              <p className="mt-3">
                <span className="text-primary">Grounding status: {report.grounding.label}.</span> {report.grounding.summary}
              </p>
            </ReportSection>

            <section aria-labelledby="report-references">
              <h3 id="report-references" className="text-base font-semibold text-primary">
                References
              </h3>
              {report.references.length === 0 ? <p className="mt-2">{NOT_AVAILABLE}.</p> : null}
              <ol className="mt-3 space-y-3">
                {report.references.map((r) => (
                  <li key={r.n} id={`report-ref-${r.n}`} className="flex gap-3">
                    <span className="shrink-0 font-mono text-xs text-muted tabular-nums">[{r.n}]</span>
                    <div className="min-w-0">
                      <p>
                        <span className="text-primary">{r.id}.</span> {r.title}.{' '}
                        <a href={r.url} target="_blank" rel="noreferrer" className="text-focus [overflow-wrap:anywhere] hover:underline">
                          {r.url}
                          <ExternalLink className="ml-1 inline size-3 align-[-1px]" aria-hidden />
                          <span className="sr-only">(opens in a new tab)</span>
                        </a>
                      </p>
                      <p className="mt-1 text-xs text-muted">{r.finding}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <footer className="space-y-1 border-t border-subtle pt-4 text-xs text-muted">
              <p>{SI_NOTE}</p>
              <p className="text-secondary">{DISCLAIMER}</p>
            </footer>
          </div>
        </article>
      </div>
    </div>,
    document.body,
  )
}

function ReportSection({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  const id = `report-section-${n}`
  return (
    <section aria-labelledby={id}>
      <h3 id={id} className="flex gap-2 text-base font-semibold text-primary">
        <span className="font-mono text-brand">{n}.</span>
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </section>
  )
}

function Cite({ text }: { text: string }) {
  if (!text) return null
  return <span className="font-mono text-xs text-focus">{text}</span>
}

/** Numbers and units are set in mono; text values stay in the UI font. */
const NUMERIC = /^-?[0-9.]+$/

function DataTable({ headers, rows, monoColumns = [] }: { headers: string[]; rows: string[][]; monoColumns?: number[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-subtle">
      <table className="w-full border-collapse text-left text-xs">
        <thead className="bg-elevated text-muted">
          <tr>
            {headers.map((h) => (
              <th key={h} scope="col" className="px-3 py-2 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]} className="border-t border-subtle">
              {row.map((cell, i) => (
                <td
                  key={i}
                  className={`px-3 py-2 align-top ${i === 0 ? 'text-primary' : ''} ${monoColumns.includes(i) || NUMERIC.test(cell) ? 'font-mono tabular-nums' : ''}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function MetricTable({ rows }: { rows: MetricRow[] }) {
  return (
    <DataTable
      headers={['Metric', 'Value', 'Unit', 'What it means']}
      rows={rows.map((r) => [r.label, r.value, r.unit || '—', r.meaning])}
      monoColumns={[2]}
    />
  )
}

function FlameFigureSvg({ report }: { report: ReportModel }) {
  const fig = flameFigure(report.flame.simulation)
  const { width, height } = FIGURE_VIEWBOX
  return (
    <figure className="mt-4">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full max-w-xl rounded-lg border border-subtle bg-void"
        role="img"
        aria-label={`${fig.label}, illustrative`}
      >
        {fig.flame ? (
          <>
            <path d={fig.flame.outer} fill={fig.flame.color} fillOpacity={fig.flame.opacity * 0.55} />
            <path d={fig.flame.inner} fill={fig.flame.color} fillOpacity={fig.flame.opacity} />
          </>
        ) : null}
        {fig.ghost ? (
          <circle cx={fig.ghost.cx} cy={fig.ghost.cy} r={fig.ghost.r} fill="none" stroke="#5B6577" strokeDasharray="4 3" />
        ) : null}
        <rect x={fig.sample.x} y={fig.sample.y} width={fig.sample.width} height={fig.sample.height} fill="#9AA8BD" />
      </svg>
      <figcaption className="mt-2 text-xs text-muted">
        {FIGURE_CAPTION} {fig.label}.
      </figcaption>
    </figure>
  )
}
