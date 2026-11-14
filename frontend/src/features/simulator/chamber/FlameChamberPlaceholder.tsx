// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha, Esquivel & Elias
import { useEffect, useRef, useState } from 'react'
import { CircleDashed, CircleOff, Droplets, ExternalLink, Flame } from 'lucide-react'
import { Tooltip } from '../../../components/Tooltip'
import { fmt } from '../../../lib/format'
import type { Simulation3D, SimulationResponse } from '../../../types/contract'
import { chamberDevControlsEnabled, defaultChamberView } from './devMode'
import type { ChamberPhase, ChamberRenderInput, ChamberStateMessage } from './types'

export interface FlameChamberProps extends ChamberRenderInput {
  /** Full simulation contract payload sent to the Unity WebGL controller via ApplyJson. */
  payload?: SimulationResponse | null
  /** Set with the phase: how the flame went out (drives the status text). */
  extinguishedBy: 'suppression' | 'no_sustained_flame' | null
  /** Epoch ms when the current discharge started (for the countdown). */
  dischargeStartedAt: number | null
  /** null when "Discharge FWM PFE" is available; otherwise the reason it is disabled. */
  dischargeBlocked: string | null
  onDischarge: () => void
  loading: boolean
  stale: boolean
  /** Force the developer view controls on or off (defaults to the env / ?dev flag). */
  devControls?: boolean
}

const WEBGL_BASE_URL = import.meta.env.VITE_WEBGL_URL || 'http://127.0.0.1:8080/index.html'

export const BELOW_OXYGEN_LIMIT = 'Extinguished below oxygen limit'

/**
 * 3D Flame Chamber host. Renders a static view by default; the Unity WebGL view
 * (unity-fire-simulation/WebGlSimulation) receives the contract payload (APPLY_FIRE_PAYLOAD)
 * and the chamber state (APPLY_CHAMBER_STATE) via postMessage.
 * No suppression (mist) effect is drawn here; that belongs to the 3D module.
 */
export function FlameChamberPlaceholder({
  phase,
  flame,
  suppression,
  payload = null,
  extinguishedBy,
  dischargeStartedAt,
  dischargeBlocked,
  onDischarge,
  loading,
  stale,
  devControls = chamberDevControlsEnabled(),
}: FlameChamberProps) {
  const [viewMode, setViewMode] = useState<'webgl' | 'static'>(defaultChamberView)
  const [webglReady, setWebglReady] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data && event.data.type === 'UNITY_FIRE_SIMULATION_READY') setWebglReady(true)
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  useEffect(() => {
    const target = iframeRef.current?.contentWindow
    if (!target) return
    if (payload) target.postMessage({ type: 'APPLY_FIRE_PAYLOAD', payload }, '*')
    const message: ChamberStateMessage = { type: 'APPLY_CHAMBER_STATE', phase, flame, suppression }
    target.postMessage(message, '*')
  }, [payload, phase, flame, suppression, webglReady, viewMode])

  const remainingS = useDischargeCountdown(phase, dischargeStartedAt, suppression?.discharge_seconds ?? null)
  const inputs = payload?.inputs

  return (
    <section aria-labelledby="chamber-title" className="flex h-full min-h-0 flex-col gap-2">
      <div
        className="relative flex min-h-72 flex-1 flex-col overflow-hidden rounded-xl border border-subtle bg-void"
        data-testid="chamber-placeholder"
      >
        {/* Chamber bar: state + extinguisher */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-subtle bg-panel/80 px-4 py-2">
          <div className="flex items-center gap-3">
            <h2 id="chamber-title" className="text-sm font-semibold text-primary">
              3D flame chamber
            </h2>
            <ChamberStatus phase={phase} extinguishedBy={extinguishedBy} remainingS={remainingS} stale={stale} />
          </div>
          <div className="flex items-center gap-2">
            {devControls ? <DevControls viewMode={viewMode} onChange={setViewMode} /> : null}
            <DischargeButton blocked={dischargeBlocked} onDischarge={onDischarge} />
          </div>
        </div>

        <div className="relative flex flex-1 items-center justify-center overflow-hidden">
          {viewMode === 'webgl' ? (
            <iframe
              ref={iframeRef}
              src={`${WEBGL_BASE_URL}?embed=1`}
              title="AstroFire 3D Unity WebGL fire simulation"
              className={`size-full border-0 transition-opacity ${stale || loading ? 'opacity-60' : 'opacity-100'}`}
              onLoad={() => setWebglReady(true)}
            />
          ) : (
            <>
              <ChamberGrid />
              {flame && phase !== 'idle' ? <StaticFlame params={flame} phase={phase} dimmed={stale || loading} /> : null}
              {phase === 'idle' && !loading ? (
                <p className="relative max-w-xs text-center text-sm text-muted">
                  Pick a scenario and run the simulation to light the chamber.
                </p>
              ) : null}
            </>
          )}
          {phase === 'extinguished' && extinguishedBy === 'no_sustained_flame' && !loading ? (
            <p
              data-testid="chamber-extinguished-message"
              className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-subtle bg-void/90 px-3 py-1 text-xs whitespace-nowrap text-secondary"
            >
              {BELOW_OXYGEN_LIMIT}
            </p>
          ) : null}
          {loading ? (
            <p
              className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-md bg-void/90 px-2 py-0.5 text-xs text-secondary"
              role="status"
            >
              Receiving parameters…
            </p>
          ) : null}
        </div>
      </div>

      {/* Summary of the run inputs */}
      <p
        data-testid="chamber-summary"
        className="px-1 text-center font-mono text-xs text-balance text-secondary tabular-nums"
      >
        {inputs ? summaryText(inputs) : '—'}
      </p>
      <p className="px-1 text-center text-[0.6875rem] text-muted">Research visualization, not a validated simulation.</p>
    </section>
  )
}

