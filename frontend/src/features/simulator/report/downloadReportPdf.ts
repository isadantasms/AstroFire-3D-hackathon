// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import sans600 from '@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-600-normal.woff?url'
import sans400 from '@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff?url'
import mono400 from '@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff?url'
import { reportFileName, type ReportModel } from './reportModel'

/**
 * Renders the report to a real PDF (selectable text) and downloads it.
 * react-pdf and the document are imported on demand to keep them out of the main bundle.
 */
export async function downloadReportPdf(report: ReportModel): Promise<void> {
  const [{ pdf }, { ReportDocument }, { registerReportFonts }] = await Promise.all([
    import('@react-pdf/renderer'),
    import('./ReportPdf'),
    import('./reportFonts'),
  ])
  registerReportFonts({ sans400, sans600, mono400 })
  // ReportDocument has no hooks; calling it returns the <Document> element react-pdf expects.
  const blob = await pdf(ReportDocument({ report })).toBlob()

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = reportFileName(report.scenarioId, report.generatedAt)
  document.body.appendChild(a)
  a.click()
  a.remove()
  // Give the browser time to start the download before releasing the blob.
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}
