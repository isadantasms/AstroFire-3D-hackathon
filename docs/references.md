# AstroFire 3D — References & Super Intelligence (SI) Ledger

**2026 NASA Space Apps Challenge | Challenge:** *Flame in Freefall: SI-Powered Fire Safety Insights from Microgravity Combustion Data* | **Team:** 21 PyroRangers

> **Compliance Notice:** Every NASA dataset, technical report, Brazilian partner study, open-source library, 3D asset, and Super Intelligence (SI) tool used in AstroFire 3D is recorded below with its license and public link. No official NASA logos, flags, or mission insignias are used, and investigation `PSI-10` is strictly excluded because it has no open license declaration in NASA PSI.

## 1. NASA Data, Technical Reports & Space Partner Research

| Resource | Type | License | Link | Used in |
| --- | --- | --- | --- | --- |
| **BASS-II (`PSI-25`)**: *Burning and Suppression of Solids – II Empirical Microgravity Combustion Dataset* | NASA PSI data | CC0-1.0 | https://doi.org/10.60555/4qc4-de67 | `backend/data/`, deterministic physics engine, PINN training & 79-test explorer |
| **NASA/TM-20210011385**: *Burning and Suppression of Solids – II (BASS-II) Summary Report* (Olson et al., 2021) | NASA technical report | US Gov Public Domain | https://ntrs.nasa.gov/citations/20210011385 | Limiting Oxygen Index (LOI Eq. 6.1), thickness scaling & byproduct models |
| **Saffire I–VI (`NTRS-20170000230`)**: *Operation and Development Status of the Spacecraft Fire Experiments (Saffire)* (Ruff & Urban, 2016) | NASA technical report | US Gov Public Domain | https://ntrs.nasa.gov/citations/20170000230 | Exploration cabin atmosphere bounds & multi-habitat investigation ranking |
| **NTRS-20240002981**: *Preliminary Results from the Saffire VI Experiment* (Urban, Ruff, Ferkul et al., ICES 2024) | NASA technical report | US Gov Public Domain | https://ntrs.nasa.gov/citations/20240002981 | Documentation investigation ranking & exploration atmosphere context (Saffire) |
| **NTRS-20260001600**: *Spacecraft Fire Safety Predictions using Verified Saffire Model* (Niehaus, Urban, Ruff et al., ICES 2026) | NASA technical report | US Gov Public Domain | https://ntrs.nasa.gov/citations/20260001600 | Scenario limitations & vehicle-scale roadmap |
| **SAME (`NTRS-20170007283`)**: *Spacecraft Fire Safety Research at NASA Glenn Research Center* (Meyer, 2016) | NASA technical report | US Gov Public Domain | https://ntrs.nasa.gov/citations/20170007283 | Documentation investigation ranking & smoke-detection guidance (SAME) |
| **SoFIE**: *Solid Fuel Ignition and Extinction*, NASA Glenn Research Center / PSI & NTRS CIR records | NASA mission page & records | US Gov Public Domain | https://www.nasa.gov/glenn/glenn-expertise-space-exploration/physical-sciences-program/combustion-science/solid-fuel-ignition-and-extinction-sofie/ | Documentation investigation ranking (SoFIE) |
| **FLEX & FLEX-2**: *Flame Extinguishment Experiment* investigation records (NASA PSI & NTRS) | NASA PSI / NTRS records | CC0-1.0 / US Gov Public Domain | https://ntrs.nasa.gov/search?q=Flame%20Extinguishment%20Experiment%20FLEX | Documentation investigation ranking (FLEX) |
| **SPICE**: *Smoke Point In Co-flow Experiment* investigation records (NASA PSI & NTRS) | NASA PSI / NTRS records | CC0-1.0 / US Gov Public Domain | https://ntrs.nasa.gov/search?q=Smoke%20Point%20In%20Co-flow%20Experiment%20SPICE | Documentation investigation ranking (SPICE) |
| **NTRS-20130011664**: *Development of the International Space Station Fine Water Mist Portable Fire Extinguisher* (Rodriquez & Young, 2013) | NASA technical report | US Gov Public Domain | https://ntrs.nasa.gov/citations/20130011664 | ISS FWM PFE 2,720 mL tank & 55 kW qualification sizing (`physics_engine.py`) |
| **NTRS-20030003652**: *Length Scale and Gravity Effects on Microgravity Boiling Heat Transfer* (Kim et al., NASA Glenn) | NASA technical report | US Gov Public Domain | https://ntrs.nasa.gov/citations/20030003652 | Microgravity vapor-blanketing cooling efficiency calibration (`physics_engine.py`) |
| **UFSC / LEPTEN · Brazilian VSB-30 Suborbital Rocket Study**: *Confined and Unconfined Nucleate Boiling under Terrestrial and Microgravity Conditions* (Souza, Passos & Cardoso, COBEM 2011; AEB / INPE microgravity program) | Academic research paper | Open Academic Publication (COBEM 2011) | https://lepten.ufsc.br/publicacoes/boiling/eventos/2011/COBEM/souza_passos.pdf | Brazil–NASA microgravity heat-transfer fusion ($\eta_{0g} = 0.68$ in `physics_engine.py`) |
| **NASA-STD-6001B**: *Flammability, Offgassing, and Compatibility Requirements and Test Procedures* | NASA technical standard | US Gov Public Domain | https://standards.nasa.gov/standard/nasa/nasa-std-6001 | Upward $1\text{ g}$ Test 1 material screening baseline & terrestrial spin-off |
| **NASA Space Apps Challenge 2026**: *Flame in Freefall* official challenge description | Challenge brief | Public Web Page | https://www.spaceappschallenge.org/2026/challenges/flame-in-freefall/ | Problem alignment, partial-gravity bounding guidance & $\ge 30\%\text{ O}_2$ lunar band |