function summaryText(i: SimulationResponse['inputs']): string {
  return `${i.environment_label} · ${i.material_name} · ${fmt(i.thickness_mm, 1)} mm · ${fmt(i.o2_pct, 1)}% O₂ · ${fmt(i.airflow_cm_s, 1)} cm/s`
}

function DischargeButton({ blocked, onDischarge }: { blocked: string | null; onDischarge: () => void }) {
  const button = (describedBy?: string) => (
    <button
      type="button"
      onClick={onDischarge}
      disabled={blocked !== null}
      aria-describedby={describedBy}
      className="inline-flex items-center gap-1.5 rounded-lg border border-focus px-3 py-1.5 text-xs font-medium text-focus transition-colors hover:bg-focus hover:text-hero disabled:cursor-not-allowed disabled:border-subtle disabled:text-muted disabled:hover:bg-transparent"
    >
      <Droplets className="size-3.5" aria-hidden />
      Discharge FWM PFE
    </button>
  )
  return (
    <Tooltip label={blocked} align="end" side="bottom" focusable={blocked !== null}>
      {(id) => button(id)}
    </Tooltip>
  )
}

function DevControls({ viewMode, onChange }: { viewMode: 'webgl' | 'static'; onChange: (mode: 'webgl' | 'static') => void }) {
  const tab = (mode: 'webgl' | 'static', label: string) => (
    <button
      type="button"
      aria-pressed={viewMode === mode}
      onClick={() => onChange(mode)}
      className={`rounded px-2 py-0.5 transition-colors ${viewMode === mode ? 'bg-focus/20 text-focus' : 'text-secondary hover:text-primary'}`}
    >
      {label}
    </button>
  )
  return (
    <div className="flex items-center gap-1.5 font-mono text-[0.65rem]" data-testid="chamber-dev-controls">
      <div className="inline-flex rounded-md border border-subtle bg-void p-0.5" role="group" aria-label="Chamber view">
        {tab('static', 'Static placeholder')}
        {tab('webgl', 'Unity WebGL (local)')}
      </div>
      <a
        href={WEBGL_BASE_URL}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 rounded-md border border-subtle bg-void px-2 py-0.5 text-focus hover:border-focus"
        title="Open the standalone Unity WebGL build served by StartWebGL.cmd"
      >
        Standalone
        <ExternalLink className="size-2.5" aria-hidden />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </div>
  )
}

/** Seconds left in the current discharge, refreshed while suppressing. */
function useDischargeCountdown(phase: ChamberPhase, startedAt: number | null, totalS: number | null) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (phase !== 'suppressing') return
    const id = setInterval(() => setNow(Date.now()), 100)
    return () => clearInterval(id)
  }, [phase])
  if (phase !== 'suppressing' || startedAt === null || totalS === null) return null
  return Math.max(0, totalS - (now - startedAt) / 1000)
}

