// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { Link } from 'react-router'
import { BrandMark, Wordmark } from '../components/BrandMark'
import { LINKS } from './routes'

const LINK = 'transition-colors hover:text-primary'

/**
 * One discreet line. Sources, licenses and credits live in Research & Data,
 * SI usage on the Home, and research disclaimers next to the content they qualify.
 */
export function Footer() {
  return (
    <footer className="relative bg-hero">
      <div className="mx-auto flex max-w-[1920px] flex-col gap-2 px-4 py-4 text-xs text-[#7D8BA1] sm:px-6 md:flex-row md:items-center md:justify-between md:gap-6">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="inline-flex items-center gap-1.5">
            <BrandMark size={14} />
            <Wordmark className="text-xs" />
          </span>
          <span data-testid="footer-credit">© 2026 21 Pyro Rangers · Built for NASA Space Apps Challenge 2026</span>
        </p>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-4 gap-y-1">
          <Link to={LINKS.research} className={LINK}>
            Research &amp; Data
          </Link>
          <Link to={LINKS.siUsage} className={LINK}>
            SI Usage
          </Link>
          <Link to={LINKS.credits} className={LINK}>
            Credits
          </Link>
        </nav>
      </div>
    </footer>
  )
}
