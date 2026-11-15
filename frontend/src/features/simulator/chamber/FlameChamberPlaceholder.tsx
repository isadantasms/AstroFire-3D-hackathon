// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha, Esquivel & Elias
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { CircleDashed, CircleOff, Droplets, ExternalLink, Flame } from 'lucide-react'
import { Tooltip } from '../../../components/Tooltip'
import { fmt } from '../../../lib/format'
import type { Simulation3D, SimulationResponse } from '../../../types/contract'
import { chamberDevControlsEnabled, defaultChamberView, UNITY_READY_TIMEOUT_MS } from './devMode'
import type { ChamberPhase, ChamberRenderInput, ChamberStateMessage } from './types'

export interface StandbyMaterialPreview {
  material_id: string
  material_name: string
  thickness_mm: number
  gravity_g: number
}

export interface FlameChamberProps extends ChamberRenderInput {
  /** Full simulation contract payload sent to the Unity WebGL controller via ApplyJson. */
  payload?: SimulationResponse | null
  /** Selected material to preview in 3D while the chamber is idle (without changing location). */
  standbyMaterial?: StandbyMaterialPreview | null
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

const DEFAULT_WEBGL_URL = import.meta.env.PROD
  ? '/webgl/index.html'
  : 'http://127.0.0.1:8080/index.html'
const WEBGL_BASE_URL = import.meta.env.VITE_WEBGL_URL || DEFAULT_WEBGL_URL

export const BELOW_OXYGEN_LIMIT = 'Extinguished below oxygen limit'

function isReactInputOrSliderFocused(): boolean {
  if (typeof document === 'undefined') return false
  const active = document.activeElement as HTMLElement | null
  if (!active || active === document.body || active === document.documentElement) return false
  const tag = active.tagName.toLowerCase()
  if (tag === 'input' || tag === 'select' || tag === 'textarea') return true
  const role = active.getAttribute('role')
  if (
    role === 'slider' ||
    role === 'spinbutton' ||
    role === 'listbox' ||
    role === 'option' ||
    role === 'combobox'
  ) {
    return true
  }
  return Boolean(active.isContentEditable)
}

function focusUnityIframeSafely(iframe: HTMLIFrameElement | null): void {
  if (!iframe || isReactInputOrSliderFocused()) return
  try {
    iframe.focus({ preventScroll: true })
    iframe.contentWindow?.focus()
  } catch {
    // Ignore cross-origin or detached iframe focus exceptions.
  }
}

function sendUnityCommand(target: Window, gameObject: string, method: string): void {
  target.postMessage({ type: 'UNITY_SEND_MESSAGE', gameObject, method }, '*')
  try {
    const win = target as Window & {
      unityInstance?: { SendMessage?: (go: string, fn: string) => void }
    }
    win.unityInstance?.SendMessage?.(gameObject, method)
  } catch {
    // Cross-origin iframe window access is optional; postMessage handles it.
  }
}

/**
 * 3D Flame Chamber host. Shows the Unity WebGL view by default (static view as fallback); the Unity view
 * (unity-fire-simulation/WebGlSimulation) receives the contract payload (APPLY_FIRE_PAYLOAD)
 * and the chamber state (APPLY_CHAMBER_STATE) via postMessage.
 * No suppression (mist) effect is drawn here; that belongs to the 3D module.
 */
export function FlameChamberPlaceholder({
  phase,
  flame,
  suppression,
  payload = null,
  standbyMaterial = null,
  extinguishedBy,
  dischargeStartedAt,
  dischargeBlocked,
  onDischarge,
  loading,
  stale,
  devControls = chamberDevControlsEnabled(),
}: FlameChamberProps) {
  const [viewMode, setViewMode] = useState<'webgl' | 'static'>(defaultChamberView)
  const { unity, retry } = useUnityStatus(viewMode)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const showIframe = viewMode === 'webgl' && (unity === 'loading' || unity === 'ready')

  // Re-sent when Unity reports ready or when a run finishes, without re-sending during suppression.
  useEffect(() => {
    const target = iframeRef.current?.contentWindow
    if (!target || unity !== 'ready' || !payload) return
    if (phase !== 'burning' && !(phase === 'extinguished' && extinguishedBy === 'no_sustained_flame')) return
    focusUnityIframeSafely(iframeRef.current)
    sendUnityCommand(target, 'Fire Extinguisher', 'CancelForTravel')
    target.postMessage({ type: 'APPLY_FIRE_PAYLOAD', payload }, '*')
    sendUnityCommand(target, 'FireSimulation', 'SkipAnimation')
    sendUnityCommand(target, 'FireSimulation', 'ResetSuppression')

    const syncRunState = () => {
      sendUnityCommand(target, 'Fire Extinguisher', 'CancelForTravel')
      sendUnityCommand(target, 'FireSimulation', 'SkipAnimation')
      sendUnityCommand(target, 'FireSimulation', 'ResetSuppression')
    }

    let rafId = 0
    let remainingFrames = 5
    const stepRaf = () => {
      syncRunState()
      remainingFrames -= 1
      if (remainingFrames > 0) {
        rafId = requestAnimationFrame(stepRaf)
      }
    }
    rafId = requestAnimationFrame(stepRaf)

    const timer1 = setTimeout(syncRunState, 40)
    const timer2 = setTimeout(syncRunState, 120)
    const timer3 = setTimeout(syncRunState, 260)
    const timer4 = setTimeout(syncRunState, 450)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
    }
  }, [payload, phase, extinguishedBy, unity])

