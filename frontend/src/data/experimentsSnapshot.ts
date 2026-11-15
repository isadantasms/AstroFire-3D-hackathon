// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
// Source: NASA PSI, BASS-II (PSI-25), DOI 10.60555/4qc4-de67, CC0-1.0
// Reference: Olson et al., NASA/TM-20210011385 (2021)
import dataset from '../../../backend/data/bass2_empirical_verified.json'
import type { ExperimentRecord } from '../types/catalog'

/**
 * BASS-II records read directly from the repository dataset file
 * (backend/data/bass2_empirical_verified.json). Real records, not mock data.
 * Used in mock mode and as a fallback when the live API is unreachable.
 */
export const EXPERIMENTS_SNAPSHOT: readonly ExperimentRecord[] = dataset.records as ExperimentRecord[]

export const DATASET_META = {
  sourceDoi: dataset.source_doi,
  sourceNtrs: dataset.source_ntrs,
  license: dataset.license,
  count: dataset.records_count,
} as const

function minMax(values: number[]) {
  return { min: Math.min(...values), max: Math.max(...values) }
}

/**
 * Tested ranges computed from the 79 BASS-II records (min–max of initial O2 and airflow).
 * Shared by Research & Data and the Simulator so both always show the same numbers.
 */
export const BASS2_RANGES = {
  o2Pct: minMax(EXPERIMENTS_SNAPSHOT.map((r) => r.initial_o2_pct)),
  airflowCmS: minMax(EXPERIMENTS_SNAPSHOT.map((r) => r.airflow_cm_s)),
} as const
