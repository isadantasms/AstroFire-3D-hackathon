// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/**
 * SI disclosure: the short Home block and the labels used by the Simulator, the PDF report and the credits.
 * The full disclosure (tool by tool, what SI does and does not do) lives in docs/technical-notes.md.
 * Keep both in sync with what the code actually does.
 *
 * TODO(si): If the PINN is wired into /api/simulate, update these texts to describe the ML prediction step.
 */

// TODO(logo): when the team redesigns the logo, change this line to
// "AstroFire logo designed by the team; initial concept explored with Claude Code (SI-assisted)."
export const LOGO_CREDIT = 'AstroFire logo created with Claude Code (SI-assisted) and reviewed by the team.'

/**
 * Short "How we use SI" block on the Home.
 * TODO(logo): when the team redesigns the logo, update "Claude Code created the logo".
 * TODO(voice-tool): replace [VOICE TOOL] with the name of the narration tool.
 */
export const SI_COMPACT = {
  product: 'A rule-based engine matches each scenario to NASA data. Its diagnosis texts were drafted with SI and reviewed by the team.',
  development:
    'ChatGPT, Codex, Gemini and Claude Code supported code, 3D, data and interface. Claude Code created the logo; [VOICE TOOL] narrates the demo.',
  human: 'The team conceived the solution, made every decision and reviewed all code, data and results.',
  linkLabel: 'Full SI disclosure in the documentation',
} as const

/**
 * Label for the diagnosis and suppression text in the Simulator and the PDF report.
 * TODO(si): If the PINN is wired into /api/simulate, update this label to describe the ML prediction step.
 */
export const TEMPLATE_TEXT_NOTE = 'Diagnosis text from templates drafted with SI and reviewed by the team.'

/** Added wherever mock results are shown (the sample payloads were written with Gemini). */
export const MOCK_TEXT_NOTE = 'Sample text written with Gemini'
