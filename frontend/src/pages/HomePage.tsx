// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { useRef, type CSSProperties, type ReactNode } from 'react'
import { Link } from 'react-router'
import { AlarmSmoke, ArrowRight, Droplets, Gauge, HardHat, Play, SlidersHorizontal } from 'lucide-react'
import { RocketHeroBackdrop } from '../components/RocketHeroBackdrop'
import { SkyLayer } from '../components/home/SkyLayer'
import { PlanetHorizon } from '../components/home/PlanetHorizon'
import { useReveal } from '../components/home/useReveal'
import { usePrefersReducedMotion } from '../components/hero/useMotionPreferences'
import { LINKS } from '../app/routes'

// TODO(pitch): replace with the public URL of the 30-second pitch video once it is published.
const PITCH_VIDEO_URL = '#'

/** Entrance order: 80 ms between elements. */
function stagger(step: number): CSSProperties {
  return { '--d': `${step * 80}ms` } as CSSProperties
}

/** Same translucent card on every section: #0F1728 at ~85%, #1F2C47 border, 12px corners. */
const CARD = 'rounded-xl border border-subtle bg-panel/85'

export function HomePage() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const reduced = usePrefersReducedMotion()
  useReveal(rootRef, reduced)

  return (
    // One continuous background for the whole Home; the fixed sky sits behind everything.
    <div ref={rootRef} className="relative isolate overflow-x-clip bg-linear-to-b from-hero to-void">
      <SkyLayer />
      <PlanetHorizon />
      <Hero />
      <ProblemSection />
      <HowItWorksSection />
      <DifferentSection />
      <EarthSection />
      <FinalCta />
    </div>
  )
}

function LaunchSimulatorButton() {
  return (
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
      <ArrowRight className="relative size-4 transition-transform duration-200 ease-out group-hover:translate-x-1" aria-hidden />
    </Link>
  )
}

