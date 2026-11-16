// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/**
 * SI disclosure: the short Home block and the labels used by the Simulator, the PDF report and the credits.
 * The full disclosure (tool by tool, what SI does and does not do) lives in docs/technical-notes.md.
 * Keep both in sync with what the code actually does.
 *
 * TODO(si): If the PINN is wired into /api/simulate, update these texts to describe the ML prediction step.
 */

/**
 * Public URL of the 30-second pitch video (YouTube), opened by "Watch the 30s pitch" on the Home.
 * TODO(pitch): replace '#' with the published URL before submission.
 */
export const PITCH_VIDEO_URL: string = '#'

/**
 * Name of the SI tool that narrates the demo video.
 */
export const VOICE_TOOL: string = 'ElevenLabs'

/**
 * Items still waiting for a confirmed reference or license ("To verify") show only in development builds.
 * Production builds hide them until the team confirms them.
 */
export const SHOW_UNVERIFIED: boolean = import.meta.env.DEV

// TODO(logo): if the team redraws the logo by hand, change this line to
// "AstroFire 3D logo designed by the team; initial concept explored with ChatGPT and Claude Code (SI-assisted)."
export const LOGO_CREDIT = 'AstroFire 3D logo: concept generated with ChatGPT; simplified vector artwork recreated with Claude Code (SI-assisted) and reviewed by the team.'

/**
 * Short "How we use SI" block on the Home.
 * TODO(logo): if the team redraws the logo by hand, update the logo sentence.
 */
export const SI_COMPACT = {
  product: 'A rule-based engine matches each scenario to NASA data. Its diagnosis texts were drafted with SI and reviewed by the team.',
  development:
    'ChatGPT, Codex, Gemini and Claude Code supported code, 3D, data and interface. ChatGPT drafted the logo and Claude Code redrew it as vector art.' +
    (VOICE_TOOL ? ` ${VOICE_TOOL} narrates the demo.` : ''),
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
