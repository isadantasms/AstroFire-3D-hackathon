// SI-assisted: generated with Claude, reviewed and edited by Elias
import { useEffect, useState, type ReactNode } from 'react'
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  CircleOff,
  Droplets,
  Flame,
  HelpCircle,
  Play,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  X,
} from 'lucide-react'

interface TutorialStepDef {
  id: string
  shortTitle: string
  title: string
  subtitle: string
  summary: string
  renderVisual: () => ReactNode
}

function PointerBadge({ label, direction = 'down' }: { label: string; direction?: 'down' | 'left' | 'right' }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-brand/70 bg-brand/15 px-2.5 py-1 text-[0.7rem] font-semibold text-brand shadow-sm">
      {direction === 'left' ? <ArrowLeft className="size-3.5 shrink-0" aria-hidden /> : null}
      <span>{label}</span>
      {direction === 'down' ? <ArrowDown className="size-3.5 shrink-0" aria-hidden /> : null}
      {direction === 'right' ? <ArrowRight className="size-3.5 shrink-0" aria-hidden /> : null}
    </div>
  )
}

const TUTORIAL_STEPS: TutorialStepDef[] = [
  {
    id: 'welcome',
    shortTitle: 'Overview',
    title: 'Welcome to AstroFire 3D',
    subtitle: 'Microgravity Fire Safety & Suppression Console',
    summary:
      'Explore how spacecraft materials ignite, spread, and extinguish across orbital and planetary habitats using NASA BASS-II data and our Physics-Informed Neural Network (PINN).',
    renderVisual: () => (
      <div className="space-y-4">
        <div className="rounded-xl border border-subtle bg-void/80 p-4">
          <div className="mb-3 flex items-center justify-between text-[0.7rem] text-muted">
            <span className="font-mono uppercase tracking-wider text-focus">3-Step Mission Console</span>
            <span>Static Walkthrough · Preset: ISS 0.00 g · PMMA</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-subtle bg-panel p-3">
              <p className="text-xs font-semibold text-primary">1. Mission Controls</p>
              <p className="mt-1 text-[0.7rem] text-secondary">
                Choose material, gravity, O₂ concentration, and cabin airflow.
              </p>
            </div>
            <div className="rounded-lg border border-focus/50 bg-panel p-3">
              <p className="text-xs font-semibold text-primary">2. 3D Flame Chamber</p>
              <p className="mt-1 text-[0.7rem] text-secondary">
                Observe the 3D flame geometry and test FWM PFE mist suppression.
              </p>
            </div>
            <div className="rounded-lg border border-subtle bg-panel p-3">
              <p className="text-xs font-semibold text-primary">3. Results & Copilot</p>
              <p className="mt-1 text-[0.7rem] text-secondary">
                Review flammability risk, telemetry, extinguisher sizing, and NASA citations.
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'material',
    shortTitle: 'Material',
    title: 'Step 1 · Select Material',
    subtitle: '7 NASA BASS-II Spacecraft & Habitat Materials',
    summary:
      'Use the Material selector to pick a solid fuel (such as PMMA Clear Cast Slab, Nomex III, or SIBAL fabric). Each material loads its verified nominal thickness and combustion properties.',
    renderVisual: () => (
      <div className="mx-auto max-w-sm rounded-xl border border-subtle bg-void/90 p-4">
        <div className="mb-2 flex justify-start">
          <PointerBadge label="Click to choose from 7 NASA BASS-II materials" direction="down" />
        </div>
        <p className="mb-1.5 text-xs text-secondary">Material</p>
        <div className="flex items-center justify-between gap-2 rounded-xl border-2 border-focus bg-elevated/40 px-3 py-2.5 shadow-[0_0_0_3px_rgba(76,141,255,0.18)]">
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-primary">PMMA Clear Cast Slab</p>
            <p className="truncate text-[0.65rem] text-muted">Spacecraft Window/Panel Acrylic</p>
          </div>
          <span className="shrink-0 rounded border border-subtle bg-panel px-1.5 py-0.5 font-mono text-[0.65rem] text-secondary">
            2.00 mm
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-muted">
          <span>Thickness</span>
          <span className="font-mono text-primary">2.00 mm</span>
        </div>
      </div>
    ),
  },
  {
    id: 'gravity',
    shortTitle: 'Gravity',
    title: 'Step 2 · Choose Gravity Regime',
    subtitle: 'ISS (0.00 g) · Moon (0.16 g) · Mars (0.38 g) · Earth (1.00 g)',
    summary:
      'Select the destination gravity. Switching location keeps your selected material and transitions the 3D laboratory porthole and buoyancy physics to that environment.',
    renderVisual: () => (
      <div className="mx-auto max-w-sm rounded-xl border border-subtle bg-void/90 p-4">
        <div className="mb-2 flex justify-start">
          <PointerBadge label="Switches habitat gravity & 3D destination" direction="down" />
        </div>
        <p className="mb-1.5 text-xs text-secondary">Gravity</p>
        <div className="grid grid-cols-4 gap-1 rounded-lg border-2 border-focus bg-panel p-1 shadow-[0_0_0_3px_rgba(76,141,255,0.18)]">
          {[
            { short: 'ISS', g: '0.00 g', active: true },
            { short: 'Moon', g: '0.16 g', active: false },
            { short: 'Mars', g: '0.38 g', active: false },
            { short: 'Earth', g: '1.00 g', active: false },
          ].map((item) => (
            <div
              key={item.short}
              className={`rounded-md px-1 py-1.5 text-center ${
                item.active ? 'bg-elevated text-primary' : 'text-secondary'
              }`}
            >
              <span className="block text-xs font-medium">{item.short}</span>
              <span className="block font-mono text-[0.625rem] text-muted">{item.g}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'atmosphere',
    shortTitle: 'O₂ & Airflow',
    title: 'Step 3 · Set Oxygen, Airflow & Run',
    subtitle: 'Cabin Atmosphere & Forced Ventilation',
    summary:
      'Adjust Oxygen (% O₂) and Airflow (cm/s) to test flammability limits and ventilation effects, then click Run Simulation to compute the PINN prediction and light the 3D chamber.',
    renderVisual: () => (
      <div className="mx-auto max-w-sm space-y-3 rounded-xl border border-subtle bg-void/90 p-4">
        <div className="flex justify-start">
          <PointerBadge label="Tune O₂ & forced ventilation" direction="down" />
        </div>
        <div className="space-y-2.5 rounded-lg border border-focus/60 bg-panel p-3">
          <div>
            <div className="flex justify-between text-xs">
              <span className="text-secondary">Oxygen</span>
              <span className="font-mono text-primary">21.0 % O₂</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full rounded-full bg-void">
              <div className="h-1.5 w-[37%] rounded-full bg-brand" />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs">
              <span className="text-secondary">Airflow</span>
              <span className="font-mono text-primary">5.0 cm/s</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full rounded-full bg-void">
              <div className="h-1.5 w-[10%] rounded-full bg-brand" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-xs font-semibold text-hero">
            <Play className="size-3.5 fill-current" aria-hidden />
            Run Simulation
          </div>
          <PointerBadge label="Start test" direction="left" />
        </div>
      </div>
    ),
  },
  {
    id: 'flame',
    shortTitle: '3D Flame',
    title: 'Step 4 · Observe the 3D Flame',
    subtitle: 'Authentic Microgravity vs. Gravity Flame Physics',
    summary:
      'In ISS microgravity (0.00 g) with PMMA at 21% O₂ and 5 cm/s, there is no upward buoyancy—the flame forms a compact blue spherical diffusion flame (#3B82F6). Higher gravity elongates and turns it amber.',
    renderVisual: () => (
      <div className="rounded-xl border border-subtle bg-void/90 p-3">
        <div className="flex items-center justify-between border-b border-subtle pb-2 text-xs">
          <span className="font-semibold text-primary">3D flame chamber</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-panel px-2 py-0.5 text-brand">
            <Flame className="size-3.5" aria-hidden />
            Burning
          </span>
        </div>
        <div className="relative mt-2 flex h-40 flex-col items-center justify-center overflow-hidden rounded-lg border border-subtle bg-hero">
          <div className="absolute top-2.5 right-2.5">
            <PointerBadge label="Spherical blue 0g flame (#3B82F6)" direction="left" />
          </div>
          <svg viewBox="0 0 240 120" className="h-28 w-56" role="img" aria-label="Static 0g blue spherical flame">
            <defs>
              <radialGradient id="tut-flame-0g" cx="50%" cy="50%" r="55%">
                <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.9" />
                <stop offset="55%" stopColor="#3b82f6" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="120" cy="60" r="42" fill="url(#tut-flame-0g)" />
            <circle cx="120" cy="60" r="28" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeOpacity="0.85" />
            <rect x="112" y="54" width="16" height="12" rx="2" fill="#b4c0d3" />
          </svg>
          <p className="font-mono text-[0.65rem] text-secondary">
            ISS Microgravity (0.00g) · PMMA Clear Cast Slab · 2.0 mm · 21.0% O₂ · 5.0 cm/s
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'suppress',
    shortTitle: 'Extinguisher',
    title: 'Step 5 · Discharge FWM PFE',
    subtitle: 'ISS Fine Water Mist Portable Fire Extinguisher',
    summary:
      'Click Discharge FWM PFE to trigger the 3D water-mist extinguisher. The chamber extinguishes the flame using the backend cooling efficiency and discharge duration model.',
    renderVisual: () => (
      <div className="rounded-xl border border-subtle bg-void/90 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-subtle pb-2 text-xs">
          <span className="inline-flex items-center gap-1 rounded-full bg-panel px-2 py-0.5 text-secondary">
            <CircleOff className="size-3.5" aria-hidden />
            Extinguished · after FWM PFE discharge
          </span>
          <div className="flex items-center gap-2">
            <PointerBadge label="Click to suppress flame" direction="right" />
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-focus bg-focus px-2.5 py-1 text-[0.7rem] font-semibold text-hero">
              <Droplets className="size-3.5" aria-hidden />
              Discharge FWM PFE
            </span>
          </div>
        </div>
        <div className="mt-2 flex h-32 items-center justify-center rounded-lg border border-subtle bg-hero px-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-focus">
              <Droplets className="size-5" aria-hidden />
              <span className="font-mono text-xs">Fine Water Mist Spray</span>
            </div>
            <ArrowRight className="size-4 text-muted" aria-hidden />
            <div className="rounded-md border border-subtle bg-panel px-3 py-2 text-center">
              <span className="block text-xs font-medium text-primary">Sample Cooled</span>
              <span className="block font-mono text-[0.65rem] text-muted">Flame extinguished</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'results',
    shortTitle: 'Results',
    title: 'Step 6 · Interpret Results & Copilot',
    subtitle: 'Right-Hand Decision Console',
    summary:
      'Review the Flammability Risk score, burn rate & O₂ limit telemetry, ISS FWM PFE mist sizing, SI safety copilot guidance, and the grounding badge showing whether data is empirical or interpolated.',
    renderVisual: () => (
      <div className="mx-auto max-w-md space-y-2.5 rounded-xl border border-subtle bg-void/90 p-3">
        <div className="flex justify-end">
          <PointerBadge label="Risk, telemetry, sizing & NASA grounding" direction="down" />
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-lg border border-focus/60 bg-panel p-2.5">
            <div className="flex items-center justify-between text-[0.65rem]">
              <span className="font-semibold text-primary">Risk</span>
              <span className="rounded border border-focus/60 px-1 py-0.5 text-[0.6rem] text-focus">
                NASA experimental data
              </span>
            </div>
            <p className="mt-1 font-mono text-lg font-semibold text-amber">54 / 100</p>
            <p className="text-[0.65rem] text-muted">Moderate flammability risk</p>
          </div>
          <div className="rounded-lg border border-focus/60 bg-panel p-2.5">
            <p className="text-[0.65rem] font-semibold text-primary">Telemetry</p>
            <div className="mt-1.5 grid grid-cols-2 gap-1 font-mono text-[0.65rem]">
              <span className="text-muted">Burn: <strong className="text-primary">0.07 mm/s</strong></span>
              <span className="text-muted">O₂ lim: <strong className="text-primary">17.1%</strong></span>
              <span className="text-muted">CO: <strong className="text-primary">370 ppm</strong></span>
              <span className="text-muted">CO₂: <strong className="text-primary">0.9%</strong></span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-subtle bg-panel px-3 py-2 text-[0.7rem]">
          <span className="inline-flex items-center gap-1.5 text-secondary">
            <Sparkles className="size-3.5 text-focus" aria-hidden />
            SI Safety Copilot & FWM PFE Sizing
          </span>
          <span className="inline-flex items-center gap-1 text-muted">
            <ShieldAlert className="size-3.5" aria-hidden />
            Grounded
          </span>
        </div>
      </div>
    ),
  },
]

interface SimulatorTutorialModalProps {
  open: boolean
  onClose: () => void
}

export function SimulatorTutorialModal({ open, onClose }: SimulatorTutorialModalProps) {
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    if (open) setStepIndex(0)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const step = TUTORIAL_STEPS[stepIndex]
  const isFirst = stepIndex === 0
  const isLast = stepIndex === TUTORIAL_STEPS.length - 1

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutorial-title"
      data-testid="simulator-tutorial"
      className="fixed inset-0 z-50 flex items-center justify-center bg-void/80 p-4 backdrop-blur-sm"
    >
      <div className="flex max-h-[90dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-subtle bg-panel shadow-2xl">
        <header className="flex items-start justify-between gap-3 border-b border-subtle px-5 py-4">
          <div>
            <p className="font-mono text-[0.7rem] uppercase tracking-wider text-focus">
              Simulator Tutorial · Step {stepIndex + 1} of {TUTORIAL_STEPS.length}
            </p>
            <h2 id="tutorial-title" className="mt-0.5 text-base font-semibold text-primary">
              {step.title}
            </h2>
            <p className="text-xs text-muted">{step.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close tutorial"
            className="rounded-lg border border-subtle bg-void p-1.5 text-secondary transition-colors hover:border-focus hover:text-primary"
          >
            <X className="size-4" aria-hidden />
          </button>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          <p className="text-sm leading-relaxed text-secondary">{step.summary}</p>
          {step.renderVisual()}
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-subtle bg-void/60 px-5 py-3">
          <div className="flex items-center gap-1.5" aria-label="Tutorial steps">
            {TUTORIAL_STEPS.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setStepIndex(idx)}
                aria-label={`Go to step ${idx + 1}: ${item.shortTitle}`}
                aria-current={idx === stepIndex ? 'step' : undefined}
                className={`h-2 rounded-full transition-all ${
                  idx === stepIndex ? 'w-6 bg-brand' : 'w-2 bg-subtle hover:bg-secondary'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-2.5 py-1.5 text-xs text-muted transition-colors hover:text-primary"
            >
              Skip
            </button>
            <button
              type="button"
              onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
              disabled={isFirst}
              aria-label="Previous step"
              className="inline-flex items-center gap-1 rounded-lg border border-subtle bg-panel px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:border-focus disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft className="size-3.5" aria-hidden />
              Back
            </button>
            {isLast ? (
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-1.5 text-xs font-semibold text-hero transition-colors hover:bg-brand/90"
              >
                Start Simulating
                <ArrowRight className="size-3.5" aria-hidden />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStepIndex((i) => Math.min(TUTORIAL_STEPS.length - 1, i + 1))}
                aria-label="Next step"
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-1.5 text-xs font-semibold text-hero transition-colors hover:bg-brand/90"
              >
                Next
                <ArrowRight className="size-3.5" aria-hidden />
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  )
}

interface SimulatorHelpModalProps {
  open: boolean
  onClose: () => void
  onReplayTutorial: () => void
}

export function SimulatorHelpModal({ open, onClose, onReplayTutorial }: SimulatorHelpModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
      data-testid="simulator-help-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-void/80 p-4 backdrop-blur-sm"
    >
      <div className="flex max-h-[90dvh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-subtle bg-panel shadow-2xl">
        <header className="flex items-start justify-between gap-3 border-b border-subtle px-5 py-4">
          <div>
            <p className="font-mono text-[0.7rem] uppercase tracking-wider text-focus">Quick Reference</p>
            <h2 id="help-modal-title" className="mt-0.5 text-base font-semibold text-primary">
              Simulator Help & Step-by-Step Guide
            </h2>
            <p className="text-xs text-muted">
              Static overview of every step in the AstroFire 3D workflow.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close help"
            className="rounded-lg border border-subtle bg-void p-1.5 text-secondary transition-colors hover:border-focus hover:text-primary"
          >
            <X className="size-4" aria-hidden />
          </button>
        </header>

        <div className="grid flex-1 gap-4 overflow-y-auto p-5 md:grid-cols-2">
          {TUTORIAL_STEPS.slice(1).map((step, idx) => (
            <section
              key={step.id}
              data-testid={`help-card-${step.id}`}
              className="flex flex-col justify-between gap-3 rounded-xl border border-subtle bg-void/70 p-4"
            >
              <div>
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <span className="font-mono text-[0.65rem] font-semibold uppercase tracking-wider text-focus">
                    Step {idx + 1} · {step.shortTitle}
                  </span>
                </div>
                <h3 className="text-xs font-semibold text-primary">{step.title}</h3>
                <p className="mt-1 text-[0.7rem] leading-relaxed text-secondary">{step.summary}</p>
              </div>
              <div className="pointer-events-none select-none">{step.renderVisual()}</div>
            </section>
          ))}
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-subtle bg-void/60 px-5 py-3">
          <button
            type="button"
            onClick={onReplayTutorial}
            className="inline-flex items-center gap-1.5 rounded-lg border border-focus/70 bg-elevated/60 px-3.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:border-focus hover:bg-elevated"
          >
            <RotateCcw className="size-3.5 text-focus" aria-hidden />
            Replay tutorial
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-brand px-4 py-1.5 text-xs font-semibold text-hero transition-colors hover:bg-brand/90"
          >
            Close
          </button>
        </footer>
      </div>
    </div>
  )
}

export function SimulatorHelpButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Simulator help"
      title="Help & tutorial"
      data-testid="simulator-help-button"
      className="fixed right-5 bottom-5 z-40 inline-flex size-10 items-center justify-center rounded-full border border-focus/60 bg-panel text-primary shadow-lg transition-colors hover:border-focus hover:bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
    >
      <HelpCircle className="size-5 text-focus" aria-hidden />
    </button>
  )
}
