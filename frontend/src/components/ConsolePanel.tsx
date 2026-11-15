// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import type { ReactNode } from 'react'

interface ConsolePanelProps {
  title: string
  /** Optional element aligned right in the panel header (tags, counters). */
  aside?: ReactNode
  children: ReactNode
  className?: string
  bodyClassName?: string
  id?: string
}

/** Telemetry module: hairline-bordered panel with a mono uppercase header. */
export function ConsolePanel({ title, aside, children, className = '', bodyClassName = 'p-4', id }: ConsolePanelProps) {
  const headingId = id ? `${id}-title` : undefined
  return (
    <section id={id} aria-labelledby={headingId} className={`border border-subtle bg-panel ${className}`}>
      <header className="flex min-h-9 flex-wrap items-center justify-between gap-2 border-b border-subtle px-4 py-2">
        <h2 id={headingId} className="label-mono">
          {title}
        </h2>
        {aside}
      </header>
      <div className={bodyClassName}>{children}</div>
    </section>
  )
}

/** Small uppercase tag used for MOCK / STALE / source markers. */
export function Tag({ tone = 'neutral', children }: { tone?: 'neutral' | 'warning' | 'focus' | 'critical'; children: ReactNode }) {
  const tones = {
    neutral: 'border-subtle text-secondary',
    warning: 'border-warning text-warning',
    focus: 'border-focus text-focus',
    critical: 'border-critical text-critical',
  }
  return (
    <span className={`inline-flex items-center border px-1.5 py-0.5 whitespace-nowrap font-mono text-[0.625rem] tracking-[0.1em] uppercase ${tones[tone]}`}>
      {children}
    </span>
  )
}
