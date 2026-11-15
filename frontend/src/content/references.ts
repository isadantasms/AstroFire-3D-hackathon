// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/**
 * Numbered references for the Documentation page. Cards and the method cite them as [1], [2]…
 * Every entry is registered in docs/references.md; authors, titles and dates were checked
 * against the NTRS citation records. Do not add an entry without a full reference there.
 *
 * TODO(references): FLEX and SPICE have no full reference in docs/references.md yet,
 * so they have no numbered citation here.
 */
export interface Reference {
  n: number
  /** Citation text in author–year format, without the link. */
  text: string
  url: string
}

export const REFERENCES: readonly Reference[] = [
  {
    n: 1,
    text: 'Olson, S. L., Ferkul, P. V., Bhattacharjee, S., et al. (2021). Burning and Suppression of Solids–II (BASS-II) Summary Report. NASA/TM-20210011385.',
    url: 'https://ntrs.nasa.gov/citations/20210011385',
  },
  {
    n: 2,
    text: 'NASA Physical Sciences Informatics. BASS-II (PSI-25) dataset. DOI 10.60555/4qc4-de67. CC0-1.0.',
    url: 'https://doi.org/10.60555/4qc4-de67',
  },
  {
    n: 3,
    text: 'Ruff, G. A., & Urban, D. L. (2016). Operation and Development Status of the Spacecraft Fire Experiments (Saffire). International Conference on Environmental Systems. NTRS-20170000230.',
    url: 'https://ntrs.nasa.gov/citations/20170000230',
  },
  {
    n: 4,
    text: 'Urban, D. L., Ruff, G. A., Ferkul, P., et al. (2024). Preliminary Results from the Saffire VI Experiment. ICES 2024. NTRS-20240002981.',
    url: 'https://ntrs.nasa.gov/citations/20240002981',
  },
  {
    n: 5,
    text: 'Meyer, M. (2016). Spacecraft Fire Safety Research at NASA Glenn Research Center (covers SAME). NTRS-20170007283.',
    url: 'https://ntrs.nasa.gov/citations/20170007283',
  },
  {
    n: 6,
    text: 'NASA Glenn Research Center. Solid Fuel Ignition and Extinction (SoFIE). nasa.gov.',
    url: 'https://www.nasa.gov/glenn/glenn-expertise-space-exploration/physical-sciences-program/combustion-science/solid-fuel-ignition-and-extinction-sofie/',
  },
]
