// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/**
 * Scenario report shared by the "Full report" panel and the PDF (same content, same order).
 * Every value comes from the simulation payload, the BASS-II dataset shown on the site, or a
 * registered reference. Explanations of what values mean come from contracts/simulation_schema.json.
 * Texts are written for engineers and researchers and stay readable for undergraduate students.
 */
import { EXPERIMENTS_SNAPSHOT } from '../../../data/experimentsSnapshot'
import { fmt } from '../../../lib/format'
import type { ExperimentRecord } from '../../../types/catalog'
import type { GroundingStatus } from '../../../content/grounding'
import type { Simulation3D, SimulationResponse } from '../../../types/contract'
import { isCitationShown, riskBand } from '../results/resultHelpers'
import { MOCK_TEXT_NOTE } from '../../../content/project'

export const REPORT_TITLE = 'Scenario Fire Safety Analysis'
export const PRODUCT_NAME = 'AstroFire 3D'
export const PROVENANCE = 'Experimental reference data: PSI-25 / BASS-II dataset'
export const GUIDANCE_NOTE = 'Research guidance, not an operational procedure.'
export const SI_NOTE = 'Diagnosis and guidance texts come from templates drafted with SI and reviewed by the team.'
export const DISCLAIMER = 'Research tool. Not a certified safety assessment or operational procedure.'
export const SIZING_AWAITING = 'Suppression sizing is awaiting the engine estimate for this scenario.'
export const MOCK_WATERMARK = 'MOCK DATA, SIMULATION PREVIEW'

/** Dataset reference added when the payload does not cite it (the regime map and empirical context use it). */
const DATASET_REFERENCE = {
  id: 'PSI-25 (DOI: 10.60555/4qc4-de67)',
  title: 'Burning and Suppression of Solids - II (BASS-II)',
  url: 'https://doi.org/10.60555/4qc4-de67',
  finding: 'Experimental records used for the flammability regime map and the empirical context in this report.',
}

export interface ValueRow {
  label: string
  value: string
  unit: string
}

export interface MetricRow extends ValueRow {
  meaning: string
}

export interface ReportReference {
  n: number
  id: string
  title: string
  url: string
  finding: string
}

export interface Kpi {
  label: string
  value: string
  unit: string
  detail: string
  /** "derived" when computed from payload values rather than read from it. */
  tag?: string
  tone: 'nominal' | 'warning' | 'critical' | 'neutral'
}

export interface RegimePoint {
  testId: string
  o2: number
  airflow: number
  sustained: boolean
}

export interface ReportModel {
  scenarioId: string
  generatedAt: Date
  mode: 'Mock' | 'Live'
  mock: boolean
  /** "Sample text written with Gemini" in mock mode; null in live mode. */
  mockNote: string | null
  title: string
  subtitle: string
  groundingLabel: string
  abstract: string
  kpis: Kpi[]
  parameters: ValueRow[]
  telemetry: MetricRow[]
  score: number
  flame: {
    burning: boolean
    shape: 'spherical' | 'elongated'
    /** Amber (sooty) instead of blue (soot-free) reaction zone, from the contract colour mapping. */
    sooty: boolean
    mechanism: string
    text: string
    thicknessMm: number
    airflowCmS: number
  }
  regime: { points: RegimePoint[]; scenario: { o2: number; airflow: number; oxygenLimit: number } }
  neighbors: { rows: ExperimentRecord[]; sameMaterial: boolean; note: string }
  interpretation: string
  suppression: { action: string; sizing: MetricRow[] | null; note: string | null }
  terrestrial: string
  limitations: string
  groundingMeaning: string
  references: ReportReference[]
  /** "[1, 2]" for the payload citations behind the SI-drafted sections. */
  cite: string
  /** Citation of the BASS-II dataset (regime map, empirical context). */
  datasetCite: string
}

const GROUNDING_LABEL: Record<GroundingStatus, string> = {
  empirical_bass2: 'Direct empirical match (BASS-II)',
  interpolated_from_ntrs: 'Interpolated (bounded by NTRS reports)',
  theoretical_extrapolation_to_verify: 'Theoretical extrapolation (to verify)',
}