const PHASE_UI: Record<ChamberPhase, { label: string; icon: typeof Flame; tone: string }> = {
  idle: { label: 'Idle', icon: CircleDashed, tone: 'text-muted' },
  burning: { label: 'Burning', icon: Flame, tone: 'text-brand' },
  suppressing: { label: 'Suppressing', icon: Droplets, tone: 'text-focus' },
  extinguished: { label: 'Extinguished', icon: CircleOff, tone: 'text-secondary' },
}

function ChamberStatus({
  phase,
  extinguishedBy,
  remainingS,
  stale,
}: {
  phase: ChamberPhase
  extinguishedBy: FlameChamberProps['extinguishedBy']
  remainingS: number | null
  stale: boolean
}) {
  const ui = PHASE_UI[phase]
  const Icon = ui.icon
  let detail: string | null = null
  if (phase === 'suppressing') detail = `${fmt(remainingS, 1)} s left`
  // "Extinguished below oxygen limit" is shown over the chamber, so the bar stays on one line.
  if (phase === 'extinguished' && extinguishedBy === 'suppression') detail = 'after FWM PFE discharge'
  return (
    <p className="flex items-center gap-1.5 text-xs" data-testid="chamber-state" aria-live="polite">
      <span className={`inline-flex items-center gap-1 rounded-full bg-void/70 px-2 py-0.5 font-medium ${ui.tone}`}>
        <Icon className="size-3.5" aria-hidden />
        {ui.label}
      </span>
      {detail ? <span className="text-muted tabular-nums"> {detail}</span> : null}
      {stale ? <span className="text-warning"> · controls changed</span> : null}
    </p>
  )
}

function ChamberGrid() {
  return (
    <svg className="absolute inset-0 size-full opacity-60" aria-hidden="true">
      <defs>
        <pattern id="mm-grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0H0V24" fill="none" stroke="var(--border-subtle)" strokeWidth="0.6" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#mm-grid)" />
    </svg>
  )
}

function StaticFlame({ params, phase, dimmed }: { params: Simulation3D; phase: ChamberPhase; dimmed: boolean }) {
  const color = params.flame_color_hex
  const out = phase === 'extinguished'
  const base = out ? 0 : 0.35 + 0.65 * params.oxygen_factor
  const spherical = params.flame_geometry === 'spherical'
  return (
    <svg
      viewBox="0 0 300 160"
      className={`relative w-full max-w-lg transition-opacity ${dimmed ? 'opacity-40' : 'opacity-100'}`}
      role="img"
      aria-label={out ? 'Static illustration: flame extinguished' : `Static illustration: ${params.flame_geometry} flame`}
    >
      <defs>
        <radialGradient id="flame-fill" cx={spherical ? '50%' : '35%'} cy="50%" r="60%">
          <stop offset="0%" stopColor={color} stopOpacity={0.7 * base} />
          <stop offset="70%" stopColor={color} stopOpacity={0.2 * base} />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      {!out ? (
        spherical ? (
          <>
            <circle cx="150" cy="80" r="62" fill="url(#flame-fill)" />
            <circle cx="150" cy="80" r="44" fill="none" stroke={color} strokeOpacity={base} strokeWidth="1.5" />
          </>
        ) : (
          <>
            <ellipse cx="170" cy="80" rx="105" ry="38" fill="url(#flame-fill)" />
            <path d="M88 80 C 100 50, 180 48, 272 80 C 180 112, 100 110, 88 80 Z" fill="none" stroke={color} strokeOpacity={base} strokeWidth="1.5" />
          </>
        )
      ) : null}
      {!spherical && !out
        ? [52, 80, 108].map((y) => (
            <g key={y} stroke="var(--text-muted)" strokeWidth="1.2" fill="none">
              <line x1="14" y1={y} x2="48" y2={y} />
              <polyline points={`43,${y - 4} 48,${y} 43,${y + 4}`} />
            </g>
          ))
        : null}
      <rect x={spherical ? 142 : 80} y="72" width="16" height="16" rx="2" fill="var(--text-secondary)" />
    </svg>
  )
}
