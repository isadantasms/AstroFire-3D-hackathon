// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import { Header } from './Header'
import { Footer } from './Footer'

/** Scrolls to the top on route change, or to the element named by the URL hash. */
function useScrollRestoration() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (target) {
        target.scrollIntoView({ block: 'start' })
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
}

export function Layout() {
  useScrollRestoration()

  return (
    <div className="flex min-h-screen flex-col bg-void text-primary">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:border focus:border-focus focus:bg-panel focus:px-3 focus:py-2 focus:text-sm"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
