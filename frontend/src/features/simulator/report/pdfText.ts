// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/** Latin-subset safe text for the PDF: the Plex web fonts have no ₂, ₀, Δ, ≥, ≤ or → glyphs. */
export function toPdf(s: string): string {
  return s
    .replace(/g₀/g, 'g')
    .replace(/₂/g, '2')
    .replace(/₀/g, '0')
    .replace(/Δ/g, 'delta ')
    .replace(/≥/g, '>=')
    .replace(/≤/g, '<=')
    .replace(/→/g, '->')
}
