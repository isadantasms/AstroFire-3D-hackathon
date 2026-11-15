// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { useEffect, useId, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { Menu, X } from 'lucide-react'
import { BrandMark, Wordmark } from '../components/BrandMark'
import { NAV_ITEMS } from './routes'

/**
 * Sticky site header. From lg (1024px) the links sit inline; below it they collapse behind a menu
 * button and open as a full-width list (44px rows). The menu closes on navigation and on Esc.
 */
export function Header() {
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const { pathname, hash } = useLocation()

  useEffect(() => setOpen(false), [pathname, hash])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="sticky top-0 z-40 border-b border-subtle bg-hero/95 backdrop-blur-sm lg:h-14">
      <div className="mx-auto flex max-w-[1920px] flex-wrap items-center justify-between gap-x-6 px-4 py-1.5 sm:px-6 lg:h-full lg:py-0">
        {/* Lockup: simple mark slightly taller than the wordmark. */}
        <Link to="/" className="flex min-h-11 items-center gap-2" aria-label="AstroFire 3D home">
          <BrandMark size={26} />
          <Wordmark className="text-[1.125rem] leading-none" />
        </Link>

        <button
          type="button"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
          className="-mr-2 inline-flex size-11 items-center justify-center rounded-lg text-secondary transition-colors hover:text-primary lg:hidden"
        >
          {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
        </button>

        <nav id={menuId} aria-label="Primary" className={`${open ? 'block' : 'hidden'} w-full pb-2 lg:block lg:h-full lg:w-auto lg:pb-0`}>
          <ul className="flex flex-col lg:h-full lg:flex-row lg:items-center lg:gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.to} className="lg:h-full">
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    [
                      'flex min-h-11 items-center border-l-2 px-3 text-sm transition-colors lg:h-full lg:border-b-2 lg:border-l-0',
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