function Hero() {
  return (
    <section className="relative isolate" aria-labelledby="hero-title">
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
          <span className="safer-in relative inline-block text-brand" style={stagger(4)}>
            safer.
            <span className="safer-glow absolute inset-0" style={stagger(4)} aria-hidden="true">
              safer.
            </span>
          </span>
        </h1>

        <p className="hero-rise mt-6 max-w-2xl text-base leading-relaxed text-secondary sm:text-lg" style={stagger(2)}>
          Turn complex space fire research into clear answers: simulate scenarios, compare
          investigations and get cited safety guidance in seconds.
        </p>

        <div className="hero-rise mt-10 flex flex-wrap items-center justify-center gap-3" style={stagger(3)}>
          <LaunchSimulatorButton />
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
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */

/** Shared section pattern: mono label, centered title, centered content, same width and spacing. */
function HomeSection({ id, label, title, children }: { id: string; label: string; title: string; children: ReactNode }) {
  return (
    <section className="relative" aria-labelledby={`${id}-title`}>
      <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 sm:py-24">
        <p data-reveal className="reveal font-mono text-[0.75rem] tracking-[0.18em] text-label uppercase">
          <span className="text-brand" aria-hidden>
            ●
          </span>{' '}
          {label}
        </p>
        <h2
          id={`${id}-title`}
          data-reveal
          style={stagger(1)}
          className="reveal mx-auto mt-4 max-w-2xl text-2xl font-semibold tracking-tight text-primary sm:text-3xl"
        >
          {title}
        </h2>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  )
}

function ProblemSection() {
  return (
    <HomeSection id="problem" label="The science" title="Fire in space doesn’t behave like on Earth.">
      <div className="grid gap-4 md:grid-cols-3">
        <ProblemCard step={2} index="01" channel="Gravity" title="It turns into a ball." diagram={<BallDiagram />}>
          Without gravity, hot air doesn’t rise, so flames become slow, round and hard to see.
        </ProblemCard>
        <ProblemCard step={3} index="02" channel="Airflow" title="Air vents spread it." diagram={<FlowDiagram />}>
          Cabin airflow pushes the flame and helps it grow.
        </ProblemCard>
        <ProblemCard step={4} index="03" channel="Oxygen" title="More oxygen, more danger." diagram={<OxygenDiagram />}>
          Future Moon bases will have oxygen-richer air, so materials burn more easily.
        </ProblemCard>
      </div>
    </HomeSection>
  )
}

function ProblemCard({
  step,
  index,
  channel,
  title,
  diagram,
  children,
}: {
  step: number
  index: string
  channel: string
  title: string
  diagram: ReactNode
  children: ReactNode
}) {
  return (
    <article data-reveal style={stagger(step)} className={`reveal flex flex-col p-6 sm:p-7 ${CARD}`}>
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

function BallDiagram() {
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

/* ------------------------------------------------------------------ */

const STEPS = [
  {
    icon: SlidersHorizontal,
    title: 'Pick a scenario.',
    body: 'Choose a material, gravity, oxygen and airflow.',
  },
  {
    icon: Gauge,
    title: 'See the fire and its risk.',
    body: (
      <>
        Watch the flame in 3D and get a risk score explained by{' '}
        <abbr title="Super Intelligence" className="no-underline">
          SI
        </abbr>
        .
      </>
    ),
  },
  {
    icon: Droplets,
    title: 'Put it out.',
    body: 'See how much water mist the ISS extinguisher would need.',
  },
]

function HowItWorksSection() {
  return (
    <HomeSection id="how" label="How it works" title="How it works">
      <ol className="grid gap-4 md:grid-cols-3">
        {STEPS.map(({ icon: Icon, title, body }, i) => (
          <li key={title} data-reveal style={stagger(i + 2)} className={`reveal flex flex-col items-center p-6 sm:p-7 ${CARD}`}>
            <span className="inline-flex size-10 items-center justify-center rounded-[10px] border border-subtle bg-void/60 text-brand">
              <Icon className="size-[18px]" aria-hidden />
            </span>
            <span className="mt-4 font-mono text-[0.6875rem] tracking-[0.14em] text-muted">STEP {String(i + 1).padStart(2, '0')}</span>
            <h3 className="mt-3 text-lg font-semibold text-primary">{title}</h3>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-secondary">{body}</p>
          </li>
        ))}
      </ol>
    </HomeSection>
  )
}

/* ------------------------------------------------------------------ */

/*
 * TODO(references): add this item once the UFSC (VSB-30) study is registered in
 * docs/references.md (it is not there yet, so it is not shown):
 *   title: 'NASA and Brazilian research, side by side.'
 *   body:  'We combine NASA space experiments with Brazilian sounding-rocket research from UFSC (VSB-30).'
 */
const DIFFERENTIATORS = [
  {
    title: 'From fire to extinguisher.',
    body: 'Most tools stop at the risk. We go one step further and size the suppression.',
  },
  {
    title: 'Every answer has a source.',
    body: 'Each result links to the study behind it and says if it’s measured data or an estimate.',
  },
]

function DifferentSection() {
  return (
    <HomeSection id="different" label="Why AstroFire" title="What makes AstroFire different">
      <ul className="mx-auto grid max-w-3xl gap-4 md:grid-cols-2">
        {DIFFERENTIATORS.map((item, i) => (
          <li key={item.title} data-reveal style={stagger(i + 2)} className={`reveal p-6 sm:p-7 ${CARD}`}>
            <span className="font-mono text-sm text-brand">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="mt-3 text-lg font-semibold text-primary">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-secondary">{item.body}</p>
          </li>
        ))}
      </ul>
    </HomeSection>
  )
}

/* ------------------------------------------------------------------ */

const EARTH_USES = [
  { icon: Droplets, label: 'Water mist extinguishers' },
  { icon: AlarmSmoke, label: 'Better smoke detectors' },
  { icon: HardHat, label: 'Safer firefighter gear' },
]

function EarthSection() {
  return (
    <HomeSection id="earth" label="Back on Earth" title="Space research protects us on Earth too">
      <ul data-reveal style={stagger(2)} className={`reveal mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-4 px-6 py-5 ${CARD}`}>
        {EARTH_USES.map(({ icon: Icon, label }) => (
          <li key={label} className="inline-flex items-center gap-2.5 text-sm text-secondary">
            <Icon className="size-4 text-label" aria-hidden />
            {label}
          </li>
        ))}
      </ul>
    </HomeSection>
  )
}

function FinalCta() {
  return (
    <section className="relative" aria-label="Launch the simulator">
      <div data-reveal className="reveal mx-auto flex max-w-5xl justify-center px-4 pb-24 sm:px-6">
        <LaunchSimulatorButton />
      </div>
    </section>
  )
}
