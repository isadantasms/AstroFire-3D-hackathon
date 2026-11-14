// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { FlameRegimeSchematic } from './FlameRegimeSchematic'
import { LINKS } from '../app/routes'

/** "Fig. 01" figure (moved from the Home to Research & Data). */
export function FlameGeometryFigure() {
  return (
    <section aria-labelledby="figure-title" className="grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div>
        <p className="label-mono">Fig. 01 · Flame geometry</p>
        <h2 id="figure-title" className="mt-3 text-2xl font-semibold tracking-tight text-primary">
          Two regimes, one console
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-secondary">
          Each simulation returns a flame geometry: spherical when the air is still in microgravity,
          elongated when airflow or gravity stretches it. The 3D chamber, the telemetry and the
          citations all read from that same result.
        </p>
        <Link
          to={LINKS.simulator}
          className="mt-6 inline-flex items-center gap-1.5 text-sm text-brand underline-offset-4 hover:underline"
        >
          Try both regimes in the simulator
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
      <FlameRegimeSchematic />
    </section>
  )
}
