// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Download, ExternalLink, X } from 'lucide-react'
import { fmt } from '../../../lib/format'
import { CHART_THEMES, flameSchematic, regimeMap, riskBarChart, type Chart } from './reportCharts'
import { figureCaptions, KPI_INTRO, SECTION_INTRO, SECTION_TITLES } from './reportCopy'
import {
  DISCLAIMER,
  formatDateTime,
  GUIDANCE_NOTE,
  PROVENANCE,
  SI_NOTE,
  SIZING_AWAITING,
  type Kpi,
  type MetricRow,
  type ReportModel,
  type ValueRow,
} from './reportModel'

interface ReportPanelProps {
  report: ReportModel
  onClose: () => void
  onDownload: () => void
  downloading: boolean
  downloadError: string | null
}

/**
 * Wide side panel (~60% of the screen) with the detailed scenario report, dark theme.
 * Same content and order as the PDF (ReportPdf.tsx). Closes with Esc, X or the backdrop.
 */
export function ReportPanel({ report, onClose, onDownload, downloading, downloadError }: ReportPanelProps) {
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement | null>(null)
  const captions = figureCaptions(report)

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

  const [s1, s2, s3, s4, s5, s6, s7, s8, s9] = SECTION_TITLES

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
              <p className="mt-0.5 text-sm text-secondary">{report.subtitle}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
                <span className="font-mono break-all text-secondary">{report.scenarioId}</span>
                <span aria-hidden>·</span>
                <span className="font-mono tabular-nums">{formatDateTime(report.generatedAt)}</span>
                <span aria-hidden>·</span>
                <span className={report.mock ? 'text-warning' : 'text-secondary'}>{report.mode}</span>
                {report.mockNote ? <span data-testid="report-mock-note">· {report.mockNote}</span> : null}
              </div>
              <p className="mt-1 text-[0.6875rem] text-muted" data-testid="report-provenance">
                {PROVENANCE}
              </p>
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
          <div className="mx-auto max-w-3xl space-y-9 text-sm leading-relaxed text-secondary">
            <section aria-labelledby="report-abstract" className="rounded-xl border border-subtle bg-panel/70 p-4">
              <h3 id="report-abstract" className="text-sm font-semibold text-primary">
                Abstract
              </h3>
              <p className="mt-2">{report.abstract}</p>
            </section>

            <section aria-label="Key indicators">
              <p className="mb-3 text-xs text-muted">{KPI_INTRO}</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" data-testid="report-kpis">
                {report.kpis.map((k) => (
                  <KpiCard key={k.label} kpi={k} />
                ))}
              </div>
            </section>

            <ReportSection n={1} title={s1}>
              <ValueTable rows={report.parameters} />
            </ReportSection>

            <ReportSection n={2} title={s2}>
              <MetricTable rows={report.telemetry} />
              <Figure chart={riskBarChart(report.score)} caption={captions.riskBar} maxWidth="max-w-lg" />
            </ReportSection>

            <ReportSection n={3} title={s3}>
              <p>{report.flame.text}</p>
              <Figure chart={flameSchematic(report.flame)} caption={captions.schematic} />
            </ReportSection>

            <ReportSection n={4} title={s4}>
              <Figure chart={regimeMap(report.regime)} caption={captions.regime} />
            </ReportSection>

            <ReportSection n={5} title={s5}>
              <p className="mb-3">{report.neighbors.note}</p>
              <DataTable
                headers={['Test', 'Material', 'O₂ %', 'Airflow cm/s', 'Thickness mm', 'Burn rate mm/s', 'Outcome']}
                numeric={[2, 3, 4, 5]}
                rows={report.neighbors.rows.map((r) => [
                  r.test_id,
                  r.material_name,
                  fmt(r.initial_o2_pct, 1),
                  fmt(r.airflow_cm_s, 1),
                  fmt(r.thickness_mm, 2),
                  fmt(r.spread_rate_mm_s, 3),
                  r.outcome,
                ])}
              />
            </ReportSection>

            <ReportSection n={6} title={s6}>
              <p>
                {report.interpretation} <Cite text={report.cite} />
              </p>
            </ReportSection>

            <ReportSection n={7} title={s7}>
              <p>
                {report.suppression.action} <Cite text={report.cite} />
              </p>
              {report.suppression.sizing ? (
                <>
                  <h4 className="mt-4 text-xs font-medium text-primary">ISS water-mist extinguisher sizing (engine estimate)</h4>
                  <MetricTable rows={report.suppression.sizing} />
                  {report.suppression.note ? <p className="mt-2 text-xs text-muted">{report.suppression.note}</p> : null}
                </>
              ) : (
                <p className="mt-3 text-xs text-muted" data-testid="report-sizing-awaiting">
                  {SIZING_AWAITING}
                </p>
              )}
              <p className="mt-3 text-xs text-warning">{GUIDANCE_NOTE}</p>
            </ReportSection>

            <ReportSection n={8} title={s8}>
              <p>{report.terrestrial}</p>
            </ReportSection>

            <ReportSection n={9} title={s9}>
              <p>
                {report.limitations} <Cite text={report.cite} />
              </p>
              <p className="mt-3">
                <span className="text-primary">Data grounding: {report.groundingLabel}.</span> {report.groundingMeaning}
              </p>
            </ReportSection>

            <section aria-labelledby="report-references">
              <h3 id="report-references" className="text-base font-semibold text-primary">
                References
              </h3>
              <ol className="mt-3 space-y-3">
                {report.references.map((r) => (
                  <li key={r.n} className="flex gap-3">
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
              <p>{DISCLAIMER}</p>
            </footer>
          </div>
        </article>
      </div>
    </div>,
    document.body,
  )
}

const KPI_TONE: Record<Kpi['tone'], string> = {
  nominal: 'text-nominal',
  warning: 'text-warning',
  critical: 'text-critical',
  neutral: 'text-primary',
}

function KpiCard({ kpi }: { kpi: Kpi }) {
  const long = kpi.value.length > 12
  return (
    <div className="rounded-xl border border-subtle bg-panel/70 p-3.5">
      <p className="flex items-center justify-between gap-2 text-xs text-muted">
        {kpi.label}
        {kpi.tag ? <span className="rounded border border-subtle px-1 font-mono text-[0.625rem] text-label">{kpi.tag}</span> : null}
      </p>
      <p className={`mt-1.5 ${long ? 'text-sm leading-snug font-medium' : 'font-mono text-2xl tabular-nums'} ${KPI_TONE[kpi.tone]}`}>
        {kpi.value}
        {kpi.unit ? <span className="ml-1 font-mono text-xs text-secondary">{kpi.unit}</span> : null}
      </p>
      <p className="mt-1 text-[0.6875rem] leading-snug text-muted">{kpi.detail}</p>
    </div>
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
      <p className="mt-1 text-xs text-muted">{SECTION_INTRO[title as keyof typeof SECTION_INTRO]}</p>
      <div className="mt-3">{children}</div>
    </section>
  )
}

function Cite({ text }: { text: string }) {
  if (!text) return null
  return <span className="font-mono text-xs text-focus">{text}</span>
}

const NUMERIC = /^[+−-]?[0-9.]+$/

/** Numbers in mono, right-aligned; text cells in a numeric column stay in the UI font. */
function DataTable({ headers, rows, numeric = [] }: { headers: string[]; rows: string[][]; numeric?: number[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-subtle">
      <table className="w-full border-collapse text-left text-xs">
        <thead className="bg-elevated text-muted">
          <tr>
            {headers.map((h, i) => (
              <th key={h} scope="col" className={`px-3 py-2 font-medium whitespace-nowrap ${numeric.includes(i) ? 'text-right' : ''}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-t border-subtle">
              {row.map((cell, i) => (
                <td
                  key={i}
                  className={`px-3 py-2 align-top ${i === 0 ? 'text-primary' : ''} ${numeric.includes(i) && NUMERIC.test(cell) ? 'text-right font-mono tabular-nums' : ''}`}
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

function ValueTable({ rows }: { rows: ValueRow[] }) {
  return <DataTable headers={['Parameter', 'Value', 'Unit']} numeric={[1]} rows={rows.map((r) => [r.label, r.value, r.unit])} />
}

function MetricTable({ rows }: { rows: MetricRow[] }) {
  return (
    <DataTable
      headers={['Metric', 'Value', 'Unit', 'What it means']}
      numeric={[1]}
      rows={rows.map((r) => [r.label, r.value, r.unit, r.meaning])}
    />
  )
}

function Figure({ chart, caption, maxWidth = 'max-w-xl' }: { chart: Chart; caption: string; maxWidth?: string }) {
  return (
    <figure className="mt-4">
      <ChartSvg chart={chart} className={`w-full ${maxWidth}`} />
      <figcaption className="mt-2 text-xs text-muted">{caption}</figcaption>
    </figure>
  )
}

/** Draws a chart's shapes as inline SVG (dark theme). */
function ChartSvg({ chart, className }: { chart: Chart; className?: string }) {
  const c = CHART_THEMES.dark
  return (
    <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className={className} role="img" aria-label={chart.label}>
      {chart.shapes.map((s, i) => {
        switch (s.kind) {
          case 'rect':
            return (
              <rect
                key={i}
                x={s.x}
                y={s.y}
                width={Math.max(0, s.w)}
                height={Math.max(0, s.h)}
                rx={s.rx}
                fill={c[s.fill]}
                fillOpacity={s.opacity}
                stroke={s.stroke ? c[s.stroke] : undefined}
              />
            )
          case 'line':
            return <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={c[s.stroke]} strokeWidth={s.width ?? 1} strokeDasharray={s.dash} />
          case 'circle':
            return (
              <circle
                key={i}
                cx={s.cx}
                cy={s.cy}
                r={s.r}
                fill={s.fill ? c[s.fill] : 'none'}
                fillOpacity={s.opacity}
                stroke={s.stroke ? c[s.stroke] : undefined}
                strokeWidth={s.width}
                strokeDasharray={s.dash}
              />
            )
          case 'path':
            return (
              <path key={i} d={s.d} fill={s.fill ? c[s.fill] : 'none'} fillOpacity={s.opacity} stroke={s.stroke ? c[s.stroke] : undefined} strokeWidth={s.width} />
            )
          case 'text':
            return (
              <text
                key={i}
                x={s.x}
                y={s.y}
                fontSize={s.size}
                fill={c[s.fill]}
                textAnchor={s.anchor ?? 'start'}
                fontWeight={s.bold ? 600 : 400}
                fontFamily="IBM Plex Sans, sans-serif"
              >
                {s.text}
              </text>
            )
        }
      })}
    </svg>
  )
}
