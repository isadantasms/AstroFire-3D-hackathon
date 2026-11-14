# AstroFire 3D — Frontend

React + TypeScript + Vite + Tailwind CSS client for AstroFire 3D. Visual rules live in [`../DESIGN.md`](../DESIGN.md); data shapes come from [`../contracts/simulation_schema.json`](../contracts/simulation_schema.json).

## Scripts

| Command | Purpose |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the local dev server at http://localhost:5173 |
| `npm run build` | Type-check and build to `dist/` |
| `npm run typecheck` | TypeScript project check |
| `npm run lint` | ESLint |
| `npm test` | Vitest route and component tests |

## Structure

```
src/
  app/         router, layout, header, footer, nav config
  pages/       Home, Simulator, Research & Data, About & SI Usage
  components/  shared UI (brand mark, page header, schematics)
  content/     UI copy sourced only from repository ledgers (docs/references.md, schema)
  styles/      DESIGN.md tokens (CSS variables + Tailwind theme)
```

## Notes

- Vitest is pinned to v3: v4 fails on Windows when the shell reports a lowercase drive letter (`c:\`). The open `npm audit` advisories affect only dev/test tooling; `npm audit --omit=dev` reports 0 vulnerabilities.
- SI disclosure: source files carry an `SI-assisted` header. See the About & SI Usage page.
