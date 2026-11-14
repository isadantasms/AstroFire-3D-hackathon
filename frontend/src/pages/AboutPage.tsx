// SI-assisted: generated with Gemini & Claude, reviewed and edited by Rocha, Elias, Pina & Dantas
// Source: NASA PSI, BASS-II (PSI-25), DOI 10.60555/4qc4-de67, CC0-1.0
import { ExternalLink, ShieldCheck } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { ConsolePanel, Tag } from '../components/ConsolePanel'

const TEAM_MEMBERS = [
  {
    name: 'Elias',
    role: 'Lead Architect & Data Engineer',
    focus: 'NASA PSI/NTRS data curation, deterministic physics engine, and PINN cross-validation pipeline.',
  },
  {
    name: 'Pina',
    role: 'Backend & API Engineer',
    focus: 'FastAPI contract endpoints, mission presets, and multi-investigation ranking & comparison engine.',
  },
  {
    name: 'Dantas',
    role: 'Scientific Synthesis & Telemetry',
    focus: 'Olson Eq. (6.1) flammability boundaries, stoichiometric CO/CO2 telemetry, and safety protocols.',
  },
  {
    name: 'Esquivel',
    role: '3D Simulation & Shader Engineer',
    focus: 'Three.js / Unity microgravity combustion chamber, spherical 0g diffusion vs. elongated wake shaders.',
  },
  {
    name: 'Celina',
    role: 'SI Copilot & Validation Specialist',
    focus: 'Zero-hallucination grounding rules, physical collocation constraints, and NASA compliance ledger.',
  },
  {
    name: 'Rocha',
    role: 'Frontend & Mission Console Lead',
    focus: 'Three-column mission console, Ajv runtime schema validation, accessibility, and telemetry visualization.',
  },
]

const CREDITS_LEDGER = [
  {
    resource: 'BASS-II (PSI-25): Burning and Suppression of Solids - II',
    type: 'NASA Data',
    license: 'CC0-1.0',
    url: 'https://doi.org/10.60555/4qc4-de67',
    usedIn: 'backend/data/bass2_empirical_verified.json (79 verified ISS states)',
  },
  {
    resource: 'NASA/TM-20210011385: BASS-II Summary Report (Olson et al., 2021)',
    type: 'NASA Technical Report',
    license: 'US Gov Public Domain',
    url: 'https://ntrs.nasa.gov/citations/20210011385',
    usedIn: 'Olson Eq. 6.1 LOI boundary, Bhattacharjee Eq. 2.2–2.5 & CO/CO2 stoichiometry',
  },
  {
    resource: 'Saffire I–VI (NTRS-20170000230 & NTRS-20240002981)',
    type: 'NASA Technical Report',
    license: 'CC0-1.0 / Public Domain',
    url: 'https://ntrs.nasa.gov/citations/20170000230',
    usedIn: 'Meter-scale Cygnus spacecraft fire bounds & 30–34% O2 exploration atmospheres',
  },
  {
    resource: 'SAME / SoFIE / FLEX / SPICE (NTRS-20170007283)',
    type: 'NASA Data & Report',
    license: 'CC0-1.0 / Public Domain',
    url: 'https://ntrs.nasa.gov/citations/20170007283',
    usedIn: 'Cross-investigation synthesis, aerosol detection & spherical droplet regimes',
  },
  {
    resource: 'React 19, TypeScript, Vite & Tailwind CSS',
    type: 'Open-Source Libraries',
    license: 'MIT / Apache-2.0',
    url: 'https://react.dev',
    usedIn: 'frontend/ three-column mission console',
  },
  {
    resource: 'FastAPI & Pydantic V2 (+ Python 3.12 stdlib fallback)',
    type: 'Open-Source Libraries',
    license: 'MIT License',
    url: 'https://fastapi.tiangolo.com',
    usedIn: 'backend/ deterministic API and JSON Schema contract validation',
  },
  {
    resource: 'Ajv, Lucide Icons, Inter & JetBrains Mono (@fontsource)',
    type: 'UI & Validation Assets',
    license: 'MIT / ISC / SIL OFL 1.1',
    url: 'https://ajv.js.org',
    usedIn: 'Runtime schema validation, telemetry icons, and self-hosted typography',
  },
]

