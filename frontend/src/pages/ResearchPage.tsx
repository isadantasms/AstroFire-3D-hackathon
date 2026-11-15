// SI-assisted: generated with Gemini & Claude, reviewed and edited by Rocha, Elias, Pina & Dantas
// Source: NASA PSI, BASS-II (PSI-25), DOI 10.60555/4qc4-de67, CC0-1.0
// Reference: Olson et al., NASA/TM-20210011385 (2021); Saffire (NTRS-20170000230, NTRS-20240002981)
import { lazy, Suspense, useState, type ReactNode } from 'react'
import { ChevronDown, ExternalLink } from 'lucide-react'
import { Tag } from '../components/ConsolePanel'
import { CreditsLedger } from '../components/CreditsLedger'
import { Tooltip } from '../components/Tooltip'
import { TECHNICAL_DOCS_PDF_URL } from '../app/routes'
import {
  HABITATS,
  INVESTIGATIONS,
  RELEVANCE_EXPLANATION,
  relevanceOf,
  type HabitatKey,
  type Investigation,
  type Relevance,
} from '../content/investigations'
import { REFERENCES } from '../content/references'
// Lazy: keeps the BASS-II snapshot and API client out of the main bundle.
const BassExperimentsSection = lazy(() =>
  import('../features/simulator/experiments/BassExperimentsSection').then((m) => ({ default: m.BassExperimentsSection })),
)

const SECTIONS = [
  { id: 'investigations', label: 'Investigations' },
  { id: 'bass-ii-data', label: 'Data' },
  { id: 'method', label: 'Method' },
  { id: 'references', label: 'References' },
  { id: 'credits', label: 'Credits' },
] as const

const PANEL = 'rounded-2xl border border-subtle bg-panel'

export function ResearchPage() {
  return (
    <div className="bg-void">
      <ResearchHeader />
      <div className="mx-auto max-w-6xl space-y-16 px-4 py-12 sm:px-6">
        <InvestigationsSection />
        <BassDataSection />
        <MethodSection />
        <DataNotesSection />
        <ReferencesSection />
        {/* Data & credits: the footer "Credits" link lands here (#credits). */}
        <CreditsLedger />
      </div>
    </div>
  )
}

