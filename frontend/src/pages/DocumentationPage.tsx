// SI-assisted: generated with Gemini & Claude, reviewed and edited by Rocha, Elias, Pina & Dantas
// Source: NASA PSI, BASS-II (PSI-25), DOI 10.60555/4qc4-de67, CC0-1.0
// Reference: Olson et al., NASA/TM-20210011385 (2021); Saffire (NTRS-20170000230, NTRS-20240002981)
/**
 * Documentation: the minimum the rules ask for (NASA sources with links, credits and licenses, access
 * to the SI disclosure) plus the way to the full technical PDF. Everything else (investigation ranking
 * by habitat, model, validation, architecture) lives in the PDF and in docs/technical-notes.md.
 */
import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router'
import { ChevronDown, Download, ExternalLink, FileText } from 'lucide-react'
import { CreditsLedger } from '../components/CreditsLedger'
import { Tooltip } from '../components/Tooltip'
import { DOCUMENTATION_PDF_URL, DOCUMENTATION_SI_URL, LINKS } from '../app/routes'
import { FIRE_SAFETY_USES, INVESTIGATIONS, type FireSafetyUse } from '../content/investigations'
import { REFERENCES } from '../content/references'
// Lazy: keeps the BASS-II snapshot and API client out of the main bundle.
const BassExperimentsSection = lazy(() =>
  import('../features/simulator/experiments/BassExperimentsSection').then((m) => ({ default: m.BassExperimentsSection })),
)

const SECTIONS = [
  { id: 'full-documentation', label: 'Full documentation' },
  { id: 'research', label: 'Sources' },
  { id: 'data', label: 'Data' },
  { id: 'credits', label: 'Credits' },
] as const

const SI_CHAPTER = 'Use of Super Intelligence (SI)'

/** Table of contents of the technical PDF (shown on the documentation card). */
const DOC_CONTENTS = [
  'Problem and Challenge Alignment',
  'Product Overview',
  'Using the Simulator',
  'Science and Calculations',
  'Data and Curation',
  'Hybrid Physics-Informed Neural Network (PINN) & Dual-Layer Verification',
  'Architecture and Data Contract',
  SI_CHAPTER,
  'Operational Scope and Physical Domain',
  'Authors and Credits',
  'References',
  'Appendices',
] as const

const PANEL = 'rounded-2xl border border-subtle bg-panel'

export function DocumentationPage() {
  return (
    <div className="bg-void">
      <DocumentationHeader />
      <div className="mx-auto max-w-6xl space-y-16 px-4 py-12 sm:px-6">
        <FullDocumentationCard />
        <ResearchSection />
        <BassDataSection />
        <CreditsSection />
      </div>
    </div>
  )
}

