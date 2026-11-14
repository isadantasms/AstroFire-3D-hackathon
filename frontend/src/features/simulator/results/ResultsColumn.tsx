// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { useState, type ReactNode } from 'react'
import { AlertTriangle, ChevronRight, ExternalLink, Info, RotateCcw } from 'lucide-react'
import { Tooltip } from '../../../components/Tooltip'
import { GROUNDING } from '../../../content/grounding'
import { fmt } from '../../../lib/format'
import type { SimulationResponse } from '../../../types/contract'
import { isCitationShown, MOCK_TOOLTIP, riskBand, shortCitationId } from './resultHelpers'
import type { SimulationState } from '../state/simulationReducer'

interface ResultsColumnProps {
  state: SimulationState
  stale: boolean
  mock: boolean
  onRun: () => void
}

export function ResultsColumn({ state, stale, mock, onRun }: ResultsColumnProps) {
  const { status, result, error } = state

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex items-center gap-2 px-1 pb-3">
        <h2 className="text-base font-semibold text-primary">Results</h2>
        {mock ? (
          <Tooltip label={MOCK_TOOLTIP} align="start" side="bottom" focusable>
            {(id) => (
              <span
                data-testid="mock-badge"
                aria-describedby={id}
                className="rounded-md border border-warning/70 px-1.5 py-0.5 font-mono text-[0.625rem] tracking-[0.1em] text-warning"
              >
                MOCK DATA
              </span>
            )}
          </Tooltip>
        ) : null}
      </header>

      <div className="relative flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1 pb-2" aria-live="polite">
        {status === 'error' && error ? <ErrorPanel message={error.message} details={error.details} onRetry={onRun} /> : null}
        {status === 'loading' && !result ? <LoadingPanel /> : null}
        {status === 'idle' && !result ? <EmptyState /> : null}

        {result ? (
          <>
            {stale ? <StaleBanner onRun={onRun} /> : null}
            <div
              data-testid="results"
              className={`flex flex-col gap-3 transition-opacity ${stale || status === 'loading' ? 'opacity-50' : ''}`}
            >
              <ResultPanels result={result} />
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

function Card({ title, aside, children, testId }: { title: string; aside?: ReactNode; children: ReactNode; testId?: string }) {
  const id = `card-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
  return (
    <section aria-labelledby={id} data-testid={testId} className="rounded-xl border border-subtle bg-panel/88 p-4">
      <header className="mb-3 flex items-center justify-between gap-2">
        <h3 id={id} className="text-sm font-semibold text-primary">
          {title}
        </h3>
        {aside}
      </header>
      {children}
    </section>
  )
}

function ResultPanels({ result }: { result: SimulationResponse }) {
  const { telemetry, safety_copilot: copilot } = result
  const estimate = result.suppression_estimate
  const citations = result.nasa_citations.filter(isCitationShown)

  return (
    <>
      <Card title="Risk" aside={<GroundingBadge status={result.grounding_status} />}>
        <RiskGauge score={telemetry.flammability_score} label={telemetry.risk_label} />
      </Card>

      <Card title="Telemetry">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
          <Metric label="Burn rate" value={fmt(result.simulation_3d.burn_rate_mm_s, 2)} unit="mm/s" />
          <Metric label="O₂ limit" value={fmt(telemetry.oxygen_limit_pct, 1)} unit="%" />
          <Metric label="CO" value={fmt(telemetry.co_ppm, 0)} unit="ppm" />
          <Metric label="CO₂" value={fmt(telemetry.co2_pct, 1)} unit="%" />
        </dl>
      </Card>

      <Card
        title="ISS FWM PFE suppression sizing"
        testId="suppression-card"
        aside={<span className="rounded-md border border-focus/70 px-1.5 py-0.5 text-[0.6875rem] text-focus">Estimated</span>}
      >
        {estimate ? null : (
          <p className="mb-3 flex items-center gap-2 text-xs text-secondary" data-testid="suppression-awaiting">
            <Info className="size-3.5 shrink-0 text-muted" aria-hidden />
            Awaiting suppression estimate from engine
          </p>
        )}
        <dl className={`grid grid-cols-2 gap-x-4 gap-y-3 ${estimate ? '' : 'opacity-60'}`}>
          <Metric label="Mist volume" value={fmt(estimate?.estimated_mist_volume_ml, 0)} unit="mL" />
          <Metric label="Discharge time" value={fmt(estimate?.estimated_discharge_seconds, 1)} unit="s" />
          <Metric label="Tank used" value={fmt(estimate?.tank_capacity_used_pct, 1)} unit="%" />
          <Metric label="Cooling efficiency" value={fmt(estimate?.cooling_efficiency_pct, 0)} unit="%" />
        </dl>
        {estimate ? <p className="mt-3 text-xs leading-relaxed text-muted">{estimate.confined_rack_note}</p> : null}
      </Card>

      <Card
        title="SI copilot"
        aside={
          <span data-testid="si-generated" className="rounded-md border border-subtle px-1.5 py-0.5 text-[0.6875rem] text-label">
            SI-generated
          </span>
        }
      >
        <Diagnosis text={copilot.diagnosis} />
        <div className="mt-4 rounded-lg border-l-2 border-warning/80 bg-void/60 px-3 py-2.5" data-testid="suppression-guidance">
          <p className="text-[0.6875rem] text-warning">Research guidance, not an operational procedure</p>
          <p className="mt-1.5 text-sm leading-relaxed text-primary">{copilot.suppression_action}</p>
        </div>
        <details className="group mt-3">
          <summary className="flex cursor-pointer list-none items-center gap-1 text-xs text-secondary hover:text-primary">
            <ChevronRight className="size-3.5 transition-transform group-open:rotate-90" aria-hidden />
            Scientific limitations
          </summary>
          <p className="mt-2 text-xs leading-relaxed text-secondary">{copilot.scientific_limitations}</p>
        </details>
      </Card>

      <OnEarth text={copilot.terrestrial_spinoff} />

      <section aria-labelledby="sources-title" className="px-1">
        <h3 id="sources-title" className="flex items-baseline gap-2 text-sm font-semibold text-primary">
          Sources
          <span className="font-mono text-xs font-normal text-muted tabular-nums">{citations.length}</span>
        </h3>
        <ul className="mt-2 divide-y divide-subtle">
          {citations.map((c) => (
            <li key={c.id}>
              <details className="group py-2">
                <summary className="flex cursor-pointer list-none items-start gap-2 text-xs">
                  <ChevronRight className="mt-0.5 size-3.5 shrink-0 text-muted transition-transform group-open:rotate-90" aria-hidden />
                  <span className="shrink-0 font-mono text-focus">{shortCitationId(c.id)}</span>
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noreferrer"
                    className="min-w-0 flex-1 text-secondary underline-offset-2 hover:text-primary hover:underline"
                  >
                    {c.title}
                    <ExternalLink className="ml-1 inline size-3 align-[-1px] text-muted" aria-hidden />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </summary>
                <p className="mt-1.5 pl-5.5 text-xs leading-relaxed text-muted">{c.finding}</p>
              </details>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

function GroundingBadge({ status }: { status: SimulationResponse['grounding_status'] }) {
  const g = GROUNDING[status]
  return (
    <span
      data-testid="grounding-badge"
      title={g.summary}
      className={`rounded-md border px-1.5 py-0.5 text-[0.6875rem] whitespace-nowrap ${g.tone}`}
    >
      {g.badge}
    </span>
  )
}

const BAND_TONE = {
  nominal: { text: 'text-nominal', bar: 'bg-nominal' },
  warning: { text: 'text-warning', bar: 'bg-warning' },
  critical: { text: 'text-critical', bar: 'bg-critical' },
}

function RiskGauge({ score, label }: { score: number; label: string }) {
  const tone = BAND_TONE[riskBand(score)]
  return (
    <div data-testid="risk-gauge">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-mono text-4xl leading-none text-primary tabular-nums">
          {score}
          <span className="ml-1 text-sm text-muted">/100</span>
        </p>
        <p className={`text-right text-sm font-medium ${tone.text}`}>{label}</p>
      </div>
      <div
        className="relative mt-3 h-1.5 w-full overflow-hidden rounded-full"
        role="meter"
        aria-label="Flammability score"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={score}
        aria-valuetext={`${score} of 100, ${label}`}
      >
        <div className="absolute inset-0 flex gap-px opacity-25">
          <span className="h-full bg-nominal" style={{ width: '35%' }} />
          <span className="h-full bg-warning" style={{ width: '35%' }} />
          <span className="h-full flex-1 bg-critical" />
        </div>
        <span className={`absolute inset-y-0 left-0 rounded-full ${tone.bar}`} style={{ width: `${score}%` }} />
      </div>
      <div className="mt-1 flex justify-between font-mono text-[0.625rem] text-muted tabular-nums">
        <span>0</span>
        <span>35</span>
        <span>70</span>
        <span>100</span>
      </div>
      <p className="mt-2 text-[0.6875rem] text-muted">Flammability score. Research indicator, not a certified safety assessment.</p>
    </div>
  )
}

function Metric({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-0.5 font-mono text-lg text-primary tabular-nums">
        {value}
        <span className="ml-1 text-xs text-secondary">{unit}</span>
      </dd>
    </div>
  )
}

function Diagnosis({ text }: { text: string }) {
  const [open, setOpen] = useState(false)
  const long = text.length > 140
  return (
    <div>
      <p className="text-xs text-muted">Diagnosis</p>
      <p data-testid="diagnosis" className={`mt-1 text-sm leading-relaxed text-primary ${open || !long ? '' : 'line-clamp-3'}`}>
        {text}
      </p>
      {long ? (
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="mt-1 text-xs text-focus hover:underline"
        >
          {open ? 'Show less' : 'Read more'}
        </button>
      ) : null}
    </div>
  )
}

function OnEarth({ text }: { text: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex items-start gap-2 px-1 text-xs" data-testid="on-earth">
      <span className="shrink-0 font-medium text-primary">On Earth</span>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        title={open ? undefined : text}
        className={`min-w-0 flex-1 text-left text-secondary hover:text-primary ${open ? '' : 'truncate'}`}
      >
        {text}
      </button>
    </div>
  )
}

function StaleBanner({ onRun }: { onRun: () => void }) {
  return (
    <div data-testid="stale-banner" className="flex items-center justify-between gap-3 rounded-lg border border-warning/60 px-3 py-2">
      <p className="flex gap-2 text-xs text-warning">
        <Info className="mt-px size-3.5 shrink-0" aria-hidden />
        Controls changed. Results reflect the previous run.
      </p>
      <button
        type="button"
        onClick={onRun}
        className="shrink-0 rounded-md border border-warning/80 px-2 py-0.5 text-xs text-warning hover:bg-warning hover:text-void"
      >
        Re-run
      </button>
    </div>
  )
}

function EmptyState() {
  const steps = ['Pick a scenario', 'Run', 'Discharge the extinguisher']
  return (
    <div data-testid="results-empty" className="rounded-xl border border-dashed border-subtle p-5">
      <p className="text-sm text-primary">No results yet.</p>
      <ol className="mt-4 space-y-3">
        {steps.map((step, i) => (
          <li key={step} className="flex items-center gap-3 text-sm text-secondary">
            <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-subtle font-mono text-[0.6875rem] text-muted">
              {i + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>
    </div>
  )
}

function LoadingPanel() {
  return (
    <div role="status" data-testid="results-loading" className="flex flex-col gap-3">
      <p className="px-1 text-xs text-secondary">Running simulation…</p>
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-20 animate-pulse rounded-xl bg-panel" />
      ))}
    </div>
  )
}

function ErrorPanel({ message, details, onRetry }: { message: string; details: string[]; onRetry: () => void }) {
  return (
    <div role="alert" data-testid="results-error" className="rounded-xl border border-critical/70 bg-panel p-4">
      <p className="flex items-center gap-2 text-sm font-medium text-critical">
        <AlertTriangle className="size-4" aria-hidden />
        Simulation failed
      </p>
      <p className="mt-2 text-xs leading-relaxed text-secondary">{message}</p>
      {details.length > 0 ? (
        <ul className="mt-2 list-inside list-disc font-mono text-[0.6875rem] text-muted">
          {details.slice(0, 5).map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      ) : null}
      <button
        type="button"
        onClick={onRetry}
        className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-subtle px-3 py-1.5 text-xs text-primary hover:border-secondary"
      >
        <RotateCcw className="size-3.5" aria-hidden />
        Retry
      </button>
    </div>
  )
}
