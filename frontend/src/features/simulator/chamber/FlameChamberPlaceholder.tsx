// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha, Esquivel & Elias
import { useEffect, useRef, useState } from 'react'
import { CircleDashed, CircleOff, Droplets, ExternalLink, Flame } from 'lucide-react'
import { Tag } from '../../../components/ConsolePanel'
import { fmt } from '../../../lib/format'
import type { Simulation3D, SimulationResponse } from '../../../types/contract'
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
  mock: boolean
}

const WEBGL_BASE_URL = import.meta.env.VITE_WEBGL_URL || 'http://127.0.0.1:8080/index.html'

/**
 * 3D Flame Chamber host. Renders a static placeholder by default; the Unity WebGL view
 * (unity-fire-simulation/WebGlSimulation) can be selected and receives the contract payload
 * (APPLY_FIRE_PAYLOAD) and the chamber state (APPLY_CHAMBER_STATE) via postMessage.
 * No suppression effect is simulated here; that belongs to the 3D module.
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
  mock,
}: FlameChamberProps) {
  // Static by default: the Unity build is only available when served locally.
  const [viewMode, setViewMode] = useState<'webgl' | 'static'>('static')
  const [webglReady, setWebglReady] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data && event.data.type === 'UNITY_FIRE_SIMULATION_READY') {
        setWebglReady(true)
      }
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

  return (
    <div className="relative flex h-full min-h-64 flex-col border border-subtle bg-void" data-testid="chamber-placeholder">
      {/* Title bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-subtle bg-panel px-4 py-2">
        <h2 className="label-mono">3D flame chamber</h2>
        <div className="flex flex-wrap items-center gap-1.5">
          {mock && flame ? <Tag tone="warning">Mock data</Tag> : null}
          {stale ? <Tag tone="warning">Stale</Tag> : null}
          <div className="inline-flex border border-subtle bg-void p-0.5 font-mono text-[0.65rem]" role="group" aria-label="Chamber view">
            <button
              type="button"
              aria-pressed={viewMode === 'static'}
              onClick={() => setViewMode('static')}
              className={`px-2 py-0.5 transition-colors ${viewMode === 'static' ? 'bg-focus/20 text-focus' : 'text-secondary hover:text-primary'}`}
            >
              Static placeholder
            </button>
            <button
              type="button"
              aria-pressed={viewMode === 'webgl'}
              onClick={() => setViewMode('webgl')}
              className={`px-2 py-0.5 transition-colors ${viewMode === 'webgl' ? 'bg-focus/20 text-focus' : 'text-secondary hover:text-primary'}`}
            >
              Unity WebGL (local)
            </button>
          </div>
          <a
            href={WEBGL_BASE_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 border border-subtle bg-void px-2 py-0.5 font-mono text-[0.65rem] text-focus hover:border-focus"
            title="Open the standalone Unity WebGL build served by StartWebGL.cmd"
          >
            Standalone
            <ExternalLink className="size-2.5" aria-hidden />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </div>

      {/* Status strip: chamber state + suppression control */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-subtle bg-hero px-4 py-2">
        <ChamberStatus phase={phase} extinguishedBy={extinguishedBy} remainingS={remainingS} />
        <div className="flex items-center gap-2">
          {dischargeBlocked ? (
            <span id="discharge-blocked-reason" className="hidden text-[0.6875rem] text-muted xl:inline">
              {dischargeBlocked}
            </span>
          ) : null}
          <button
            type="button"
            onClick={onDischarge}
            disabled={dischargeBlocked !== null}
            aria-describedby={dischargeBlocked ? 'discharge-blocked-reason' : undefined}
            title={dischargeBlocked ?? 'Research visualization of a fine water mist discharge. Not an operational procedure.'}
            className="inline-flex items-center gap-1.5 border border-focus px-3 py-1.5 font-mono text-[0.6875rem] tracking-[0.06em] text-focus uppercase transition-colors hover:bg-focus hover:text-hero disabled:cursor-not-allowed disabled:border-subtle disabled:text-muted disabled:hover:bg-transparent"
          >
            <Droplets className="size-3.5" aria-hidden />
            Discharge FWM PFE
          </button>
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
                Run a simulation to send flame parameters to the chamber.
              </p>
            ) : null}
          </>
        )}
        {loading ? (
          <p className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-void/90 px-2 py-0.5 font-mono text-xs text-secondary" role="status">
            Receiving parameters…
          </p>
        ) : null}
      </div>

      <dl className="grid grid-cols-2 gap-px border-t border-subtle bg-subtle sm:grid-cols-4">
        <Readout label="Geometry" value={flame?.flame_geometry ?? '—'} />
        <Readout label="Burn rate" value={fmt(flame?.burn_rate_mm_s, 3)} unit="mm/s" />
        <Readout label="Flame color" value={flame?.flame_color_hex ?? '—'} swatch={flame?.flame_color_hex} />
        <Readout label="Oxygen factor" value={fmt(flame?.oxygen_factor, 2)} />
      </dl>

      <p className="border-t border-subtle bg-panel px-4 py-1.5 text-[0.6875rem] text-muted">
        Static placeholder for the 3D chamber module. Flame and suppression states are a research
        visualization driven by the backend estimate, not a simulation or an operational procedure.
      </p>
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
}: {
  phase: ChamberPhase
  extinguishedBy: FlameChamberProps['extinguishedBy']
  remainingS: number | null
}) {
  const ui = PHASE_UI[phase]
  const Icon = ui.icon
  let detail = 'awaiting a run'
  if (phase === 'burning') detail = 'flame active'
  if (phase === 'suppressing') detail = `FWM PFE discharge · ${fmt(remainingS, 1)} s left`
  if (phase === 'extinguished') {
    detail = extinguishedBy === 'suppression' ? 'after FWM PFE discharge' : 'no sustained flame in this run'
  }
  return (
    <p className="flex items-center gap-2 font-mono text-xs" data-testid="chamber-state" aria-live="polite">
      <span className="text-muted">STATE</span>
      <span className={`inline-flex items-center gap-1.5 font-medium tracking-[0.08em] uppercase ${ui.tone}`}>
        <Icon className="size-3.5" aria-hidden />
        {ui.label}
      </span>
      <span className="text-secondary">· {detail}</span>
    </p>
  )
}

