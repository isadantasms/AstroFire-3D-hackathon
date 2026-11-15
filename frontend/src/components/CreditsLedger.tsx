// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { ExternalLink } from 'lucide-react'
import { CREDITS_LEDGER } from '../content/credits'

/**
 * Software, tools, assets and SI tools with their licenses (Documentation → Sources & credits).
 * NASA data and reports are the numbered references shown above it, so they are not repeated here.
 * The footer "Credits" link lands here (#credits).
 */
export function CreditsLedger() {
  return (
    <div id="credits" className="scroll-mt-20">
      <h3 className="text-base font-semibold text-primary">Credits &amp; licenses</h3>
      <p className="mt-1 text-xs text-muted">Software, tools, assets and SI tools used to build AstroFire.</p>
      <div className="relative mt-4 overflow-x-auto rounded-2xl border border-subtle bg-panel px-4">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="border-b border-subtle text-xs text-muted">
            <tr>
              <th scope="col" className="py-2.5 pr-4 font-medium">Resource</th>
              <th scope="col" className="py-2.5 pr-4 font-medium">Type</th>
              <th scope="col" className="py-2.5 pr-4 font-medium">License</th>
              <th scope="col" className="py-2.5 text-right font-medium">Source</th>
            </tr>
          </thead>
          <tbody>
            {CREDITS_LEDGER.map((item) => (
              <tr key={item.resource} className="border-b border-subtle/60 align-top last:border-b-0">
                <td className="py-2.5 pr-4 text-primary">{item.resource}</td>
                <td className="py-2.5 pr-4 text-xs whitespace-nowrap text-muted">{item.type}</td>
                <td
                  className={`py-2.5 pr-4 font-mono text-xs whitespace-nowrap ${item.license === 'To verify' ? 'text-warning' : 'text-secondary'}`}
                >
                  {item.license}
                </td>
                <td className="py-2.5 text-right whitespace-nowrap">
                  {item.url ? (
                    <a href={item.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-focus hover:underline">
                      Link
                      <ExternalLink className="size-3" aria-hidden />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
