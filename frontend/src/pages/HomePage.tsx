// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { useId, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react'
import { Link } from 'react-router'
import { ArrowRight, GraduationCap, HardHat, Microscope, Play, UserCheck, Workflow, Wrench } from 'lucide-react'
import { RocketHeroBackdrop } from '../components/RocketHeroBackdrop'
import { SkyLayer } from '../components/home/SkyLayer'
import { PlanetHorizon } from '../components/home/PlanetHorizon'
import { useReveal } from '../components/home/useReveal'
import { usePrefersReducedMotion } from '../components/hero/useMotionPreferences'
import { DOCUMENTATION_SI_URL, LINKS } from '../app/routes'
import { EXPERIMENTS_SNAPSHOT } from '../data/experimentsSnapshot'
import { INVESTIGATIONS } from '../content/investigations'
import { PITCH_VIDEO_URL, SI_COMPACT } from '../content/project'

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
      <AudienceSection />
      <SiUsageSection />
      <EvidenceSection />
      <ClosingSection />
    </div>
  )
}

function DocumentationButton() {
  const className =
    'inline-flex min-h-11 items-center gap-2 rounded-[10px] border border-subtle bg-hero/60 px-5 py-3 text-sm text-primary transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:border-label'
  // The Documentation page gives access to the full technical PDF.
  return (
    <Link to={LINKS.documentation} className={className}>
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
    <section className="relative isolate h-[calc(100svh-3.5rem)] min-h-[560px] short:min-h-[340px]" aria-labelledby="hero-title">
      <RocketHeroBackdrop />
      <PlanetHorizon />
      <div className="relative mx-auto flex h-full max-w-4xl flex-col items-center justify-center px-4 pt-10 pb-36 text-center sm:px-6 short:pt-4 short:pb-8">
        <div data-rocket-avoid className="flex flex-col items-center">
        <p className="hero-rise font-mono text-[0.75rem] tracking-[0.18em] text-label uppercase" style={stagger(0)}>
          <span className="text-brand" aria-hidden>
            ●
          </span>{' '}
          Flame in Freefall · Space Apps 2026
        </p>

        <h1
          id="hero-title"
          className="hero-rise mt-6 text-[2.5rem] leading-[1.05] font-semibold tracking-[-0.02em] text-primary sm:text-6xl lg:text-[4.25rem] short:mt-3 short:text-[2.25rem]!"
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

        <p className="hero-rise mt-6 max-w-2xl text-base leading-relaxed text-secondary sm:text-lg short:mt-3 short:text-base!" style={stagger(2)}>
          Turn complex space fire research into clear answers: simulate scenarios, compare
          investigations and get cited safety guidance in seconds.
        </p>

        <div className="hero-rise mt-10 flex flex-wrap items-center justify-center gap-3 short:mt-5" style={stagger(3)}>
          <LaunchSimulatorButton />
          <DocumentationButton />
          <a
            href={PITCH_VIDEO_URL}
            className="inline-flex min-h-11 items-center gap-2 rounded-[10px] px-3 text-sm text-secondary transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:text-primary"
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

interface Step {
  n: number
  name: string
  /** Marker and step-name styling. */
  marker: string
  nameColor: string
  dashColor: string
  /** Top-edge rule and numeral outline colour of the step panel. */
  rule: string
  accent: string
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
    rule: 'bg-[#4C8DFF]',
    accent: '#8CB4FF',
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
    rule: 'bg-[#B98A5A]',
    accent: '#E6C9A8',
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
    rule: 'bg-[#F28C28]',
    accent: '#F28C28',
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

/** Left-aligned section heading (mono label + title), used by the asymmetric sections below. */
function SideHeader({ id, label, title }: { id: string; label: string; title: string }) {
  return (
    <div data-rocket-avoid>
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
        className="reveal mt-4 text-2xl font-semibold tracking-tight text-primary sm:text-3xl"
      >
        {title}
      </h2>
    </div>
  )
}

/**
 * "How AstroFire 3D helps" as a step selector: the three steps on the left (joined by a vertical
 * connector), one panel on the right with the selected step. Keyboard: arrow keys move between steps.
 */
function HelpsSection() {
  const [active, setActive] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const baseId = useId()

  const select = (i: number, focus = false) => {
    const next = (i + STEPS.length) % STEPS.length
    setActive(next)
    if (focus) tabRefs.current[next]?.focus()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const keys: Record<string, number> = {
      ArrowDown: i + 1,
      ArrowRight: i + 1,
      ArrowUp: i - 1,
      ArrowLeft: i - 1,
      Home: 0,
      End: STEPS.length - 1,
    }
    if (e.key in keys) {
      e.preventDefault()
      select(keys[e.key], true)
    }
  }

  return (
    <section className="relative" aria-labelledby="helps-title">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 pt-12 pb-20 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-[auto_1fr] lg:gap-x-14 lg:gap-y-8 min-[1400px]:pt-6">
        <div>
          <SideHeader id="helps" label="From research to answers" title="How AstroFire 3D helps" />

          <div
            role="tablist"
            aria-label="How AstroFire 3D helps"
            aria-orientation="vertical"
            data-reveal
            style={stagger(2)}
            className="reveal relative mt-8 grid grid-cols-3 gap-2 lg:mt-10 lg:grid-cols-1 lg:gap-0"
          >
            {/* Vertical connector through the markers (desktop). */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-8 bottom-8 left-[27px] hidden w-[2px] bg-linear-to-b from-[#4C8DFF]/60 via-[#B98A5A]/60 to-[#F28C28]/70 lg:block"
            />
            {STEPS.map((s, i) => {
              const selected = i === active
              return (
                <button
                  key={s.n}
                  ref={(el) => {
                    tabRefs.current[i] = el
                  }}
                  type="button"
                  role="tab"
                  id={`${baseId}-tab-${i}`}
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel-${i}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(i)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className={`group relative flex flex-col items-center gap-2 rounded-xl border px-2 py-3 text-center transition-colors lg:flex-row lg:items-center lg:gap-4 lg:border-transparent lg:px-3 lg:py-4 lg:text-left ${
                    selected ? 'border-subtle bg-panel/80 lg:bg-panel/60' : 'border-transparent hover:bg-panel/40'
                  }`}
                >
                  <span
                    className={`relative z-10 inline-flex size-8 shrink-0 items-center justify-center rounded-full font-mono text-xs font-semibold transition-transform duration-300 ${s.marker} ${
                      selected ? 'scale-110' : 'opacity-70 group-hover:opacity-100'
                    }`}
                    aria-hidden="true"
                  >
                    {s.n}
                  </span>
                  <span className="min-w-0">
                    <span className={`block font-mono text-[0.6875rem] tracking-[0.14em] uppercase sm:text-[0.75rem] ${s.nameColor}`}>
                      {s.name}
                    </span>
                    <span
                      className={`mt-1 hidden text-sm leading-snug transition-colors lg:block ${
                        selected ? 'text-primary' : 'text-muted group-hover:text-secondary'
                      }`}
                    >
                      {s.title}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div data-reveal style={stagger(3)} className="reveal lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:pt-14">
          {STEPS.map((s, i) => (
            <div
              key={s.n}
              role="tabpanel"
              id={`${baseId}-panel-${i}`}
              aria-labelledby={`${baseId}-tab-${i}`}
              hidden={i !== active}
              tabIndex={0}
              className={`relative overflow-hidden p-6 sm:p-8 lg:min-h-[25.5rem] ${PANEL}`}
            >
              {/* Step colour on the top edge and an outlined numeral as a quiet marker. */}
              <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-[3px] ${s.rule}`} />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-4 -bottom-5 font-mono text-[7.5rem] leading-none font-semibold text-transparent select-none sm:right-6"
                style={{ WebkitTextStroke: `1px ${s.accent}`, opacity: 0.35 }}
              >
                0{s.n}
              </span>

              <div key={active} className="step-in relative">
                <p className={`font-mono text-[0.75rem] tracking-[0.14em] uppercase ${s.nameColor}`}>
                  <span className="sr-only">Step {s.n}: </span>
                  {s.name}
                </p>
                <h3 className="mt-3 max-w-md text-[22px] leading-snug font-semibold text-primary sm:text-2xl">{s.title}</h3>
                <ul className="mt-6 space-y-3">
                  {s.items.map((item) => (
                    <li key={item.id} className="flex gap-3 text-sm leading-relaxed text-secondary sm:text-[0.9375rem]">
                      <span className={`shrink-0 ${s.dashColor}`} aria-hidden="true">
                        —
                      </span>
                      <span>{item.content}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {i < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={() => select(i + 1, true)}
                  className="relative mt-6 inline-flex min-h-11 items-center gap-1.5 text-sm text-secondary transition-colors hover:text-primary"
                >
                  Next: {STEPS[i + 1].name.toLowerCase()}
                  <ArrowRight className="size-3.5" aria-hidden />
                </button>
              ) : null}
            </div>
          ))}
        </div>

        {/* Under the steps on desktop; after the panel on small screens (grid order). */}
        <div data-reveal style={stagger(4)} className="reveal lg:col-start-1 lg:row-start-2">
          <LaunchSimulatorButton />
        </div>
      </div>
    </section>
  )
}

const AUDIENCE = [
  { name: 'Students', text: 'See why fire behaves differently in microgravity.', Icon: GraduationCap },
  { name: 'Researchers', text: 'Compare NASA investigations and their findings.', Icon: Microscope },
  { name: 'Engineers', text: 'Explore material and ventilation scenarios for crewed habitats.', Icon: HardHat },
]

/** "Who it's for": the three audiences, in short columns (stacked on small screens). */
function AudienceSection() {
  return (
    <section id="audience" className="relative scroll-mt-16" aria-labelledby="audience-title">
      <div className="mx-auto max-w-6xl px-4 pt-4 pb-20 sm:px-6">
        <SideHeader id="audience" label="Audience" title="Who it’s for" />
        <ul data-reveal style={stagger(2)} className="reveal mt-8 grid gap-4 md:grid-cols-3">
          {AUDIENCE.map(({ name, text, Icon }) => (
            <li key={name} className={`flex gap-4 p-5 ${PANEL}`}>
              <span
                aria-hidden="true"
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-subtle text-label"
              >
                <Icon className="size-5" strokeWidth={1.75} />
              </span>
              <div>
                <h3 className="text-base font-semibold text-primary">{name}</h3>
                <p className="mt-1 text-sm leading-relaxed text-secondary">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/**
 * How SI is used (NASA Space Apps disclosure); the footer "SI Usage" link lands here (#si-usage).
 * Editorial layout (no card): heading on the left, three typographic rows on the right.
 * Short on purpose: the full disclosure lives in docs/technical-notes.md (for the technical PDF).
 * The documentation link sits right below the rows.
 */
function SiUsageSection() {
  const rows = [
    { name: 'In the product', text: SI_COMPACT.product, Icon: Workflow },
    { name: 'In development', text: SI_COMPACT.development, Icon: Wrench },
    { name: 'Human responsibility', text: SI_COMPACT.human, Icon: UserCheck },
  ]
  return (
    <section id="si-usage" className="relative scroll-mt-16" aria-labelledby="si-usage-title" data-testid="si-compact">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 pt-4 pb-20 sm:px-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-14">
        <div>
          <SideHeader id="si-usage" label="Transparency" title="How we use SI" />
          <p data-reveal style={stagger(2)} className="reveal mt-4 max-w-xs text-sm leading-relaxed text-muted">
            Where SI is used in AstroFire 3D, and where the team is responsible.
          </p>
        </div>

        <div data-reveal style={stagger(2)} className="reveal">
          <dl className="divide-y divide-subtle border-y border-subtle">
            {rows.map(({ name, text, Icon }) => (
              <div key={name} className="grid items-start gap-x-6 gap-y-2 py-5 sm:grid-cols-[14.5rem_1fr]">
                <dt className="flex items-center gap-3 font-mono text-[0.75rem] tracking-[0.14em] text-[#F28C28] uppercase">
                  <span
                    aria-hidden="true"
                    className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-subtle text-label"
                  >
                    <Icon className="size-4" strokeWidth={1.75} />
                  </span>
                  {name}
                </dt>
                {/* pt aligns the first text line with the centre of the icon. */}
                <dd className="text-sm leading-relaxed text-secondary sm:pt-1.5">{text}</dd>
              </div>
            ))}
          </dl>

          <SiDocsLink />
        </div>
      </div>
    </section>
  )
}

/** SI section of the technical PDF once published; until then, the documentation card on the Documentation page. */
function SiDocsLink() {
  const className = 'mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm text-focus hover:underline'
  if (DOCUMENTATION_SI_URL) {
    return (
      <a href={DOCUMENTATION_SI_URL} target="_blank" rel="noreferrer" className={className}>
        {SI_COMPACT.linkLabel}
        <ArrowRight className="size-3.5" aria-hidden />
      </a>
    )
  }
  return (
    <Link to={LINKS.fullDocumentation} className={className}>
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
    'Sources cited',
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
          <Link to={LINKS.documentation} className="inline-flex min-h-11 shrink-0 items-center gap-1.5 text-sm text-focus hover:underline">
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
            <DocumentationButton />
          </div>
        </div>
      </div>
    </section>
  )
}
