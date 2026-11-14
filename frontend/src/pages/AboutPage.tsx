// SI-assisted: generated with Gemini & Claude, reviewed and edited by Rocha, Elias, Pina & Dantas
// Source: NASA PSI, BASS-II (PSI-25), DOI 10.60555/4qc4-de67, CC0-1.0
import type { ReactNode } from 'react'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { Link } from 'react-router'
import { LINKS, TECHNICAL_DOCS_PDF_URL } from '../app/routes'

const PIPELINE = [
  { name: 'Data', text: 'NASA combustion experiments (PSI · BASS-II) and technical reports (NTRS).' },
  { name: 'Engine', text: 'A backend that matches each scenario to the experimental data and an SI model that interprets it.' },
  { name: 'Console', text: 'The simulator: 3D flame chamber, risk, suppression sizing and a downloadable report.' },
]

const DEV_TOOLS = [
  { tool: 'Claude', use: 'code, interface design and website copy' },
  { tool: 'Gemini', use: 'code assistance and test data generation' },
  // TODO(voice-tool): replace [VOICE TOOL] with the name of the tool used to narrate the demo video.
  { tool: '[VOICE TOOL]', use: 'narration of the demo video' },
]

interface CreditRow {
  resource: string
  type: string
  license: string
  url: string | null
}

/*
 * NASA data and library rows are kept as they were (IDs and DOIs unchanged).
 * The UFSC (VSB-30) study is added only once it is registered in docs/references.md.
 */
const CREDITS_LEDGER: CreditRow[] = [
  {
    resource: 'BASS-II (PSI-25): Burning and Suppression of Solids - II',
    type: 'NASA Data',
    license: 'CC0-1.0',
    url: 'https://doi.org/10.60555/4qc4-de67',
  },
  {
    resource: 'NASA/TM-20210011385: BASS-II Summary Report (Olson et al., 2021)',
    type: 'NASA Technical Report',
    license: 'US Gov Public Domain',
    url: 'https://ntrs.nasa.gov/citations/20210011385',
  },
  {
    resource: 'Saffire I–VI (NTRS-20170000230 & NTRS-20240002981)',
    type: 'NASA Technical Report',
    license: 'CC0-1.0 / Public Domain',
    url: 'https://ntrs.nasa.gov/citations/20170000230',
  },
  {
    resource: 'SAME / SoFIE / FLEX / SPICE (NTRS-20170007283)',
    type: 'NASA Data & Report',
    license: 'CC0-1.0 / Public Domain',
    url: 'https://ntrs.nasa.gov/citations/20170007283',
  },
  {
    resource: 'React 19, TypeScript, Vite & Tailwind CSS',
    type: 'Open-Source Libraries',
    license: 'MIT / Apache-2.0',
    url: 'https://react.dev',
  },
  {
    resource: 'FastAPI & Pydantic V2 (+ Python 3.12 stdlib fallback)',
    type: 'Open-Source Libraries',
    license: 'MIT License',
    url: 'https://fastapi.tiangolo.com',
  },
  {
    resource: 'Ajv, Lucide Icons, IBM Plex Sans & IBM Plex Mono (@fontsource)',
    type: 'UI & Validation Assets',
    license: 'MIT / ISC / SIL OFL 1.1',
    url: 'https://ajv.js.org',
  },
  // TODO(credits): author and license of the voxel rocket model are not in assets/CREDITS.md yet.
  {
    resource: 'Voxel rocket 3D model (MagicaVoxel)',
    type: '3D Model',
    license: 'To verify',
    url: null,
  },
  // TODO(voice-tool): name, license and link of the narration tool.
  {
    resource: '[VOICE TOOL]: demo video narration',
    type: 'SI Tool',
    license: 'To verify',
    url: null,
  },
]

const TEAM = [
  { name: 'Elias', role: 'Data & physics engine' },
  { name: 'Pina', role: 'Backend & API' },
  { name: 'Dantas', role: 'Data analysis & model accuracy' },
  { name: 'Celina', role: 'Science & SI validation' },
  { name: 'Esquivel', role: '3D flame chamber' },
  { name: 'Rocha', role: 'Front-end & product' },
]

const NASA_DATA = CREDITS_LEDGER.filter((c) => c.type.startsWith('NASA'))
const SOFTWARE = CREDITS_LEDGER.filter((c) => !c.type.startsWith('NASA'))

