// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { useRef, type CSSProperties } from 'react'
import { Link } from 'react-router'
import { ArrowRight, Play } from 'lucide-react'
import { RocketHeroBackdrop } from '../components/RocketHeroBackdrop'
import { SkyLayer } from '../components/home/SkyLayer'
import { PlanetHorizon } from '../components/home/PlanetHorizon'
import { useReveal } from '../components/home/useReveal'
import { usePrefersReducedMotion } from '../components/hero/useMotionPreferences'
import { LINKS, TECHNICAL_DOCS_PDF_URL } from '../app/routes'
import { DEV_TOOLS } from '../content/project'

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
  items: { text: string; badge?: string }[]
}

/*
 * TODO(references): add this item to "Our approach" once the UFSC (VSB-30) study is
 * registered in docs/references.md (it is not there yet, so it is not shown):
 *   { text: 'Brazilian sounding-rocket research', badge: 'UFSC · VSB-30' }
 */
const STEPS: Step[] = [
  {
    n: 1,
    name: 'The problem',
    marker: 'border-2 border-[#4C8DFF] bg-panel text-[#8CB4FF]',
    nameColor: 'text-[#8CB4FF]',
    dashColor: 'text-[#8CB4FF]',
    title: 'Fire behaves differently in space, and the data to plan for it is hard to use.',
    items: [
      { text: 'Without gravity, flames turn round, slow and hard to see.' },
      { text: 'Cabin airflow and oxygen-richer habitats change how materials burn.' },
      { text: 'Decades of experiments are spread across reports and raw tables.' },
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
      { text: 'NASA combustion experiments', badge: 'PSI · BASS-II' },
      { text: 'NASA technical reports', badge: 'NTRS' },
      { text: 'SI that reads, compares and cites these sources' },
    ],
  },
  {
    n: 3,
    name: 'The solution',
    marker: 'border-2 border-[#F28C28] bg-[#F28C28] text-[#0A101C]',
    nameColor: 'text-[#F28C28]',
    dashColor: 'text-[#F28C28]',
    title: 'AstroFire turns it into a clear answer in seconds.',
    items: [
      { text: 'Set material, gravity, oxygen and airflow' },
      { text: 'See the flame in 3D and its fire risk' },
      { text: 'Size the ISS water-mist extinguisher for that fire' },
      { text: 'Check the source behind every number' },
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
                    <li key={item.text} className="flex gap-3 text-sm leading-relaxed text-secondary">
                      <span className={`shrink-0 ${step.dashColor}`} aria-hidden="true">
                        —
                      </span>
                      <span>
                        {item.text}
                        {item.badge ? (
                          <span className="ml-2 inline-block rounded-md border border-subtle bg-void/60 px-1.5 py-0.5 align-middle font-mono text-[0.6875rem] tracking-[0.06em] whitespace-nowrap text-label">
                            {item.badge}
                          </span>
                        ) : null}
                      </span>
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

const SI_BLOCKS = [
  {
    name: 'In the product',
    text: 'SI interprets the experimental data for each scenario and writes the diagnosis and suppression guidance. These texts are labeled as SI-generated in the results and in the PDF report, and always come with their sources.',
  },
  { name: 'In development', tools: DEV_TOOLS },
  {
    name: 'Human review',
    text: 'The team reviewed every SI-assisted file, checked all references against their original sources and validated the results before publishing.',
  },
] as const

/** How SI is used (NASA Space Apps disclosure); the footer "SI Usage" link lands here. */
function SiUsageSection() {
  return (
    <section id="si-usage" className="relative scroll-mt-16" aria-labelledby="si-usage-title">
      <div className="mx-auto max-w-6xl px-4 pt-4 pb-20 sm:px-6">
        <SectionHeader id="si-usage" label="SI usage" title="How we use SI" />
        <div data-reveal style={stagger(2)} className={`reveal mt-12 p-6 sm:p-8 lg:p-10 ${PANEL}`}>
          <div className="grid gap-8 lg:grid-cols-3 lg:gap-0 lg:divide-x lg:divide-subtle">
            {SI_BLOCKS.map((block, i) => (
              <div key={block.name} data-reveal style={stagger(3 + i)} className="reveal lg:px-8 lg:first:pl-0 lg:last:pr-0">
                <h3 className="font-mono text-[0.75rem] tracking-[0.14em] text-[#F28C28] uppercase">{block.name}</h3>
                {'tools' in block ? (
                  <ul className="mt-4 space-y-3" data-testid="dev-tools">
                    {block.tools.map((t) => (
                      <li key={t.tool} className="flex gap-3 text-sm leading-relaxed text-secondary">
                        <span className="shrink-0 text-[#F28C28]" aria-hidden="true">
                          —
                        </span>
                        <span>
                          <span className="font-medium text-primary">{t.tool}:</span> {t.use}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm leading-relaxed text-secondary">{block.text}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ClosingSection() {
  return (
    <section className="relative" aria-labelledby="closing-title">
      <div className="mx-auto max-w-6xl px-4 pt-4 pb-24 sm:px-6">
        <div
          data-reveal
          className={`reveal flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:p-10 ${PANEL}`}
        >
          <div data-rocket-avoid className="max-w-2xl">
            <h2 id="closing-title" className="text-[30px] leading-tight font-semibold tracking-tight text-primary">
              Ready to test a scenario?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-secondary">
              Space fire research also supports safer water-mist extinguishers, smoke detectors and firefighter gear on Earth.
            </p>
          </div>
          <div data-rocket-avoid className="flex shrink-0 flex-wrap items-center gap-3">
            <LaunchSimulatorButton />
            <DocumentationButton />
          </div>
        </div>
      </div>
    </section>
  )
}
