// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { ExternalLink } from 'lucide-react'
import { ConsolePanel } from './ConsolePanel'
import { CREDITS_LEDGER, type CreditRow } from '../content/credits'

const NASA_DATA = CREDITS_LEDGER.filter((c) => c.type.startsWith('NASA'))
const SOFTWARE = CREDITS_LEDGER.filter((c) => !c.type.startsWith('NASA'))

/** Data, libraries and assets with their licenses; the footer "Credits" link lands here (#credits). */
export function CreditsLedger() {
  return (
    <ConsolePanel id="credits" title="Data & credits" className="scroll-mt-20">
      <div className="space-y-6">
        <CreditGroup title="NASA data" rows={NASA_DATA} />
        <CreditGroup title="Software & assets" rows={SOFTWARE} />
      </div>
    </ConsolePanel>
  )
}

function CreditGroup({ title, rows }: { title: string; rows: CreditRow[] }) {
  return (
    <div>
      <h3 className="text-sm font-medium text-secondary">{title}</h3>
      <div className="relative mt-2 overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="border-b border-subtle text-xs text-muted">
            <tr>
              <th scope="col" className="py-2 pr-4 font-medium">Resource</th>
              <th scope="col" className="py-2 pr-4 font-medium">Type</th>
              <th scope="col" className="py-2 pr-4 font-medium">License</th>
              <th scope="col" className="py-2 text-right font-medium">Source</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
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
