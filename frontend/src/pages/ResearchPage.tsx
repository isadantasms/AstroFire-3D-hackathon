// SI-assisted: generated with Gemini & Claude, reviewed and edited by Rocha, Elias, Pina & Dantas
// Source: NASA PSI, BASS-II (PSI-25), DOI 10.60555/4qc4-de67, CC0-1.0
// Reference: Olson et al., NASA/TM-20210011385 (2021); Saffire I-VI (NTRS-20170000230)
import { lazy, Suspense, useState } from 'react'
import { ExternalLink, ShieldCheck } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { ConsolePanel, Tag } from '../components/ConsolePanel'
import { FlameGeometryFigure } from '../components/FlameGeometryFigure'
import { CreditsLedger } from '../components/CreditsLedger'
// Lazy: keeps the BASS-II snapshot and API client out of the main bundle.
const BassExperimentsSection = lazy(() =>
  import('../features/simulator/experiments/BassExperimentsSection').then((m) => ({ default: m.BassExperimentsSection })),
)
import pinnMetrics from '../../../backend/data/pinn_validation_metrics.json'

type TargetEnvKey = 'lunar_base_30o2' | 'iss_space_station' | 'martian_habitat' | 'spacecraft_cabin_rover'

interface InvestigationItem {
  id: string
  code: string
  name: string
  facility: string
  o2Range: string
  flowRange: string
  fuels: string
  similarity: string
  difference: string
  prevention: string
  detection: string
  suppression: string
  url: string
  scores: Record<TargetEnvKey, number>
}

const ENVIRONMENTS: { key: TargetEnvKey; label: string; badge: string }[] = [
  { key: 'lunar_base_30o2', label: 'Lunar Base (0.16g · 30–34% O2)', badge: 'Artemis Exploration Bound' },
  { key: 'iss_space_station', label: 'ISS Orbital Lab (0.00g · 21% O2)', badge: 'Empirical Baseline' },
  { key: 'martian_habitat', label: 'Martian Habitat (0.38g · 21–24% O2)', badge: 'Partial-g Bound' },
  { key: 'spacecraft_cabin_rover', label: 'Crew Cabin & Pressurized Rover', badge: 'Confined Enclosure' },
]

