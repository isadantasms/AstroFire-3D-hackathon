// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { useEffect, type RefObject } from 'react'

/**
 * Reveals `[data-reveal]` elements (fade + slight rise) the first time they enter
 * the viewport. Without IntersectionObserver, or with reduced motion, everything
 * is shown immediately.
 */
export function useReveal(rootRef: RefObject<HTMLElement | null>, reduced: boolean) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const elements = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (reduced || typeof IntersectionObserver === 'undefined') {
      elements.forEach((el) => el.classList.add('is-visible'))
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [rootRef, reduced])
}
