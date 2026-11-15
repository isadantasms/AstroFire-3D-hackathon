# AGENTS.md — AstroFire (NASA Space Apps Challenge 2026)

> **1. TOP-PRIORITY GLOBAL LANGUAGE MANDATE (ALWAYS ACTIVE):**
> - **Team Interaction (Portuguese PT-BR):** The 6 team members (**Elias, Pina, Dantas, Esquivel, Celina, Rocha**) send prompts in **Portuguese (PT-BR)**. Always reply to the user in the chat in **Portuguese (PT-BR)**.
> - **Product & NASA Deliverables (100% English EN):** 100% of source code, variable/function/class identifiers, inline comments, docstrings, user interface (UI) text, logs, Git commit messages, `README.md`, `contracts/`, `assets/CREDITS.md`, and `docs/references.md` MUST be written exclusively in **English (EN)**.

> **2. TECHNICAL AUTONOMY + FACTUAL GROUNDING MANDATE:**
> Maintain full autonomy in code engineering (Python, React, Three.js). For scientific data, consult only dataset columns, DOIs, and NASA reports that exist in local files; if a data point or column does not exist in the file, report what is missing instead of inventing it.

---

## 1. Mission & 80/20 Architecture (*Flame in Freefall*)
**`AstroFire`** is an interactive 3D microgravity combustion simulator and SI-powered fire-safety copilot for spacecraft cabins and Lunar/Martian habitats. It connects empirical NASA PSI data (**BASS-II / PSI-25**, *Saffire*, *FLEX*, *SoFIE*, *SPICE*, *SAME*) and NTRS technical reports (`NASA/TM-20210011385`) to a **3D Microgravity Flame Simulator** and a **3-Column Aerospace Telemetry Console**.

### Core Rules
1. **Git Isolation & Pre-09:00 Cleanliness:** NEVER stage `./arquivos a separar/` or `./NASA SPACE APPS - 2026/` into Git. The official project name is **AstroFire**.
2. **Dataset License Guard:** Use only `CC0-1.0` NASA PSI datasets (such as `BASS-II / PSI-25`). **NEVER use `PSI-10` (ACME/Flame Design)** as it lacks an open license declaration.
3. **Zero-`.env` Deterministic Engine First:** Compute physical telemetry and safety insights deterministically/locally from `BASS-II` data and `NASA/TM-20210011385` in **< 5ms**, requiring zero paid external API keys to stay 100% online for NASA Global Judging.
4. **Contract-First Synergy:** Backend, 3D Simulator, and Frontend communicate strictly through `contracts/simulation_schema.json`.
5. **NASA 2026 Compliance:** Add `# SI-assisted: generated with <Model>, reviewed and edited by <Name>` at the top of AI-assisted files and `SI-assisted: <Model>` in commits; cite every dataset/paper/library in `docs/references.md` and `assets/CREDITS.md`; watermark any AI media with `Generated with SI (<tool>)`; keep demo within **30s video or 7 slides (public, no login)**; and **NEVER use the official NASA logo**.

---

## 2. Clean Repository Map
- `AGENTS.md` — Canonical project router, grounding rules, and 80/20 team workflow.
- `DESIGN.md` — Visual tokens, `tabular-nums` discipline, and 3-column layout rules.
- `LICENSE` — Open-source MIT License.
- `README.md` — Project overview and mandatory `Super Intelligence (SI)` transparency section.
- `assets/CREDITS.md` — Attribution ledger for fonts, icons, and visual assets.
- `contracts/simulation_schema.json` — Single JSON contract shared by FastAPI, Three.js, and React UI.
- `docs/references.md` — Official 5-column audit table of NASA DOIs, NTRS IDs, OSI libraries, and SI tools.
- `arquivos a separar/` — Ignored local folder holding reference PDFs, raw/processed study datasets, and pre-hackathon notes.

---

## 3. On-Demand Skill Routing (4 Focused Skills)
Load **only** the skill matching the active task (any team member can work on any front):

| Task / Active Scope | Skill to Load |
| :--- | :--- |
| Backend FastAPI, `BASS-II` data pipeline, physical formulas, `contracts/simulation_schema.json`, or Bonus ML/PyTorch | `.agents/skills/backend-data-si/SKILL.md` |
| 3D Space Chamber scene, Three.js/WebGL particle system, shaders, or 3D JSON binding | `.agents/skills/simulator-3d/SKILL.md` |
| Frontend 3-column UI, `BASS-II` table, grounding badges, charts, or Playwright verification | `.agents/skills/frontend-dashboard/SKILL.md` + `DESIGN.md` |
| NASA 2026 rules, `README.md`, `docs/references.md`, `assets/CREDITS.md`, SI watermarks, or pre-push language check | `.agents/skills/nasa-2026-compliance/SKILL.md` |
