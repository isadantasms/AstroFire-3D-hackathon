// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/** Neutral placeholder for routes whose content is scheduled for a later build step. */
export function ComingSoonPanel({ description }: { description: string }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="border border-dashed border-subtle bg-panel px-6 py-10">
        <p className="label-mono">Status · In development</p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-secondary">{description}</p>
      </div>
    </div>
  )
}
