// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/** SI tools used in development and the team (Home → How we use SI, Team). */

export const DEV_TOOLS = [
  { tool: 'Claude', use: 'code, interface design and website copy' },
  { tool: 'Gemini', use: 'code assistance and test data generation' },
  // TODO(voice-tool): replace [VOICE TOOL] with the name of the tool used to narrate the demo video.
  { tool: '[VOICE TOOL]', use: 'narration of the demo video' },
]

export interface TeamMember {
  name: string
  role: string
  /**
   * Optional photo: put a square image (at least 256 x 256 px) in frontend/public/team/
   * and set e.g. photo: '/team/leandro-pina.jpg'. Without a photo the initials are shown.
   */
  photo?: string
}

export const TEAM: TeamMember[] = [
  { name: 'Leandro Elias', role: 'Data & physics engine' },
  { name: 'Leandro Pina', role: 'Backend & API' },
  { name: 'Isabela Dantas', role: 'Data analysis & model accuracy' },
  { name: 'Celina Vieira', role: 'Science & SI validation' },
  { name: 'Gabriel Esquivel', role: '3D flame chamber' },
  { name: 'Isabela Rocha', role: 'Front-end & product' },
]

/** "Leandro Pina" -> "LP" */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase()
}
