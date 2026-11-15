// SI-assisted: generated with Gemini & Claude, reviewed and edited by Rocha, Elias, Pina & Dantas
// Source: NASA PSI, BASS-II (PSI-25), DOI 10.60555/4qc4-de67, CC0-1.0
// Reference: Olson et al., NASA/TM-20210011385 (2021); Saffire (NTRS-20170000230, NTRS-20240002981)
import { lazy, Suspense, useState, type ReactNode } from 'react'
import { ChevronDown, ExternalLink } from 'lucide-react'
import { Tag } from '../components/ConsolePanel'
import { CreditsLedger } from '../components/CreditsLedger'
import { HABITATS, INVESTIGATIONS, SCORE_EXPLANATION, type HabitatKey, type Investigation } from '../content/investigations'
import { REFERENCES } from '../content/references'
import pinnMetrics from '../../../backend/data/pinn_validation_metrics.json'
// Lazy: keeps the BASS-II snapshot and API client out of the main bundle.
const BassExperimentsSection = lazy(() =>
  import('../features/simulator/experiments/BassExperimentsSection').then((m) => ({ default: m.BassExperimentsSection })),
)

const SECTIONS = [
  { id: 'investigations', label: 'Investigations' },
  { id: 'bass-ii-data', label: 'BASS-II data' },
  { id: 'method', label: 'Method' },
  { id: 'data-notes', label: 'Data notes' },
  { id: 'references', label: 'References' },
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
        <strong className="font-medium text-primary">How the score works:</strong> {SCORE_EXPLANATION}
      </p>

      <ol className="mt-6 grid gap-4 md:grid-cols-2">
        {ranked.map((inv, idx) => (
          <InvestigationCard key={inv.id} inv={inv} rank={idx + 1} score={inv.scores[habitat]} />
        ))}
      </ol>
    </Section>
  )
}

function InvestigationCard({ inv, rank, score }: { inv: Investigation; rank: number; score: number }) {
  return (
    <li className={`${PANEL} flex flex-col p-5`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-xs text-focus">
            #{rank} · {inv.code}
          </p>
          <h3 className="mt-1 text-base font-semibold text-primary">{inv.name}</h3>
        </div>
        <span className="shrink-0 rounded-md border border-focus/60 px-2 py-0.5 font-mono text-xs text-focus tabular-nums">
          {score}/100
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
  const clf = pinnMetrics.classification_metrics
  const reg = pinnMetrics.regression_metrics
  const metrics = [
    {
      title: 'Ignition/quench accuracy',
      value: `${clf.accuracy_pct.toFixed(2)}%`,
      note: `TP ${clf.confusion_matrix.true_positives_sustained} · TN ${clf.confusion_matrix.true_negatives_quenched} · FP ${clf.confusion_matrix.false_positives} · FN ${clf.confusion_matrix.false_negatives}`,
    },
    {
      title: 'Safety recall & F1',
      value: `${clf.recall_pct.toFixed(1)}% / ${clf.f1_score_pct.toFixed(1)}%`,
      note: 'Detection of sustained flames',
    },
    { title: 'Spread rate R²', value: reg.r2_score.toFixed(4), note: 'Flame spread rate (mm/s)' },
    {
      title: 'Spread rate error',
      value: `${reg.rmse_mm_s.toFixed(3)} mm/s`,
      note: `RMSE · MAE ${reg.mae_mm_s.toFixed(3)} mm/s`,
    },
  ]

  return (
    <Section id="method" label="Method" title="How results are calculated">
      <p className="max-w-3xl text-sm leading-relaxed text-secondary">
        AstroFire matches each scenario to the BASS-II records and a physics-informed model trained on them{' '}
        <Cite refs={[1, 2]} />. Moon and Mars results are interpolated between microgravity and Earth data.
      </p>

      <div className={`${PANEL} mt-6 p-5`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-secondary">Team validation run · 5-fold cross-validation on 79 BASS-II tests</p>
          {/* Measured wall-clock time of the validation run (backend/app/ml_pipeline.py). */}
          <p className="font-mono text-[0.6875rem] text-muted tabular-nums">
            Run time: {pinnMetrics.training_execution_ms.toFixed(2)} ms
          </p>
        </div>
        <dl className="mt-4 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-subtle bg-subtle sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m) => (
            <div key={m.title} className="bg-void p-4">
              <dt className="text-xs text-muted">{m.title}</dt>
              <dd className="mt-1 font-mono text-2xl text-primary tabular-nums">{m.value}</dd>
              <p className="mt-1 font-mono text-[0.6875rem] text-muted tabular-nums">{m.note}</p>
            </div>
          ))}
        </dl>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-primary">Factor importance</h3>
          <p className="mt-0.5 text-xs text-muted">Permutation sensitivity in the validation run</p>
          <ul className="mt-4 space-y-3">
            {pinnMetrics.feature_importance.map((feat) => (
              <li key={feat.feature_key}>
                <div className="flex items-baseline justify-between gap-3 text-xs">
                  <span className="font-medium text-primary">{feat.feature_name}</span>
                  <span className="font-mono text-focus tabular-nums">{feat.importance_pct.toFixed(1)}%</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-elevated">
                  <div
                    className="h-full rounded-full bg-focus"
                    style={{ width: `${Math.min(100, feat.importance_pct * 2.4)}%` }}
                  />
                </div>
                <p className="mt-1 text-[0.6875rem] text-muted">{feat.physical_mechanism}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
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