  const standbyMaterialId = standbyMaterial?.material_id
  const standbyMaterialName = standbyMaterial?.material_name
  const standbyThicknessMm = standbyMaterial?.thickness_mm
  const standbyGravityG = standbyMaterial?.gravity_g

  // When idle (after switching material or location), stop the flame and update the 3D specimen/destination.
  useEffect(() => {
    const target = iframeRef.current?.contentWindow
    if (
      !target ||
      unity !== 'ready' ||
      phase !== 'idle' ||
      loading ||
      !standbyMaterialId ||
      !standbyMaterialName ||
      standbyThicknessMm === undefined ||
      standbyGravityG === undefined
    ) {
      return
    }
    const g = standbyGravityG
    const envLabel =
      g === 0 ? 'ISS Microgravity' : g <= 0.2 ? 'Lunar Surface' : g <= 0.5 ? 'Martian Surface' : 'Earth 1g'
    const standbyPayload = {
      scenario_id: `standby_${standbyMaterialId}_${g}g`,
      grounding_status: 'interpolated_from_ntrs',
      inputs: {
        material_id: standbyMaterialId,
        material_name: standbyMaterialName,
        thickness_mm: Math.max(0.05, standbyThicknessMm),
        gravity_g: g,
        environment_label: envLabel,
        o2_pct: 21,
        airflow_cm_s: 5,
      },
      simulation_3d: {
        flame_geometry: 'spherical',
        burn_rate_mm_s: 0,
        flame_color_hex: '#3B82F6',
        oxygen_factor: 0,
      },
    }
    sendUnityCommand(target, 'Fire Extinguisher', 'CancelForTravel')
    target.postMessage({ type: 'APPLY_FIRE_PAYLOAD', payload: standbyPayload }, '*')
    sendUnityCommand(target, 'FireSimulation', 'ResetSuppression')
  }, [
    loading,
    phase,
    standbyGravityG,
    standbyMaterialId,
    standbyMaterialName,
    standbyThicknessMm,
    unity,
  ])

