// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { Tag } from '../../../components/ConsolePanel'
import { fmt } from '../../../lib/format'
import type { Simulation3D } from '../../../types/contract'

export interface FlameChamberProps {
  /** simulation_3d block of the latest result; null before the first run. */
  params: Simulation3D | null
  loading: boolean
  stale: boolean
  mock: boolean
}

/**
 * STATIC placeholder for the 3D Flame Chamber (Esquivel's module).
 * Integration boundary: the 3D module will receive exactly these props and render
 * from `params` (contract simulation_3d). Nothing here is animated or simulated.
 */
export function FlameChamberPlaceholder({ params, loading, stale, mock }: FlameChamberProps) {
  return (
    <div className="relative flex h-full min-h-64 flex-col border border-subtle bg-void" data-testid="chamber-placeholder">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-subtle bg-panel px-4 py-2">
        <h2 className="label-mono">3D flame chamber</h2>
        <div className="flex flex-wrap gap-1.5">
          {mock && params ? <Tag tone="warning">Mock data</Tag> : null}
          {stale ? <Tag tone="warning">Stale</Tag> : null}
          <Tag>Static placeholder</Tag>
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden">
        <ChamberGrid />
        {params ? <StaticFlame params={params} dimmed={stale || loading} /> : null}
        {!params && !loading ? (
          <p className="relative max-w-xs text-center text-sm text-muted">
            Run a simulation to send flame parameters to the chamber.
          </p>
        ) : null}
        {loading ? (
          <p className="absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-xs text-secondary" role="status">
            Receiving parameters…
          </p>
        ) : null}
      </div>

      <dl className="grid grid-cols-2 gap-px border-t border-subtle bg-subtle sm:grid-cols-4">
        <Readout label="Geometry" value={params?.flame_geometry ?? '—'} />
        <Readout label="Burn rate" value={fmt(params?.burn_rate_mm_s, 3)} unit="mm/s" />
        <Readout
          label="Flame color"
          value={params?.flame_color_hex ?? '—'}
          swatch={params?.flame_color_hex}
        />
        <Readout label="Oxygen factor" value={fmt(params?.oxygen_factor, 2)} />
      </dl>

      <p className="border-t border-subtle bg-panel px-4 py-1.5 text-[0.6875rem] text-muted">
        The interactive 3D chamber module is in development and will render here. This static view is
        an illustration, not a simulation.
      </p>
    </div>
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

function StaticFlame({ params, dimmed }: { params: Simulation3D; dimmed: boolean }) {
  const color = params.flame_color_hex
  const extinguished = params.oxygen_factor === 0
  const opacity = extinguished ? 0 : 0.35 + 0.65 * params.oxygen_factor
  return (
    <svg
      viewBox="0 0 300 160"
      className={`relative w-full max-w-md transition-opacity ${dimmed ? 'opacity-40' : 'opacity-100'}`}
      role="img"
      aria-label={
        extinguished
          ? 'Static illustration: flame extinguished'
          : `Static illustration: ${params.flame_geometry} flame`
      }
    >
      <defs>
        <radialGradient id="flame-fill" cx={params.flame_geometry === 'spherical' ? '50%' : '35%'} cy="50%" r="60%">
          <stop offset="0%" stopColor={color} stopOpacity={0.7 * opacity} />
          <stop offset="70%" stopColor={color} stopOpacity={0.2 * opacity} />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      {params.flame_geometry === 'spherical' ? (
        <>
          <circle cx="150" cy="80" r="62" fill="url(#flame-fill)" />
          <circle cx="150" cy="80" r="44" fill="none" stroke={color} strokeOpacity={opacity} strokeWidth="1.5" />
        </>
      ) : (
        <>
          <ellipse cx="170" cy="80" rx="105" ry="38" fill="url(#flame-fill)" />
          <path
            d="M88 80 C 100 50, 180 48, 272 80 C 180 112, 100 110, 88 80 Z"
            fill="none"
            stroke={color}
            strokeOpacity={opacity}
            strokeWidth="1.5"
          />
          {[52, 80, 108].map((y) => (
            <g key={y} stroke="var(--text-muted)" strokeWidth="1.2" fill="none">
              <line x1="14" y1={y} x2="48" y2={y} />
              <polyline points={`43,${y - 4} 48,${y} 43,${y + 4}`} />
            </g>
          ))}
        </>
      )}
      <rect x={params.flame_geometry === 'spherical' ? 142 : 80} y="72" width="16" height="16" fill="var(--text-secondary)" />
      {extinguished ? (
        <text x="150" y="140" textAnchor="middle" className="fill-[var(--text-secondary)] font-mono text-[11px]">
          FLAME EXTINGUISHED
        </text>
      ) : null}
    </svg>
  )
}