function DocumentationHeader() {
  return (
    <header className="border-b border-subtle bg-linear-to-b from-hero to-void">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="font-mono text-[0.75rem] tracking-[0.18em] text-label uppercase">
          <span className="text-brand" aria-hidden>
            ●
          </span>{' '}
          Documentation
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-primary sm:text-4xl">Documentation</h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-secondary">
          The research, data and methods behind AstroFire 3D.
        </p>
        <nav aria-label="On this page" className="mt-8">
          <ul className="flex flex-wrap gap-2">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="inline-flex items-center justify-center rounded-full border border-subtle bg-panel/70 px-3.5 py-1.5 text-xs text-secondary transition-colors hover:border-label hover:text-primary"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

function Section({ id, label, title, children }: { id: string; label: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-20">
      <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-label uppercase">{label}</p>
      <h2 id={`${id}-title`} className="mt-2 text-2xl font-semibold tracking-tight text-primary">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Full technical documentation                                        */
/* ------------------------------------------------------------------ */

function FullDocumentationCard() {
  return (
    <section
      id="full-documentation"
      aria-labelledby="full-documentation-title"
      className={`relative scroll-mt-20 overflow-hidden ${PANEL}`}
    >
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-brand" />
      <div className="p-6 sm:p-8 lg:p-10">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 font-mono text-[0.6875rem] tracking-[0.18em] text-label uppercase">
            <FileText className="size-3.5 text-brand" aria-hidden />
            Full documentation
          </p>
          <h2 id="full-documentation-title" className="mt-3 text-2xl font-semibold tracking-tight text-primary">
            AstroFire 3D · Technical Documentation
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-secondary sm:text-[0.9375rem]">
            Everything about the project in one 50-page technical reference by 21 PyroRangers: the deterministic
            microgravity-combustion physics engine, the 79 verified and 150 curated NASA BASS-II records, the hybrid
            PINN model and validation, ISS FWM PFE & Brazilian VSB-30 water-mist suppression sizing, the system
            architecture, and our Super Intelligence disclosure.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            <DocAction
              href={DOCUMENTATION_PDF_URL}
              className="inline-flex items-center gap-2 rounded-[10px] bg-brand px-4 py-2.5 text-sm font-semibold text-hero transition-opacity hover:opacity-90"
              disabledClassName="inline-flex cursor-not-allowed items-center gap-2 rounded-[10px] bg-brand/40 px-4 py-2.5 text-sm font-semibold text-hero/70"
            >
              <Download className="size-4" aria-hidden />
              Download full documentation (PDF)
            </DocAction>
          </div>
        </div>

        {/* Compact contents: two columns of small text; the SI chapter is a link. */}
        <div className="mt-8 border-t border-subtle pt-5">
          <h3 className="font-mono text-[0.625rem] tracking-[0.18em] text-muted uppercase">Contents</h3>
          <ol className="mt-3 gap-x-8 space-y-1 sm:columns-2" data-testid="doc-contents">
            {DOC_CONTENTS.map((item, i) => (
              <li key={item} className="flex break-inside-avoid gap-2.5 text-xs leading-5 text-secondary">
                <span className="w-4 shrink-0 text-right font-mono text-[0.6875rem] text-muted tabular-nums">{i + 1}</span>
                {item === SI_CHAPTER ? <SiChapterLink>{item}</SiChapterLink> : <span>{item}</span>}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

/** SI chapter of the PDF once published; until then, the "How we use SI" block on the Home. */
function SiChapterLink({ children }: { children: ReactNode }) {
  const className = 'font-medium text-focus underline-offset-2 hover:underline'
  if (DOCUMENTATION_SI_URL) {
    return (
      <a href={DOCUMENTATION_SI_URL} target="_blank" rel="noreferrer" className={className}>
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    )
  }
  return (
    <Link to={LINKS.siUsage} className={className}>
      {children}
    </Link>
  )
}

/** Link to the PDF when it is published; a disabled button with "Coming soon" until then. */
function DocAction({
  href,
  className,
  disabledClassName,
  children,
}: {
  href: string | null
  className: string
  disabledClassName: string
  children: ReactNode
}) {
  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {children}
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    )
  }
  return (
    <Tooltip label="Coming soon" align="start" focusable>
      {(id) => (
        <button type="button" disabled aria-describedby={id} className={disabledClassName}>
          {children}
        </button>
      )}
    </Tooltip>
  )
}

/* ------------------------------------------------------------------ */
/* Sources (the research behind AstroFire 3D)                        */
/* ------------------------------------------------------------------ */

/**
 * The NASA experiments behind AstroFire 3D, one plain line each, with a link to the source.
 * The full citations are collapsed under "Full references" (#references); links to #references or
 * #ref-n open it automatically.
 */
function ResearchSection() {
  const { hash } = useLocation()
  const [refsOpen, setRefsOpen] = useState(false)
  const [use, setUse] = useState<FireSafetyUse | 'all'>('all')
  useEffect(() => {
    if (hash === '#references' || hash.startsWith('#ref-')) setRefsOpen(true)
  }, [hash])
  const shown = use === 'all' ? INVESTIGATIONS : INVESTIGATIONS.filter((inv) => inv.uses.includes(use))
  const filters = [{ key: 'all' as const, label: 'All' }, ...FIRE_SAFETY_USES]

  return (
    <Section id="research" label="Sources" title="The research behind AstroFire 3D">
      <div className="flex flex-wrap items-center gap-1.5" role="radiogroup" aria-label="Filter by fire-safety area">
        {filters.map((f) => {
          const active = use === f.key
          return (
            <button
              key={f.key}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setUse(f.key)}
              className={`inline-flex items-center justify-center rounded-full border px-3.5 py-1.5 text-xs transition-colors ${
                active ? 'border-focus bg-elevated font-medium text-primary' : 'border-subtle bg-panel text-secondary hover:text-primary'
              }`}
            >
              {f.label}
            </button>
          )
        })}
      </div>
      <p className="mt-3 mb-4 text-xs text-muted">Tags summarize what each investigation studied, based on its published objectives.</p>

      <ul className={`${PANEL} divide-y divide-subtle`} aria-live="polite">
        {shown.map((inv) => (
          <li key={inv.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:gap-6 sm:px-5">
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-primary">{inv.name}</h3>
              <p className="mt-0.5 text-sm leading-relaxed text-secondary">{inv.plain}</p>
              <ul className="mt-2 flex flex-wrap gap-1.5" aria-label={`What ${inv.id} studied`} data-testid="tags">
                {inv.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-subtle bg-void/60 px-2 py-0.5 font-mono text-[0.625rem] tracking-[0.04em] text-label"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
            <a
              href={inv.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center gap-1 text-xs text-focus hover:underline"
            >
              View source
              <ExternalLink className="size-3.5" aria-hidden />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>

      <details
        id="references"
        className="group mt-4 scroll-mt-20"
        open={refsOpen}
        onToggle={(e) => setRefsOpen(e.currentTarget.open)}
      >
        <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-sm text-secondary hover:text-primary [&::-webkit-details-marker]:hidden">
          <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden />
          Full references ({REFERENCES.length})
        </summary>
        <ol className="mt-3 space-y-3">
          {REFERENCES.map((r) => (
            <li key={r.n} id={`ref-${r.n}`} className="flex scroll-mt-20 gap-3 text-xs leading-relaxed">
              <span className="shrink-0 font-mono text-muted tabular-nums">[{r.n}]</span>
              <span className="min-w-0 text-secondary">
                {r.text}{' '}
                <a href={r.url} target="_blank" rel="noreferrer" className="text-focus [overflow-wrap:anywhere] hover:underline">
                  {r.url}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-xs text-muted">
          NASA data is CC0-1.0 and NASA technical reports are U.S. Government public domain.
        </p>
      </details>
    </Section>
  )
}

/* ------------------------------------------------------------------ */
/* The experimental data                                               */
/* ------------------------------------------------------------------ */

function BassDataSection() {
  return (
    <Section id="data" label="Data" title="The experimental data">
      <p className="max-w-3xl text-sm leading-relaxed text-secondary">
        The fire tests NASA ran aboard the ISS for the BASS-II experiment, as published in the NASA PSI open data
        repository.
      </p>
      {/* Data notes: open licenses, Moon/Mars estimates, and 79 vs. 150 dataset scope. */}
      <p data-testid="data-notes" className="mt-2 mb-4 max-w-3xl text-xs leading-relaxed text-muted">
        Open data only (CC0-1.0 or U.S. Government public domain; PSI-10 has no license listed and is not used). NASA PSI
        has no Moon or Mars combustion data, so those results are estimates between microgravity and Earth data. The
        curated matrix below lists the 79 verified BASS-II records with measured spread rates (mm/s) used for PINN
        regression training and validation; an additional 71 outcome-only BASS-II tests (N = 150 total) are used in the
        expanded ignition outcome classification benchmark (Sustained Spread vs. Quenched).
      </p>
      <Suspense fallback={<div className="h-24 rounded-2xl border border-subtle bg-panel" />}>
        <BassExperimentsSection collapsible />
      </Suspense>
    </Section>
  )
}

/* ------------------------------------------------------------------ */
/* Credits & licenses                                                  */
/* ------------------------------------------------------------------ */

function CreditsSection() {
  return (
    <Section id="licenses" label="Credits" title="Credits & licenses">
      {/* The footer "Credits" link lands on #credits (the table below). */}
      <CreditsLedger />
    </Section>
  )
}
