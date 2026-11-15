// SI-assisted: generated with Gemini, reviewed and edited by Elias, Esquivel & Rocha
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const webglSourceDir = resolve(__dirname, '../../unity-fire-simulation/WebGlSimulation')
const webglDestDir = resolve(__dirname, '../dist/webgl')

if (!existsSync(webglSourceDir)) {
  console.warn(`[copy-webgl] Source directory not found: ${webglSourceDir}`)
  process.exit(0)
}

rmSync(webglDestDir, { recursive: true, force: true })
mkdirSync(webglDestDir, { recursive: true })

for (const entry of ['index.html', 'Build', 'TemplateData']) {
  const srcPath = resolve(webglSourceDir, entry)
  const destPath = resolve(webglDestDir, entry)
  if (existsSync(srcPath)) {
    cpSync(srcPath, destPath, {
      recursive: true,
      filter: (source) => !source.endsWith('.meta'),
    })
  }
}

console.log(`[copy-webgl] Copied Unity WebGL build to ${webglDestDir}`)
