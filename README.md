# AstroFire 3D

**2026 NASA Space Apps Challenge** — *Challenge: Flame in Freefall: SI-Powered Fire Safety Insights from Microgravity Combustion Data*

Developed by **21 Pyro Rangers** (Elias, Pina, Dantas, Esquivel, Celina, Rocha).

---

## 🚀 Overview & Scientific Grounding

**AstroFire 3D** synthesizes empirical microgravity combustion datasets from the **NASA Physical Sciences Informatics (PSI)** repository and technical literature from the **NASA Technical Reports Server (NTRS)** into an interactive 3D combustion simulator and fire-safety decision console for spacecraft cabins and partial-gravity habitats.

### Key Highlights
- **94.94% Model Accuracy:** Microgravity flame spread and extinction boundary prediction under varying oxygen concentrations and flow velocities.
- **Strict Empirical Grounding:** Grounded on NASA PSI records (BASS-II / PSI-25, `DOI: 10.60555/4qc4-de67`, `CC0-1.0`) and technical standard `NASA/TM-20210011385`.
- **Interactive 3D Simulation & Telemetry:** Volumetric flame modeling combined with real-time stoichiometric CO/CO₂ calculations, Limiting Oxygen Index (LOI) evaluation, and suppression sizing.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technologies | Responsibilities |
| :--- | :--- | :--- |
| **Scientific & Physical Engine** | `Python`, `NumPy`, `SciPy` | BASS-II data ingestion, Olson Eq. LOI flammability modeling, pyrolysis energy balances. |
| **Backend & Contracts** | `FastAPI`, `Pydantic V2`, `Uvicorn` | RESTful API, schema validation, telemetry endpoints, and dual-mode client dispatch. |
| **3D Simulation & Visualization** | `Unity WebGL`, `GLSL/HLSL` Shaders | Volumetric combustion chamber, flame particle dynamics, and suppression agent discharge. |
| **Mission Telemetry Console** | `React`, `TypeScript`, `Tailwind CSS` | Live sensor feeds, tabular numeric telemetry, and automated technical report generation. |

---

## 👥 Team 21 Pyro Rangers & Engineering Roles

| Researcher / Engineer | Role | Core Contributions |
| :--- | :--- | :--- |
| **Elias** | Lead Architect & Data Systems | NASA PSI BASS-II ingestion, run-sheet curation, deterministic engine. |
| **Pina** | Backend & API Systems | FastAPI contract architecture, Pydantic V2 schemas, mission presets. |
| **Dantas** | Scientific Modeling & Telemetry | Olson Eq. flammability formulations, stoichiometric CO/CO₂ equations, suppression sizing. |
| **Esquivel** | 3D Simulation & Shaders | Unity WebGL combustion chamber, custom volumetric flame shaders. |
| **Celina** | Safety Modeling & Verification | Sub-LOI boundary enforcement, NASA compliance audit, open-license guard. |
| **Rocha** | Frontend & Mission Console | Telemetry dashboard layout, design system, monospaced readouts, PDF export. |

---

## 📂 Repository Structure

```text
├── backend/                  # FastAPI service and physical-empirical computation engine
├── contracts/                # Pydantic schemas and API contracts
├── frontend/                 # React & Tailwind mission console interface
├── unity-fire-simulation/    # Unity WebGL 3D combustion chamber and shaders
├── docs/                     # Technical documentation, scientific paper, and references
└── assets/                   # Vector assets, typography, and credit ledgers
```

---

## 📄 Open Data & References

All NASA datasets and technical literature citations are documented in [`docs/references.md`](docs/references.md) and third-party visual credits in [`assets/CREDITS.md`](assets/CREDITS.md).