export function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Project documentation"
        title="About & SI Usage"
        lead="[PROJECT_NAME] is an open-source microgravity combustion explorer and Super Intelligence (SI) fire-safety copilot built for the 2026 NASA Space Apps Challenge (Flame in Freefall)."
      />

      <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6">
        {/* Architecture & Mission */}
        <ConsolePanel title="System Architecture & Single Source of Truth" aside={<Tag tone="focus">Contract-First</Tag>}>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="border border-subtle bg-void p-4">
              <p className="font-mono text-xs text-focus">01 · JSON Schema Contract</p>
              <h3 className="mt-1 text-sm font-semibold text-primary">contracts/simulation_schema.json</h3>
              <p className="mt-2 text-xs leading-relaxed text-secondary">
                Synchronizes the Python backend, the React telemetry dashboard, and the 3D Flame Chamber with strict
                runtime validation via Pydantic V2 and Ajv.
              </p>
            </div>
            <div className="border border-subtle bg-void p-4">
              <p className="font-mono text-xs text-focus">02 · Deterministic Physics + PINN</p>
              <h3 className="mt-1 text-sm font-semibold text-primary">&lt; 5 ms Zero-Key Execution</h3>
              <p className="mt-2 text-xs leading-relaxed text-secondary">
                Combines exact lookup on 79 verified BASS-II ISS states with Olson Eq. (6.1) and Bhattacharjee
                Eq. (2.2)–(2.5) physical equations, validated via 5-fold PINN cross-validation (94.94% accuracy, R² = 0.9117).
              </p>
            </div>
            <div className="border border-subtle bg-void p-4">
              <p className="font-mono text-xs text-focus">03 · 3D Chamber &amp; Safety Copilot</p>
              <h3 className="mt-1 text-sm font-semibold text-primary">Explainable Crew Guidance</h3>
              <p className="mt-2 text-xs leading-relaxed text-secondary">
                Maps physical telemetry directly to spherical blue diffusion flames (`0g`, `&lt; 1 cm/s`) vs. elongated
                luminous wakes, paired with auditable NASA citations.
              </p>
            </div>
          </div>
        </ConsolePanel>

        {/* SI Usage Disclosure (#si-usage) */}
        <ConsolePanel
          id="si-usage"
          title="Super Intelligence (SI) Usage & Human Verification Protocol"
          aside={<Tag tone="focus">NASA 2026 Compliance</Tag>}
        >
          <div className="space-y-4 text-xs leading-relaxed text-secondary">
            <p className="flex items-start gap-2 border border-focus/50 bg-void p-3 text-primary">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-focus" aria-hidden />
              <span>
                <strong>Zero-Hallucination Grounding Policy:</strong> No generative model is allowed to invent
                experimental numbers, DOIs, or safety thresholds at runtime. Every simulation output is computed
                deterministically from verified NASA tables and equations.
              </span>
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="border border-subtle bg-void p-4">
                <h3 className="font-mono text-xs text-primary uppercase">1. SI inside the Product (Physics-Informed ML)</h3>
                <p className="mt-2">
                  To overcome the small-data regime inherent to orbital glovebox experiments (79 verified BASS-II test
                  steps), we trained a hybrid <strong>Physics-Informed Neural Network (PINN)</strong> and classifier
                  ensemble (`backend/app/ml_pipeline.py`). By embedding Olson Eq. (6.1) and Bhattacharjee Eq. (2.2) into
                  the loss function alongside 24 boundary collocation points, the model achieves 94.94% stratified 5-fold
                  CV accuracy and R² = 0.9117 without synthetic hallucination.
                </p>
              </div>
              <div className="border border-subtle bg-void p-4">
                <h3 className="font-mono text-xs text-primary uppercase">2. SI in Development &amp; Human Audit</h3>
                <p className="mt-2">
                  Coding assistants (Gemini and Claude) were used to scaffold boilerplate, extract tabular records from
                  NASA/TM-20210011385, and write unit tests. Every SI-assisted file carries an explicit{' '}
                  <code className="font-mono text-primary"># SI-assisted</code> /{' '}
                  <code className="font-mono text-primary">// SI-assisted</code> header naming the human reviewers. For
                  example, human audit verified every NTRS report against the official NASA NTRS API and confirmed the
                  Saffire citations (`NTRS-20170000230` and `NTRS-20240002981`).
                </p>
              </div>
            </div>
          </div>
        </ConsolePanel>

        {/* Team Roster */}
        <ConsolePanel title="Engineering & Science Team" aside={<Tag>6 Members</Tag>}>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM_MEMBERS.map((member) => (
              <li key={member.name} className="border border-subtle bg-void p-4">
                <p className="font-mono text-xs text-focus uppercase">{member.role}</p>
                <h3 className="mt-1 text-base font-semibold text-primary">{member.name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-secondary">{member.focus}</p>
              </li>
            ))}
          </ul>
        </ConsolePanel>

        {/* Credits & Licenses (#credits) */}
        <ConsolePanel
          id="credits"
          title="Credits, Open-Source Licenses & NASA Data Ledger"
          aside={<Tag>PSI-10 Strictly Excluded</Tag>}
        >
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="bg-elevated font-mono text-[0.625rem] text-secondary uppercase">
                <tr>
                  <th className="border-b border-subtle px-3 py-2">Resource</th>
                  <th className="border-b border-subtle px-3 py-2">Type</th>
                  <th className="border-b border-subtle px-3 py-2">License</th>
                  <th className="border-b border-subtle px-3 py-2">Used In</th>
                  <th className="border-b border-subtle px-3 py-2 text-right">Source</th>
                </tr>
              </thead>
              <tbody>
                {CREDITS_LEDGER.map((item) => (
                  <tr key={item.resource} className="border-b border-subtle bg-void">
                    <td className="px-3 py-2 font-medium text-primary">{item.resource}</td>
                    <td className="px-3 py-2 text-secondary">{item.type}</td>
                    <td className="px-3 py-2 font-mono text-secondary">{item.license}</td>
                    <td className="px-3 py-2 text-secondary">{item.usedIn}</td>
                    <td className="px-3 py-2 text-right">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-focus hover:underline"
                      >
                        Link
                        <ExternalLink className="size-3" aria-hidden />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ConsolePanel>
      </div>
    </>
  )
}
