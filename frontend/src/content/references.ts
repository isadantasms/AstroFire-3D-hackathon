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
  {
    n: 7,
    text: 'Niehaus, J., Urban, D., Ruff, G., Berger, G., & Easton, J. (2026). Spacecraft Fire Safety Predictions using Verified Saffire Model. NTRS-20260001600.',
    url: 'https://ntrs.nasa.gov/citations/20260001600',
  },
  {
    n: 8,
    text: 'NASA Space Apps Challenge 2026. Flame in Freefall: SI-Powered Fire Safety Insights from Microgravity Combustion Data (challenge description; oxygen-enriched lunar base atmosphere, 30% O₂ or more).',
    url: 'https://www.spaceappschallenge.org/2026/challenges/flame-in-freefall/',
  },
  {
    n: 9,
    text: 'Rodriquez, B., & Young, G. (2013). Development of the International Space Station Fine Water Mist Portable Fire Extinguisher (FWM PFE). NASA NTRS 20130011664.',
    url: 'https://ntrs.nasa.gov/citations/20130011664',
  },
  {
    n: 10,
    text: 'Kim, J., et al. Length Scale and Gravity Effects on Microgravity Boiling Heat Transfer. NASA Glenn Research Center. NASA NTRS 20030003652.',
    url: 'https://ntrs.nasa.gov/citations/20030003652',
  },
  {
    n: 11,
    text: 'Souza, R. R., Passos, J. C., & Cardoso, E. M. (2011). Confined and Unconfined Nucleate Boiling under Terrestrial and Microgravity Conditions. COBEM 2011. UFSC / LEPTEN; Brazilian microgravity heat-transfer research on the VSB-30 suborbital rocket (AEB / INPE; Cumã II / Maracati II campaigns).',
    url: 'https://lepten.ufsc.br/publicacoes/boiling/eventos/2011/COBEM/souza_passos.pdf',
  },
  {
    n: 12,
    text: 'NASA Physical Sciences Informatics & NTRS. Flame Extinguishment Experiment (FLEX) investigation records.',
    url: 'https://ntrs.nasa.gov/search?q=Flame%20Extinguishment%20Experiment%20FLEX',
  },
  {
    n: 13,
    text: 'NASA Physical Sciences Informatics & NTRS. Smoke Point In Co-flow Experiment (SPICE) investigation records.',
    url: 'https://ntrs.nasa.gov/search?q=Smoke%20Point%20In%20Co-flow%20Experiment%20SPICE',
  },
  {
    n: 14,
    text: 'NASA-STD-6001B. Flammability, Offgassing, and Compatibility Requirements and Test Procedures.',
    url: 'https://standards.nasa.gov/standard/nasa/nasa-std-6001',
  },
]