/** One column, short sections, plain headings: easy to scan for users and judges. */
export function AboutPage() {
  return (
    <div className="bg-void">
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <header>
          <p className="font-mono text-[0.6875rem] tracking-[0.14em] text-label uppercase">About &amp; SI Usage</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-primary sm:text-4xl">About AstroFire 3D</h1>
          <p className="mt-5 text-base leading-relaxed text-secondary sm:text-lg">
            AstroFire 3D helps students, researchers and aerospace engineers understand how materials burn in crewed
            space environments. It brings together space combustion experiments and technical reports, and turns them
            into a simulation with fire risk, suppression guidance and the sources behind every result.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to={LINKS.simulator}
              className="inline-flex items-center gap-2 rounded-[10px] bg-brand px-4 py-2.5 text-sm font-semibold text-hero transition-transform duration-200 hover:-translate-y-0.5"
            >
              Open the Simulator
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              to={LINKS.research}
              className="inline-flex items-center gap-2 rounded-[10px] border border-subtle px-4 py-2.5 text-sm text-primary transition-transform duration-200 hover:-translate-y-0.5 hover:border-label"
            >
              Research &amp; Data
            </Link>
          </div>
        </header>

        <Section id="how-it-works" title="How it works">
          <ol className="space-y-4">
            {PIPELINE.map((block, i) => (
              <li key={block.name} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-subtle font-mono text-xs text-brand"
                >
                  {i + 1}
                </span>
                <p className="pt-0.5 text-sm leading-relaxed text-secondary">
                  <span className="font-semibold text-primary">{block.name}.</span> {block.text}
                </p>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm" data-testid="tech-docs-link">
            {TECHNICAL_DOCS_PDF_URL ? (
              <a
                href={TECHNICAL_DOCS_PDF_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-focus hover:underline"
              >
                Read the technical documentation (PDF)
                <ArrowRight className="size-3.5" aria-hidden />
              </a>
            ) : (
              <span className="text-muted">Technical documentation (PDF) coming soon.</span>
            )}
          </p>
        </Section>

        <Section id="si-usage" title="How we use SI">
          <dl className="space-y-5 text-sm leading-relaxed">
            <div>
              <dt className="font-semibold text-primary">In the product</dt>
              <dd className="mt-1 text-secondary">
                SI interprets the experimental data for each scenario and writes the diagnosis and suppression guidance.
                These texts are labeled as SI-generated in the results and in the PDF report, and always come with
                their sources.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-primary">In development</dt>
              <dd className="mt-1">
                <ul className="space-y-1 text-secondary" data-testid="dev-tools">
                  {DEV_TOOLS.map((t) => (
                    <li key={t.tool}>
                      <span className="font-medium text-primary">{t.tool}:</span> {t.use}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-primary">Human review</dt>
              <dd className="mt-1 text-secondary">
                The team reviewed every SI-assisted file, checked all references against their original sources and
                validated the results before publishing.
              </dd>
            </div>
          </dl>
        </Section>

        <Section id="credits" title="Data & credits">
          <CreditGroup title="NASA data" rows={NASA_DATA} />
          <CreditGroup title="Software & assets" rows={SOFTWARE} />
        </Section>

        <Section id="team" title="Team">
          <p className="text-sm text-secondary">
            <span className="font-medium text-primary">21 Pyro Rangers</span> · Uberlândia, Brazil · NASA Space Apps
            Challenge 2026
          </p>
          <ul className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {TEAM.map((m) => (
              <li key={m.name} className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-[#1F2C47] bg-[#0F1728] font-mono text-sm font-semibold text-[#F28C28]"
                >
                  {m.name[0]}
                </span>
                <span className="text-sm">
                  <span className="font-medium text-primary">{m.name}</span>
                  <span className="text-muted"> · {m.role}</span>
                </span>
              </li>
            ))}
          </ul>
        </Section>
      </article>
    </div>
  )
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mt-12 scroll-mt-20 border-t border-subtle pt-10">
      <h2 id={`${id}-title`} className="text-xl font-semibold tracking-tight text-primary">
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  )
}

/** Resource (linked to its source) · type · license, one row per item. */
function CreditGroup({ title, rows }: { title: string; rows: CreditRow[] }) {
  return (
    <div className="mt-6 first:mt-0">
      <h3 className="text-sm font-medium text-secondary">{title}</h3>
      <table className="mt-2 w-full border-collapse text-left text-sm">
        <thead className="sr-only">
          <tr>
            <th scope="col">Resource</th>
            <th scope="col">Type</th>
            <th scope="col">License</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => (
            <tr key={item.resource} className="border-b border-subtle/60 align-top last:border-b-0">
              <td className="py-2.5 pr-4">
                {item.url ? (
                  <a href={item.url} target="_blank" rel="noreferrer" className="text-primary hover:text-focus hover:underline">
                    {item.resource}
                    <ExternalLink className="ml-1 inline size-3 align-[-1px] text-muted" aria-hidden />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                ) : (
                  <span className="text-primary">{item.resource}</span>
                )}
                <span className="mt-0.5 block text-xs text-muted sm:hidden">{item.type}</span>
              </td>
              <td className="hidden py-2.5 pr-4 text-xs whitespace-nowrap text-muted sm:table-cell">{item.type}</td>
              <td
                className={`py-2.5 text-right font-mono text-xs whitespace-nowrap ${item.license === 'To verify' ? 'text-warning' : 'text-secondary'}`}
              >
                {item.license}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

