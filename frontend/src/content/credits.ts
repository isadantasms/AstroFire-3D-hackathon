// SI-assisted: generated with Gemini & Claude, reviewed and edited by Rocha, Elias, Pina & Dantas
/** Library, tool, asset and SI-tool credits (Documentation → Sources & credits). */
import { LOGO_CREDIT } from './project'

export interface CreditRow {
  resource: string
  type: string
  license: string
  url: string | null
}

/*
 * Software, tools, assets and SI tools with their licenses. NASA data and reports are not repeated
 * here: they are the numbered references (content/references.ts) shown right above this table.
 * Rows marked "To verify" still need details from the team; nothing is filled in for them.
 */
export const CREDITS_LEDGER: CreditRow[] = [
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
    resource: 'Ajv, Lucide Icons, IBM Plex Sans, IBM Plex Serif & IBM Plex Mono (@fontsource)',
    type: 'UI & Validation Assets',
    license: 'MIT / ISC / SIL OFL 1.1',
    url: 'https://ajv.js.org',
  },
  {
    resource: 'Unity (3D chamber engine and WebGL template)',
    type: 'Engine',
    license: 'Unity Terms of Service (edition to verify)',
    url: 'https://unity.com/legal/terms-of-service',
  },
  // TODO(credits): author and license of the MagicaVoxel models are not confirmed yet.
  {
    resource: 'MagicaVoxel 3D models: Earth, ISS, Mars, Moon, RocketShip, Extinguisher',
    type: '3D Models',
    license: 'To verify',
    url: null,
  },
  {
    resource: LOGO_CREDIT,
    type: 'Logo',
    license: 'MIT License (this repository)',
    url: null,
  },
  {
    resource: 'ChatGPT (OpenAI): planning, development support and 3D modeling support',
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
  // TODO(credits): confirm the use, license and link of Antigravity and Google Colab.
  {
    resource: 'Antigravity: coding environment used with Gemini',
    type: 'Development Tool',
    license: 'To verify',
    url: null,
  },
  {
    resource: 'Google Colab: model training and validation',
    type: 'Development Tool',
    license: 'To verify',
    url: null,
  },
  {
    resource: 'Claude / Claude Code (Anthropic): front-end code, interface, documentation and logo',
    type: 'SI Tool',
    license: 'Provider terms',
    url: 'https://claude.com/product/claude-code',
  },
  // TODO(voice-tool): name, license and link of the narration tool.
  {
    resource: '[VOICE TOOL]: demo video narration',
    type: 'SI Tool',
    license: 'To verify',
    url: null,
  },
  // TODO(references): the UFSC/INPE VSB-30 study is listed by name only until the team confirms the reference.
  {
    resource: 'UFSC/INPE · VSB-30 sounding-rocket study',
    type: 'Research Study',
    license: 'To verify',
    url: null,
  },
]
