// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { useId, type ReactNode } from 'react'

interface TooltipProps {
  label: ReactNode
  /** Renders the trigger; pass the id to aria-describedby on the trigger. */
  children: (tooltipId: string | undefined) => ReactNode
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'bottom'
  /** Make the wrapper focusable (for disabled or non-interactive triggers). */
  focusable?: boolean
}

const ALIGN = { start: 'left-0', center: 'left-1/2 -translate-x-1/2', end: 'right-0' }
const SIDE = { top: 'bottom-full mb-2', bottom: 'top-full mt-2' }

/** Small hover/focus tooltip. Works on disabled buttons because the wrapper receives the hover. */
export function Tooltip({ label, children, align = 'center', side = 'top', focusable = false }: TooltipProps) {
  const id = useId()
  // With no label, keep the wrapper (so the trigger is not remounted) but render no tooltip.
  if (label === null || label === undefined || label === '') {
    return <span className="relative inline-flex">{children(undefined)}</span>
  }
  return (
    <span className="group/tt relative inline-flex" tabIndex={focusable ? 0 : undefined}>
      {children(id)}
      <span
        id={id}
        role="tooltip"
        className={`pointer-events-none invisible absolute z-30 w-max max-w-64 rounded-md border border-subtle bg-elevated px-2.5 py-1.5 text-left text-xs leading-snug font-normal tracking-normal text-secondary normal-case opacity-0 shadow-lg transition-opacity duration-150 group-focus-within/tt:visible group-focus-within/tt:opacity-100 group-hover/tt:visible group-hover/tt:opacity-100 ${ALIGN[align]} ${SIDE[side]}`}
      >
        {label}
      </span>
    </span>
  )
}