const INVESTIGATIONS: InvestigationItem[] = [
  {
    id: 'BASS-II',
    code: 'PSI-25 · NASA/TM-20210011385',
    name: 'Burning and Suppression of Solids - II (BASS-II)',
    facility: 'ISS Microgravity Science Glovebox (MSG) — 7.6 × 7.6 cm Flow Duct',
    o2Range: '13.6% – 29.3% O2 (N2 dilution)',
    flowRange: '0.0 – 55.0 cm/s (opposed & concurrent)',
    fuels: 'PMMA slabs (1–5 mm), PMMA thin films (0.1–0.4 mm), PMMA rods, SIBAL cotton-fiberglass, Nomex III, Japan wax candle',
    similarity: 'Shares standardized PMMA and SIBAL reference fuels with Saffire and SoFIE under controlled forced-ventilation ducts.',
    difference: 'Maps exact cm-scale extinction boundaries (Olson Eq. 6.1 U-shaped LOI & Bhattacharjee radiative quench) across 79 verified states.',
    prevention: 'Replace upward 1g NASA-STD-6001 Test 1 screening with stagnation blowoff extrapolation to capture low-flow 0g flammability.',
    detection: 'Pair CO/CO2 stoichiometric sensors (370–550 ppm CO per 1% CO2) with UV/IR optical detectors for soot-free blue flames.',
    suppression: 'Immediate HVAC ventilation shutoff (< 2 s) induces radiative quenching; allow 9+ min solid cooldown before airflow recovery.',
    url: 'https://doi.org/10.60555/4qc4-de67',
    scores: { iss_space_station: 99, lunar_base_30o2: 95, martian_habitat: 92, spacecraft_cabin_rover: 96 },
  },
  {
    id: 'SAFFIRE',
    code: 'Saffire I–VI · NTRS-20170000230 & NTRS-20240002981',
    name: 'Spacecraft Fire Safety Demonstration Project (Saffire I–VI)',
    facility: 'Uncrewed Northrop Grumman Cygnus Spacecraft (17–19 m³ free volume)',
    o2Range: '21.0% – 34.0% O2 (8.2–14.7 psi)',
    flowRange: '3.0 – 30.0 cm/s vehicle duct flow',
    fuels: 'Meter-scale SIBAL sheets (0.4 × 1.0 m), thick/ribbed PMMA panels, Nomex fire barriers, silicone & cotton',
    similarity: 'Tests the exact same SIBAL cotton-fiberglass and PMMA materials studied in BASS-II under forced ventilation.',
    difference: 'Full meter-scale vehicle burns up to 10 kW in 34% O2 exploration atmospheres, quantifying cabin-wide gas toxicity & HCl sorption.',
    prevention: 'Restrict exposed flammable surface area in 30–34% O2 exploration habitats; enforce Nomex firebreaks.',
    detection: 'Monitor vehicle-wide CO2, CO, and HCl/HF acid gases via Far Field Diagnostics; toxicity rises faster than cabin pressure.',
    suppression: 'Automate ECLSS post-fire acid-gas (HCl) scrubbing and ventilation isolation prior to crew re-entry.',
    url: 'https://ntrs.nasa.gov/citations/20170000230',
    scores: { iss_space_station: 93, lunar_base_30o2: 99, martian_habitat: 94, spacecraft_cabin_rover: 98 },
  },
  {
    id: 'SOFIE',
    code: 'SoFIE · ISS Combustion Integrated Rack (CIR)',
    name: 'Solid Fuel Ignition and Extinction (GEL, RTDFS, MIST, SMOLDER, FEANICS)',
    facility: 'ISS Combustion Integrated Rack (CIR) Flow Tunnel',
    o2Range: '15.0% – 40.0% O2',
    flowRange: '1.0 – 50.0 cm/s with external radiant flux',
    fuels: 'PMMA spheres, flat plates, and thermally-soaked thick polymers',
    similarity: 'Direct successor to BASS-II investigating PMMA solid fuels under opposed and concurrent low-velocity flow.',
    difference: 'Adds variable ambient pressure and external radiant preheating inside the CIR to bound exploration cabin atmospheres.',
    prevention: 'Account for external radiative preheating from adjacent avionics racks when certifying thick polymers.',
    detection: 'Narrow-band infrared thermal imaging of solid surface preheating prior to visible ignition.',
    suppression: 'De-energize external heat source (electrical bus) simultaneously with cabin airflow cutoff.',
    url: 'https://psi.nasa.gov/physci/repo/search?q=SoFIE',
    scores: { iss_space_station: 90, lunar_base_30o2: 96, martian_habitat: 95, spacecraft_cabin_rover: 91 },
  },
  {
    id: 'SAME',
    code: 'SAME · NTRS-20170007283',
    name: 'Smoke Aerosol Measurement Experiment (SAME)',
    facility: 'ISS Microgravity Science Glovebox (MSG)',
    o2Range: '21.0% O2 (cabin air)',
    flowRange: '1.0 – 10.0 cm/s duct transport',
    fuels: 'Overheated Kapton wire insulation, Teflon, Silicone, Cellulose paper, Lamp wick',
    similarity: 'Operated inside the ISS MSG to protect spacecraft cabins from early electrical and polymer fire hazards.',
    difference: 'Characterizes non-flaming pyrolysis smoke aerosol particle size distributions rather than open flame spread.',
    prevention: 'Derate electrical wire currents in 0g because absence of buoyant cooling increases insulation overheating.',
    detection: 'Calibrate dual-wavelength optical detectors for larger microgravity aerosol agglomerates.',
    suppression: 'Cut electrical circuit power during the pyrolysis/smoldering stage before flaming ignition occurs.',
    url: 'https://ntrs.nasa.gov/citations/20170007283',
    scores: { iss_space_station: 94, lunar_base_30o2: 88, martian_habitat: 89, spacecraft_cabin_rover: 93 },
  },
  {
    id: 'FLEX',
    code: 'FLEX & FLEX-2 · ISS CIR',
    name: 'Flame Extinguishment Experiment (FLEX)',
    facility: 'ISS Combustion Integrated Rack (CIR) — Droplet Apparatus',
    o2Range: '15.0% – 30.0% O2 (N2/CO2/He diluents)',
    flowRange: '0.0 – 5.0 cm/s quiescent & slow convective',
    fuels: 'Heptane, methanol, decane, and biobutanol droplets',
    similarity: 'Establishes the fundamental physics of spherical blue diffusion flames and radiative extinction in 0g.',
    difference: 'Studies liquid droplets rather than solid polymers, discovering low-temperature cool flames after visible radiative quench.',
    prevention: 'Account for invisible cool-flame re-ignition pathways in hydrocarbon vapor leaks.',
    detection: 'Use UV (OH*) and mid-IR spectroscopy to detect dim spherical diffusion flames.',
    suppression: 'Require higher inert gas / fine water mist concentrations in 0g than in 1g due to spherical diffusion geometry.',
    url: 'https://psi.nasa.gov/physci/repo/search?q=FLEX',
    scores: { iss_space_station: 87, lunar_base_30o2: 82, martian_habitat: 81, spacecraft_cabin_rover: 85 },
  },
  {
    id: 'SPICE',
    code: 'SPICE · ISS MSG',
    name: 'Smoke Point In Co-flow Experiment (SPICE)',
    facility: 'ISS Microgravity Science Glovebox (MSG)',
    o2Range: '21.0% O2',
    flowRange: '5.0 – 50.0 cm/s laminar co-flow',
    fuels: 'Ethylene, propane, methane, and propylene gas jets',
    similarity: 'Quantifies the transition from clean blue non-sooting flames to luminous orange radiative soot plumes in the ISS MSG.',
    difference: 'Studies gaseous jet smoke points, proving how longer residence time in microgravity shifts the soot threshold.',
    prevention: 'Control ventilation velocity to avoid operating in the heavy-soot radiant heat release regime.',
    detection: 'Switch detector sensitivity profiles between blue soot-free regime (< 1 cm/s) and luminous soot plumes (>= 1 cm/s).',
    suppression: 'Rapid fuel/flow cutoff before radiant soot shell heats adjacent surfaces.',
    url: 'https://psi.nasa.gov/physci/repo/search?q=SPICE',
    scores: { iss_space_station: 84, lunar_base_30o2: 80, martian_habitat: 80, spacecraft_cabin_rover: 82 },
  },
]

