// SI-assisted: generated with Gemini & Claude, reviewed and edited by Rocha, Elias, Pina & Dantas
// Source: NASA PSI, BASS-II (PSI-25), DOI 10.60555/4qc4-de67, CC0-1.0
import type { ReactNode } from 'react'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { TECHNICAL_DOCS_PDF_URL } from '../app/routes'

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

/** Numbered sections, also listed in the side index. */
const SECTIONS = [
  { id: 'how-it-works', n: 1, title: 'How it works' },
  { id: 'si-usage', n: 2, title: 'How we use SI' },
  { id: 'credits', n: 3, title: 'Data & credits' },
  { id: 'team', n: 4, title: 'Team' },
] as const

/** Document-style page: left-aligned reading column, numbered sections, side index. */
export function AboutPage() {
  return (
    <div className="bg-void">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] gap-12 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[180px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <nav aria-label="On this page" className="sticky top-20">
            <p className="font-mono text-[0.6875rem] tracking-[0.14em] text-label uppercase">Contents</p>
            <ol className="mt-4 space-y-2.5 border-l border-subtle text-sm">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="-ml-px flex gap-2 border-l border-transparent pl-4 text-secondary hover:border-label hover:text-primary"
                  >
                    <span className="font-mono text-muted tabular-nums">{s.n}</span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <article className="max-w-3xl">
          <header className="border-b border-subtle pb-10">
            <p className="font-mono text-[0.6875rem] tracking-[0.14em] text-label uppercase">About &amp; SI Usage</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-primary sm:text-4xl">About AstroFire 3D</h1>
            <p className="mt-5 text-base leading-relaxed text-secondary">
              AstroFire 3D helps students, researchers and aerospace engineers understand how materials burn in crewed
              space environments. It brings together space combustion experiments and technical reports, and turns them
              into a simulation with fire risk, suppression guidance and the sources behind every result.
            </p>
          </header>

          <Section id="how-it-works" n={1} title="How it works">
            <figure>
              <ol className="grid gap-px overflow-hidden rounded-md border border-subtle bg-subtle md:grid-cols-3">
                {PIPELINE.map((block, i) => (
                  <li key={block.name} className="bg-panel p-4">
                    <p className="flex items-baseline gap-2 text-sm font-semibold text-primary">
                      <span className="font-mono text-xs font-normal text-muted tabular-nums">{i + 1}</span>
                      {block.name}
                      {i < PIPELINE.length - 1 ? (
                        <ArrowRight className="ml-auto hidden size-3.5 self-center text-label md:block" aria-hidden />
                      ) : null}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-secondary">{block.text}</p>
                  </li>
                ))}
              </ol>
              <figcaption className="mt-3 text-xs text-muted">
                <span className="font-medium text-secondary">Figure 1.</span> From data sources to the simulator console.
              </figcaption>
            </figure>
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

          <Section id="si-usage" n={2} title="How we use SI">
            <Subsection n="2.1" title="In the product">
              SI interprets the experimental data for each scenario and writes the diagnosis and suppression guidance.
              These texts are labeled as SI-generated in the results and in the PDF report, and always come with their
              sources.
            </Subsection>
            <Subsection n="2.2" title="In development">
              <table className="mt-1 w-full border-collapse text-left text-sm">
                <thead className="border-b border-subtle text-xs text-muted">
                  <tr>
                    <th scope="col" className="py-2 pr-6 font-medium">Tool</th>
                    <th scope="col" className="py-2 font-medium">Used for</th>
                  </tr>
                </thead>
                <tbody>
                  {DEV_TOOLS.map((t) => (
                    <tr key={t.tool} className="border-b border-subtle/60 last:border-b-0">
                      <td className="py-2 pr-6 align-top font-medium whitespace-nowrap text-primary">{t.tool}</td>
                      <td className="py-2 text-secondary">{t.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Subsection>
            <Subsection n="2.3" title="Human review">
              The team reviewed every SI-assisted file, checked all references against their original sources and
              validated the results before publishing.
            </Subsection>
          </Section>

          <Section id="credits" n={3} title="Data & credits">
            <div className="relative overflow-x-auto">
              <table className="w-full border-collapse border-y border-label/60 text-left text-sm">
                <caption className="caption-bottom pt-3 text-left text-xs text-muted">
                  <span className="font-medium text-secondary">Table 1.</span> Data sources, libraries and assets, with
                  their licenses.
                </caption>
                <thead className="border-b border-subtle text-xs text-muted">
                  <tr>
                    <th scope="col" className="py-2.5 pr-4 font-medium">Resource</th>
                    <th scope="col" className="py-2.5 pr-4 font-medium">Type</th>
                    <th scope="col" className="py-2.5 pr-4 font-medium">License</th>
                    <th scope="col" className="py-2.5 text-right font-medium">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {CREDITS_LEDGER.map((item) => (
                    <tr key={item.resource} className="border-b border-subtle/60 last:border-b-0">
                      <td className="py-2.5 pr-4 text-primary">{item.resource}</td>
                      <td className="py-2.5 pr-4 whitespace-nowrap text-secondary">{item.type}</td>
                      <td
                        className={`py-2.5 pr-4 font-mono text-xs whitespace-nowrap ${item.license === 'To verify' ? 'text-warning' : 'text-secondary'}`}
                      >
                        {item.license}
                      </td>
                      <td className="py-2.5 text-right whitespace-nowrap">
                        {item.url ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-focus hover:underline"
                          >
                            Link
                            <ExternalLink className="size-3" aria-hidden />
                            <span className="sr-only">(opens in a new tab)</span>
                          </a>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section id="team" n={4} title="Team">
            <p className="text-sm text-secondary">
              <span className="font-medium text-primary">21 Pyro Rangers</span> · Uberlândia, Brazil · NASA Space Apps
              Challenge 2026
            </p>
            <ul className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {TEAM.map((m) => (
                <li key={m.name} className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-[#1F2C47] bg-[#0F1728] font-mono text-sm font-semibold text-[#F28C28]"
                  >
                    {m.name[0]}
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-primary">{m.name}</span>
                    <span className="block text-xs text-muted">{m.role}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Section>
        </article>
      </div>
    </div>
  )
}

function Section({ id, n, title, children }: { id: string; n: number; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-20 border-b border-subtle py-10 last:border-b-0">
      <h2 id={`${id}-title`} className="flex items-baseline gap-3 text-xl font-semibold tracking-tight text-primary">
        <span className="font-mono text-sm font-normal text-label tabular-nums" aria-hidden="true">
          {n}
        </span>
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  )
}

function Subsection({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <div className="mt-6 first:mt-0">
      <h3 className="flex items-baseline gap-2.5 text-base font-semibold text-primary">
        <span className="font-mono text-xs font-normal text-muted tabular-nums" aria-hidden="true">
          {n}
        </span>
        {title}
      </h3>
      <div className="mt-2 text-sm leading-relaxed text-secondary">{children}</div>
    </div>
  )
}

