// SI-assisted: generated with Gemini & Claude, reviewed and edited by Rocha, Elias, Pina & Dantas
// Source: NASA PSI, BASS-II (PSI-25), DOI 10.60555/4qc4-de67, CC0-1.0
/** Data, library and asset credits (Research & Data → Data & credits). */

export interface CreditRow {
  resource: string
  type: string
  license: string
  url: string | null
}

/*
 * NASA data and library rows are kept as they were (IDs and DOIs unchanged).
 * The UFSC (VSB-30) study is added only once it is registered in docs/references.md.
 */
export const CREDITS_LEDGER: CreditRow[] = [
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
    resource: 'SAME: Spacecraft Fire Safety Research at NASA Glenn Research Center (Meyer, 2016, NTRS-20170007283)',
    type: 'NASA Technical Report',
    license: 'CC0-1.0 / Public Domain',
    url: 'https://ntrs.nasa.gov/citations/20170007283',
  },
  {
    resource: 'SoFIE: Solid Fuel Ignition and Extinction (NASA Glenn Research Center)',
    type: 'NASA Web Page',
    license: 'To verify',
    url: 'https://www.nasa.gov/glenn/glenn-expertise-space-exploration/physical-sciences-program/combustion-science/solid-fuel-ignition-and-extinction-sofie/',
  },
  // TODO(references): FLEX and SPICE need full references in docs/references.md.
  {
    resource: 'FLEX: Flame Extinguishment Experiment',
    type: 'NASA Data',
    license: 'To verify',
    url: 'https://psi.nasa.gov/physci/repo/search?q=FLEX',
  },
  {
    resource: 'SPICE: Smoke Point In Co-flow Experiment',
    type: 'NASA Data',
    license: 'To verify',
    url: 'https://psi.nasa.gov/physci/repo/search?q=SPICE',
  },
  {
    resource: 'React 19, TypeScript, Vite & Tailwind CSS',
    type: 'Open-Source Libraries',
    license: 'MIT / Apache-2.0',
    url: 'https://react.dev',
  },
  {
    resource: '@react-pdf/renderer (scenario report PDF)',
    type: 'Open-Source Library',
    license: 'MIT License',
    url: 'https://react-pdf.org',
  },
  {
    resource: 'FastAPI & Pydantic V2 (+ Python 3.12 stdlib fallback)',
    type: 'Open-Source Libraries',
    license: 'MIT License',
    url: 'https://fastapi.tiangolo.com',
  },
  {
    resource: 'Ajv, Lucide Icons, IBM Plex Sans, IBM Plex Serif & IBM Plex Mono (@fontsource)',
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
