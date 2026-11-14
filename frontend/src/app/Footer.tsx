// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { Link } from 'react-router'
import { BrandMark } from '../components/BrandMark'
import { LINKS } from './routes'

export function Footer() {
  return (
    <footer className="border-t border-subtle bg-panel">
      <div className="mx-auto grid max-w-[1920px] gap-8 px-4 py-8 sm:px-6 md:grid-cols-[1fr_auto]">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <BrandMark size={18} />
            <span className="font-mono text-xs tracking-[0.14em] text-primary uppercase">
              [PROJECT_NAME]
            </span>
          </div>
          <p className="text-sm leading-relaxed text-secondary" data-testid="footer-disclaimer">
            <strong className="font-medium text-primary">For research and education only.</strong>{' '}
            [PROJECT_NAME] outputs are not certified safety assessments, and suppression guidance is
            not an approved operational procedure. The 3D chamber is a parameter-driven
            illustration, not a validated CFD simulation.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-col gap-2 text-sm md:items-end">
          <Link to={LINKS.siUsage} className="text-secondary hover:text-primary">
            SI Usage
          </Link>
          <Link to={LINKS.credits} className="text-secondary hover:text-primary">
            Credits &amp; Licenses
          </Link>
          <Link to={LINKS.research} className="text-secondary hover:text-primary">
            Research &amp; Data
          </Link>
        </nav>
      </div>

      <div className="border-t border-subtle">
        <div className="mx-auto flex max-w-[1920px] flex-col gap-1 px-4 py-4 text-xs text-muted sm:flex-row sm:justify-between sm:px-6">
          <p>
            Built for the NASA Space Apps Challenge 2026 · Challenge: Flame in Freefall. Not
            affiliated with or endorsed by NASA; no NASA insignia are used.
          </p>
          <p>Open source under the MIT License.</p>
        </div>
      </div>
    </footer>
  )
}