export function ResearchPage() {
  const [targetEnv, setTargetEnv] = useState<TargetEnvKey>('lunar_base_30o2')

  const ranked = [...INVESTIGATIONS].sort((a, b) => b.scores[targetEnv] - a.scores[targetEnv])
  const clf = pinnMetrics.classification_metrics
  const reg = pinnMetrics.regression_metrics

  return (
    <>
      <PageHeader
        eyebrow="Datasets & methodology"
        title="Research & Data"
        lead="Physics-Informed Neural Network (PINN) cross-validation on 79 verified NASA BASS-II (PSI-25) empirical states, plus multi-investigation ranking across Saffire, SoFIE, SAME, FLEX, and SPICE."
      />

      <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6">
        {/* Compliance & Partial-Gravity Boundary Banner */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="border border-focus/60 bg-panel p-4">
            <p className="flex items-center gap-2 font-mono text-xs text-focus uppercase">
              <ShieldCheck className="size-4" aria-hidden />
              Open-License Compliance Guard (PSI-10 Excluded)
            </p>
            <p className="mt-2 text-xs leading-relaxed text-secondary">
              {pinnMetrics.grounding_sources.compliance_guard}. All empirical records in this repository derive from{' '}
              <strong className="text-primary">BASS-II (PSI-25, DOI: 10.60555/4qc4-de67)</strong> and{' '}
              <strong className="text-primary">NASA/TM-20210011385</strong> under CC0-1.0 / US Government Public Domain.
            </p>
          </div>
          <div className="border border-warning/60 bg-panel p-4">
            <p className="font-mono text-xs text-warning uppercase">
              Partial-Gravity Scientific Boundary (0.16g Moon &amp; 0.38g Mars)
            </p>
            <p className="mt-2 text-xs leading-relaxed text-secondary">
              No direct partial-gravity (0.16g Lunar or 0.38g Martian) combustion datasets exist in NASA PSI today.
              Lunar and Martian scenarios are presented as <strong className="text-primary">bounded physical interpolations</strong>{' '}
              between 0g forced-flow (BASS-II / Saffire) and 1g baselines using convective buoyant stretch equivalence.
            </p>
          </div>
        </div>

        {/* Fig. 01: flame geometry (moved here from the Home page) */}
        <FlameGeometryFigure />

        {/* BASS-II record table (moved here from the Simulator) */}
        <Suspense fallback={<div className="h-[32rem] border border-subtle bg-panel" />}>
          <BassExperimentsSection />
        </Suspense>

        {/* PINN Training & Validation Pipeline */}
        <ConsolePanel
          title="Physics-Informed Neural Network (PINN) & 5-Fold Cross-Validation"
          aside={<Tag tone="focus">79 ISS States + 24 Collocation Points</Tag>}
        >
          <p className="text-sm leading-relaxed text-secondary">
            {pinnMetrics.why_small_data_succeeds.explanation}
          </p>

          <dl className="mt-5 grid grid-cols-2 gap-px border border-subtle bg-subtle sm:grid-cols-4">
            <div className="bg-void p-4">
              <dt className="label-mono">Ignition / Quench Accuracy</dt>
              <dd className="mt-1 font-mono text-2xl text-focus">{clf.accuracy_pct.toFixed(2)}%</dd>
              <p className="mt-1 text-[0.6875rem] text-muted">Stratified 5-Fold CV (TP={clf.confusion_matrix.true_positives_sustained}, TN={clf.confusion_matrix.true_negatives_quenched})</p>
            </div>
            <div className="bg-void p-4">
              <dt className="label-mono">Safety Recall &amp; F1</dt>
              <dd className="mt-1 font-mono text-2xl text-primary">
                {clf.recall_pct.toFixed(1)}% <span className="text-sm text-secondary">/ {clf.f1_score_pct.toFixed(1)}%</span>
              </dd>
              <p className="mt-1 text-[0.6875rem] text-muted">Sustained flame detection recall / F1</p>
            </div>
            <div className="bg-void p-4">
              <dt className="label-mono">Spread Rate R² (PINN)</dt>
              <dd className="mt-1 font-mono text-2xl text-focus">{reg.r2_score.toFixed(4)}</dd>
              <p className="mt-1 text-[0.6875rem] text-muted">5-Fold CV on Vf (mm/s)</p>
            </div>
            <div className="bg-void p-4">
              <dt className="label-mono">Spread Rate RMSE / MAE</dt>
              <dd className="mt-1 font-mono text-2xl text-primary">
                {reg.rmse_mm_s.toFixed(3)} <span className="text-xs text-secondary">mm/s</span>
              </dd>
              <p className="mt-1 text-[0.6875rem] text-muted">MAE: {reg.mae_mm_s.toFixed(3)} mm/s · {pinnMetrics.training_execution_ms} ms</p>
            </div>
          </dl>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {/* Feature Importance */}
            <div className="border border-subtle bg-void p-4">
              <h3 className="label-mono">Physical Feature Importance (Permutation Sensitivity)</h3>
              <ul className="mt-4 space-y-3">
                {pinnMetrics.feature_importance.map((feat) => (
                  <li key={feat.feature_key}>
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="font-medium text-primary">{feat.feature_name}</span>
                      <span className="font-mono text-focus">{feat.importance_pct.toFixed(1)}%</span>
                    </div>
                    <div className="mt-1 h-2 w-full bg-panel">
                      <div className="h-full bg-focus" style={{ width: `${Math.min(100, feat.importance_pct * 2.4)}%` }} />
                    </div>
                    <p className="mt-1 text-[0.6875rem] text-muted">{feat.physical_mechanism}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* PINN Convergence Curve */}
            <div className="border border-subtle bg-void p-4">
              <h3 className="label-mono">Hybrid PINN Loss Convergence (Olson Eq. 6.1 + Bhattacharjee Eq. 2.2)</h3>
              <p className="mt-1 text-xs text-secondary">
                L_total = L_MSE(BASS-II) + 0.5 · L_physics(LOI &amp; Quench Boundary Collocation)
              </p>
              <div className="mt-3 max-h-64 overflow-auto border border-subtle">
                <table className="w-full border-collapse text-left font-mono text-xs">
                  <thead className="sticky top-0 bg-elevated text-[0.625rem] text-secondary uppercase">
                    <tr>
                      <th className="px-2.5 py-1.5">Epoch</th>
                      <th className="px-2.5 py-1.5 text-right">Train MSE</th>
                      <th className="px-2.5 py-1.5 text-right">Val MSE</th>
                      <th className="px-2.5 py-1.5 text-right">Physics Loss</th>
                      <th className="px-2.5 py-1.5 text-right">Total PINN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pinnMetrics.pinn_loss_curve
                      .filter((_, idx) => idx % 3 === 0 || idx === pinnMetrics.pinn_loss_curve.length - 1)
                      .map((row) => (
                        <tr key={row.epoch} className="border-t border-subtle">
                          <td className="px-2.5 py-1 text-primary">{row.epoch}</td>
                          <td className="px-2.5 py-1 text-right text-secondary">{row.train_mse_loss.toFixed(4)}</td>
                          <td className="px-2.5 py-1 text-right text-secondary">{row.val_mse_loss.toFixed(4)}</td>
                          <td className="px-2.5 py-1 text-right text-focus">{row.physics_residual_loss.toFixed(4)}</td>
                          <td className="px-2.5 py-1 text-right text-primary">{row.total_pinn_loss.toFixed(4)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </ConsolePanel>

        {/* Multi-Investigation Ranking & Comparison */}
        <ConsolePanel
          title="NASA PSI & NTRS Investigation Ranking & Safety Comparison"
          aside={<Tag>6 Open Campaigns · PSI-10 Excluded</Tag>}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-subtle pb-4">
            <p className="text-xs text-secondary">
              Select a target mission habitat to rank open NASA microgravity combustion investigations by physical relevance:
            </p>
            <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Target mission habitat">
              {ENVIRONMENTS.map((env) => {
                const active = targetEnv === env.key
                return (
                  <button
                    key={env.key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setTargetEnv(env.key)}
                    className={`border px-3 py-1.5 text-xs transition-colors ${
                      active
                        ? 'border-focus bg-elevated font-medium text-primary'
                        : 'border-subtle bg-void text-secondary hover:text-primary'
                    }`}
                  >
                    {env.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {ranked.map((inv, idx) => (
              <article key={inv.id} className="flex flex-col justify-between border border-subtle bg-void p-4">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-xs text-focus">
                        #{idx + 1} · {inv.code}
                      </span>
                      <h3 className="mt-1 text-base font-semibold text-primary">{inv.name}</h3>
                    </div>
                    <span className="border border-focus/60 bg-panel px-2 py-0.5 font-mono text-xs text-focus">
                      Score {inv.scores[targetEnv]}/100
                    </span>
                  </div>

                  <dl className="mt-3 grid grid-cols-2 gap-2 border-y border-subtle py-2 text-xs">
                    <div>
                      <dt className="text-muted">Facility</dt>
                      <dd className="text-secondary">{inv.facility}</dd>
                    </div>
                    <div>
                      <dt className="text-muted">O2 &amp; Airflow Tested</dt>
                      <dd className="font-mono text-secondary">
                        {inv.o2Range} · {inv.flowRange}
                      </dd>
                    </div>
                  </dl>

                  <p className="mt-2.5 text-xs leading-relaxed text-secondary">
                    <strong className="text-primary">Similarity:</strong> {inv.similarity}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-secondary">
                    <strong className="text-primary">Key Distinction:</strong> {inv.difference}
                  </p>

                  <div className="mt-3 space-y-1 border-t border-subtle pt-2.5 text-[0.6875rem] leading-snug text-secondary">
                    <p>
                      <span className="font-mono text-nominal uppercase">Prevention: </span>
                      {inv.prevention}
                    </p>
                    <p>
                      <span className="font-mono text-warning uppercase">Detection: </span>
                      {inv.detection}
                    </p>
                    <p>
                      <span className="font-mono text-critical uppercase">Suppression: </span>
                      {inv.suppression}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-subtle pt-2.5 text-xs">
                  <span className="font-mono text-[0.6875rem] text-muted">CC0-1.0 / Public Domain</span>
                  <a
                    href={inv.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-focus hover:underline"
                  >
                    Inspect NASA Record
                    <ExternalLink className="size-3.5" aria-hidden />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </ConsolePanel>

        {/* Data & credits (moved here from the former About page) */}
        <CreditsLedger />
      </div>
    </>
  )
}
