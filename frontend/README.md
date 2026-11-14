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

## API mode

Copy `.env.example` to `.env.local` to change it.

| Variable | Values | Default |
| --- | --- | --- |
| `VITE_API_MODE` | `mock` (placeholder results, labeled MOCK DATA in the UI) or `live` (FastAPI backend) | `mock` |
| `VITE_API_BASE_URL` | Backend URL for live mode | `http://localhost:8000` |

- Every simulation response (mock or live) is validated at runtime against `contracts/simulation_schema.json` with Ajv.
- Materials and BASS-II records come from `GET /api/materials` and `GET /api/experiments` in live mode. In mock mode, or if the API is unreachable, the UI uses real repository snapshots (`backend/data/bass2_empirical_verified.json` and the backend material catalog), labeled "Repository snapshot".
- Live simulation failures show an error state; they never fall back to mock results.

## Structure

```
src/
  app/         router, layout, header, footer, nav config
  pages/       Home, Simulator, Research & Data, About & SI Usage
  features/simulator/
    controls/     presets, material, gravity, O2, airflow, Run Simulation
    chamber/      static 3D placeholder (integration boundary for the 3D module)
    experiments/  BASS-II experiment matrix
    results/      grounding, risk gauge, metrics, copilot, citations, states
    state/        reducer (draft, run lifecycle, stale detection) and hooks
  services/api/ mock + live clients, config, Ajv contract validation
  data/        repository snapshots (backend catalog, BASS-II dataset)
  types/       contract and catalog types
  components/  shared UI (brand mark, page header, console panel, schematics)
  content/     UI copy sourced only from repository ledgers (docs/references.md, schema)
  styles/      DESIGN.md tokens (CSS variables + Tailwind theme)
```

## Notes

- Vitest is pinned to v3: v4 fails on Windows when the shell reports a lowercase drive letter (`c:\`). The open `npm audit` advisories affect only dev/test tooling; `npm audit --omit=dev` reports 0 vulnerabilities.
- SI disclosure: source files carry an `SI-assisted` header. See the About & SI Usage page.
