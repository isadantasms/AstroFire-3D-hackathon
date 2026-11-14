// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/**
 * Decorative scroll trail (aria-hidden): a thin dashed blue line in the right margin,
 * starting where the hero rocket leaves, descending through one marker per section.
 * A small rocket follows the scroll; the travelled part turns orange and each marker
 * lights up when the rocket reaches it. Hidden below 1024px. With reduced motion the
 * line stays visible and static (no rocket, no progress).
 * Only transform and opacity change, driven by requestAnimationFrame.
 */
import { useEffect, useRef, useState, type RefObject } from 'react'
import { usePrefersReducedMotion } from '../hero/useMotionPreferences'
import { buildTrail, sampleAtY, type TrailLayout } from './trailPath'

export function ScrollRocketTrail({ rootRef }: { rootRef: RefObject<HTMLElement | null> }) {
  const reduced = usePrefersReducedMotion()
  const [layout, setLayout] = useState<TrailLayout | null>(null)
  const [height, setHeight] = useState(0)
  const rocketRef = useRef<SVGGElement | null>(null)
  const clipRectRef = useRef<SVGRectElement | null>(null)
  const markerRefs = useRef<(SVGGElement | null)[]>([])

  // Measure the page and the section markers; re-measure on resize.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const measure = () => {
      const rect = root.getBoundingClientRect()
      const markerYs = Array.from(root.querySelectorAll<HTMLElement>('[data-trail-marker]')).map(
        (el) => el.getBoundingClientRect().top - rect.top + 14,
      )
      const start = root.querySelector<HTMLElement>('[data-trail-start]')
      const startY = start ? start.getBoundingClientRect().bottom - rect.top - 48 : 560
      setHeight(root.scrollHeight)
      setLayout(buildTrail({ width: root.clientWidth, startY, markerYs }))
    }
    measure()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(measure)
    observer.observe(root)
    return () => observer.disconnect()
  }, [rootRef])

  // Follow the scroll.
  useEffect(() => {
    const root = rootRef.current
    if (!root || !layout || reduced) return
    const span = Math.max(1, layout.endY - layout.startY)
    let frame = 0
    const update = () => {
      frame = 0
      const y = Math.min(layout.endY, Math.max(layout.startY, window.innerHeight * 0.55 - root.getBoundingClientRect().top))
      const p = sampleAtY(layout, y)
      rocketRef.current?.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${p.angle.toFixed(1)})`)
      const progress = (y - layout.startY) / span
      clipRectRef.current?.setAttribute(
        'transform',
        `translate(0 ${layout.startY}) scale(1 ${progress.toFixed(4)}) translate(0 ${-layout.startY})`,
      )
      layout.markers.forEach((m, i) => {
        const el = markerRefs.current[i]
        if (el) el.dataset.lit = y >= m.y - 2 ? 'true' : 'false'
      })
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [rootRef, layout, reduced])

  if (!layout || layout.markers.length === 0) return null

  return (
    <svg
      className="pointer-events-none absolute top-0 left-0 hidden lg:block"
      width={layout.width}
      height={height}
      viewBox={`0 0 ${layout.width} ${height}`}
      aria-hidden="true"
      focusable="false"
      data-testid="scroll-trail"
    >
      <defs>
        <clipPath id="trail-progress">
          <rect
            ref={clipRectRef}
            x="0"
            y={layout.startY}
            width={layout.width}
            height={layout.endY - layout.startY}
            transform={`translate(0 ${layout.startY}) scale(1 0) translate(0 ${-layout.startY})`}
          />
        </clipPath>
      </defs>

      <path d={layout.d} fill="none" stroke="var(--brand-blue)" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="3 6" />
      {!reduced ? (
        <path d={layout.d} fill="none" stroke="var(--brand-orange)" strokeOpacity="0.85" strokeWidth="1.4" clipPath="url(#trail-progress)" />
      ) : null}

      {layout.markers.map((m, i) => (
        <g
          key={i}
          ref={(el) => {
            markerRefs.current[i] = el
          }}
          className="trail-marker"
          data-lit="false"
          transform={`translate(${m.x.toFixed(1)} ${m.y.toFixed(1)})`}
        >
          <circle r="5" fill="var(--bg-void)" stroke="var(--brand-blue)" strokeOpacity="0.5" />
          <circle className="trail-marker-light" r="5" fill="var(--brand-orange)" />
          <circle className="trail-marker-light" r="10" fill="none" stroke="var(--brand-orange)" strokeOpacity="0.35" />
        </g>
      ))}

      {!reduced ? (
        <g ref={rocketRef} transform={`translate(${layout.markers[0].x} ${layout.startY}) rotate(180)`}>
          <g transform="scale(0.42)">
            <path d="M-3.5 18 L0 32 L3.5 18 Z" fill="var(--brand-amber)" />
            <path d="M0 -34 C9 -24 10 -8 9 14 L-9 14 C-10 -8 -9 -24 0 -34 Z" fill="var(--text-primary)" />
            <circle cx="0" cy="-11" r="3.6" fill="var(--bg-void)" stroke="var(--brand-blue)" strokeWidth="1.4" />
            <path d="M-9 2 L-17 19 L-9 14 Z" fill="var(--brand-orange)" />
            <path d="M9 2 L17 19 L9 14 Z" fill="var(--brand-orange)" />
          </g>
        </g>
      ) : null}
    </svg>
  )
}