  useEffect(() => {
    const target = iframeRef.current?.contentWindow
    if (!target || unity !== 'ready') return
    focusUnityIframeSafely(iframeRef.current)
    const message: ChamberStateMessage = { type: 'APPLY_CHAMBER_STATE', phase, flame, suppression }
    target.postMessage(message, '*')

    let raf2 = 0
    let raf1 = 0
    let timer1: ReturnType<typeof setTimeout> | null = null
    let timer2: ReturnType<typeof setTimeout> | null = null

    if (phase === 'suppressing') {
      sendUnityCommand(target, 'FireSimulation', 'SkipAnimation')
      sendUnityCommand(target, 'Fire Extinguisher', 'UseExtinguisher')
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          sendUnityCommand(target, 'FireSimulation', 'SkipAnimation')
          sendUnityCommand(target, 'Fire Extinguisher', 'UseExtinguisher')
        })
      })
      timer1 = setTimeout(() => {
        sendUnityCommand(target, 'FireSimulation', 'SkipAnimation')
        sendUnityCommand(target, 'Fire Extinguisher', 'UseExtinguisher')
      }, 40)
      timer2 = setTimeout(() => {
        sendUnityCommand(target, 'Fire Extinguisher', 'UseExtinguisher')
      }, 120)
    } else if (phase === 'burning' || phase === 'idle') {
      sendUnityCommand(target, 'Fire Extinguisher', 'CancelForTravel')
      sendUnityCommand(target, 'FireSimulation', 'ResetSuppression')
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          sendUnityCommand(target, 'Fire Extinguisher', 'CancelForTravel')
          sendUnityCommand(target, 'FireSimulation', 'ResetSuppression')
        })
      })
      timer1 = setTimeout(() => {
        sendUnityCommand(target, 'Fire Extinguisher', 'CancelForTravel')
        sendUnityCommand(target, 'FireSimulation', 'ResetSuppression')
      }, 40)
    }

    return () => {
      if (raf1) cancelAnimationFrame(raf1)
      if (raf2) cancelAnimationFrame(raf2)
      if (timer1) clearTimeout(timer1)
      if (timer2) clearTimeout(timer2)
    }
  }, [phase, flame, suppression, unity])

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
          {showIframe ? (
            <>
              {/* No allow-modals: a failing Unity build cannot open alert() dialogs over the app. */}
              <iframe
                ref={iframeRef}
                src={`${WEBGL_BASE_URL}?embed=1`}
                title="AstroFire 3D Unity WebGL fire simulation"
                sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-popups"
                allow="fullscreen"
                className={`size-full border-0 transition-opacity ${stale || loading ? 'opacity-60' : 'opacity-100'}`}
              />
              {unity === 'loading' ? <ChamberNotice>Loading the 3D view…</ChamberNotice> : null}
            </>
          ) : (
            <>
              <ChamberGrid />
              {flame && phase !== 'idle' ? <StaticFlame params={flame} phase={phase} dimmed={stale || loading} /> : null}
              {phase === 'idle' && !loading ? (
                <p className="relative max-w-xs text-center text-sm text-muted">
                  Pick a scenario and run the simulation to light the chamber.
                </p>
              ) : null}
              {viewMode === 'webgl' && unity === 'checking' ? <ChamberNotice>Connecting to the 3D view…</ChamberNotice> : null}
              {viewMode === 'webgl' && unity === 'unavailable' ? (
                <ChamberNotice testId="unity-unavailable">
                  {/* Phones and small tablets (< 768px): point to the desktop browser instead of a retry. */}
                  <span className="md:hidden">For the full 3D chamber, open AstroFire 3D on a desktop browser.</span>
                  <span className="hidden md:inline">
                    3D view unavailable: the Unity WebGL build is not responding. Showing the static view.
                    <button type="button" onClick={retry} className="ml-1 inline-flex min-h-11 items-center px-1 text-focus hover:underline">
                      Retry
                    </button>
                  </span>
                </ChamberNotice>
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

type UnityStatus = 'checking' | 'loading' | 'ready' | 'unavailable'

/**
 * Unity WebGL availability: probe the local server, then wait for UNITY_FIRE_SIMULATION_READY.
 * Falls back to 'unavailable' when the server is down or Unity never reports ready.
 */
function useUnityStatus(viewMode: 'webgl' | 'static') {
  const [attempt, setAttempt] = useState(0)
  const [probe, setProbe] = useState<{ attempt: number; status: UnityStatus } | null>(null)
  const unity: UnityStatus = probe?.attempt === attempt ? probe.status : 'checking'

  useEffect(() => {
    if (viewMode !== 'webgl') return
    let done = false
    const set = (status: UnityStatus) => {
      if (done) return
      setProbe((p) => (p?.attempt === attempt && p.status === 'ready' ? p : { attempt, status }))
      if (status === 'ready' || status === 'unavailable') done = true
    }
    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === 'UNITY_FIRE_SIMULATION_READY') set('ready')
    }
    window.addEventListener('message', onMessage)
    fetch(WEBGL_BASE_URL, { mode: 'no-cors', cache: 'no-store', signal: AbortSignal.timeout(3000) })
      .then(() => set('loading'))
      .catch(() => set('unavailable'))
    const timer = setTimeout(() => set('unavailable'), UNITY_READY_TIMEOUT_MS)
    return () => {
      done = true
      clearTimeout(timer)
      window.removeEventListener('message', onMessage)
    }
  }, [viewMode, attempt])

  return { unity, retry: () => setAttempt((n) => n + 1) }
}

function ChamberNotice({ children, testId }: { children: ReactNode; testId?: string }) {
  return (
    <p
      role="status"
      data-testid={testId}
      className="absolute top-3 left-1/2 max-w-[90%] -translate-x-1/2 rounded-full border border-subtle bg-void/90 px-3 py-1 text-center text-xs text-secondary"
    >
      {children}
    </p>
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
      className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-focus bg-focus px-3.5 py-1.5 text-xs font-semibold text-hero shadow-sm transition-colors hover:bg-focus/90 disabled:cursor-not-allowed disabled:border-subtle disabled:bg-transparent disabled:text-muted disabled:shadow-none"
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
