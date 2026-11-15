// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { ExternalLink } from 'lucide-react'
import { CREDITS_LEDGER } from '../content/credits'

/**
 * Software, tools, assets and SI tools with their licenses (Documentation → Credits & licenses).
 * NASA data and reports are listed under "The NASA research" with full references, so they are not repeated here.
 * The footer "Credits" link lands here (#credits).
 * Below sm the same table is restyled as stacked cards (one per row), so nothing scrolls sideways.
 */
export function CreditsLedger() {
  return (
    <div id="credits" className="scroll-mt-24">
      <p className="text-xs text-muted">Software, tools, assets and SI tools used to build AstroFire 3D.</p>
      <div className="relative mt-4 overflow-x-auto rounded-2xl border border-subtle bg-panel px-4">
        <table className="w-full border-collapse text-left text-sm max-sm:block">
          <thead className="border-b border-subtle text-xs text-muted max-sm:sr-only">
            <tr>
              <th scope="col" className="py-2.5 pr-4 font-medium">Resource</th>
              <th scope="col" className="py-2.5 pr-4 font-medium">Type</th>
              <th scope="col" className="py-2.5 pr-4 font-medium">License</th>
              <th scope="col" className="py-2.5 text-right font-medium">Source</th>
            </tr>
          </thead>
          <tbody className="max-sm:block">
            {CREDITS_LEDGER.map((item) => (
              <tr key={item.resource} className="border-b border-subtle/60 align-top last:border-b-0 max-sm:block max-sm:py-3">
                <td className="py-2.5 pr-4 text-primary max-sm:block max-sm:p-0">{item.resource}</td>
                <td className="py-2.5 pr-4 text-xs whitespace-nowrap text-muted max-sm:mt-1 max-sm:inline-block max-sm:py-0">{item.type}</td>
                <td
                  className={`py-2.5 pr-4 font-mono text-xs whitespace-nowrap max-sm:inline-block max-sm:py-0 max-sm:whitespace-normal ${item.license === 'To verify' ? 'text-warning' : 'text-secondary'}`}
                >
                  {item.license}
                </td>
                <td className="py-2.5 text-right whitespace-nowrap max-sm:block max-sm:py-0 max-sm:text-left">
                  {item.url ? (
                    <a href={item.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-focus hover:underline">
                      Link
                      <ExternalLink className="size-3" aria-hidden />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  ) : (
                    <span className="text-muted max-sm:hidden">—</span>
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
