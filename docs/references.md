# AstroFire 3D — References & Super Intelligence (SI) Ledger

**2026 NASA Space Apps Challenge | Challenge:** *Flame in Freefall: SI-Powered Fire Safety Insights from Microgravity Combustion Data*

> **Compliance Notice:** Every NASA dataset, technical report, open-source library, 3D asset and Super Intelligence (SI) tool used in AstroFire 3D is recorded below. No official NASA logos are used, and investigation `PSI-10` is excluded because it has no open license listed. Items marked "To verify" still need a full reference or license from the team.

## Data and technical reports

| Resource | Type | License | Link | Used in |
| --- | --- | --- | --- | --- |
| BASS-II (PSI-25): *Burning and Suppression of Solids - II* | NASA data | CC0-1.0 | https://doi.org/10.60555/4qc4-de67 | `backend/data/`, rule-based physics engine |
| NASA/TM-20210011385: *BASS-II Summary Report* (Olson et al., 2021) | NASA technical report | US Gov Public Domain | https://ntrs.nasa.gov/citations/20210011385 | Limiting Oxygen Index (LOI) & forced-flow models |
| Saffire I–VI (NTRS-20170000230): *Operation and Development Status of the Spacecraft Fire Experiments (Saffire)* | NASA technical report | CC0-1.0 / Public Domain | https://ntrs.nasa.gov/citations/20170000230 | Exploration cabin atmosphere & partial-gravity bounds |
| NTRS-20240002981: *Preliminary Results from the Saffire VI Experiment* (Urban, Ruff, Ferkul, et al., ICES 2024) | NASA technical report | US Gov Public Domain | https://ntrs.nasa.gov/citations/20240002981 | Documentation investigation ranking (Saffire) |
| NTRS-20260001600: Niehaus, J., Urban, D., Ruff, G., Berger, G., & Easton, J. (2026). *Spacecraft Fire Safety Predictions using Verified Saffire Model* | NASA technical report | US Gov Public Domain | https://ntrs.nasa.gov/citations/20260001600 | Sample payload (scenario 2) limitations text |
| NTRS-20170007283: *Spacecraft Fire Safety Research at NASA Glenn Research Center* (Meyer, 2016; covers SAME) | NASA technical report | US Gov Public Domain | https://ntrs.nasa.gov/citations/20170007283 | Documentation investigation ranking (SAME) |
| *Solid Fuel Ignition and Extinction (SoFIE)*, NASA Glenn Research Center | NASA web page | To verify | https://www.nasa.gov/glenn/glenn-expertise-space-exploration/physical-sciences-program/combustion-science/solid-fuel-ignition-and-extinction-sofie/ | Documentation investigation ranking (SoFIE) |
| FLEX / SPICE | NASA data | To verify (TODO: full reference) | https://psi.nasa.gov/ | Documentation investigation ranking |
| NTRS-20030003652 | NASA technical report | To verify (TODO: title, authors, link) | To verify | `contracts/simulation_schema.json`, `backend/app/physics_engine.py` (not shown in the UI) |
| NTRS-20130011664 | NASA technical report | To verify (TODO: title, authors, link) | To verify | `contracts/simulation_schema.json`, `backend/app/physics_engine.py` (not shown in the UI) |
| UFSC/INPE · VSB-30 sounding-rocket study | Research report | To verify (TODO: full reference) | To verify | `contracts/simulation_schema.json`, `backend/app/physics_engine.py`; listed by name only in the Documentation credits |
| NASA-STD-6001 | NASA standard | To verify (TODO: full reference) | To verify | `backend/app/physics_engine.py`, `backend/app/investigations_presets.py` (not shown in the UI) |

## Software, fonts and 3D assets

| Resource | Type | License | Link | Used in |
| --- | --- | --- | --- | --- |
| Unity (game engine and WebGL template) | Engine | Unity Terms of Service | https://unity.com/legal/terms-of-service | `unity-fire-simulation/` (3D chamber, WebGL build) |
| MagicaVoxel 3D models: Earth, ISS, Mars, Moon, RocketShip, Extinguisher | 3D models | To verify (TODO: author and license) | https://ephtracy.github.io/ (MagicaVoxel editor) | `unity-fire-simulation/Assets/MagicaVoxelModels/`, `Assets/TravelModels/` |
| FastAPI | Library | MIT License | https://fastapi.tiangolo.com | `backend/` |
| Pydantic V2 | Library | MIT License | https://docs.pydantic.dev | `backend/`, `contracts/simulation_schema.json` |
| React & TypeScript | Library | MIT / Apache-2.0 | https://react.dev | `frontend/` |
| Tailwind CSS | Library | MIT License | https://tailwindcss.com | `frontend/`, `DESIGN.md` |
| Vite | Library | MIT License | https://vite.dev | `frontend/` build tooling and dev server |
| React Router | Library | MIT License | https://reactrouter.com | `frontend/` client-side routing |
| Fontsource (`@fontsource/ibm-plex-sans`, `@fontsource/ibm-plex-mono`) | Library | MIT License (packaging); IBM Plex fonts under SIL OFL 1.1 | https://fontsource.org | `frontend/` self-hosted fonts |
| Vitest | Library | MIT License | https://vitest.dev | `frontend/` unit and route tests |
| Testing Library (`@testing-library/react`, `@testing-library/jest-dom`) | Library | MIT License | https://testing-library.com | `frontend/` tests |
| ESLint & typescript-eslint | Library | MIT License | https://eslint.org | `frontend/` linting |
| @react-pdf/renderer | Library | MIT License | https://react-pdf.org | `frontend/src/features/simulator/report/` (scenario report PDF) |
| Ajv (JSON Schema validator) | Library | MIT License | https://ajv.js.org | `frontend/src/services/api/validate.ts` (runtime validation against `contracts/simulation_schema.json`) |

## SI tools

| Tool | Type | License / terms | Link | Used for |
| --- | --- | --- | --- | --- |
| ChatGPT (OpenAI) | SI tool | Provider terms | https://chatgpt.com | Planning, development support, 3D modeling support and the logo concept (the ChatGPT image is not used in the project) |
| Codex (OpenAI) | SI tool | Provider terms | https://developers.openai.com/codex | Unity scripts and shaders for the 3D chamber (`unity-fire-simulation/`, `SI-assisted` headers) |
| Gemini (Google) | SI tool | Provider terms | https://gemini.google.com | Refining the team's business rules, backend integration and test data (`backend/`, `contracts/`, sample payloads) |
| Claude / Claude Code (Anthropic) | SI tool | Provider terms | https://claude.com/product/claude-code | Front-end code and interface, planning, visual design, documentation, pitch script, reference review; vector logo recreated from the ChatGPT concept (SI-assisted) and reviewed by the team |
| Antigravity | Coding environment (used with Gemini) | Google Terms of Service | https://policies.google.com/terms | Coding environment used with Gemini |
| Google Colab | Notebook environment | Google Terms of Service | https://policies.google.com/terms | Model training and validation |
| [VOICE TOOL] | SI tool | To verify | To verify | Demo video narration (TODO: tool name, license and link) |
