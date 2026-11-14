// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import type { ReactNode } from 'react'

interface PageHeaderProps {
  eyebrow: string
  title: string
  lead?: ReactNode
}

export function PageHeader({ eyebrow, title, lead }: PageHeaderProps) {
  return (
    <header className="border-b border-subtle">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="label-mono">{eyebrow}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
          {title}
        </h1>
        {lead ? <p className="mt-4 max-w-3xl text-base leading-relaxed text-secondary">{lead}</p> : null}
      </div>
    </header>
  )
}
