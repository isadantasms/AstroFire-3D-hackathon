// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/**
 * NASA sources shown in the UI.
 * Every entry is copied verbatim from docs/references.md / README.md in this repository.
 * Do not add a source here unless its ID, link and license exist in those ledgers.
 */
export interface NasaSource {
  id: string
  title: string
  kind: 'NASA data' | 'NASA technical report'
  license: string
  url: string
}

export const PRIMARY_SOURCES: readonly NasaSource[] = [
  {
    id: 'BASS-II (PSI-25) · DOI 10.60555/4qc4-de67',
    title: 'Burning and Suppression of Solids - II',
    kind: 'NASA data',
    license: 'CC0-1.0',
    url: 'https://doi.org/10.60555/4qc4-de67',
  },
  {
    id: 'NASA/TM-20210011385',
    title: 'BASS-II Summary Report (Olson et al., 2021)',
    kind: 'NASA technical report',
    license: 'US Gov Public Domain',
    url: 'https://ntrs.nasa.gov/citations/20210011385',
  },
]
