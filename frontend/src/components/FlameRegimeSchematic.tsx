// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/**
 * Static, non-WebGL schematic of the two flame geometries defined in
 * contracts/simulation_schema.json (simulation_3d.flame_geometry).
 * It is an illustration only and carries no data.
 */
export function FlameRegimeSchematic() {
  return (
    <figure className="border border-subtle bg-panel">
      <div className="grid grid-cols-2 divide-x divide-subtle">
        <div className="p-4">
          <p className="label-mono">0 g · quiescent · spherical</p>
          <svg viewBox="0 0 200 150" className="mt-3 w-full" role="img" aria-labelledby="schem-sph">
            <title id="schem-sph">
              Spherical flame ball around a sample with no airflow, drawn in blue
            </title>
            <defs>
              <radialGradient id="g-sph" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="var(--flame-0g-blue)" stopOpacity="0.55" />
                <stop offset="70%" stopColor="var(--flame-0g-blue)" stopOpacity="0.18" />
                <stop offset="100%" stopColor="var(--flame-0g-blue)" stopOpacity="0" />
              </radialGradient>
            </defs>
            <Grid />
            <circle cx="100" cy="75" r="52" fill="url(#g-sph)" />
            <circle cx="100" cy="75" r="38" fill="none" stroke="var(--flame-0g-blue)" strokeWidth="1.5" />
            <rect x="94" y="69" width="12" height="12" fill="var(--text-secondary)" />
          </svg>
        </div>

        <div className="p-4">
          <p className="label-mono">0 g · ventilated · elongated</p>
          <svg viewBox="0 0 200 150" className="mt-3 w-full" role="img" aria-labelledby="schem-elo">
            <title id="schem-elo">
              Flame stretched downstream by cabin airflow, drawn in amber
            </title>
            <defs>
              <radialGradient id="g-elo" cx="35%" cy="50%" r="65%">
                <stop offset="0%" stopColor="var(--flame-soot-amber)" stopOpacity="0.6" />
                <stop offset="60%" stopColor="var(--flame-soot-amber)" stopOpacity="0.2" />
                <stop offset="100%" stopColor="var(--flame-soot-amber)" stopOpacity="0" />
              </radialGradient>
            </defs>
            <Grid />
            <ellipse cx="118" cy="75" rx="70" ry="30" fill="url(#g-elo)" />
            <path
              d="M62 75 C 70 52, 120 50, 182 75 C 120 100, 70 98, 62 75 Z"
              fill="none"
              stroke="var(--flame-soot-amber)"
              strokeWidth="1.5"
            />
            <rect x="56" y="69" width="12" height="12" fill="var(--text-secondary)" />
            {[45, 75, 105].map((y) => (
              <g key={y} stroke="var(--text-muted)" strokeWidth="1.2" fill="none">
                <line x1="8" y1={y} x2="36" y2={y} />
                <polyline points={`31,${y - 4} 36,${y} 31,${y + 4}`} />
              </g>
            ))}
          </svg>
        </div>
      </div>
      <figcaption className="border-t border-subtle px-4 py-2 text-xs text-muted">
        Illustrative schematic. Not simulation output or measured data.
      </figcaption>
    </figure>
  )
}

function Grid() {
  const lines = []
  for (let x = 20; x < 200; x += 20) {
    lines.push(<line key={`x${x}`} x1={x} y1="0" x2={x} y2="150" />)
  }
  for (let y = 15; y < 150; y += 20) {
    lines.push(<line key={`y${y}`} x1="0" y1={y} x2="200" y2={y} />)
  }
  return (
    <g stroke="var(--border-subtle)" strokeWidth="0.5">
      {lines}
    </g>
  )
}