const GROUNDING_MEANING: Record<GroundingStatus, string> = {
  empirical_bass2: 'The scenario matches a measured BASS-II test record, so the telemetry reflects an experiment run aboard the ISS.',
  interpolated_from_ntrs:
    'No BASS-II test matches these conditions exactly; the values are interpolated across oxygen, airflow or gravity, bounded by the technical reports listed in the references.',
  theoretical_extrapolation_to_verify:
    'The scenario lies outside the experimental envelope; treat the values as a hypothesis that still needs verification.',
}

/**
 * Replaces code-style names and markup that may appear in engine texts with physical notation:
 * "gravity_g = 0.0g" → "g = 0.00 g₀", "airflow_cm_s" → "airflow", LaTeX wrappers and hex colours removed.
 */
export function humanize(text: string): string {
  return text
    .replace(/gravity_g\s*=\s*([\d.]+)\s*g\b/g, (_m, v: string) => `g = ${Number(v).toFixed(2)} g₀`)
    .replace(/\bgravity_g\b/g, 'gravity')
    .replace(/\bairflow_cm_s\b/g, 'airflow')
    .replace(/\boxygen_limit_pct\b/g, 'oxygen limit')
    .replace(/\bo2_pct\b/g, 'O₂')
    .replace(/\bburn_rate_mm_s\b/g, 'burn rate')
    .replace(/\bthickness_mm\b/g, 'thickness')
    .replace(/\\text\{([^}]*)\}/g, '$1')
    .replace(/\$([^$]+)\$/g, '$1')
    .replace(/\s*\(?#[0-9A-Fa-f]{6}\)?/g, '')
    .replace(/\bCO2\b/g, 'CO₂')
    .replace(/\bO2\b/g, 'O₂')
}

export function isBurning(sim: Simulation3D): boolean {
  return sim.burn_rate_mm_s > 0 && sim.oxygen_factor > 0
}

/** Sustained or extinguished, from the recorded outcome (final state after "->"). */
export function isSustainedOutcome(outcome: string): boolean {
  const final = outcome.split('->').pop()!.trim()
  if (/^near-/i.test(final)) return true
  return !/quench|extinct|no (sustained )?ignition|blow-?off|below/i.test(final)
}

/** Up to three BASS-II records closest to the scenario (same material when at least two exist). */
function nearestRecords(result: SimulationResponse): { rows: ExperimentRecord[]; sameMaterial: boolean } {
  const { o2_pct: o2, airflow_cm_s: air, material_id: material } = result.inputs
  const same = EXPERIMENTS_SNAPSHOT.filter((r) => r.material_id === material)
  const pool = same.length >= 2 ? same : EXPERIMENTS_SNAPSHOT
  const dist = (r: ExperimentRecord) => Math.hypot((r.initial_o2_pct - o2) / 5, (r.airflow_cm_s - air) / 10)
  const rows = [...pool].sort((a, b) => dist(a) - dist(b)).slice(0, 3)
  return { rows, sameMaterial: same.length >= 2 }
}

function flameDescription(result: SimulationResponse): ReportModel['flame'] {
  const { simulation_3d: sim, inputs, telemetry: t } = result
  const burning = isBurning(sim)
  const shape = sim.flame_geometry
  const sooty = sim.flame_color_hex.toUpperCase() === '#F97316'
  const mechanism = !burning ? 'No sustained flame' : shape === 'spherical' ? 'Molecular diffusion' : 'Advective transport'
  const conditions = `At g = ${fmt(inputs.gravity_g, 2)} g₀ and ${fmt(inputs.airflow_cm_s, 1)} cm/s airflow`
  let text: string
  if (!burning) {
    text =
      inputs.o2_pct < t.oxygen_limit_pct
        ? `${conditions}, the cabin oxygen (${fmt(inputs.o2_pct, 1)}% O₂) is below the oxygen limit (${fmt(t.oxygen_limit_pct, 1)}% O₂): heat losses exceed the heat released, so no flame can sustain itself and only dissipating smoke remains.`
        : `${conditions}, the simulation reports no sustained flame (burn rate 0 mm/s), so only dissipating smoke remains.`
  } else if (shape === 'spherical') {
    text = `${conditions}, there is no buoyancy and almost no forced flow, so oxygen reaches the reaction zone mainly by molecular diffusion. The flame stays a small, near-spherical ball around the sample${sooty ? '.' : ', dim and blue because it produces little or no soot.'}`
  } else {
    text = `${conditions}, forced airflow and buoyancy carry oxygen to the flame (advective transport), stretching it downstream into a longer plume${sooty ? ' that is brighter and sootier, so it radiates more heat to nearby surfaces.' : '.'}`
  }
  return { burning, shape, sooty, mechanism, text, thicknessMm: inputs.thickness_mm, airflowCmS: inputs.airflow_cm_s }
}

/** Local calendar date as YYYY-MM-DD. */
export function isoDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function formatDateTime(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${isoDate(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function reportFileName(scenarioId: string, d: Date): string {
  return `astrofire-analysis-${scenarioId}-${isoDate(d)}.pdf`
}

export function buildReport(result: SimulationResponse, options: { mock: boolean; generatedAt: Date }): ReportModel {
  const { inputs, telemetry: t, simulation_3d: sim, safety_copilot: copilot } = result
  const cited = result.nasa_citations.filter(isCitationShown)
  const refs = [...cited]
  if (!refs.some((c) => c.url === DATASET_REFERENCE.url)) refs.push(DATASET_REFERENCE)
  const references: ReportReference[] = refs.map((c, i) => ({ n: i + 1, id: c.id, title: c.title, url: c.url, finding: humanize(c.finding) }))
  const cite = cited.length > 0 ? `[${cited.map((_, i) => i + 1).join(', ')}]` : ''
  const datasetCite = `[${references.find((r) => r.url === DATASET_REFERENCE.url)!.n}]`

  const band = riskBand(t.flammability_score)
  const margin = inputs.o2_pct - t.oxygen_limit_pct
  const estimate = result.suppression_estimate
  const neighbors = nearestRecords(result)

  const abstract =
    `This report analyzes ${inputs.material_name} (${fmt(inputs.thickness_mm, 2)} mm) in ${inputs.environment_label}, ` +
    `at ${fmt(inputs.o2_pct, 1)}% O₂ and ${fmt(inputs.airflow_cm_s, 1)} cm/s airflow. ` +
    `The flammability score is ${t.flammability_score}/100 (${t.risk_label}), with a burn rate of ${fmt(sim.burn_rate_mm_s, 2)} mm/s ` +
    `and a minimum oxygen limit of ${fmt(t.oxygen_limit_pct, 1)}% O₂; the cabin oxygen is ${margin >= 0 ? 'above' : 'below'} that limit. ` +
    `${humanize(copilot.diagnosis)}${cite ? ` ${cite}` : ''}`

  return {
    scenarioId: result.scenario_id,
    generatedAt: options.generatedAt,
    mode: options.mock ? 'Mock' : 'Live',
    mock: options.mock,
    mockNote: options.mock ? MOCK_TEXT_NOTE : null,
    title: REPORT_TITLE,
    subtitle: `${inputs.environment_label} · ${inputs.material_name}`,
    groundingLabel: GROUNDING_LABEL[result.grounding_status],
    abstract,
    kpis: [
      {
        label: 'Flammability score',
        value: String(t.flammability_score),
        unit: '/100',
        detail: t.risk_label,
        tone: band,
      },
      { label: 'Burn rate', value: fmt(sim.burn_rate_mm_s, 2), unit: 'mm/s', detail: 'Flame spread speed over the material', tone: 'neutral' },
      {
        label: 'Oxygen margin (ΔO₂)',
        value: `${margin >= 0 ? '+' : '−'}${fmt(Math.abs(margin), 1)}`,
        unit: 'pts',
        detail: `${margin >= 0 ? 'Above' : 'Below'} extinction limit (cabin O₂ − oxygen limit)`,
        tag: 'derived',
        tone: margin >= 0 ? 'warning' : 'nominal',
      },
      { label: 'Data grounding', value: GROUNDING_LABEL[result.grounding_status], unit: '', detail: 'Where the values come from', tone: 'neutral' },
    ],
    parameters: [
      { label: 'Material', value: inputs.material_name, unit: '' },
      { label: 'Thickness', value: fmt(inputs.thickness_mm, 2), unit: 'mm' },
      { label: 'Gravity', value: fmt(inputs.gravity_g, 2), unit: 'g₀' },
      { label: 'Environment', value: inputs.environment_label, unit: '' },
      { label: 'Cabin oxygen', value: fmt(inputs.o2_pct, 1), unit: '% O₂' },
      { label: 'Airflow', value: fmt(inputs.airflow_cm_s, 1), unit: 'cm/s' },
    ],
    telemetry: [
      {
        label: 'Flammability score',
        value: String(t.flammability_score),
        unit: '/100',
        meaning: 'Composite risk index; higher means the material burns more readily in this environment',
      },
      { label: 'Burn rate', value: fmt(sim.burn_rate_mm_s, 2), unit: 'mm/s', meaning: 'How fast the flame spreads over the material' },
      { label: 'Oxygen limit', value: fmt(t.oxygen_limit_pct, 1), unit: '% O₂', meaning: 'Minimum oxygen needed to sustain the flame at this flow and gravity' },
      { label: 'CO', value: fmt(t.co_ppm, 0), unit: 'ppm', meaning: 'Estimated carbon monoxide produced; a crew toxicity concern' },
      { label: 'CO₂', value: fmt(t.co2_pct, 1), unit: '%', meaning: 'Estimated carbon dioxide produced by combustion' },
    ],
    score: t.flammability_score,
    flame: flameDescription(result),
    regime: {
      points: EXPERIMENTS_SNAPSHOT.map((r) => ({ testId: r.test_id, o2: r.initial_o2_pct, airflow: r.airflow_cm_s, sustained: isSustainedOutcome(r.outcome) })),
      scenario: { o2: inputs.o2_pct, airflow: inputs.airflow_cm_s, oxygenLimit: t.oxygen_limit_pct },
    },
    neighbors: {
      ...neighbors,
      note: neighbors.sameMaterial
        ? `The BASS-II tests on the same material closest to this scenario in oxygen and airflow ${datasetCite}. Compare how the measured burn rate changes with oxygen and flow.`
        : `No BASS-II tests exist for this material; these are the closest tests on other materials in oxygen and airflow ${datasetCite}.`,
    },
    interpretation: humanize(copilot.diagnosis),
    suppression: {
      action: humanize(copilot.suppression_action),
      sizing: estimate
        ? [
            { label: 'Mist volume', value: fmt(estimate.estimated_mist_volume_ml, 0), unit: 'mL', meaning: 'Water mist needed to absorb the heat released' },
            { label: 'Discharge time', value: fmt(estimate.estimated_discharge_seconds, 1), unit: 's', meaning: 'How long the extinguisher discharges' },
            { label: 'Tank used', value: fmt(estimate.tank_capacity_used_pct, 1), unit: '%', meaning: 'Share of the ISS water-mist extinguisher tank' },
            { label: 'Cooling efficiency', value: fmt(estimate.cooling_efficiency_pct, 0), unit: '%', meaning: 'How well the mist cools the fire at this gravity' },
          ]
        : null,
      note: estimate ? humanize(estimate.confined_rack_note) : null,
    },
    terrestrial: humanize(copilot.terrestrial_spinoff),
    limitations: humanize(copilot.scientific_limitations),
    groundingMeaning: GROUNDING_MEANING[result.grounding_status],
    references,
    cite,
    datasetCite,
  }
}
