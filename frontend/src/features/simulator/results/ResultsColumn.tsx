// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { AlertTriangle, BadgeCheck, ExternalLink, Info, RotateCcw } from 'lucide-react'
import { Link } from 'react-router'
import { ConsolePanel, Tag } from '../../../components/ConsolePanel'
import { GROUNDING } from '../../../content/grounding'
import { LINKS } from '../../../app/routes'
import { fmt } from '../../../lib/format'
import type { RiskLabel, SimulationResponse } from '../../../types/contract'
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
    <div className="flex flex-col gap-3" aria-live="polite">
      {status === 'error' && error ? <ErrorPanel message={error.message} details={error.details} onRetry={onRun} /> : null}

      {status === 'loading' && !result ? <LoadingPanel /> : null}

      {status === 'idle' && !result ? <EmptyPanel /> : null}

      {result ? (
        <>
          {stale ? <StaleBanner onRun={onRun} /> : null}
          {status === 'loading' ? (
            <p role="status" className="border border-subtle bg-panel px-3 py-2 font-mono text-xs text-secondary">
              Running simulation…
            </p>
          ) : null}
          <div
            data-testid="results"
            className={`flex flex-col gap-3 transition-opacity ${stale || status === 'loading' ? 'opacity-50' : ''}`}
          >
            {mock ? <MockNotice /> : null}
            <ResultPanels result={result} mock={mock} />
          </div>
        </>
      ) : null}
    </div>
  )
}

