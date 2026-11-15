// SI-assisted: generated with Gemini & Claude, reviewed and edited by Rocha, Elias, Pina & Dantas
// Source: NASA PSI, BASS-II (PSI-25), DOI 10.60555/4qc4-de67, CC0-1.0
// Reference: Olson et al., NASA/TM-20210011385 (2021); Saffire (NTRS-20170000230, NTRS-20240002981)
/**
 * NASA investigations ranked on the Documentation page.
 * Numeric conditions appear only when they can be traced to a source: BASS-II ranges are
 * computed from the 79 dataset records; the other investigations show "see source".
 */
import { BASS2_RANGES } from '../data/experimentsSnapshot'
import { fmt } from '../lib/format'

export type HabitatKey = 'lunar_base' | 'iss' | 'martian_habitat' | 'crew_cabin_rover'

export const HABITATS: readonly { key: HabitatKey; label: string }[] = [
  { key: 'lunar_base', label: 'Lunar base (0.16 g)' },
  { key: 'iss', label: 'ISS orbital lab (0 g)' },
  { key: 'martian_habitat', label: 'Martian habitat (0.38 g)' },
  { key: 'crew_cabin_rover', label: 'Crew cabin & pressurized rover' },
]

/*
 * TODO(ranking): the team ordered the investigations per habitat with internal values (scores below).
 * The criteria behind them are not documented, so the page shows only a team-assigned relevance level
 * (High / Medium) and never the number. Document the criteria to show more.
 */
export type Relevance = 'High' | 'Medium'

/** Team-assigned relevance level derived from the internal ordering value (90 or more: High). */
export function relevanceOf(inv: Investigation, habitat: HabitatKey): Relevance {
  return inv.scores[habitat] >= 90 ? 'High' : 'Medium'
}

export const RELEVANCE_EXPLANATION =
  'Team-assigned relevance (High / Medium) for each habitat. The criteria behind it are not documented yet (to verify).'

export interface Investigation {
  id: string
  code: string
  name: string
  facility: string
  /** Short label of where the test ran, shown as a badge on the card (from the facility above). */
  site: string
  /** Tested O2 and airflow, only when traceable to a source; otherwise null ("see source"). */
  conditions: string | null
  why: string
  materials: string
  similarity: string
  difference: string
  prevention: string
  detection: string
  suppression: string
  /** Numbers of the entries in REFERENCES (content/references.ts). */
  refs: number[]
  url: string
  /** Internal team ordering per habitat; used only to sort and to derive the relevance level, never shown. */
  scores: Record<HabitatKey, number>
}

const o2 = BASS2_RANGES.o2Pct
const air = BASS2_RANGES.airflowCmS

