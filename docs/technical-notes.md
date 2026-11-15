<!-- SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha -->
# AstroFire 3D — Technical Notes

Working notes for the technical documentation PDF. This content was moved out of the Research & Data page (now Documentation),
which now only shows the evidence (NASA data, investigation comparison and citations).
Every number below is copied from a file in this repository; the source file is named in each section.

## 1. How results are calculated today

- `POST /api/simulate` (`backend/app/physics_engine.py`) is a **deterministic, rule-based engine**. No AI model runs at runtime.
- When a scenario matches one of the 79 BASS-II records (`backend/data/bass2_empirical_verified.json`), the engine uses that measured record (`grounding_status = empirical_bass2`).
- Otherwise it applies formulas bounded by NASA/TM-20210011385 (Olson's stretch flammability boundary, Eq. 6.1; Bhattacharjee's thermal/radiative scaling, Eq. 2.2–2.5) and maps partial gravity through an equivalent convective stretch velocity (`grounding_status = interpolated_from_ntrs`).
- The diagnosis, suppression and limitations texts are filled in from three templates (extinguished, quiescent 0g, advective/buoyant). The templates were drafted with Gemini and reviewed by the team.
- In mock mode (`VITE_API_MODE=mock`, the default of the published front-end), results come from three sample payloads (`frontend/src/mocks/sample_3d_payloads.json`) written with Gemini.

> TODO(si): If the PINN is wired into `/api/simulate`, update this section and the Home "How we use SI" section to describe the ML prediction step.

## 2. Physics-informed model (PINN): separate validation study

Source: `backend/data/pinn_validation_metrics.json`, produced by `backend/app/ml_pipeline.py` and served by `GET /api/model-metrics`.

**Important:** the PINN is **not** used by `/api/simulate`. Its metrics describe a separate validation run, not the Simulator results.

- Architecture (as recorded in the file): Hybrid Physics-Informed Neural Network (PINN) + Stratified 5-Fold Cross-Validation Ensemble.
- Data: 79 BASS-II records plus 24 collocation boundary points.
- Loss (as described on the former Research page): L_total = L_MSE(BASS-II) + 0.5 · L_physics (LOI and quench boundary collocation), embedding Olson Eq. 6.1 and Bhattacharjee Eq. 2.2–2.5.
- Measured wall-clock time of the validation run: **654.38 ms**.

> To verify: the backend docstrings (`main.py`, `physics_engine.py`) claim "< 5 ms" execution for the engine; this has not been measured.

### 2.1 Validation metrics

| Task | Scheme | Metric | Value |
| --- | --- | --- | --- |
| Sustained flame vs. quench / O2 extinction | Stratified 5-fold CV (79 states) | Accuracy | 94.94% |
| | | Precision | 95.31% |
| | | Recall | 98.39% |
| | | F1 | 96.83% |
| | | Confusion matrix | TP 61 · TN 14 · FP 3 · FN 1 |
| Flame spread rate Vf (mm/s) | 5-fold CV on measured spread rates | R² | 0.9117 |
| | | RMSE | 0.1747 mm/s |
| | | MAE | 0.0549 mm/s |

### 2.2 Fold breakdown

| Fold | Samples | Classification accuracy | Spread-rate RMSE (mm/s) |
| --- | --- | --- | --- |
| 1 | 17 | 94.12% | 0.0819 |
| 2 | 17 | 94.12% | 0.0662 |
| 3 | 15 | 93.33% | 0.3635 |
| 4 | 15 | 100.00% | 0.0591 |
| 5 | 15 | 93.33% | 0.1118 |

### 2.3 Factor importance (permutation sensitivity)

| Factor | Importance | Description (as recorded) |
| --- | --- | --- |
| Material polymer/textile family baseline reactivity | 34.94% | Distinguishes PMMA acrylic, SIBAL cotton-fiberglass blend and Nomex III fire barrier. |
| Forced ventilation & radiative quench velocity | 21.53% | Supplies oxidizer in 0g where natural buoyancy is absent; quenches at ultra-low flow or high blowoff. |
| Oxygen margin above Olson Eq. 6.1 LOI | 21.39% | Primary driver of flame temperature and the extinction boundary. |
| Bhattacharjee thermal thickness scaling | 11.72% | Controls solid heat-sink capacity. |
| Gravitational acceleration & buoyant stretch | 10.42% | Buoyant flow on Lunar and Martian habitats. |

