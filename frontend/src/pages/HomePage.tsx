// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { useRef, type CSSProperties, type ReactNode } from 'react'
import { Link } from 'react-router'
import { ArrowRight, ChevronDown, Play } from 'lucide-react'
import { RocketHeroBackdrop } from '../components/RocketHeroBackdrop'
import { SkyLayer } from '../components/home/SkyLayer'
import { PlanetHorizon } from '../components/home/PlanetHorizon'
import { useReveal } from '../components/home/useReveal'
import { usePrefersReducedMotion } from '../components/hero/useMotionPreferences'
import { LINKS, TECHNICAL_DOCS_PDF_URL } from '../app/routes'
import { EXPERIMENTS_SNAPSHOT } from '../data/experimentsSnapshot'
import { INVESTIGATIONS } from '../content/investigations'
import { SI_COMPACT } from '../content/project'

// TODO(pitch): replace with the public URL of the 30-second pitch video once it is published.
const PITCH_VIDEO_URL = '#'

/** Entrance order: 80 ms between elements. */
function stagger(step: number): CSSProperties {
  return { '--d': `${step * 80}ms` } as CSSProperties
}

/** Translucent panel used by every Home section: #0F1728 at ~88%, #1F2C47 border, 16px corners. */
const PANEL = 'rounded-2xl border border-subtle bg-panel/88'

export function HomePage() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const reduced = usePrefersReducedMotion()
  useReveal(rootRef, reduced)

  return (
    // One continuous background for the whole Home; the fixed sky sits behind everything.
    <div ref={rootRef} className="relative isolate overflow-x-clip bg-linear-to-b from-hero to-void">
      <SkyLayer />
      <Hero />
      <HelpsSection />
      <SiUsageSection />
      <EvidenceSection />
      <ClosingSection />
    </div>
  )
}

