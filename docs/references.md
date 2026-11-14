# [PROJECT_NAME] — References & Super Intelligence (SI) Ledger

**2026 NASA Space Apps Challenge | Challenge:** *Flame in Freefall: SI-Powered Fire Safety Insights from Microgravity Combustion Data*

> **Compliance Notice:** Every NASA dataset, technical report, open-source library, and Super Intelligence (SI) tool used in `[PROJECT_NAME]` is recorded below in the format required for the official submission form. **No official NASA logos are used, and unlicensed investigation `PSI-10` is strictly excluded.**

| Resource | Type | License | Link | Used in |
| --- | --- | --- | --- | --- |
| BASS-II (PSI-25): *Burning and Suppression of Solids - II* | NASA data | CC0-1.0 | https://doi.org/10.60555/4qc4-de67 | `backend/data/`, Empirical Physics Engine |
| NASA/TM-20210011385: *BASS-II Summary Report* (Olson et al., 2021) | NASA technical report | US Gov Public Domain | https://ntrs.nasa.gov/citations/20210011385 | Limiting Oxygen Index (LOI) & forced-flow models |
| Saffire I–VI (NTRS-20170000230): *Operation and Development Status of the Spacecraft Fire Experiments (Saffire)* | NASA technical report | CC0-1.0 / Public Domain | https://ntrs.nasa.gov/citations/20170000230 | Exploration cabin atmosphere & partial-gravity bounds |
| FLEX / SoFIE / SPICE / SAME | NASA data | CC0-1.0 | https://psi.nasa.gov/ | Spherical `0g` flame ball geometry & smoke detector spinoffs |
| FastAPI | Library | MIT License | https://fastapi.tiangolo.com | `backend/` |
| Pydantic V2 | Library | MIT License | https://docs.pydantic.dev | `backend/`, `contracts/simulation_schema.json` |
| Three.js | Library | MIT License | https://threejs.org | `frontend/` (3D Microgravity Chamber) |
| React & TypeScript | Library | MIT / Apache-2.0 | https://react.dev | `frontend/` |
| Tailwind CSS | Library | MIT License | https://tailwindcss.com | `frontend/`, `DESIGN.md` |
| Vite | Library | MIT License | https://vite.dev | `frontend/` build tooling and dev server |
| React Router | Library | MIT License | https://reactrouter.com | `frontend/` client-side routing |
| Fontsource (`@fontsource/inter`, `@fontsource/jetbrains-mono`) | Library | MIT License (packaging); fonts under SIL OFL 1.1 | https://fontsource.org | `frontend/` self-hosted fonts |
| Vitest | Library | MIT License | https://vitest.dev | `frontend/` unit and route tests |
| Testing Library (`@testing-library/react`, `@testing-library/jest-dom`) | Library | MIT License | https://testing-library.com | `frontend/` tests |
| ESLint & typescript-eslint | Library | MIT License | https://eslint.org | `frontend/` linting |
| Playwright | Library | Apache-2.0 | https://playwright.dev | Visual & functional UI verification |
| Gemini / Claude / GPT Coding Assistants | SI model | Provider API Terms | https://ai.google.dev | Development code assistance (`# SI-assisted` tagged & team reviewed) |
