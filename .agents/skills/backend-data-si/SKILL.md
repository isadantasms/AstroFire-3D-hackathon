---
name: backend-data-si
description: Govern FastAPI endpoints, BASS-II/NTRS data processing, factual scientific grounding, contracts/simulation_schema.json, and the optional ML/PyTorch bonus module. Activate when editing backend/** or contracts/**.
---

# Backend, NASA PSI/NTRS Data & Scientific Grounding Skill

## 1. Scope & Activation Triggers
Activate when creating or modifying `backend/**` or `contracts/simulation_schema.json`.

## 2. Factual Grounding & Zero Contamination Mandate
1. **Strict Source Attribution in Code:** Every module that loads or processes NASA data MUST include an explicit source header comment:
   `# Source: NASA PSI, BASS-II (PSI-25), DOI 10.60555/4qc4-de67, CC0-1.0`
   `# Reference: Olson et al., NASA/TM-20210011385 (2021)`
2. **Honest Grounding Status (`grounding_status`):**
   - Maintain full autonomy in code engineering (Python, React, Three.js). For scientific data, consult only dataset columns, DOIs, and NASA reports that exist in local files; if a data point or column does not exist in the file, report what is missing instead of inventing it.
   - Set `grounding_status = "empirical_bass2"` when returning or matching a direct test from `BASS-II (PSI-25)`.
   - Set `grounding_status = "interpolated_from_ntrs"` when interpolating across airflow, oxygen, or partial-gravity (`0.16g` / `0.38g`) regimes, and populate `safety_copilot.scientific_limitations` with the exact boundary assumptions.
3. **Dataset License Guard:** Use only `CC0-1.0` investigations (`BASS-II / PSI-25`, `Saffire`, `FLEX`, `SoFIE`, `SPICE`, `SAME`). **NEVER use `PSI-10` (ACME/Flame Design)** as it lacks an open license in NASA PSI.

## 3. Core Engineering Rules (80/20 Execution)
1. **Contract Synchronization:** Every response from `POST /api/simulate` MUST validate against `contracts/simulation_schema.json` using **Pydantic V2** (`extra="forbid"`).
2. **Zero-`.env` Deterministic Engine (< 5ms):** Compute telemetry and safety insights deterministically in Python without requiring external paid API keys at runtime:
   - **Hypoxia Extinction (`o2_pct < oxygen_limit_pct`):** `oxygen_factor = 0.0`, `burn_rate_mm_s = 0.0`, `flammability_score <= 15`, `risk_label = "Safe (Extinguished Below LOI)"`.
   - **Quiescent `0g` (`gravity_g == 0.0` and `airflow_cm_s < 1.0`):** `flame_geometry = "spherical"`, `flame_color_hex = "#3B82F6"` (diffusion blue flame ball).
   - **Ventilated `0g` or Partial Gravity (`airflow_cm_s >= 1.0` or `gravity_g > 0.0`):** `flame_geometry = "elongated"`, `flame_color_hex = "#F97316"` (radiative soot amber/orange), scaling `burn_rate_mm_s` and `co_ppm` from `BASS-II` forced-flow data.
3. **SI Code Header:** Add `# SI-assisted: generated with <Model>, reviewed and edited by <Team Member>` at the top of AI-assisted backend files.

## 4. Standard Endpoints & Optional Bonus ML/PyTorch
- `GET /api/health` -> `{ "status": "ok" }`
- `GET /api/experiments` -> Returns cleaned English `BASS-II` test records.
- `POST /api/simulate` -> Returns the validated `contracts/simulation_schema.json` payload.
- **Optional Bonus (Only after 80/20 MVP is complete):** Scikit-Learn/XGBoost feature importance or PyTorch PINN validation curves (`>90%` accuracy / loss plot) modeled on `BASS-II`.
