// SI-assisted: generated with Gemini & Claude, reviewed and edited by Rocha, Elias, Pina & Dantas
// Source: NASA PSI, BASS-II (PSI-25), DOI 10.60555/4qc4-de67, CC0-1.0
import type { ReactNode } from 'react'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { TECHNICAL_DOCS_PDF_URL } from '../app/routes'

/** Translucent panel shared with the Home and the Simulator: #0F1728 ~88%, #1F2C47 border, 12px corners. */
const PANEL = 'rounded-xl border border-subtle bg-panel/88'

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

const LIMITATIONS = [
  'Moon and Mars results are estimates: there is no partial-gravity combustion data in NASA PSI, so they are bounded by microgravity and Earth results.',
  'The 3D chamber is an illustration driven by the results, not a fluid dynamics simulation.',
  'Suppression guidance is research guidance, not an operational procedure.',
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

export function AboutPage() {
  return (
    <div className="bg-linear-to-b from-hero to-void">
      <div className="mx-auto max-w-5xl space-y-20 px-4 py-14 sm:px-6 sm:py-20">
        {/* 1. About */}
        <section aria-labelledby="about-title" className="text-center">
          <Label>About</Label>
          <h1 id="about-title" className="mt-4 text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
            About AstroFire 3D
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-secondary">
            AstroFire 3D helps students, researchers and aerospace engineers understand how materials burn in crewed
            space environments. It brings together space combustion experiments and technical reports, and turns them
            into a simulation with fire risk, suppression guidance and the sources behind every result.
          </p>
        </section>

        {/* 2. How it works */}
        <Section id="how-it-works" label="How it works" title="How it works">
          <ol className="flex flex-col items-stretch gap-3 md:flex-row">
            {PIPELINE.map((block, i) => (
              <li key={block.name} className="flex flex-col items-center gap-3 md:flex-1 md:flex-row">
                <div className={`${PANEL} w-full p-5 md:self-stretch`}>
                  <p className="font-mono text-[0.6875rem] tracking-[0.14em] text-brand uppercase">
                    <span className="sr-only">Step {i + 1}: </span>
                    {block.name}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-secondary">{block.text}</p>
                </div>
                {i < PIPELINE.length - 1 ? (
                  <ArrowRight className="size-4 shrink-0 rotate-90 text-label md:rotate-0" aria-hidden />
                ) : null}
              </li>
            ))}
          </ol>
          <p className="mt-6 text-center text-sm" data-testid="tech-docs-link">
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

        {/* 3. SI usage */}
        <Section id="si-usage" label="SI usage" title="How we use SI">
          <div className="grid gap-4 md:grid-cols-2">
            <div className={`${PANEL} p-5 sm:p-6`}>
              <h3 className="text-base font-semibold text-primary">In the product</h3>
              <p className="mt-3 text-sm leading-relaxed text-secondary">
                SI interprets the experimental data for each scenario and writes the diagnosis and suppression
                guidance. These texts are labeled as SI-generated in the results and in the PDF report, and always come
                with their sources.
              </p>
            </div>
            <div className={`${PANEL} p-5 sm:p-6`}>
              <h3 className="text-base font-semibold text-primary">In development</h3>
              <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-secondary">
                {DEV_TOOLS.map((t) => (
                  <li key={t.tool} className="flex gap-3">
                    <span className="text-brand" aria-hidden>
                      —
                    </span>
                    <span>
                      <span className="font-medium text-primary">{t.tool}:</span> {t.use}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={`${PANEL} p-5 sm:p-6 md:col-span-2`}>
              <h3 className="text-base font-semibold text-primary">Human review</h3>
              <p className="mt-3 text-sm leading-relaxed text-secondary">
                The team reviewed every SI-assisted file, checked all references against their original sources and
                validated the results before publishing.
              </p>
            </div>
          </div>
        </Section>

        {/* 4. Limitations */}
        <Section id="limitations" label="Limitations" title="Limitations">
          <ul className={`${PANEL} mx-auto max-w-3xl divide-y divide-subtle`}>
            {LIMITATIONS.map((text) => (
              <li key={text} className="flex gap-3 px-5 py-4 text-sm leading-relaxed text-secondary">
                <span className="text-amber" aria-hidden>
                  —
                </span>
                {text}
              </li>
            ))}
          </ul>
        </Section>

        {/* 5. Credits */}
        <Section id="credits" label="Credits" title="Data & credits">
          <div className={`${PANEL} relative overflow-x-auto`}>
            <table className="w-full border-collapse text-left text-sm">
              <thead className="font-mono text-[0.6875rem] tracking-[0.08em] text-label uppercase">
                <tr>
                  <th scope="col" className="border-b border-subtle px-4 py-3 font-medium">Resource</th>
                  <th scope="col" className="border-b border-subtle px-4 py-3 font-medium">Type</th>
                  <th scope="col" className="border-b border-subtle px-4 py-3 font-medium">License</th>
                  <th scope="col" className="border-b border-subtle px-4 py-3 text-right font-medium">Source</th>
                </tr>
              </thead>
              <tbody>
                {CREDITS_LEDGER.map((item) => (
                  <tr key={item.resource} className="border-b border-subtle last:border-b-0">
                    <td className="px-4 py-3 text-primary">{item.resource}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-secondary">{item.type}</td>
                    <td
                      className={`px-4 py-3 font-mono text-xs whitespace-nowrap ${item.license === 'To verify' ? 'text-warning' : 'text-secondary'}`}
                    >
                      {item.license}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
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

        {/* 6. Team */}
        <Section id="team" label="Team" title="21 Pyro Rangers" subtitle="Uberlândia, Brazil · NASA Space Apps Challenge 2026">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
            {TEAM.map((m) => (
              <li key={m.name} className="flex flex-col items-center text-center">
                <span
                  aria-hidden="true"
                  className="inline-flex size-16 items-center justify-center rounded-full border border-[#1F2C47] bg-[#0F1728] font-mono text-xl font-semibold text-[#F28C28]"
                >
                  {m.name[0]}
                </span>
                <span className="mt-3 text-sm font-medium text-primary">{m.name}</span>
                <span className="mt-0.5 text-xs leading-snug text-muted">{m.role}</span>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  )
}

function Label({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[0.75rem] tracking-[0.18em] text-label uppercase">
      <span className="text-brand" aria-hidden>
        ●
      </span>{' '}
      {children}
    </p>
  )
}

function Section({
  id,
  label,
  title,
  subtitle,
  children,
}: {
  id: string
  label: string
  title: string
  subtitle?: string
  children: ReactNode
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-20">
      <div className="text-center">
        <Label>{label}</Label>
        <h2 id={`${id}-title`} className="mt-4 text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
          {title}
        </h2>
        {subtitle ? <p className="mt-2 text-sm text-secondary">{subtitle}</p> : null}
      </div>
      <div className="mt-8">{children}</div>
    </section>
  )
}
