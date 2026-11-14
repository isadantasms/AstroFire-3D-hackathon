// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import type { ComponentType, ReactNode } from 'react'
import { Link } from 'react-router'
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  ExternalLink,
  Gauge,
  Orbit,
  ShieldAlert,
  SlidersHorizontal,
  Table,
} from 'lucide-react'
import { FlameRegimeSchematic } from '../components/FlameRegimeSchematic'
import { LINKS } from '../app/routes'
import { PRIMARY_SOURCES } from '../content/sources'
import { GROUNDING, type GroundingStatus } from '../content/grounding'

interface Capability {
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
  title: string
  body: string
}

const CAPABILITIES: Capability[] = [
  {
    icon: SlidersHorizontal,
    title: 'Mission Controls',
    body: 'Set the material, gravity level (ISS, Moon, Mars or Earth), cabin oxygen in % O2 and ventilation airflow in cm/s, or start from a preset scenario.',
  },
  {
    icon: Orbit,
    title: '3D Flame Chamber',
    body: 'A browser-based chamber shows how flame geometry, color and size respond to your parameters. It is an illustration, not a CFD simulation.',
  },
  {
    icon: Table,
    title: 'BASS-II Experiment Matrix',
    body: 'Browse experiment records from BASS-II (PSI-25) and load any row straight into the controls.',
  },
  {
    icon: Gauge,
    title: 'Flammability Telemetry',
    body: 'Read a 0–100 flammability score, the minimum oxygen limit, burn rate in mm/s, and estimated CO and CO2, all with explicit units.',
  },
  {
    icon: ShieldAlert,
    title: 'SI Safety Copilot',
    body: 'Get a diagnosis of the flame regime, suppression guidance for research discussion, terrestrial applications and the scientific limits of each result.',
  },
  {
    icon: BookOpen,
    title: 'Auditable Citations',
    body: 'Every result links to the NASA datasets and technical reports behind it, with the specific finding it relies on.',
  },
]

const STEPS = [
  {
    n: '01',
    title: 'Configure a scenario',
    body: 'Choose a material, gravity level, oxygen concentration and airflow, or pick a BASS-II record.',
  },
  {
    n: '02',
    title: 'Run the grounded engine',
    body: 'A deterministic engine computes telemetry from BASS-II data and NASA/TM-20210011385, with no paid external API.',
  },
  {
    n: '03',
    title: 'Inspect and audit',
    body: 'Compare the 3D illustration, telemetry and SI copilot notes, then follow the citations back to the source.',
  },
]