> To verify before publishing:
> - The gravity factor is not computed by permutation: `ml_pipeline.py` sets its raw score to a fixed value (`delta_score = 9.8`), and all 79 BASS-II records are at 0 g.
> - The recorded descriptions also contain numbers without a cited source (">30x faster than 6.35 mm rods", "V_b = 25*sqrt(g/g0) cm/s"); they are left out of the table above.

### 2.4 Loss convergence by epoch

The per-epoch curve (25 points, epochs 1–120: train MSE, validation MSE, physics residual and total loss) is stored in `pinn_loss_curve` in the same file. For example, total PINN loss goes from 0.115376 at epoch 1 to 0.035516 at epoch 120. Include the full table in the PDF.

## 3. SI disclosure

Full disclosure for the technical PDF. The Home shows only a short block (`SI_COMPACT` in
`frontend/src/content/project.ts`); its "Full SI disclosure in the documentation" link appears once
`TECHNICAL_DOCS_PDF_URL` is set in `frontend/src/app/routes.ts`. Keep this section and the Home block in sync.

**Transparency & scientific integrity — Human-led science. AI-assisted development.**

### 3.1 SI inside AstroFire 3D

NASA data → Rule-based engine → Results

AstroFire 3D does not run an AI model when you simulate. A deterministic engine matches your scenario to the 79 BASS-II records, or applies formulas bounded by NASA technical reports, and fills in the diagnosis and suppression text from templates. Those rules and templates were drafted with Gemini and reviewed by the team. In mock mode, results come from three sample payloads written with Gemini.

What it does:
- Computes telemetry from the BASS-II records or NASA-bounded formulas
- Explains the flame regime and suppression options with template text
- Cites the NASA sources behind each result

What it does not do:
- Run a live AI model
- Measure Moon or Mars fires
- Provide a certified safety assessment

In the Simulator and the PDF report, these texts carry the label "Diagnosis text from templates drafted with SI and reviewed by the team." In mock mode they add "Sample text written with Gemini".

> TODO(si): If the PINN is wired into `/api/simulate`, update this section to describe the ML prediction step.

### 3.2 AI-assisted development

- ChatGPT (OpenAI): planning, development support, 3D modeling support and the logo concept
- Codex (OpenAI): Unity scripts and shaders for the 3D chamber
- Gemini (Google): refining the team's business rules, backend integration and test data
- Claude / Claude Code (Anthropic): front-end code and interface, planning, visual design, documentation, pitch script and reference review
- AstroFire 3D logo: concept generated with ChatGPT; simplified vector artwork recreated with Claude Code (SI-assisted) and reviewed by the team. The ChatGPT image itself is not used in the project.
- Demo video narration generated with [VOICE TOOL].

> TODO(logo): if the team redraws the logo by hand, change the logo line to "AstroFire 3D logo designed by the team; initial concept explored with ChatGPT and Claude Code (SI-assisted)."
> TODO(voice-tool): replace [VOICE TOOL] with the name of the narration tool.

### 3.3 Human review & responsibility

The team conceived the solution, chose the NASA data and methods, made every design decision, and reviewed the code, data and results.

"Super Intelligence (SI)" is the term used by the Space Apps challenge; ChatGPT, Codex, Gemini and Claude are tools we used for specific tasks.

## 4. NASA investigations: comparison by habitat (for the PDF)

The Documentation page now lists the six NASA investigations with one plain sentence and a source link each. The detailed comparison moved here for the PDF. Source of truth: `frontend/src/content/investigations.ts`.

- For each investigation: code, facility, tested conditions (BASS-II ranges computed from the 79 records; the others "see source"), materials, similarity, key distinction, and SI-assisted prevention / detection / suppression guidance (research only, not an operational procedure).
- Team-assigned relevance (High / Medium) per habitat (Lunar base, ISS, Martian habitat, crew cabin & pressurized rover). The criteria behind it are not documented yet (to verify); the internal ordering values are in the `scores` field.

## 5. Known issues to fix before the PDF

- Backend risk labels now follow the schema bands for 36–70 (Moderate Alert) and 71–100 (Critical Flashover Risk). The enum has no label for a burning flame scored 0–35 ("Safe" is reserved for extinguished flames), so those keep "Moderate Alert"; "High Risk" is unused (to verify with the team).
- Investigation relevance by habitat (section 4) is team-assigned; the criteria are not documented yet (to verify).
