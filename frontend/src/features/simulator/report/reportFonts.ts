// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { Font } from '@react-pdf/renderer'

export interface ReportFontSources {
  sans600: string
  serif400: string
  serif600: string
  mono400: string
}

let fontsRegistered = false

/** Registers the Plex fonts for the PDF once (URLs in the browser, file paths in tests). */
export function registerReportFonts(src: ReportFontSources): void {
  if (fontsRegistered) return
  Font.register({ family: 'Plex Sans', fonts: [{ src: src.sans600, fontWeight: 600 }] })
  Font.register({
    family: 'Plex Serif',
    fonts: [
      { src: src.serif400, fontWeight: 400 },
      { src: src.serif600, fontWeight: 600 },
    ],
  })
  Font.register({ family: 'Plex Mono', fonts: [{ src: src.mono400, fontWeight: 400 }] })
  // Keep words whole: academic text reads better without automatic hyphenation.
  Font.registerHyphenationCallback((word) => [word])
  fontsRegistered = true
}
