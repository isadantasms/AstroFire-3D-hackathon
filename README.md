# AstroFire

**2026 NASA Space Apps Challenge — Challenge:** *Flame in Freefall: SI-Powered Fire Safety Insights from Microgravity Combustion Data*

> **Note:** Official project name, visual identity, and application implementation will be populated starting Saturday, November 14, 2026, at 09:00 AM local time in accordance with NASA Space Apps Challenge rules.

---

## 1. Overview & Scientific Question
`AstroFire` synthesizes empirical microgravity combustion datasets from the **NASA Physical Sciences Informatics (PSI)** repository and technical literature from the **NASA Technical Reports Server (NTRS)** into an interactive 3D combustion simulator and fire-safety decision console for spacecraft cabins and partial-gravity habitats.

## 2. NASA Open Data & Citations
All datasets, DOIs, technical reports, and open-source libraries used in this repository are cataloged with their licenses in [`docs/references.md`](docs/references.md) and [`assets/CREDITS.md`](assets/CREDITS.md).
- Primary empirical baseline: **BASS-II (PSI-25)** (`DOI: 10.60555/4qc4-de67`, `CC0-1.0`) and **NASA/TM-20210011385**.
- *Note:* Investigation `PSI-10` is excluded due to the absence of an open license declaration in PSI.

## 3. Scientific Scope & Grounding Boundaries
Every output produced by the system explicitly distinguishes between:
- `empirical_bass2`: Direct experimental measurements from NASA PSI records.
- `interpolated_from_ntrs`: Physical interpolation bounded by NASA NTRS models with explicit uncertainty/validity limits.

---

## Super Intelligence (SI)

### SI inside the product
- Deterministic physical-empirical engine and SI synthesis layer grounded on NASA PSI (`PSI-25`) and NTRS (`NASA/TM-20210011385`) records.

### SI tools used to build it
| Tool | What for | Where | Human review |
| --- | --- | --- | --- |
| Gemini / Claude / GPT Coding Assistants | Code generation, schema modeling, and English documentation review | `backend/`, `frontend/`, `contracts/`, `docs/` | All generated code and scientific formulas reviewed, tested, and edited by the 6 team members |

### What was not made with SI
The project concept, scientific grounding architecture, selection of NASA PSI/NTRS investigations, and experimental verification rules are the team's own work.