export const INVESTIGATIONS: readonly Investigation[] = [
  {
    id: 'BASS-II',
    code: 'PSI-25 · NASA/TM-20210011385',
    name: 'Burning and Suppression of Solids–II (BASS-II)',
    facility: 'ISS Microgravity Science Glovebox (MSG)',
    site: 'ISS · MSG',
    conditions: `${fmt(o2.min, 1)}–${fmt(o2.max, 1)}% O₂ · ${fmt(air.min, 1)}–${fmt(air.max, 1)} cm/s (79 tests)`,
    why: 'Observed ISS flame-spread and extinction data for solid fuels under forced flow. AstroFire matches every scenario against these records.',
    materials: 'PMMA slabs, thin films and rods, SIBAL cotton-fiberglass fabric, Nomex III, Japan wax candle',
    similarity: 'Shares PMMA and SIBAL reference fuels with Saffire and SoFIE under controlled forced flow.',
    difference: 'Maps flame-spread and extinction behavior across the 79 BASS-II tests.',
    prevention: 'Supplement upward 1g flammability screening with low-flow microgravity data.',
    detection: 'Pair CO/CO₂ gas sensing with UV/IR optical detection for dim, soot-free blue flames.',
    suppression: 'Shut off ventilation to promote extinction, and let the solid cool before airflow is restored.',
    refs: [1, 2],
    url: 'https://doi.org/10.60555/4qc4-de67',
    scores: { iss: 99, lunar_base: 95, martian_habitat: 92, crew_cabin_rover: 96 },
  },
  {
    id: 'SAFFIRE',
    code: 'Saffire I–VI · NTRS-20170000230 & NTRS-20240002981',
    name: 'Spacecraft Fire Safety Demonstration Project (Saffire I–VI)',
    facility: 'Uncrewed Northrop Grumman Cygnus spacecraft',
    site: 'Cygnus',
    conditions: null,
    why: 'Large-scale burns of materials also studied in BASS-II, aboard an uncrewed vehicle. Informs cabin-scale fire growth and combustion products.',
    materials: 'SIBAL fabric sheets, PMMA panels, Nomex fire barriers, silicone and cotton',
    similarity: 'Tests the SIBAL cotton-fiberglass and PMMA materials studied in BASS-II under forced flow.',
    difference: 'Burns large samples at vehicle scale and measures cabin-wide combustion products, including acid gases.',
    prevention: 'Limit exposed flammable surface area in oxygen-enriched exploration habitats and use fire barriers.',
    detection: 'Monitor cabin-wide CO₂, CO and acid gases; toxicity can rise before pressure changes are noticeable.',
    suppression: 'Plan post-fire acid-gas scrubbing and ventilation isolation before crew re-entry.',
    refs: [3, 4],
    url: 'https://ntrs.nasa.gov/citations/20170000230',
    scores: { iss: 93, lunar_base: 99, martian_habitat: 94, crew_cabin_rover: 98 },
  },
  {
    id: 'SOFIE',
    code: 'SoFIE · ISS Combustion Integrated Rack (CIR)',
    name: 'Solid Fuel Ignition and Extinction (RTDFS, NCA, GEL, MIST, SMuRF)',
    facility: 'ISS Combustion Integrated Rack (CIR)',
    site: 'ISS · CIR',
    conditions: null,
    why: 'Studies how solid spacecraft materials ignite, grow and go out, including the effects of flow, oxygen and pressure.',
    materials: 'PMMA and other solid spacecraft materials, including cotton-based fabrics',
    similarity:
      'Several SoFIE principal investigators also authored the BASS-II summary report; both study solid fuels such as PMMA under forced flow.',
    difference: 'Adds variable pressure and external radiant heating inside the CIR.',
    prevention: 'Account for radiant preheating from nearby equipment when assessing thick polymers.',
    detection: 'Use infrared imaging of surface preheating before visible ignition.',
    suppression: 'Remove external heat sources together with airflow cutoff.',
    refs: [6],
    url: 'https://www.nasa.gov/glenn/glenn-expertise-space-exploration/physical-sciences-program/combustion-science/solid-fuel-ignition-and-extinction-sofie/',
    scores: { iss: 90, lunar_base: 96, martian_habitat: 95, crew_cabin_rover: 91 },
  },
  {
    id: 'SAME',
    code: 'SAME · NTRS-20170007283',
    name: 'Smoke Aerosol Measurement Experiment (SAME)',
    facility: 'ISS Microgravity Science Glovebox (MSG)',
    site: 'ISS · MSG',
    conditions: null,
    why: 'Measures smoke from overheated spacecraft materials before flaming starts, which informs early smoke detection.',
    materials: 'Kapton wire insulation, Teflon, silicone, cellulose paper, lamp wick',
    similarity: 'Operated in the ISS MSG to study early electrical and polymer fire hazards in spacecraft cabins.',
    difference: 'Characterizes smoke particles from non-flaming pyrolysis rather than open flame spread.',
    prevention: 'Consider wire current limits in microgravity, where there is no buoyant cooling of insulation.',
    detection: 'Calibrate optical smoke detectors for the particle sizes seen in microgravity.',
    suppression: 'Cut circuit power during the pyrolysis or smoldering stage, before flaming ignition.',
    refs: [5],
    url: 'https://ntrs.nasa.gov/citations/20170007283',
    scores: { iss: 94, lunar_base: 88, martian_habitat: 89, crew_cabin_rover: 93 },
  },
  {
    id: 'FLEX',
    code: 'FLEX & FLEX-2 · ISS CIR',
    name: 'Flame Extinguishment Experiment (FLEX)',
    facility: 'ISS Combustion Integrated Rack (CIR)',
    site: 'ISS · CIR',
    conditions: null,
    why: 'Studies how burning fuel droplets go out in microgravity, including low-temperature flames that continue after visible extinction.',
    materials: 'Heptane, methanol, decane and biobutanol droplets',
    similarity: 'Studies spherical blue diffusion flames and radiative extinction in microgravity.',
    difference: 'Studies liquid droplets rather than solid materials.',
    prevention: 'Consider low-temperature (cool-flame) re-ignition pathways in hydrocarbon vapor leaks.',
    detection: 'Consider UV and infrared sensing for dim spherical diffusion flames.',
    suppression: 'Expect different suppressant requirements in microgravity than in 1g because of the spherical flame shape.',
    // TODO(references): no full FLEX reference in docs/references.md yet.
    refs: [],
    url: 'https://psi.nasa.gov/physci/repo/search?q=FLEX',
    scores: { iss: 87, lunar_base: 82, martian_habitat: 81, crew_cabin_rover: 85 },
  },
  {
    id: 'SPICE',
    code: 'SPICE · ISS MSG',
    name: 'Smoke Point In Co-flow Experiment (SPICE)',
    facility: 'ISS Microgravity Science Glovebox (MSG)',
    site: 'ISS · MSG',
    conditions: null,
    why: 'Studies when gas-jet flames start to produce soot in microgravity, which changes flame color and radiant heat.',
    materials: 'Ethylene, propane, methane and propylene gas jets',
    similarity: 'Studies the transition from blue non-sooting flames to luminous sooting flames in the ISS MSG.',
    difference: 'Studies gas-jet smoke points and how longer residence time in microgravity shifts the soot threshold.',
    prevention: 'Consider ventilation velocity to avoid sooting, high-radiation flame conditions.',
    detection: 'Adjust detector sensitivity between soot-free blue flames and luminous sooting flames.',
    suppression: 'Cut fuel and flow early, before radiant soot heats nearby surfaces.',
    // TODO(references): no full SPICE reference in docs/references.md yet.
    refs: [],
    url: 'https://psi.nasa.gov/physci/repo/search?q=SPICE',
    scores: { iss: 84, lunar_base: 80, martian_habitat: 80, crew_cabin_rover: 82 },
  },
]