function ResearchHeader() {
  return (
    <header className="border-b border-subtle bg-linear-to-b from-hero to-void">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="font-mono text-[0.75rem] tracking-[0.18em] text-label uppercase">
          <span className="text-brand" aria-hidden>
            ●
          </span>{' '}
          Research &amp; Data
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
          The research behind AstroFire
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-secondary">
          The NASA experiments and reports AstroFire uses, how they compare for each habitat, and how results are calculated.
        </p>
        <nav aria-label="On this page" className="mt-8">
          <ul className="flex flex-wrap gap-2">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="inline-flex rounded-full border border-subtle bg-panel/70 px-3.5 py-1.5 text-xs text-secondary transition-colors hover:border-label hover:text-primary"
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

/** Inline citation linking to the numbered reference list. */
function Cite({ refs }: { refs: number[] }) {
  if (refs.length === 0) return null
  return (
    <span className="font-mono text-[0.6875rem]">
      {refs.map((n) => (
        <a key={n} href={`#ref-${n}`} className="text-focus hover:underline" aria-label={`Reference ${n}`}>
          [{n}]
        </a>
      ))}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* 1. Investigations                                                   */
/* ------------------------------------------------------------------ */

function InvestigationsSection() {
  const [habitat, setHabitat] = useState<HabitatKey>('lunar_base')
  const ranked = [...INVESTIGATIONS].sort((a, b) => b.scores[habitat] - a.scores[habitat])

  return (
    <Section id="investigations" label="Investigations" title="Which experiments matter for your habitat?">
      <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Target habitat">
        {HABITATS.map((h) => {
          const active = habitat === h.key
          return (
            <button
              key={h.key}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setHabitat(h.key)}
              className={`rounded-full border px-3.5 py-1.5 text-xs transition-colors ${
                active
                  ? 'border-focus bg-elevated font-medium text-primary'
                  : 'border-subtle bg-panel text-secondary hover:text-primary'
              }`}
            >
              {h.label}
            </button>
          )
        })}
      </div>
      <p className="mt-3 max-w-3xl text-xs leading-relaxed text-secondary">
        {RELEVANCE_EXPLANATION}
      </p>

      <ol className="mt-6 grid gap-4 md:grid-cols-2">
        {ranked.map((inv, idx) => (
          <InvestigationCard key={inv.id} inv={inv} rank={idx + 1} relevance={relevanceOf(inv, habitat)} />
        ))}
      </ol>
    </Section>
  )
}

const RELEVANCE_TONE: Record<Relevance, string> = {
  High: 'border-focus/60 text-focus',
  Medium: 'border-subtle text-secondary',
}

function InvestigationCard({ inv, rank, relevance }: { inv: Investigation; rank: number; relevance: Relevance }) {
  return (
    <li className={`${PANEL} flex flex-col p-5`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-xs text-focus">
            #{rank} · {inv.code}
          </p>
          <h3 className="mt-1 text-base font-semibold text-primary">{inv.name}</h3>
        </div>
        <span
          data-testid="relevance"
          title="Team-assigned relevance"
          className={`shrink-0 rounded-md border px-2 py-0.5 text-xs ${RELEVANCE_TONE[relevance]}`}
        >
          <span className="sr-only">Team-assigned relevance: </span>
          {relevance}
        </span>
      </div>

      <dl className="mt-4 grid gap-3 text-xs sm:grid-cols-2">
        <div>
          <dt className="text-muted">Facility</dt>
          <dd className="mt-0.5 text-secondary">{inv.facility}</dd>
        </div>
        <div>
          <dt className="text-muted">Conditions tested</dt>
          <dd className="mt-0.5 font-mono text-secondary tabular-nums">{inv.conditions ?? 'See source'}</dd>
        </div>
      </dl>

      <div className="mt-4">
        <p className="text-xs text-muted">Why it matters</p>
        <p className="mt-0.5 line-clamp-2 text-sm leading-relaxed text-secondary">{inv.why}</p>
      </div>

      <details className="group mt-4 border-t border-subtle pt-3">
        <summary className="flex cursor-pointer list-none items-center gap-1.5 text-xs font-medium text-secondary hover:text-primary [&::-webkit-details-marker]:hidden">
          <ChevronDown className="size-3.5 transition-transform group-open:rotate-180" aria-hidden />
          Details
        </summary>
        <div className="mt-3 space-y-2 text-xs leading-relaxed text-secondary">
          <p>
            <strong className="font-medium text-primary">Materials:</strong> {inv.materials}
          </p>
          <p>
            <strong className="font-medium text-primary">Similarity:</strong> {inv.similarity}
          </p>
          <p>
            <strong className="font-medium text-primary">Key distinction:</strong> {inv.difference}
          </p>
          <div className="mt-3 rounded-lg border border-subtle bg-void p-3">
            <p className="font-mono text-[0.625rem] tracking-[0.08em] text-muted uppercase">
              SI-assisted guidance · research only, not an operational procedure
            </p>
            <div className="mt-2 space-y-1">
              <p>
                <span className="font-medium text-nominal">Prevention: </span>
                {inv.prevention}
              </p>
              <p>
                <span className="font-medium text-warning">Detection: </span>
                {inv.detection}
              </p>
              <p>
                <span className="font-medium text-critical">Suppression: </span>
                {inv.suppression}
              </p>
            </div>
          </div>
        </div>
      </details>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-subtle pt-3 text-xs">
        <Cite refs={inv.refs} />
        <a
          href={inv.url}
          target="_blank"
          rel="noreferrer"
          className="ml-auto inline-flex items-center gap-1 text-focus hover:underline"
        >
          View source
          <ExternalLink className="size-3.5" aria-hidden />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>
    </li>
  )
}

/* ------------------------------------------------------------------ */
/* 2. BASS-II data                                                     */
/* ------------------------------------------------------------------ */

function BassDataSection() {
  return (
    <Section id="bass-ii-data" label="BASS-II data" title="The experimental data">
      <p className="mb-4 max-w-3xl text-sm leading-relaxed text-secondary">
        The 79 BASS-II tests run aboard the ISS, as recorded in the NASA PSI dataset <Cite refs={[2]} /> and the summary
        report <Cite refs={[1]} />.
      </p>
      <Suspense fallback={<div className="h-64 border border-subtle bg-panel" />}>
        <BassExperimentsSection />
      </Suspense>
    </Section>
  )
}

/* ------------------------------------------------------------------ */
/* 3. Method                                                           */
/* ------------------------------------------------------------------ */

function MethodSection() {
  return (
    <Section id="method" label="Method" title="Method, in short">
      <div className={`${PANEL} p-5`}>
        <p className="max-w-3xl text-sm leading-relaxed text-secondary">
          AstroFire calculates results with a deterministic, rule-based engine; no AI model runs when you simulate. When a
          scenario matches one of the 79 BASS-II tests, it uses that measured record <Cite refs={[2]} />. Otherwise it
          applies formulas bounded by NASA technical reports <Cite refs={[1]} />, and Moon and Mars results are interpolated
          between microgravity and Earth data.
        </p>
        <div className="mt-4">
          <TechnicalDocsButton />
        </div>
      </div>
    </Section>
  )
}

function TechnicalDocsButton() {
  const label = 'Read the technical documentation (PDF)'
  if (TECHNICAL_DOCS_PDF_URL) {
    return (
      <a
        href={TECHNICAL_DOCS_PDF_URL}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 rounded-lg border border-subtle px-3.5 py-2 text-xs text-primary transition-colors hover:border-label"
      >
        {label}
        <ExternalLink className="size-3.5" aria-hidden />
      </a>
    )
  }
  return (
    <Tooltip label="Coming soon" align="start" focusable>
      {(id) => (
        <button
          type="button"
          disabled
          aria-describedby={id}
          className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg border border-subtle px-3.5 py-2 text-xs text-muted opacity-60"
        >
          {label}
        </button>
      )}
    </Tooltip>
  )
}

/* ------------------------------------------------------------------ */
/* 4. Data notes                                                       */
/* ------------------------------------------------------------------ */

function DataNotesSection() {
  return (
    <Section id="data-notes" label="Data notes" title="About the data">
      <div className={`${PANEL} divide-y divide-subtle`}>
        <div className="p-5">
          <h3 className="text-sm font-medium text-primary">Open data only</h3>
          <p className="mt-1 text-sm leading-relaxed text-secondary">
            All data comes from openly licensed NASA sources (CC0-1.0 or U.S. Government public domain). PSI-10 has no
            license listed and is not used.
          </p>
        </div>
        <div className="p-5">
          <h3 className="text-sm font-medium text-primary">Partial gravity</h3>
          <p className="mt-1 text-sm leading-relaxed text-secondary">
            NASA PSI has no Moon or Mars combustion data. These results are estimates bounded by microgravity and
            Earth-gravity data.
          </p>
        </div>
      </div>
    </Section>
  )
}

/* ------------------------------------------------------------------ */
/* 5. References                                                       */
/* ------------------------------------------------------------------ */

function ReferencesSection() {
  return (
    <Section id="references" label="References" title="References">
      <ol className={`${PANEL} divide-y divide-subtle`}>
        {REFERENCES.map((r) => (
          <li key={r.n} id={`ref-${r.n}`} className="flex scroll-mt-20 gap-3 p-4 text-sm leading-relaxed">
            <span className="shrink-0 font-mono text-xs text-muted tabular-nums">[{r.n}]</span>
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
        <Tag>To verify</Tag> The FLEX and SPICE cards link to the NASA PSI repository; their full references are still to
        be added.
      </p>
    </Section>
  )
}
