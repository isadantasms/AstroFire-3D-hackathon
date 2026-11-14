// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { Check } from 'lucide-react'

const STEPS = ['Simulate', 'Measure risk', 'Suppress'] as const

/** Simulate -> Measure risk -> Suppress, with the current step highlighted. */
export function CycleBar({ current }: { current: 1 | 2 | 3 }) {
  return (
    <nav aria-label="Simulation cycle" className="border-b border-subtle bg-hero/70 px-4 py-2.5 sm:px-6">
      <ol className="mx-auto flex max-w-xl items-center justify-center gap-2 sm:gap-3" data-testid="cycle-bar">
        {STEPS.map((name, i) => {
          const n = i + 1
          const state = n < current ? 'done' : n === current ? 'current' : 'next'
          return (
            <li key={name} className="flex items-center gap-2 sm:gap-3" aria-current={state === 'current' ? 'step' : undefined}>
              {i > 0 ? (
                <span
                  aria-hidden="true"
                  className={`h-px w-6 sm:w-10 ${n <= current ? 'bg-brand/70' : 'bg-subtle'}`}
                />
              ) : null}
              <span className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={`inline-flex size-6 items-center justify-center rounded-full font-mono text-[0.6875rem] font-semibold tabular-nums ${
                    state === 'current'
                      ? 'bg-brand text-void'
                      : state === 'done'
                        ? 'border border-brand/70 text-brand'
                        : 'border border-subtle text-muted'
                  }`}
                >
                  {state === 'done' ? <Check className="size-3.5" /> : n}
                </span>
                <span
                  className={`text-sm whitespace-nowrap ${
                    state === 'current' ? 'font-medium text-primary' : state === 'done' ? 'text-secondary' : 'text-muted'
                  }`}
                >
                  {name}
                </span>
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
