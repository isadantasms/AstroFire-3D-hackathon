# AstroFire 3D — Microgravity Combustion Simulator & Fire-Safety Decision Console

> **2026 NASA Space Apps Challenge · Challenge:** *Flame in Freefall: SI-Powered Fire Safety Insights from Microgravity Combustion Data* · **Team:** 21 PyroRangers

**[Full Technical Documentation (50-page PDF)](https://drive.google.com/file/d/1I76fUH7d-4MW_0Z12umlQFeijdn4akI0/view)** · **[References & SI Ledger](docs/references.md)** · **[Visual & Asset Credits](assets/CREDITS.md)** · **[License (MIT)](LICENSE)**

---

## 1. Overview & Scientific Question
**AstroFire 3D** is an interactive microgravity-combustion explorer and fire-safety decision console built for combustion researchers, aerospace engineers, and university instructors. It bridges published microgravity flammability evidence from the **NASA Physical Sciences Informatics (PSI)** repository and **NASA Technical Reports Server (NTRS)** with the operating conditions of spacecraft cabins and partial-gravity habitats (ISS $0\text{ g}$, Moon $0.16\text{ g}$, Mars $0.38\text{ g}$, and Earth $1.00\text{ g}$).

The platform integrates three layers:
1. **Deterministic Physics Engine (`backend/app/physics_engine.py`):** Evaluates closed-form physical relations in $< 5\text{ ms}$ with zero external API keys — effective convective velocity and stretch rate, Olson's U-shaped Limiting Oxygen Index (LOI) boundary, Bhattacharjee thickness scaling, stoichiometric $\text{CO}_2/\text{CO}$ byproduct estimates, a monotonic flammability index ($0\text{--}100$), and first-order sizing for the **ISS Fine Water Mist Portable Fire Extinguisher (FWM PFE)** coupled with microgravity boiling heat-transfer evidence from the **Brazilian VSB-30 suborbital sounding rocket** (UFSC / LEPTEN / AEB / INPE).
2. **Empirical Grounding Layer (`backend/data/`):** Anchored on **79 verified BASS-II (`PSI-25`) flight tests** with measured spread rates aboard the ISS Microgravity Science Glovebox, extended to **150 curated flight records** ($79 + 71$ from the 129-run flight sheet) for sustained-versus-quenched classification.
3. **Hybrid Physics-Informed Neural Network (`backend/app/ml_pipeline.py` & `backend/ExpandedDemo.ipynb`):** Combines an analytical physics prior with a bounded neural residual and sub-LOI collocation enforcement, achieving **95.33% stratified 5-fold cross-validation accuracy** (97.73% recall, $N = 150$) and **$R^2 = 0.9117$** ($N = 79$ spread-rate regression), running live alongside the deterministic engine in the Safety Co-Pilot.

---

## 2. NASA Open Data & Citations
All datasets, DOIs, technical reports, and open-source libraries used in this repository are cataloged with their licenses in [`docs/references.md`](docs/references.md) and [`assets/CREDITS.md`](assets/CREDITS.md).
- **Primary empirical baseline:** **BASS-II (`PSI-25`)** (`DOI: 10.60555/4qc4-de67`, `CC0-1.0`) and **NASA/TM-20210011385** (Olson et al., 2021).
- **Multi-investigation synthesis:** **Saffire I–VI** (`NTRS-20170000230`, `NTRS-20240002981`, `NTRS-20260001600`), **SoFIE**, **SAME** (`NTRS-20170007283`), **FLEX**, **SPICE**, **ISS FWM PFE** (`NTRS-20130011664`), and **NASA Glenn Microgravity Boiling** (`NTRS-20030003652`).
- **License compliance guard:** Investigation `PSI-10` is strictly excluded due to the absence of an open license declaration in PSI.

---

## 3. Scientific Scope & Grounding Boundaries
Every output produced by the system explicitly distinguishes between:
- `empirical_bass2`: Direct experimental measurements from NASA PSI BASS-II records at $0\text{ g}$.
- `interpolated_from_ntrs`: Bounded physical interpolation across oxygen, airflow, or partial gravity ($\sqrt{g/g_0}$ buoyant stretch scaling between $0\text{ g}$ and $1\text{ g}$ bounds, since no partial-gravity combustion datasets exist in PSI today).
- **3D Chamber Visualization:** The Unity WebGL 3D chamber (`unity-fire-simulation/`) is an illustrative particle visualization driven by the engine contract (`flame_geometry`, `burn_rate_mm_s`, `flame_color_hex`, `oxygen_factor`, and FWM PFE discharge duration), not a computational fluid dynamics (CFD) solver.

---

## 4. Super Intelligence (SI) Disclosure

### SI inside the product
- **Hybrid Physics-Informed Neural Network (PINN) & Classifier:** Trained and cross-validated in Google Colab (`backend/ExpandedDemo.ipynb`) on the 79 verified and 150 curated NASA BASS-II records; executes a live forward pass on every simulation request to report sustained-burn probability, independent neural spread rate ($\pm 0.055\text{ mm/s}$ MAE), and the closest ISS twin.
- **Safety Co-Pilot Templates:** Diagnosis, suppression protocol, and scientific limitation templates drafted with Gemini and reviewed by the team against `NASA/TM-20210011385`.

### SI tools used to build it
| Tool | What for | Where | Human review |
| --- | --- | --- | --- |
| **Google Gemini** | FastAPI backend, deterministic physics engine, contract schema, PINN pipeline, test data | `backend/`, `api/`, `contracts/` | Equations checked against Olson (2021) and NTRS reports; verified by 21 PyroRangers |
| **Claude / Claude Code** | React 19 & TypeScript console, design system, vector logo artwork, technical documentation | `frontend/`, `docs/` | Vitest unit tests, schema validators, and accessibility review by 21 PyroRangers |
| **ChatGPT & Codex** | Unity 3D chamber C# controllers, custom HLSL shaders, WebGL launcher scripts, initial logo concept | `unity-fire-simulation/` | All C# scripts, shaders, and UI components reviewed, tested, and validated by 21 PyroRangers |
| **Google Imagen (via Gemini)** | 21 PyroRangers group emblem (watermarked `"Generated with SI (Google Image Gen)"` on source image and credited on the PDF cover) | Technical PDF cover | Reviewed by 21 PyroRangers |
| **ElevenLabs** | AI text-to-speech voice synthesis for the 30-second demo video narration from a human-authored script | Demo video audio | Script written and audio verified by 21 PyroRangers |
| **Google Colab & Antigravity** | Notebook environment for 5-fold CV and agentic coding/verification environment | `backend/ExpandedDemo.ipynb`, repo-wide | All outputs and code changes reviewed and tested by 21 PyroRangers |

### What was not made with SI
The fundamental solution concept, problem framing, selection of NASA PSI/NTRS and Brazilian VSB-30 sources, physical equations, non-circular data curation rules, and 5-fold validation design are the original work of **21 PyroRangers**.

---

## 5. Run Locally (100% Offline Capable)

```bash
# 1. Start the full local stack (Backend API :8000, Unity WebGL :8080, React Console :5173)
./run_dev.sh

# 2. Run backend contract & physics verification suite
python3 -m unittest discover -s backend/tests -v

# 3. Run frontend typecheck, lint & Vitest suite
cd frontend && npm install && npm run typecheck && npm run lint && npm test
```

---

## 6. License & Disclaimer
Released under the [MIT License](LICENSE). Independent participant submission built by **21 PyroRangers** for the 2026 NASA Space Apps Challenge. **Not an official NASA document or endorsed by NASA.** No official NASA logos, seals, or mission insignias are used.