function Readout({ label, value, unit, swatch }: { label: string; value: string; unit?: string; swatch?: string }) {
  return (
    <div className="bg-panel px-3 py-2">
      <dt className="label-mono">{label}</dt>
      <dd className="mt-1 flex items-center gap-1.5 font-mono text-sm text-primary">
        {swatch ? <span className="size-3 border border-subtle" style={{ backgroundColor: swatch }} aria-hidden /> : null}
        {value}
        {unit ? <span className="text-xs text-secondary">{unit}</span> : null}
      </dd>
    </div>
  )
}

function ChamberGrid() {
  return (
    <svg className="absolute inset-0 size-full" aria-hidden="true">
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
  const out = phase === 'extinguished' || params.oxygen_factor === 0
  const suppressing = phase === 'suppressing'
  const base = out ? 0 : 0.35 + 0.65 * params.oxygen_factor
  const opacity = suppressing ? base * 0.45 : base
  const spherical = params.flame_geometry === 'spherical'
  return (
    <svg
      viewBox="0 0 300 160"
      className={`relative w-full max-w-md transition-opacity ${dimmed ? 'opacity-40' : 'opacity-100'}`}
      role="img"
      aria-label={
        out
          ? 'Static illustration: flame extinguished'
          : suppressing
            ? `Static illustration: ${params.flame_geometry} flame under fine water mist`
            : `Static illustration: ${params.flame_geometry} flame`
      }
    >
      <defs>
        <radialGradient id="flame-fill" cx={spherical ? '50%' : '35%'} cy="50%" r="60%">
          <stop offset="0%" stopColor={color} stopOpacity={0.7 * opacity} />
          <stop offset="70%" stopColor={color} stopOpacity={0.2 * opacity} />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <pattern id="mist-dots" width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="var(--brand-blue-light)" opacity="0.55" />
          <circle cx="7" cy="7" r="0.7" fill="var(--brand-blue-light)" opacity="0.4" />
        </pattern>
      </defs>
      {!out ? (
        spherical ? (
          <>
            <circle cx="150" cy="80" r="62" fill="url(#flame-fill)" />
            <circle cx="150" cy="80" r="44" fill="none" stroke={color} strokeOpacity={opacity} strokeWidth="1.5" />
          </>
        ) : (
          <>
            <ellipse cx="170" cy="80" rx="105" ry="38" fill="url(#flame-fill)" />
            <path d="M88 80 C 100 50, 180 48, 272 80 C 180 112, 100 110, 88 80 Z" fill="none" stroke={color} strokeOpacity={opacity} strokeWidth="1.5" />
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
      {suppressing ? <rect x="40" y="10" width="220" height="140" fill="url(#mist-dots)" /> : null}
      <rect x={spherical ? 142 : 80} y="72" width="16" height="16" fill="var(--text-secondary)" />
      {out ? (
        <text x="150" y="140" textAnchor="middle" className="fill-[var(--text-secondary)] font-mono text-[11px]">
          FLAME EXTINGUISHED
        </text>
      ) : null}
      {suppressing ? (
        <text x="150" y="146" textAnchor="middle" className="fill-[var(--brand-blue-light)] font-mono text-[11px]">
          FINE WATER MIST
        </text>
      ) : null}
    </svg>
  )
}
