// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router'
import { ArrowRight, Play } from 'lucide-react'
import { FlameRegimeSchematic } from '../components/FlameRegimeSchematic'
import { RocketHeroBackdrop } from '../components/RocketHeroBackdrop'
import { LINKS } from '../app/routes'

// TODO(pitch): replace with the public URL of the 30-second pitch video once it is published.
const PITCH_VIDEO_URL = '#'

/** Entrance order: 80 ms between hero elements ("safer." comes last). */
function stagger(step: number): CSSProperties {
  return { '--d': `${step * 80}ms` } as CSSProperties
}

export function HomePage() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <FigureSection />
    </>
  )
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-subtle bg-hero" aria-labelledby="hero-title">
      <RocketHeroBackdrop />
      <div className="relative mx-auto flex min-h-[560px] max-w-4xl flex-col items-center justify-center px-4 py-20 text-center sm:min-h-[640px] sm:px-6">
        <p className="hero-rise font-mono text-[0.75rem] tracking-[0.18em] text-label uppercase" style={stagger(0)}>
          <span className="text-brand" aria-hidden>
            ●
          </span>{' '}
          Flame in Freefall · Space Apps 2026
        </p>

        <h1
          id="hero-title"
          className="hero-rise mt-6 text-[2.5rem] leading-[1.05] font-semibold tracking-[-0.02em] text-primary sm:text-6xl lg:text-[4.25rem]"
          style={stagger(1)}
        >
          Make the next giant leap{' '}
          <span className="safer-in relative inline-block text-brand" style={stagger(5)}>
            safer.
            <span className="safer-glow absolute inset-0" style={stagger(5)} aria-hidden="true">
              safer.
            </span>
          </span>
        </h1>

        <p className="hero-rise mt-6 max-w-2xl text-base leading-relaxed text-secondary sm:text-lg" style={stagger(2)}>
          Turn complex space fire research into clear answers: simulate scenarios, compare
          investigations and get cited safety guidance in seconds.
        </p>

        <div className="hero-rise mt-10 flex flex-wrap items-center justify-center gap-3" style={stagger(3)}>
          <Link
            to={LINKS.simulator}
            className="group relative inline-flex items-center gap-2 rounded-[10px] border border-brand bg-brand px-5 py-3 text-sm font-semibold text-hero transition-transform duration-200 ease-out hover:-translate-y-0.5"
          >
            {/* Orange glow: only its opacity changes on hover. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[10px] opacity-40 shadow-[0_10px_30px_-8px_rgb(242_140_40/0.75)] transition-opacity duration-300 group-hover:opacity-100"
            />
            <span className="relative">Launch Simulator</span>
            <ArrowRight
              className="relative size-4 transition-transform duration-200 ease-out group-hover:translate-x-1"
              aria-hidden
            />
          </Link>
          <Link
            to={LINKS.about}
            className="inline-flex items-center gap-2 rounded-[10px] border border-subtle bg-hero/60 px-5 py-3 text-sm text-primary transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:border-label"
          >
            Documentation
          </Link>
          <a
            href={PITCH_VIDEO_URL}
            className="inline-flex items-center gap-2 rounded-[10px] px-3 py-3 text-sm text-secondary transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:text-primary"
          >
            <Play className="size-3.5 fill-current" aria-hidden />
            Watch the 30s pitch
          </a>
        </div>

        <p className="hero-rise mt-8 font-mono text-[0.6875rem] tracking-[0.04em] text-muted" style={stagger(4)}>
          For research and education. Not a certified safety assessment.
        </p>
      </div>
    </section>
  )
}

function ProblemSection() {
  return (
    <section className="border-b border-subtle" aria-labelledby="problem-title">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="label-mono">The problem</p>
          <h2 id="problem-title" className="mt-3 text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
            Fire behaves differently without buoyancy
          </h2>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-subtle bg-subtle md:grid-cols-3">
          <ProblemCard index="01" channel="Buoyancy" title="No rising plume" diagram={<PlumeDiagram />}>
            In quiescent microgravity there is no buoyant flow to carry hot gases upward, so a flame
            can form a spherical diffusion flame ball around the burning sample.
          </ProblemCard>
          <ProblemCard index="02" channel="Airflow" title="Ventilation shapes the flame" diagram={<FlowDiagram />}>
            Forced cabin airflow stretches the flame downstream and changes how it spreads, which
            makes ventilation a key variable for fire safety in pressurized cabins.
          </ProblemCard>
          <ProblemCard index="03" channel="Oxygen" title="Oxygen sets the limit" diagram={<OxygenDiagram />}>
            Whether a flame survives depends on the cabin oxygen concentration relative to the
            material’s minimum oxygen limit under the given flow and gravity.
          </ProblemCard>
        </div>
      </div>
    </section>
  )
}

function ProblemCard({
  index,
  channel,
  title,
  diagram,
  children,
}: {
  index: string
  channel: string
  title: string
  diagram: ReactNode
  children: ReactNode
}) {
  return (
    <article className="flex flex-col bg-panel p-6 text-center sm:p-7">
      <p className="font-mono text-[0.6875rem] tracking-[0.14em] text-muted uppercase">
        <span className="text-brand">{index}</span> · {channel}
      </p>
      <div className="mx-auto mt-5 h-16 w-40">{diagram}</div>
      <h3 className="mt-5 text-lg font-semibold text-primary">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-secondary">{children}</p>
    </article>
  )
}

/* Small instrument-style line diagrams, one per card (decorative). */

function PlumeDiagram() {
  return (
    <svg viewBox="0 0 160 64" className="size-full" aria-hidden="true">
      <line x1="0" y1="56" x2="160" y2="56" stroke="var(--border-subtle)" />
      {[24, 16, 9].map((r, i) => (
        <circle key={r} cx="80" cy="32" r={r} fill="none" stroke="var(--brand-blue)" strokeOpacity={0.35 + i * 0.25} />
      ))}
      <rect x="77" y="29" width="6" height="6" fill="var(--text-secondary)" />
      <text x="118" y="14" className="fill-[var(--text-muted)] font-mono text-[8px]">
        g = 0
      </text>
    </svg>
  )
}

function FlowDiagram() {
  return (
    <svg viewBox="0 0 160 64" className="size-full" aria-hidden="true">
      {[18, 32, 46].map((y) => (
        <g key={y} stroke="var(--text-muted)" fill="none">
          <line x1="4" y1={y} x2="34" y2={y} />
          <polyline points={`30,${y - 3} 34,${y} 30,${y + 3}`} />
        </g>
      ))}
      <path d="M58 32 C 66 18, 110 18, 154 32 C 110 46, 66 46, 58 32 Z" fill="none" stroke="var(--brand-orange)" strokeWidth="1.4" />
      <rect x="53" y="29" width="6" height="6" fill="var(--text-secondary)" />
    </svg>
  )
}

function OxygenDiagram() {
  return (
    <svg viewBox="0 0 160 64" className="size-full" aria-hidden="true">
      <line x1="10" y1="40" x2="150" y2="40" stroke="var(--border-subtle)" strokeWidth="6" strokeLinecap="round" />
      <line x1="10" y1="40" x2="104" y2="40" stroke="var(--brand-blue-light)" strokeWidth="6" strokeLinecap="round" strokeOpacity="0.7" />
      <line x1="78" y1="26" x2="78" y2="54" stroke="var(--brand-orange)" strokeWidth="1.5" strokeDasharray="3 3" />
      <text x="78" y="20" textAnchor="middle" className="fill-[var(--brand-orange)] font-mono text-[8px]">
        LIMIT
      </text>
      <text x="150" y="20" textAnchor="end" className="fill-[var(--text-muted)] font-mono text-[8px]">
        % O2
      </text>
    </svg>
  )
}

function FigureSection() {
  return (
    <section aria-labelledby="figure-title">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div>
          <p className="label-mono">Fig. 01 · Flame geometry</p>
          <h2 id="figure-title" className="mt-3 text-2xl font-semibold tracking-tight text-primary">
            Two regimes, one console
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-secondary">
            Each simulation returns a flame geometry: spherical when the air is still in
            microgravity, elongated when airflow or gravity stretches it. The 3D chamber, the
            telemetry and the citations all read from that same result.
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
      </div>
    </section>
  )
}