## 2. Software, Libraries, Fonts & 3D Assets

| Resource | Type | License | Link | Used in |
| --- | --- | --- | --- | --- |
| **Unity & Unity WebGL** (3D engine, TextMeshPro & WebGL template) | 3D Engine | Unity Terms of Service | https://unity.com/legal/terms-of-service | `unity-fire-simulation/` (3D combustion chamber & WebGL build) |
| **MagicaVoxel** (by ephtracy) — 3D voxel models (Earth, ISS, Mars, Moon, RocketShip, Extinguisher) created by 21 PyroRangers | 3D Models & Editor | MIT License (models in this repo); Freeware editor | https://ephtracy.github.io/ | `unity-fire-simulation/Assets/MagicaVoxelModels/`, `Assets/TravelModels/` |
| **FastAPI** | Backend Framework | MIT License | https://fastapi.tiangolo.com | `backend/`, `api/index.py` |
| **Pydantic V2** | Schema Validation | MIT License | https://docs.pydantic.dev | `backend/`, `contracts/simulation_schema.json` |
| **Uvicorn** | ASGI Server | BSD-3-Clause License | https://www.uvicorn.org | `backend/` local development server |
| **Pytest & HTTPX** | Testing Libraries | MIT / BSD-3-Clause | https://docs.pytest.org | `backend/tests/` |
| **React 19 & TypeScript** | Frontend UI & Types | MIT / Apache-2.0 | https://react.dev | `frontend/` |
| **Tailwind CSS v4** | Styling System | MIT License | https://tailwindcss.com | `frontend/`, `DESIGN.md` |
| **Vite** | Frontend Build Tool | MIT License | https://vite.dev | `frontend/` |
| **React Router v7** | Client Routing | MIT License | https://reactrouter.com | `frontend/` |
| **@react-pdf/renderer** | Client PDF Generator | MIT License | https://react-pdf.org | `frontend/src/features/simulator/report/` (Scenario Fire Safety Analysis PDF) |
| **Ajv** | JSON Schema Validator | MIT License | https://ajv.js.org | `frontend/src/services/api/validate.ts` |
| **Lucide Icons** (`lucide-react`) | UI Vector Icons | ISC License | https://lucide.dev/license | `frontend/` |
| **IBM Plex Sans, Serif & Mono** (`@fontsource`) | Typography | SIL Open Font License 1.1 (fonts) / MIT (Fontsource) | https://github.com/IBM/plex | `frontend/` UI, telemetry (`tabular-nums`), and technical documentation PDF |
| **Vitest & Testing Library** | Frontend Test Suite | MIT License | https://vitest.dev | `frontend/` unit and integration tests |
| **ESLint & typescript-eslint** | Static Analysis | MIT License | https://eslint.org | `frontend/` |
| **Matplotlib, ReportLab & svglib** | Scientific Charts & Typesetting | PSF / BSD / LGPL-3.0 | https://www.reportlab.com | Vector figures and typesetting of the 50-page technical documentation PDF |
| **Vercel** | Cloud Hosting | Vercel Service Terms | https://vercel.com | Unified production deployment (React SPA, Unity WebGL with Brotli headers & FastAPI Serverless API) |

## 3. Super Intelligence (SI / AI) Tools & Environments

| Tool | Type | License / Terms | Link | Used for |
| --- | --- | --- | --- | --- |
| **Google Gemini** | SI Tool | Google API / Provider Terms | https://gemini.google.com | FastAPI backend, deterministic physics engine, contract schema, PINN pipeline, and test data (`backend/`, `contracts/`) |
| **Claude / Claude Code (Anthropic)** | SI Tool | Anthropic Terms of Service | https://claude.com/product/claude-code | React & TypeScript console, design system, website copy, technical documentation PDF, and vector recreation of the AstroFire 3D logo |
| **ChatGPT & Codex (OpenAI)** | SI Tool | OpenAI Terms of Use | https://chatgpt.com | Planning, initial AstroFire 3D logo concept, Unity 3D chamber C# controllers, custom HLSL shaders, and WebGL launcher scripts (`unity-fire-simulation/`) |
| **Google Imagen (via Gemini)** | SI Image Tool | Google Terms of Service | https://gemini.google.com | 21 PyroRangers group emblem (carries visible attribution `"Generated with SI (Google Image Gen)"` on the source image and on the technical PDF cover) |
| **ElevenLabs** | SI Audio Tool | ElevenLabs Terms of Service | https://elevenlabs.io | AI voice synthesis for the 30-second demo video narration from a human-authored script |
| **Google Colab** | Notebook Environment | Google Terms of Service | https://colab.research.google.com | Curating the 150 BASS-II records, PINN training, and stratified 5-fold cross-validation (`backend/ExpandedDemo.ipynb`) |
| **Google Antigravity** | Agentic Coding Environment | Google Terms of Service | https://policies.google.com/terms | Agentic coding, repository compliance verification, and automated test auditing |