export function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-subtle">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:py-20">
          <div>
            <p className="label-mono">NASA Space Apps Challenge 2026 · Flame in Freefall</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-primary sm:text-5xl">
              [PROJECT_NAME]
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-secondary">
              Explore how solid materials burn in microgravity and partial gravity, with a 3D flame
              chamber, flammability telemetry and a Super Intelligence (SI) fire-safety copilot,
              all grounded in NASA BASS-II combustion data.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to={LINKS.simulator}
                className="inline-flex items-center gap-2 border border-focus bg-focus px-5 py-2.5 text-sm font-semibold text-void transition-colors hover:bg-transparent hover:text-focus"
              >
                Launch Simulator
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link
                to={LINKS.research}
                className="inline-flex items-center gap-2 border border-subtle px-5 py-2.5 text-sm text-primary transition-colors hover:border-secondary"
              >
                Research &amp; Data
              </Link>
              <Link
                to={LINKS.siUsage}
                className="px-2 py-2.5 text-sm text-secondary underline-offset-4 hover:text-primary hover:underline"
              >
                How we use SI
              </Link>
            </div>

            <p className="mt-6 text-xs text-muted">
              For research and education. Not a certified safety assessment.
            </p>
          </div>

          <FlameRegimeSchematic />
        </div>
      </section>

      {/* Problem */}
      <Section eyebrow="The problem" title="Fire behaves differently without buoyancy">
        <div className="grid gap-px border border-subtle bg-subtle md:grid-cols-3">
          <ProblemCard title="No rising plume">
            In quiescent microgravity there is no buoyant flow to carry hot gases upward, so a
            flame can form a spherical diffusion flame ball around the burning sample.
          </ProblemCard>
          <ProblemCard title="Ventilation shapes the flame">
            Forced cabin airflow stretches the flame downstream and changes how it spreads, which
            makes ventilation a key variable for fire safety in pressurized cabins.
          </ProblemCard>
          <ProblemCard title="Oxygen sets the limit">
            Whether a flame survives depends on the cabin oxygen concentration relative to the
            material’s minimum oxygen limit under the given flow and gravity.
          </ProblemCard>
        </div>
      </Section>

      {/* Solution */}
      <Section
        eyebrow="Our solution"
        title="From NASA experiment data to explainable fire-safety insight"
        lead="[PROJECT_NAME] links open NASA Physical Sciences Informatics (PSI) data and NASA Technical Reports Server (NTRS) documents to an interactive scenario console."
      >
        <ol className="grid gap-px border border-subtle bg-subtle md:grid-cols-3">
          {STEPS.map((step) => (
            <li key={step.n} className="bg-panel p-6">
              <span className="font-mono text-sm text-focus">{step.n}</span>
              <h3 className="mt-2 text-base font-semibold text-primary">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-secondary">{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Capabilities */}
      <Section eyebrow="Capabilities" title="One console, three views of every scenario">
        <ul className="grid gap-px border border-subtle bg-subtle sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map(({ icon: Icon, title, body }) => (
            <li key={title} className="bg-panel p-6">
              <Icon className="size-5 text-focus" aria-hidden />
              <h3 className="mt-3 text-base font-semibold text-primary">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-secondary">{body}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* Grounding */}
      <Section
        eyebrow="Scientific grounding"
        title="Every result states where it comes from"
        lead="Each simulation carries one of three grounding labels, so measured data is never confused with an estimate."
      >
        <ul className="grid gap-4 md:grid-cols-3">
          {(Object.keys(GROUNDING) as GroundingStatus[]).map((key) => {
            const info = GROUNDING[key]
            return (
              <li key={key} className="border border-subtle bg-panel p-5">
                <span
                  className={`inline-flex items-center gap-1.5 border px-2 py-1 font-mono text-[0.6875rem] tracking-[0.1em] uppercase ${info.tone}`}
                >
                  <BadgeCheck className="size-3.5" aria-hidden />
                  {info.label}
                </span>
                <p className="mt-3 text-sm leading-relaxed text-secondary">{info.summary}</p>
              </li>
            )
          })}
        </ul>
      </Section>

      {/* Data sources */}
      <Section eyebrow="Primary NASA sources" title="Built on open NASA data">
        <ul className="divide-y divide-subtle border border-subtle bg-panel">
          {PRIMARY_SOURCES.map((source) => (
            <li
              key={source.id}
              className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-mono text-sm text-primary">{source.id}</p>
                <p className="mt-1 text-sm text-secondary">
                  {source.title} · {source.kind}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="border border-subtle px-2 py-0.5 font-mono text-xs text-secondary">
                  {source.license}
                </span>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-focus hover:underline"
                >
                  Source
                  <ExternalLink className="size-3.5" aria-hidden />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* Explore */}
      <Section eyebrow="Explore" title="Go deeper">
        <div className="grid gap-4 md:grid-cols-3">
          <ExploreCard
            to={LINKS.simulator}
            title="Simulator"
            body="Open the three-column mission console and run a scenario."
          />
          <ExploreCard
            to={LINKS.research}
            title="Research & Data"
            body="Datasets, methodology, grounding rules, limitations and references."
          />
          <ExploreCard
            to={LINKS.about}
            title="About & SI Usage"
            body="Team, architecture, how SI is used in the product and in development, credits and licenses."
          />
        </div>
      </Section>
    </>
  )
}

function Section({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string
  title: string
  lead?: string
  children: ReactNode
}) {
  return (
    <section className="border-b border-subtle">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="label-mono">{eyebrow}</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-primary">{title}</h2>
        {lead ? <p className="mt-3 max-w-3xl text-base leading-relaxed text-secondary">{lead}</p> : null}
        <div className="mt-8">{children}</div>
      </div>
    </section>
  )
}

function ProblemCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-panel p-6">
      <h3 className="text-base font-semibold text-primary">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-secondary">{children}</p>
    </div>
  )
}

function ExploreCard({ to, title, body }: { to: string; title: string; body: string }) {
  return (
    <Link
      to={to}
      className="group flex flex-col justify-between border border-subtle bg-panel p-6 transition-colors hover:border-focus hover:bg-elevated"
    >
      <div>
        <h3 className="text-base font-semibold text-primary">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-secondary">{body}</p>
      </div>
      <span className="mt-6 inline-flex items-center gap-1 text-sm text-focus">
        Open
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  )
}
