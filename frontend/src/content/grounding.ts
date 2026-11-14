// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/**
 * UI labels for contracts/simulation_schema.json -> grounding_status (enum).
 * Labels for the first two values come from .agents/skills/frontend-dashboard/SKILL.md.
 */
export type GroundingStatus =
  | 'empirical_bass2'
  | 'interpolated_from_ntrs'
  | 'theoretical_extrapolation_to_verify'

export interface GroundingInfo {
  label: string
  /** Short badge text for the Simulator results. */
  badge: string
  summary: string
  /** Tailwind classes for the badge accent. */
  tone: string
}

export const GROUNDING: Record<GroundingStatus, GroundingInfo> = {
  empirical_bass2: {
    label: 'Empirical NASA BASS-II data',
    badge: 'NASA experimental data',
    summary: 'The scenario matches a direct test record from BASS-II (PSI-25).',
    tone: 'border-focus text-focus',
  },
  interpolated_from_ntrs: {
    label: 'Bounded NTRS interpolation',
    badge: 'Estimate · interpolated',
    summary:
      'The result is interpolated across oxygen, airflow or gravity regimes, bounded by NASA technical reports, with its assumptions stated.',
    tone: 'border-secondary text-secondary',
  },
  theoretical_extrapolation_to_verify: {
    label: 'Theoretical extrapolation · to verify',
    badge: 'Theoretical · to verify',
    summary:
      'The scenario lies outside the empirical envelope. Treat the output as a hypothesis that still needs verification.',
    tone: 'border-warning text-warning',
  },
}
