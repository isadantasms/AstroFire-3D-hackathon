// SI-assisted: generated with Gemini & Claude, reviewed and edited by Rocha, Elias, Pina & Dantas
/** Library, tool, asset and SI-tool credits (Documentation → Sources & credits). */
import { LOGO_CREDIT, SHOW_UNVERIFIED, VOICE_TOOL } from './project'

export interface CreditRow {
  resource: string
  type: string
  license: string
  url: string | null
}

/*
 * Software, tools, assets and SI tools with their licenses. NASA data and reports are not repeated
 * here: they are the numbered references (content/references.ts) shown right above this table.
 * Rows marked "To verify" still need details from the team; nothing is filled in for them. They show only
 * in development builds (SHOW_UNVERIFIED) until the team confirms them.
 */
const ALL_CREDITS: (CreditRow | false)[] = [
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
    resource: 'Ajv, Lucide Icons, IBM Plex Sans & IBM Plex Mono (@fontsource)',
    type: 'UI & Validation Assets',
    license: 'MIT / ISC / SIL OFL 1.1',
    url: 'https://ajv.js.org',
  },
  {
    resource: 'Unity (3D chamber engine and WebGL template)',
    type: 'Engine',
    license: 'Unity Terms of Service',
    url: 'https://unity.com/legal/terms-of-service',
  },
  {
    resource: '3D voxel models created by the team with MagicaVoxel',
    type: '3D Models',
    license: 'MIT License (this repository)',
    url: 'https://ephtracy.github.io/',
  },
  {
    resource: LOGO_CREDIT,
    type: 'Logo',
    license: 'MIT License (this repository)',
    url: null,
  },
  {
    resource: 'ChatGPT (OpenAI): planning, development support, 3D modeling support and logo concept',
    type: 'SI Tool',
    license: 'Provider terms',
    url: 'https://chatgpt.com',
  },
  {
    resource: 'Codex (OpenAI): Unity scripts and shaders for the 3D chamber',
    type: 'SI Tool',
    license: 'Provider terms',
    url: 'https://developers.openai.com/codex',
  },
  {
    resource: "Gemini (Google): refining the team's business rules, backend integration and test data",
    type: 'SI Tool',
    license: 'Provider terms',
    url: 'https://gemini.google.com',
  },
  {
    resource: 'Antigravity: coding environment used with Gemini',
    type: 'Development Tool',
    license: 'Google Terms of Service',
    url: 'https://policies.google.com/terms',
  },
  {
    resource: 'Google Colab: model training and validation',
    type: 'Development Tool',
    license: 'Google Terms of Service',
    url: 'https://policies.google.com/terms',
  },
  {
    resource: 'Claude / Claude Code (Anthropic): front-end code, interface, documentation and vector logo',
    type: 'SI Tool',
    license: 'Provider terms',
    url: 'https://claude.com/product/claude-code',
  },
  {
    resource: '21 PyroRangers group emblem: generated with Google Imagen via Gemini (SI)',
    type: 'Emblem (SI Tool)',
    license: 'Provider terms',
    url: 'https://gemini.google.com',
  },
  {
    resource: 'Matplotlib, ReportLab & svglib (scientific vector figures and technical documentation PDF)',
    type: 'Open-Source Libraries',
    license: 'PSF / BSD / LGPL-3.0',
    url: 'https://www.reportlab.com',
  },
  {
    resource: 'Vercel (unified hosting: React SPA, Unity WebGL with Brotli headers & FastAPI Serverless API)',
    type: 'Hosting Service',
    license: 'Vercel Service Terms',
    url: 'https://vercel.com',
  },
  {
    resource: 'UFSC / LEPTEN · VSB-30 suborbital microgravity boiling study (Souza, Passos & Cardoso, AEB / INPE)',
    type: 'Research Study',
    license: 'Academic Paper (COBEM 2011)',
    url: 'https://lepten.ufsc.br/publicacoes/boiling/eventos/2011/COBEM/souza_passos.pdf',
  },
  // TODO(voice-tool): license and link of the narration tool (the name comes from VOICE_TOOL).
  Boolean(VOICE_TOOL) && {
    resource: `${VOICE_TOOL}: demo video narration`,
    type: 'SI Tool',
    license: 'To verify',
    url: null,
  },
]

/** Credits shown on the Documentation page; unconfirmed licenses are hidden in production builds. */
export const CREDITS_LEDGER: CreditRow[] = ALL_CREDITS.filter(
  (row): row is CreditRow => row !== false && (SHOW_UNVERIFIED || row.license !== 'To verify'),
)
