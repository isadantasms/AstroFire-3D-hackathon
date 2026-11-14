// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { useRef, type CSSProperties, type ReactNode } from 'react'
import { Link } from 'react-router'
import { AlarmSmoke, ArrowRight, Droplets, Gauge, HardHat, Play, SlidersHorizontal } from 'lucide-react'
import { RocketHeroBackdrop } from '../components/RocketHeroBackdrop'
import { HomeAtmosphere } from '../components/home/HomeAtmosphere'
import { ScrollRocketTrail } from '../components/home/ScrollRocketTrail'
import { useReveal } from '../components/home/useReveal'
import { usePrefersReducedMotion } from '../components/hero/useMotionPreferences'
import { LINKS } from '../app/routes'

// TODO(pitch): replace with the public URL of the 30-second pitch video once it is published.
const PITCH_VIDEO_URL = '#'

/** Entrance order: 80 ms between elements. */
function stagger(step: number): CSSProperties {
  return { '--d': `${step * 80}ms` } as CSSProperties
}

export function HomePage() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const reduced = usePrefersReducedMotion()
  useReveal(rootRef, reduced)

  return (
    // One continuous background for the whole Home: hero color fading into the page color.
    <div ref={rootRef} className="relative isolate overflow-x-clip bg-linear-to-b from-hero to-void">
      <HomeAtmosphere />
      <ScrollRocketTrail rootRef={rootRef} />
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
    <section className="relative isolate overflow-hidden" aria-labelledby="hero-title" data-trail-start>
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

function ProblemSection() {
  return (
    <section className="relative" aria-labelledby="problem-title">
      <div className="mx-auto max-w-6xl px-4 pt-16 pb-20 sm:px-6 sm:pt-20 sm:pb-24">
        <h2
          id="problem-title"
          data-trail-marker
          data-reveal
          className="reveal mx-auto max-w-2xl text-center text-2xl font-semibold tracking-tight text-primary sm:text-3xl"
        >
          Fire in space doesn’t behave like on Earth.
        </h2>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <ProblemCard step={0} index="01" channel="Gravity" title="It turns into a ball." diagram={<BallDiagram />}>
            Without gravity, hot air doesn’t rise, so flames become slow, round and hard to see.
          </ProblemCard>
          <ProblemCard step={1} index="02" channel="Airflow" title="Air vents spread it." diagram={<FlowDiagram />}>
            Cabin airflow pushes the flame and helps it grow.
          </ProblemCard>
          <ProblemCard step={2} index="03" channel="Oxygen" title="More oxygen, more danger." diagram={<OxygenDiagram />}>
            Future Moon bases will have oxygen-richer air, so materials burn more easily.
          </ProblemCard>
        </div>
      </div>
    </section>
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
    <article
      data-reveal
      style={stagger(step + 1)}
      className="reveal flex flex-col rounded-xl border border-subtle bg-panel/90 p-6 text-center sm:p-7"
    >
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
    <section className="relative" aria-labelledby="how-title">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <h2 id="how-title" data-trail-marker data-reveal className="reveal text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
          How it works
        </h2>

        <ol className="relative mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {/* Thin connector behind the step markers (desktop). */}
          <span aria-hidden="true" className="absolute top-5 right-[16%] left-[16%] hidden h-px bg-subtle md:block" />
          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <li key={title} data-reveal style={stagger(i + 1)} className="reveal relative">
              <div className="flex items-center gap-3 md:flex-col md:items-start">
                <span className="relative inline-flex size-10 items-center justify-center rounded-[10px] border border-subtle bg-panel text-brand">
                  <Icon className="size-[18px]" aria-hidden />
                </span>
                <span className="font-mono text-xs tracking-[0.14em] text-muted">STEP {String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-primary">{title}</h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-secondary">{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
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
    <section className="relative" aria-labelledby="different-title">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
        <h2
          id="different-title"
          data-trail-marker
          data-reveal
          className="reveal text-2xl font-semibold tracking-tight text-primary sm:text-3xl lg:max-w-xs"
        >
          What makes AstroFire different
        </h2>
        <ul className="divide-y divide-subtle border-y border-subtle">
          {DIFFERENTIATORS.map((item, i) => (
            <li key={item.title} data-reveal style={stagger(i + 1)} className="reveal grid gap-2 py-7 sm:grid-cols-[2.5rem_1fr]">
              <span className="font-mono text-sm text-brand">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="text-lg font-semibold text-primary">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-secondary">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
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
    <section className="relative" aria-labelledby="earth-title">
      <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-20">
        <h2 id="earth-title" data-trail-marker data-reveal className="reveal text-xl font-semibold tracking-tight text-primary sm:text-2xl">
          Space research protects us on Earth too
        </h2>
        <ul data-reveal style={stagger(1)} className="reveal mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {EARTH_USES.map(({ icon: Icon, label }) => (
            <li key={label} className="inline-flex items-center gap-2.5 text-sm text-secondary">
              <Icon className="size-4 text-label" aria-hidden />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="relative" aria-label="Launch the simulator">
      <div data-trail-marker data-reveal className="reveal mx-auto flex max-w-6xl justify-center px-4 pt-8 pb-28 sm:px-6">
        <LaunchSimulatorButton />
      </div>
    </section>
  )
}
