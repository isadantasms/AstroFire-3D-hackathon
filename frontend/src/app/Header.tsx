// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { Link, NavLink } from 'react-router'
import { BrandMark, Wordmark } from '../components/BrandMark'
import { NAV_ITEMS } from './routes'

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-subtle bg-hero/95 backdrop-blur-sm lg:h-14">
      <div className="mx-auto flex max-w-[1920px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 sm:px-6 lg:h-full lg:py-0">
        {/* Lockup: icon ≈ 1.35× the cap height of the wordmark, gap ≈ 0.4× the icon height. */}
        <Link to="/" className="flex items-center gap-[7px]" aria-label="AstroFire home">
          <BrandMark size={20} />
          <Wordmark className="text-[1.125rem] leading-none" />
        </Link>

        <nav aria-label="Primary" className="lg:h-full">
          <ul className="flex flex-wrap items-center gap-1 lg:h-full">
            {NAV_ITEMS.map((item) => (
              <li key={item.to} className="lg:h-full">
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    [
                      'flex items-center border-b-2 px-3 py-1.5 text-sm transition-colors lg:h-full lg:py-0',
                      isActive
                        ? 'border-brand text-primary'
                        : 'border-transparent text-secondary hover:text-primary',
                    ].join(' ')
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
