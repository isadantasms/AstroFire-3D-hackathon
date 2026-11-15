// SI-assisted: generated with Claude, reviewed and edited by Elias
import { useEffect, useState, type ReactNode } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  CircleOff,
  Droplets,
  Flame,
  HelpCircle,
  Play,
  RotateCcw,
  X,
} from 'lucide-react'

interface TutorialStepDef {
  id: string
  shortTitle: string
  title: string
  summary: string
  renderVisual: () => ReactNode
}

const TUTORIAL_STEPS: TutorialStepDef[] = [
  {
    id: 'welcome',
    shortTitle: 'Overview',
    title: 'Welcome to AstroFire 3D',
    summary:
      'Simulate how spacecraft materials ignite, spread, and extinguish across orbital and planetary gravity regimes.',
    renderVisual: () => (
      <div className="grid gap-2.5 sm:grid-cols-3">
        <div className="rounded-xl border border-subtle bg-void/60 p-3.5">
          <span className="font-mono text-[0.65rem] text-muted">01</span>
          <p className="mt-1 text-xs font-medium text-primary">Mission Controls</p>
          <p className="mt-1 text-xs leading-relaxed text-secondary">
            Pick material, gravity, oxygen, and airflow.
          </p>
        </div>
        <div className="rounded-xl border border-subtle bg-void/60 p-3.5">
          <span className="font-mono text-[0.65rem] text-muted">02</span>
          <p className="mt-1 text-xs font-medium text-primary">3D Flame Chamber</p>
          <p className="mt-1 text-xs leading-relaxed text-secondary">
            Inspect flame geometry and trigger water-mist suppression.
          </p>
        </div>
        <div className="rounded-xl border border-subtle bg-void/60 p-3.5">
          <span className="font-mono text-[0.65rem] text-muted">03</span>
          <p className="mt-1 text-xs font-medium text-primary">Results & Copilot</p>
          <p className="mt-1 text-xs leading-relaxed text-secondary">
            Review risk score, telemetry, and NASA BASS-II sources.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'material',
    shortTitle: 'Material',
    title: 'Step 1 · Select Material',
    summary:
      'Choose one of the 7 NASA BASS-II materials in the left panel to load its nominal thickness and combustion properties.',
    renderVisual: () => (
      <div className="mx-auto max-w-sm rounded-xl border border-subtle bg-void/60 p-3.5">
        <div className="flex items-center justify-between text-xs text-muted">
          <span>Material</span>
          <span className="font-mono text-[0.6875rem]">Thickness · 2.00 mm</span>
        </div>
        <div className="mt-2 flex items-center justify-between gap-2 rounded-lg border border-focus/70 bg-panel px-3 py-2.5">
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-primary">PMMA Clear Cast Slab</p>
            <p className="truncate text-[0.6875rem] text-secondary">Acrylic spacecraft window panel</p>
          </div>
          <span className="shrink-0 rounded border border-subtle bg-void px-1.5 py-0.5 font-mono text-[0.65rem] text-secondary">
            2.00 mm
          </span>
        </div>
      </div>
    ),
  },
  {
    id: 'gravity',
    shortTitle: 'Gravity',
    title: 'Step 2 · Choose Gravity Regime',
    summary:
      'Switch between ISS, Moon, Mars, and Earth to compare microgravity diffusion flames against buoyant planetary flames.',
    renderVisual: () => (
      <div className="mx-auto max-w-sm rounded-xl border border-subtle bg-void/60 p-3.5">
        <p className="mb-2 text-xs text-muted">Gravity</p>
        <div className="grid grid-cols-4 gap-1 rounded-lg border border-subtle bg-panel p-1">
          {[
            { short: 'ISS', g: '0.00 g', active: true },
            { short: 'Moon', g: '0.16 g', active: false },
            { short: 'Mars', g: '0.38 g', active: false },
            { short: 'Earth', g: '1.00 g', active: false },
          ].map((item) => (
            <div
              key={item.short}
              className={`rounded-md px-1 py-1.5 text-center ${
                item.active ? 'bg-elevated text-primary ring-1 ring-focus/60' : 'text-secondary'
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
    summary:
      'Adjust cabin oxygen concentration and airflow velocity, then click Run Simulation to compute the prediction.',
    renderVisual: () => (
      <div className="mx-auto max-w-sm space-y-3 rounded-xl border border-subtle bg-void/60 p-3.5">
        <div className="space-y-2.5">
          <div>
            <div className="flex justify-between text-xs">
              <span className="text-secondary">Oxygen</span>
              <span className="font-mono text-primary">21.0 % O₂</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full rounded-full bg-panel">
              <div className="h-1.5 w-[37%] rounded-full bg-brand" />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs">
              <span className="text-secondary">Airflow</span>
              <span className="font-mono text-primary">5.0 cm/s</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full rounded-full bg-panel">
              <div className="h-1.5 w-[15%] rounded-full bg-brand" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-1.5 rounded-lg bg-brand py-2 text-xs font-semibold text-hero">
          <Play className="size-3.5 fill-current" aria-hidden />
          Run Simulation
        </div>
      </div>
    ),
  },
  {
    id: 'flame',
    shortTitle: '3D Flame',
    title: 'Step 4 · Observe the 3D Flame',
    summary:
      'In microgravity, flames form a compact blue sphere fed by slow oxygen diffusion; under gravity, buoyancy elongates the plume.',
    renderVisual: () => (
      <div className="mx-auto max-w-md rounded-xl border border-subtle bg-void/60 p-3.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-secondary">3D chamber</span>
          <span className="inline-flex items-center gap-1 text-brand">
            <Flame className="size-3.5" aria-hidden />
            Burning
          </span>
        </div>
        <div className="mt-2.5 flex h-28 flex-col items-center justify-center rounded-lg border border-subtle bg-hero">
          <svg viewBox="0 0 240 100" className="h-20 w-48" role="img" aria-label="Static 0g blue spherical flame">
            <defs>
              <radialGradient id="tut-flame-0g" cx="50%" cy="50%" r="55%">
                <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.9" />
                <stop offset="55%" stopColor="#3b82f6" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="120" cy="50" r="36" fill="url(#tut-flame-0g)" />
            <circle cx="120" cy="50" r="24" fill="none" stroke="#3b82f6" strokeWidth="1.25" strokeOpacity="0.8" />
            <rect x="113" y="45" width="14" height="10" rx="2" fill="#b4c0d3" />
          </svg>
        </div>
      </div>
    ),
  },
  {
    id: 'suppress',
    shortTitle: 'Extinguisher',
    title: 'Step 5 · Discharge FWM PFE',
    summary:
      'When a sample is burning, use Discharge FWM PFE below Run Simulation to release the water-mist spray and extinguish the flame.',
    renderVisual: () => (
      <div className="mx-auto max-w-sm space-y-2.5 rounded-xl border border-subtle bg-void/60 p-3.5">
        <div className="flex items-center justify-center gap-1.5 rounded-lg border border-focus bg-focus py-2 text-xs font-semibold text-hero">
          <Droplets className="size-3.5" aria-hidden />
          Discharge FWM PFE
        </div>
        <div className="flex items-center justify-between rounded-lg border border-subtle bg-panel px-3 py-2 text-xs">
          <span className="inline-flex items-center gap-1.5 text-secondary">
            <CircleOff className="size-3.5" aria-hidden />
            Extinguished
          </span>
          <span className="font-mono text-[0.6875rem] text-muted">after FWM PFE discharge</span>
        </div>
      </div>
    ),
  },
  {
    id: 'results',
    shortTitle: 'Results',
    title: 'Step 6 · Interpret Results & Copilot',
    summary:
      'Check the right-hand panel for the flammability risk score, burn rate telemetry, extinguisher sizing, and NASA citations.',
    renderVisual: () => (
      <div className="mx-auto max-w-md grid gap-2.5 sm:grid-cols-2">
        <div className="rounded-xl border border-subtle bg-void/60 p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-secondary">Risk</span>
            <span className="font-mono text-[0.65rem] text-focus">NASA data</span>
          </div>
          <p className="mt-1 font-mono text-base font-semibold text-amber">54 / 100</p>
          <p className="text-[0.6875rem] text-muted">Moderate Alert</p>
        </div>
        <div className="rounded-xl border border-subtle bg-void/60 p-3">
          <p className="text-xs text-secondary">Telemetry</p>
          <div className="mt-1.5 grid grid-cols-2 gap-1 font-mono text-[0.6875rem]">
            <span className="text-muted">Burn: <strong className="font-normal text-primary">0.07 mm/s</strong></span>
            <span className="text-muted">LOI: <strong className="font-normal text-primary">17.1%</strong></span>
            <span className="text-muted">CO: <strong className="font-normal text-primary">370 ppm</strong></span>
            <span className="text-muted">CO₂: <strong className="font-normal text-primary">0.9%</strong></span>
          </div>
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
        <header className="flex items-start justify-between gap-4 px-6 pt-5 pb-3">
          <div>
            <p className="font-mono text-[0.6875rem] tracking-[0.14em] text-muted uppercase">
              Tutorial walkthrough · Demo preview
            </p>
            <h2 id="tutorial-title" className="mt-1 text-lg font-semibold tracking-tight text-primary">
              {step.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close tutorial"
            className="inline-flex items-center justify-center rounded-lg border border-subtle bg-void/60 p-1.5 text-secondary transition-colors hover:border-label hover:text-primary"
          >
            <X className="size-4" aria-hidden />
          </button>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-3">
          <p className="text-sm leading-relaxed text-secondary">{step.summary}</p>
          <div className="pointer-events-none select-none" aria-hidden="true">
            {step.renderVisual()}
          </div>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-subtle bg-void/40 px-6 py-3">
          <div className="flex items-center gap-1.5" aria-label="Tutorial steps">
            {TUTORIAL_STEPS.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setStepIndex(idx)}
                aria-label={`Go to step ${idx + 1}: ${item.shortTitle}`}
                aria-current={idx === stepIndex ? 'step' : undefined}
                className="group inline-flex !min-h-0 !min-w-0 items-center justify-center rounded-full"
              >
                <span
                  className={`inline-flex size-7 items-center justify-center rounded-full font-mono text-xs tabular-nums transition-colors ${
                    idx === stepIndex
                      ? 'bg-brand font-semibold text-hero'
                      : 'bg-void/80 text-secondary ring-1 ring-subtle group-hover:text-primary group-hover:ring-label'
                  }`}
                >
                  {idx + 1}
                </span>
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
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
            className="inline-flex items-center justify-center rounded-lg border border-subtle bg-void p-1.5 text-secondary transition-colors hover:border-focus hover:text-primary"
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
