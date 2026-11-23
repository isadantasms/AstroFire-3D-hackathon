<!-- SI-assisted: generated with Claude & Gemini, reviewed and edited by 21 PyroRangers -->
# AstroFire 3D — Technical Architecture & Validation Notes (v1.0)

Summary reference synchronized with the **AstroFire 3D Full Technical Documentation & Architecture Reference (v1.0, 50 pages)** ([Google Drive PDF](https://drive.google.com/file/d/1I76fUH7d-4MW_0Z12umlQFeijdn4akI0/view)). Every value below is produced directly by the repository code and verified against `contracts/simulation_schema.json`.

---

## 1. Three-Layer Runtime Architecture

1. **Deterministic Physics Engine (`backend/app/physics_engine.py`):**
   - Evaluates closed-form physical equations in constant time ($< 5\text{ ms}$, zero external API keys): effective convective velocity $U_{\text{eff}}$ and stretch rate $a$, Olson's U-shaped Limiting Oxygen Index boundary (Eq. 6.1 of `NASA/TM-20210011385`), Bhattacharjee thickness scaling, stoichiometric $\text{CO}_2/\text{CO}$ estimates, a monotonic flammability index ($0\text{--}100$), and first-order sizing for the **ISS Fine Water Mist Portable Fire Extinguisher (FWM PFE, 2,720 mL)** (`NTRS-20130011664`) coupled with microgravity boiling cooling efficiency ($\eta_{0g} = 0.68$ in $0\text{ g}$ vs. $1.00$ in $1\text{ g}$) grounded on **NASA Glenn (`NTRS-20030003652`)** and the **Brazilian VSB-30 suborbital rocket boiling experiments (UFSC / LEPTEN / AEB / INPE)**.
2. **Empirical Grounding Store (`backend/data/`):**
   - **79 verified BASS-II (`PSI-25`, `DOI: 10.60555/4qc4-de67`, `CC0-1.0`) flight records** with measured flame spread rates $V_f$ ($\text{mm/s}$) from `NASA/TM-20210011385` summary tables.
   - **150 curated flight records** ($79$ verified $+ 71$ curated from the 129-run ISS flight sheet `bass2_experiments_clean.csv` using non-circular telemetry hygiene rules) for sustained-versus-quenched classification.
   - Every response reports `empirical_bass2` when matching a BASS-II record at $0\text{ g}$ or `interpolated_from_ntrs` for bounded physical interpolation (including Moon $0.16\text{ g}$ and Mars $0.38\text{ g}$ bounded between $0\text{ g}$ and $1\text{ g}$).
3. **Live Hybrid Physics-Informed Neural Network (PINN) Co-Pilot (`backend/app/ml_pipeline.py`):**
   - Runs a live forward pass of `PhysicsInformedClassifier` and `PhysicsInformedSpreadPINN` alongside a nearest-neighbor search over the 79 verified ISS tests on every `POST /api/simulate` call.
   - Reports **PINN Sustained-Burn Probability (%)**, **PINN $V_f \pm 0.055\text{ mm/s}$ MAE**, and the **Closest ISS Twin (`BASS2-*`)** in the Safety Co-Pilot without overwriting the deterministic telemetry.

---

## 2. PINN Validation Benchmark (79 Verified vs. 150 Curated Records)

Source: `backend/app/ml_pipeline.py`, `backend/data/pinn_validation_metrics.json`, and `backend/ExpandedDemo.ipynb` (Stratified 5-Fold Cross-Validation, seed `2026`).

| Metric (Stratified 5-Fold CV) | $N = 79$ Verified | $N = 150$ Curated | $\Delta$ | Notes |
| --- | --- | --- | --- | --- |
| **Accuracy** | 94.94% | **95.33%** (143/150) | +0.39 pp | Sustained vs. quenched classification |
| **Precision** | 95.31% | **96.99%** | +1.68 pp | Predicted sustained flames that are sustained |
| **Recall** | 98.39% | **97.73%** | -0.66 pp | Safety-critical sensitivity to sustained flames |
| **F1-Score** | 96.83% | **97.36%** | +0.53 pp | Harmonic mean of precision and recall |
| **Confusion Matrix (TP / TN / FP / FN)** | 61 / 14 / 3 / 1 | **129 / 14 / 4 / 3** | — | Class balance $62:17 \rightarrow 132:18$ |
| **$R^2$ of $V_f$ (Verified Subset)** | **0.9117** | **0.9117** | 0 | RMSE $0.1747\text{ mm/s}$, MAE $0.0549\text{ mm/s}$ ($N = 79$) |

### Physical Feature Sensitivity ($N = 79$ Baseline Export)

| Factor | Importance | Physical Role |
| --- | --- | --- |
| Material polymer/textile family baseline reactivity | 34.94% | Distinguishes PMMA acrylic, SIBAL cotton-fiberglass blend, Nomex III, and Japan wax |
| Forced ventilation & radiative quench velocity | 21.53% | Supplies oxidizer in $0\text{ g}$ where natural buoyancy is absent; quenches at ultra-low flow or high blowoff |
| Oxygen margin above Olson Eq. 6.1 LOI | 21.39% | Primary thermodynamic driver of flame temperature and extinction boundary |
| Bhattacharjee thermal thickness scaling ($1/\sqrt{\tau}$) | 11.72% | Controls solid heat-sink capacity |
| Gravitational acceleration & buoyant stretch | 10.42% | Analytical buoyancy sensitivity across $0\text{ g} \rightarrow 1\text{ g}$ ($\delta_{\text{raw}} = 9.8$, as all BASS-II flight records are at $0\text{ g}$) |

---

## 3. Super Intelligence (SI) Transparency Summary

- **SI inside the product:** Deterministic physics engine + live hybrid PINN co-pilot (`PhysicsInformedClassifier` and `PhysicsInformedSpreadPINN`) + Safety Co-Pilot diagnosis/suppression templates drafted with Gemini and reviewed by 21 PyroRangers.
- **SI in development:**
  - **Google Gemini:** FastAPI backend, deterministic physics engine, JSON schema contract, PINN training pipeline, and test data.
  - **Claude / Claude Code (Anthropic):** React 19 & TypeScript console, design system, website copy, technical documentation PDF, and hand-authored SVG recreation of the AstroFire 3D logo.
  - **ChatGPT & Codex (OpenAI):** Planning, initial logo concept, Unity 3D chamber C# controllers, custom HLSL shaders, and WebGL launcher scripts.
  - **Google Imagen (via Gemini):** 21 PyroRangers group emblem (carries visible attribution `"Generated with SI (Google Image Gen)"` on the source image and on the technical PDF cover).
  - **ElevenLabs:** AI text-to-speech voice narration for the 30-second demo video from a human-authored script.
  - **Google Colab & Google Antigravity:** Notebook execution environment for 5-fold validation and agentic coding/compliance verification environment.
- **Human review & responsibility:** 21 PyroRangers conceived the solution, selected all NASA PSI/NTRS and Brazilian VSB-30 sources, defined the physical equations and curation rules, and reviewed, tested, and validated all code, shaders, models, and documentation.