function DocumentationButton() {
  const className =
    'inline-flex items-center gap-2 rounded-[10px] border border-subtle bg-hero/60 px-5 py-3 text-sm text-primary transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:border-label'
  // Technical documentation PDF once published; until then, Research & Data.
  if (TECHNICAL_DOCS_PDF_URL) {
    return (
      <a href={TECHNICAL_DOCS_PDF_URL} target="_blank" rel="noreferrer" className={className}>
        Documentation
      </a>
    )
  }
  return (
    <Link to={LINKS.research} className={className}>
      Documentation
    </Link>
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
    // Full viewport height below the sticky header, with a floor for short screens.
    <section className="relative isolate h-[calc(100svh-3.5rem)] min-h-[560px]" aria-labelledby="hero-title">
      <RocketHeroBackdrop />
      <PlanetHorizon />
      <div className="relative mx-auto flex h-full max-w-4xl flex-col items-center justify-center px-4 pt-10 pb-36 text-center sm:px-6">
        <div data-rocket-avoid className="flex flex-col items-center">
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
          <DocumentationButton />
          <a
            href={PITCH_VIDEO_URL}
            className="inline-flex items-center gap-2 rounded-[10px] px-3 py-3 text-sm text-secondary transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:text-primary"
          >
            <Play className="size-3.5 fill-current" aria-hidden />
            Watch the 30s pitch
          </a>
        </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */

/** Section header in the hero pattern: mono label and centered title (rocket keeps away). */
function SectionHeader({ id, label, title }: { id: string; label: string; title: string }) {
  return (
    <div data-rocket-avoid className="text-center">
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
    </div>
  )
}

interface Step {
  n: number
  name: string
  /** Marker and step-name styling. */
  marker: string
  nameColor: string
  dashColor: string
  title: string
  items: { id: string; content: ReactNode }[]
}

const NUMBER_WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve']

/** "Six" for 6: spelled-out count for the start of a sentence (digits above twelve). */
function countWord(n: number): string {
  return NUMBER_WORDS[n] ?? String(n)
}

function MonoBadge({ children }: { children: ReactNode }) {
  return (
    <span className="ml-1.5 inline-block rounded-md border border-subtle bg-void/60 px-1.5 py-0.5 align-middle font-mono text-[0.6875rem] tracking-[0.06em] whitespace-nowrap text-label">
      {children}
    </span>
  )
}

/*
 * TODO(references): mention the UFSC (VSB-30) study in "Our approach" once it is
 * registered in docs/references.md (it is not there yet, so it is not shown).
 *
 * TODO(suppression): the water-mist extinguisher estimate is shown only when the engine returns
 * suppression_estimate. The published mock payloads do not include it, so the solution bullet does
 * not mention it. When it works in the Simulator, use:
 *   'Get prevention, detection and suppression guidance, including a water-mist extinguisher estimate.'
 */
const STEPS: Step[] = [
  {
    n: 1,
    name: 'The problem',
    marker: 'border-2 border-[#4C8DFF] bg-panel text-[#8CB4FF]',
    nameColor: 'text-[#8CB4FF]',
    dashColor: 'text-[#8CB4FF]',
    title: 'Fire behaves differently in space, and the data to understand it is scattered.',
    items: [
      { id: 'gravity', content: 'Without gravity, hot gases don’t rise, so flames can become slow, round and hard to see.' },
      { id: 'oxygen', content: 'Oxygen concentration and cabin airflow change how materials burn.' },
      { id: 'scattered', content: 'NASA’s experimental findings are spread across datasets and technical reports.' },
    ],
  },
  {
    n: 2,
    name: 'Our approach',
    marker: 'border-2 border-[#B98A5A] bg-panel text-[#E6C9A8]',
    nameColor: 'text-[#E6C9A8]',
    dashColor: 'text-[#B98A5A]',
    title: 'We bring the research together.',
    items: [
      {
        id: 'data',
        content: (
          <>
            Experimental combustion data from NASA PSI (BASS-II)
            <MonoBadge>PSI · BASS-II</MonoBadge> and NASA technical reports (NTRS)
            <MonoBadge>NTRS</MonoBadge>.
          </>
        ),
      },
      {
        id: 'investigations',
        content: `${countWord(INVESTIGATIONS.length)} NASA investigations summarized, ranked and interpreted for each habitat: spacecraft, space stations, lunar and Martian bases, and pressurized rovers.`,
      },
      {
        id: 'engine',
        content:
          'A rule-based engine matches each scenario to the research; diagnosis and guidance texts were drafted with Super Intelligence (SI) and reviewed by the team.',
      },
    ],
  },
  {
    n: 3,
    name: 'The solution',
    marker: 'border-2 border-[#F28C28] bg-[#F28C28] text-[#0A101C]',
    nameColor: 'text-[#F28C28]',
    dashColor: 'text-[#F28C28]',
    title: 'Explore fire behavior, backed by science.',
    items: [
      { id: 'configure', content: 'Configure material, gravity, oxygen and airflow.' },
      { id: 'visualize', content: 'Visualize the flame in 3D and examine risk indicators.' },
      { id: 'guidance', content: 'Get prevention, detection and suppression guidance.' },
      { id: 'report', content: 'Export a detailed PDF report with the source behind each result.' },
      { id: 'earth', content: 'See how this research also supports fire safety on Earth.' },
    ],
  },
]

/** Vertical connector colors between stacked steps (narrow screens). */
const VERTICAL_SEGMENTS = ['from-[#33456A] to-[#B98A5A]', 'from-[#B98A5A] to-[#F28C28]']

function HelpsSection() {
  return (
    <section className="relative" aria-labelledby="helps-title">
      {/* First section under the planet arc: ~96px of breathing room from the arc. */}
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-20 sm:px-6 min-[1400px]:pt-6">
        <SectionHeader id="helps" label="From research to answers" title="How AstroFire helps" />

        <div data-reveal style={stagger(2)} className={`reveal relative mt-12 p-6 text-left sm:p-8 lg:p-10 ${PANEL}`}>
          {/* Horizontal connector through the three markers (desktop). */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-[calc(2.5rem+13px)] left-[calc(2.5rem+14px)] hidden h-[2px] w-[calc((100%-5rem+2.5rem)*2/3)] bg-linear-to-r from-[#33456A] to-[#F28C28] lg:block"
          />
          <ol className="grid gap-10 lg:grid-cols-3 lg:gap-10">
            {STEPS.map((step, i) => (
              <li key={step.n} data-reveal style={stagger(3 + i)} className="reveal relative pl-12 lg:pl-0">
                {/* Vertical connector to the next step (narrow screens). */}
                {i < STEPS.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute top-7 -bottom-10 left-[13px] w-[2px] bg-linear-to-b lg:hidden ${VERTICAL_SEGMENTS[i]}`}
                  />
                ) : null}
                <div className="absolute top-0 left-0 flex items-center lg:relative">
                  <span
                    className={`relative z-10 inline-flex size-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-semibold ${step.marker}`}
                    aria-hidden="true"
                  >
                    {step.n}
                  </span>
                  <span className={`hidden bg-panel px-3 font-mono text-[0.75rem] tracking-[0.14em] uppercase lg:inline ${step.nameColor}`}>
                    {step.name}
                  </span>
                </div>
                <p className={`font-mono text-[0.75rem] tracking-[0.14em] uppercase lg:hidden ${step.nameColor}`}>
                  <span className="sr-only">Step {step.n}: </span>
                  {step.name}
                </p>
                <h3 className="mt-3 text-[22px] leading-snug font-semibold text-primary lg:mt-6">{step.title}</h3>
                <ul className="mt-5 space-y-3">
                  {step.items.map((item) => (
                    <li key={item.id} className="flex gap-3 text-sm leading-relaxed text-secondary">
                      <span className={`shrink-0 ${step.dashColor}`} aria-hidden="true">
                        —
                      </span>
                      <span>{item.content}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

/**
 * How SI is used (NASA Space Apps disclosure); the footer "SI Usage" link lands here (#si-usage).
 * Short on purpose: the full disclosure lives in docs/technical-notes.md (for the technical PDF).
 * "Learn more" opens what SI does / does not do and the documentation link.
 */
function SiUsageSection() {
  const rows = [
    { name: 'In the product', text: SI_COMPACT.product },
    { name: 'In development', text: SI_COMPACT.development },
    { name: 'Human responsibility', text: SI_COMPACT.human },
  ]
  return (
    <section id="si-usage" className="relative scroll-mt-16" aria-labelledby="si-usage-title" data-testid="si-compact">
      <div className="mx-auto max-w-6xl px-4 pt-4 pb-20 sm:px-6">
        <SectionHeader id="si-usage" label="Transparency" title="How we use SI" />
        <div data-reveal style={stagger(2)} className={`reveal mx-auto mt-10 max-w-3xl p-6 sm:p-8 ${PANEL}`}>
          <dl className="space-y-4">
            {rows.map((r) => (
              <div key={r.name} className="grid gap-1 sm:grid-cols-[11rem_1fr] sm:gap-6">
                <dt className="font-mono text-[0.75rem] tracking-[0.14em] text-[#F28C28] uppercase">{r.name}</dt>
                <dd className="text-sm leading-relaxed text-secondary">{r.text}</dd>
              </div>
            ))}
          </dl>

          {/* "Learn more": what SI does / does not do, plus the documentation link. */}
          <details className="group mt-6 border-t border-subtle pt-4" data-testid="si-learn-more">
            <summary className="flex cursor-pointer list-none items-center gap-1.5 text-sm font-medium text-primary hover:text-[#F28C28] [&::-webkit-details-marker]:hidden">
              <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden />
              Learn more
            </summary>
            <div className="mt-4 grid gap-6 sm:grid-cols-2">
              <SiList title="What SI does in AstroFire" items={SI_COMPACT.does} mark="✓" tone="text-nominal" />
              <SiList title="What it does not do" items={SI_COMPACT.doesNot} mark="×" tone="text-muted" />
            </div>
            <SiDocsLink />
          </details>
        </div>
      </div>
    </section>
  )
}

function SiList({ title, items, mark, tone }: { title: string; items: readonly string[]; mark: string; tone: string }) {
  return (
    <div>
      <h3 className="text-sm font-medium text-primary">{title}</h3>
      <ul className="mt-2 space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-secondary">
            <span className={`shrink-0 font-mono ${tone}`} aria-hidden="true">
              {mark}
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Technical PDF once published; until then, Research & Data (same rule as the hero "Documentation" button). */
function SiDocsLink() {
  const className = 'mt-5 inline-flex items-center gap-1.5 text-sm text-focus hover:underline'
  if (TECHNICAL_DOCS_PDF_URL) {
    return (
      <a href={TECHNICAL_DOCS_PDF_URL} target="_blank" rel="noreferrer" className={className}>
        {SI_COMPACT.linkLabel}
        <ArrowRight className="size-3.5" aria-hidden />
      </a>
    )
  }
  return (
    <Link to={LINKS.research} className={className}>
      Read the documentation
      <ArrowRight className="size-3.5" aria-hidden />
    </Link>
  )
}

/** Short evidence strip before the final call to action. Counts come from the site data, not typed by hand. */
function EvidenceSection() {
  const facts = [
    `${EXPERIMENTS_SNAPSHOT.length} BASS-II tests from NASA PSI`,
    `${INVESTIGATIONS.length} NASA investigations compared by habitat`,
    'Every source cited',
  ]
  return (
    <section className="relative" aria-labelledby="evidence-title" data-testid="evidence-strip">
      <div className="mx-auto max-w-6xl px-4 pt-4 pb-10 sm:px-6">
        <div data-reveal className="reveal flex flex-col gap-5 border-y border-subtle py-6 lg:flex-row lg:items-center lg:justify-between">
          <p className="flex items-center gap-2 font-mono text-[0.75rem] tracking-[0.18em] text-label uppercase">
            <span className="text-brand" aria-hidden>
              ●
            </span>
            <span id="evidence-title" role="heading" aria-level={2}>
              Built on real research
            </span>
          </p>
          <ul className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-primary">
            {facts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <Link to={LINKS.research} className="inline-flex shrink-0 items-center gap-1.5 text-sm text-focus hover:underline">
            Explore the research
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>
        {/* The three labels used in the Simulator results. */}
        <p data-testid="badge-legend" className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted">
          <span>In the Simulator:</span>
          <LegendBadge tone="border-focus text-focus">NASA experimental data</LegendBadge>
          <span>measured in a BASS-II test ·</span>
          <LegendBadge tone="border-secondary text-secondary">Estimate</LegendBadge>
          <span>interpolated or estimated ·</span>
          <LegendBadge tone="border-subtle text-label">Illustrative</LegendBadge>
          <span>visualization, not measured data</span>
        </p>
      </div>
    </section>
  )
}

function LegendBadge({ tone, children }: { tone: string; children: ReactNode }) {
  return <span className={`rounded-md border px-1.5 py-0.5 text-[0.6875rem] ${tone}`}>{children}</span>
}

function ExploreResearchButton() {
  return (
    <Link
      to={LINKS.research}
      className="inline-flex items-center gap-2 rounded-[10px] border border-subtle bg-hero/60 px-5 py-3 text-sm text-primary transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:border-label"
    >
      Explore Research
    </Link>
  )
}

function ClosingSection() {
  return (
    <section className="relative" aria-labelledby="closing-title">
      <div className="mx-auto max-w-6xl px-4 pt-6 pb-24 sm:px-6">
        <div
          data-reveal
          className={`reveal flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:p-10 ${PANEL}`}
        >
          <div data-rocket-avoid className="max-w-2xl">
            <h2 id="closing-title" className="text-[30px] leading-tight font-semibold tracking-tight text-primary">
              Explore combustion beyond Earth.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-secondary">
              Configure a scenario, visualize flame behavior, and examine the evidence behind the analysis.
            </p>
          </div>
          <div data-rocket-avoid className="flex shrink-0 flex-wrap items-center gap-3">
            <LaunchSimulatorButton />
            <ExploreResearchButton />
          </div>
        </div>
      </div>
    </section>
  )
}
