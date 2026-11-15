// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/**
 * Fixed report wording shared by the panel and the PDF: one short sentence per section on what the
 * values mean physically and why they matter, plus the numbered figure captions.
 */
import type { ReportModel } from './reportModel'

export const SECTION_TITLES = [
  'Scenario parameters',
  'Flammability telemetry',
  'Flame behavior',
  'Flammability regime map',
  'Empirical context',
  'Interpretation',
  'Suppression',
  'Terrestrial applications',
  'Limitations and data grounding',
] as const

export const SECTION_INTRO: Record<(typeof SECTION_TITLES)[number], string> = {
  'Scenario parameters': 'The conditions you set. Oxygen, airflow and gravity control how much oxygen reaches the flame.',
  'Flammability telemetry': 'What the engine computed for these conditions, with the meaning of each value.',
  'Flame behavior': 'How the flame looks and why: in microgravity, buoyancy no longer feeds the flame, so airflow decides its shape.',
  'Flammability regime map':
    'Where real flames survived or went out aboard the ISS, by oxygen and airflow. A scenario far above the extinction tests is more likely to keep burning.',
  'Empirical context': 'The measured BASS-II tests closest to this scenario, as a reality check on the computed values.',
  Interpretation: 'What the conditions mean for the fire, in plain terms.',
  Suppression: 'How the fire could be controlled in a spacecraft or habitat.',
  'Terrestrial applications': 'How this space fire research can also improve fire safety on Earth.',
  'Limitations and data grounding': 'What the result can and cannot claim, and where its numbers come from.',
}

export const KPI_INTRO = 'Key indicators at a glance.'

export function figureCaptions(report: ReportModel) {
  return {
    riskBar:
      'Figure 1. Flammability score on the risk bands used across AstroFire 3D (Nominal 0–35, Moderate 36–70, Critical 71–100). Higher scores mean the material burns more readily.',
    schematic:
      'Figure 2. Illustrative visualization of the simulated flame, not measured data. Arrows show the airflow; the color of the reaction zone shows whether it produces soot.',
    regime: `Figure 3. Oxygen versus airflow for the ${report.regime.points.length} BASS-II tests ${report.datasetCite}. Filled dots kept burning; hollow dots went out or never ignited. The shaded band marks the oxygen-enriched lunar base atmosphere (≥ 30% O₂) ${report.bandCite}. The ring marks this scenario and the red tick its oxygen limit; the engine's full limit curve is not drawn.`,
  }
}
