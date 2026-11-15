// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/**
 * SI disclosure shown on the Home ("How we use SI") and reused by the Simulator and the PDF report.
 * Keep it in sync with what the code actually does.
 *
 * TODO(si): If the PINN is wired into /api/simulate, update this section to describe the ML prediction step.
 */

export const SI_IN_PRODUCT = {
  flow: ['NASA data', 'Rule-based engine', 'Results'],
  text:
    'AstroFire does not run an AI model when you simulate. A deterministic engine matches your scenario to the 79 BASS-II records, or applies formulas bounded by NASA technical reports, and fills in the diagnosis and suppression text from templates. Those rules and templates were drafted with Gemini and reviewed by the team. In mock mode, results come from three sample payloads written with Gemini.',
  does: [
    'Computes telemetry from the BASS-II records or NASA-bounded formulas',
    'Explains the flame regime and suppression options with template text',
    'Cites the NASA sources behind each result',
  ],
  doesNot: ['Run a live AI model', 'Measure Moon or Mars fires', 'Provide a certified safety assessment'],
} as const

/** SI tools used in development, each with its specific use. */
export const DEV_TOOLS = [
  { tool: 'ChatGPT (OpenAI)', use: 'planning, development support and 3D modeling support' },
  { tool: 'Codex (OpenAI)', use: 'Unity scripts and shaders for the 3D chamber' },
  { tool: 'Gemini (Google)', use: "refining the team's business rules, backend integration and test data" },
  {
    tool: 'Claude / Claude Code (Anthropic)',
    use: 'front-end code and interface, planning, visual design, documentation, pitch script and reference review',
  },
] as const

// TODO(logo): when the team redesigns the logo, change this line to
// "AstroFire logo designed by the team; initial concept explored with Claude Code (SI-assisted)."
export const LOGO_CREDIT = 'AstroFire logo created with Claude Code (SI-assisted) and reviewed by the team.'

// TODO(voice-tool): replace [VOICE TOOL] with the name of the tool used to narrate the demo video.
export const VOICE_CREDIT = 'Demo video narration generated with [VOICE TOOL].'

export const HUMAN_REVIEW =
  'The team conceived the solution, chose the NASA data and methods, made every design decision, and reviewed the code, data and results.'

export const SI_TERM_NOTE =
  '“Super Intelligence (SI)” is the term used by the Space Apps challenge; ChatGPT, Codex, Gemini and Claude are tools we used for specific tasks.'

/**
 * Label for the diagnosis and suppression text in the Simulator and the PDF report.
 * TODO(si): If the PINN is wired into /api/simulate, update this label to describe the ML prediction step.
 */
export const TEMPLATE_TEXT_NOTE = 'Diagnosis text from templates drafted with SI and reviewed by the team.'

/** Added wherever mock results are shown (the sample payloads were written with Gemini). */
export const MOCK_TEXT_NOTE = 'Sample text written with Gemini'