function ResultPanels({ result, mock }: { result: SimulationResponse; mock: boolean }) {
  const grounding = GROUNDING[result.grounding_status]
  const { telemetry, safety_copilot: copilot, inputs } = result
  const mockTag = mock ? <Tag tone="warning">Mock data</Tag> : null

  return (
    <>
      {/* Grounding */}
      <ConsolePanel title="Scientific grounding" aside={mockTag}>
        <span
          data-testid="grounding-badge"
          className={`inline-flex items-center gap-1.5 border px-2 py-1 font-mono text-[0.6875rem] tracking-[0.1em] uppercase ${grounding.tone}`}
        >
          <BadgeCheck className="size-3.5" aria-hidden />
          {grounding.label}
        </span>
        <p className="mt-3 text-xs leading-relaxed text-secondary">{copilot.scientific_limitations}</p>
        <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 border-t border-subtle pt-3 text-xs">
          <dt className="text-muted">Scenario</dt>
          <dd className="truncate text-right font-mono text-secondary" title={result.scenario_id}>
            {result.scenario_id}
          </dd>
          <dt className="text-muted">Environment</dt>
          <dd className="text-right text-secondary">{inputs.environment_label}</dd>
          <dt className="text-muted">Run inputs</dt>
          <dd className="text-right font-mono text-secondary">
            {fmt(inputs.gravity_g, 2)} g · {fmt(inputs.o2_pct)} % O2 · {fmt(inputs.airflow_cm_s)} cm/s ·{' '}
            {fmt(inputs.thickness_mm, 2)} mm
          </dd>
        </dl>
      </ConsolePanel>

      {/* Risk + metrics */}
      <ConsolePanel title="Flammability telemetry" aside={mockTag}>
        <RiskGauge score={telemetry.flammability_score} label={telemetry.risk_label} />
        <dl className="mt-4 grid grid-cols-2 gap-px border border-subtle bg-subtle">
          <Metric label="Burn rate" value={fmt(result.simulation_3d.burn_rate_mm_s, 3)} unit="mm/s" />
          <Metric label="O2 limit (LOI)" value={fmt(telemetry.oxygen_limit_pct, 1)} unit="% O2" />
          <Metric label="CO" value={fmt(telemetry.co_ppm, 0)} unit="ppm" />
          <Metric label="CO2" value={fmt(telemetry.co2_pct, 2)} unit="% CO2" />
        </dl>
        <p className="mt-2 text-[0.6875rem] leading-snug text-muted">
          Cabin O2 {fmt(inputs.o2_pct)} % vs. limit {fmt(telemetry.oxygen_limit_pct)} %. Provenance follows the
          grounding status above. Risk indicators are for research and education, not certified safety
          assessments.
        </p>
      </ConsolePanel>

      {/* ISS FWM PFE Suppression Sizing & Gravity Cooling Efficiency */}
      {result.suppression_estimate ? (
        <ConsolePanel
          title="ISS FWM PFE suppression sizing"
          aside={<Tag>{fmt(result.suppression_estimate.cooling_efficiency_pct, 1)}% cooling eff.</Tag>}
        >
          <dl className="grid grid-cols-2 gap-px border border-subtle bg-subtle">
            <Metric
              label="Cooling efficiency"
              value={fmt(result.suppression_estimate.cooling_efficiency_pct, 1)}
              unit="% (0g–1g)"
            />
            <Metric
              label="Water mist needed"
              value={fmt(result.suppression_estimate.estimated_mist_volume_ml, 1)}
              unit="mL"
            />
            <Metric
              label="Open-cabin discharge"
              value={fmt(result.suppression_estimate.estimated_discharge_seconds, 2)}
              unit="s"
            />
            <Metric
              label="FWM PFE tank used"
              value={fmt(result.suppression_estimate.tank_capacity_used_pct, 2)}
              unit="% of 2.72 L"
            />
          </dl>
          <p className="mt-2 text-[0.6875rem] leading-snug text-muted">
            Est. flame power: {fmt(result.suppression_estimate.estimated_flame_power_kw, 2)} kW.{' '}
            {result.suppression_estimate.confined_rack_note}
          </p>
        </ConsolePanel>
      ) : null}

      {/* Copilot */}
      <ConsolePanel title="SI diagnosis" aside={mockTag}>
        <p className="text-sm leading-relaxed text-primary">{copilot.diagnosis}</p>
      </ConsolePanel>

      <ConsolePanel title="Suppression guidance" aside={mockTag}>
        <p className="flex gap-2 border border-warning/50 bg-warning/5 px-3 py-2 text-[0.6875rem] leading-snug text-warning">
          <AlertTriangle className="mt-px size-3.5 shrink-0" aria-hidden />
          Research guidance derived from published experiments, not an approved operational procedure.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-primary">{copilot.suppression_action}</p>
      </ConsolePanel>

      <ConsolePanel title="Applications on Earth" aside={mockTag}>
        <p className="text-sm leading-relaxed text-primary">{copilot.terrestrial_spinoff}</p>
      </ConsolePanel>

      <ConsolePanel title="NASA citations" aside={<span className="font-mono text-xs text-muted">{result.nasa_citations.length}</span>}>
        <ul className="flex flex-col gap-2">
          {result.nasa_citations.map((c) => (
            <li key={c.id}>
              <a
                href={c.url}
                target="_blank"
                rel="noreferrer"
                className="group block border border-subtle bg-void p-3 transition-colors hover:border-focus"
              >
                <span className="flex items-start justify-between gap-2">
                  <span className="font-mono text-xs text-focus">{c.id}</span>
                  <ExternalLink className="size-3.5 shrink-0 text-muted group-hover:text-focus" aria-hidden />
                </span>
                <span className="mt-1 block text-xs font-medium text-primary">{c.title}</span>
                <span className="mt-1 block text-[0.6875rem] leading-snug text-secondary">{c.finding}</span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[0.6875rem] text-muted">
          SI output is grounded in these sources; see{' '}
          <Link to={LINKS.siUsage} className="text-secondary underline underline-offset-2 hover:text-primary">
            how SI is used
          </Link>
          .
        </p>
      </ConsolePanel>
    </>
  )
}

/** Badge color follows risk_label; the scale shows the DESIGN.md score bands. */
const RISK_TONE: Record<RiskLabel, { text: string; bar: string }> = {
  'Safe (Extinguished Below LOI)': { text: 'text-nominal border-nominal', bar: 'bg-nominal' },
  'Moderate Alert': { text: 'text-warning border-warning', bar: 'bg-warning' },
  'High Risk': { text: 'text-critical border-critical', bar: 'bg-critical' },
  'Critical Flashover Risk': { text: 'text-critical border-critical', bar: 'bg-critical' },
}

function RiskGauge({ score, label }: { score: number; label: RiskLabel }) {
  const tone = RISK_TONE[label]
  return (
    <div data-testid="risk-gauge">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="label-mono">Flammability score</p>
          <p className="mt-1 font-mono text-4xl leading-none text-primary">
            {score}
            <span className="ml-1 text-sm text-secondary">/ 100</span>
          </p>
        </div>
        <span className={`border px-2 py-1 text-right font-mono text-[0.6875rem] tracking-[0.08em] uppercase ${tone.text}`}>
          {label}
        </span>
      </div>
      <div
        className="relative mt-3 h-2 w-full"
        role="meter"
        aria-label="Flammability score"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={score}
        aria-valuetext={`${score} of 100, ${label}`}
      >
        <div className="absolute inset-0 flex gap-px opacity-30">
          <span className="h-full bg-nominal" style={{ width: '35%' }} />
          <span className="h-full bg-warning" style={{ width: '35%' }} />
          <span className="h-full flex-1 bg-critical" />
        </div>
        <span className={`absolute inset-y-0 left-0 ${tone.bar}`} style={{ width: `${score}%` }} />
      </div>
      <div className="mt-1 flex justify-between font-mono text-[0.625rem] text-muted">
        <span>0</span>
        <span>35</span>
        <span>70</span>
        <span>100</span>
      </div>
    </div>
  )
}

function Metric({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="bg-panel px-3 py-2.5">
      <dt className="label-mono">{label}</dt>
      <dd className="mt-1 font-mono text-xl text-primary">
        {value}
        <span className="ml-1 text-xs text-secondary">{unit}</span>
      </dd>
    </div>
  )
}

function MockNotice() {
  return (
    <p
      data-testid="mock-notice"
      className="flex gap-2 border border-warning bg-warning/10 px-3 py-2 text-xs leading-snug text-warning"
    >
      <AlertTriangle className="mt-px size-3.5 shrink-0" aria-hidden />
      <span>
        <strong className="font-semibold">MOCK DATA.</strong> These results are placeholders for interface
        development. They are not engine output and not NASA evidence.
      </span>
    </p>
  )
}

function StaleBanner({ onRun }: { onRun: () => void }) {
  return (
    <div
      data-testid="stale-banner"
      className="flex items-center justify-between gap-3 border border-warning bg-panel px-3 py-2"
    >
      <p className="flex gap-2 text-xs text-warning">
        <Info className="mt-px size-3.5 shrink-0" aria-hidden />
        Parameters changed. Results below reflect the previous run.
      </p>
      <button
        type="button"
        onClick={onRun}
        className="shrink-0 border border-warning px-2 py-1 font-mono text-[0.6875rem] text-warning uppercase hover:bg-warning hover:text-void"
      >
        Re-run
      </button>
    </div>
  )
}

function EmptyPanel() {
  return (
    <ConsolePanel title="Results">
      <div data-testid="results-empty" className="py-6 text-center">
        <p className="text-sm text-primary">No simulation yet.</p>
        <p className="mt-2 text-xs leading-relaxed text-secondary">
          Choose a preset or select a BASS-II record, then press Run Simulation to see grounding,
          telemetry, SI diagnosis and NASA citations.
        </p>
      </div>
    </ConsolePanel>
  )
}

function LoadingPanel() {
  return (
    <ConsolePanel title="Results">
      <div role="status" data-testid="results-loading" className="flex flex-col gap-3">
        <p className="font-mono text-xs text-secondary">Running simulation…</p>
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-16 animate-pulse bg-elevated" />
        ))}
      </div>
    </ConsolePanel>
  )
}

function ErrorPanel({ message, details, onRetry }: { message: string; details: string[]; onRetry: () => void }) {
  return (
    <div role="alert" data-testid="results-error" className="border border-critical bg-panel p-4">
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
        className="mt-3 inline-flex items-center gap-1.5 border border-subtle px-3 py-1.5 text-xs text-primary hover:border-secondary"
      >
        <RotateCcw className="size-3.5" aria-hidden />
        Retry
      </button>
    </div>
  )
}
