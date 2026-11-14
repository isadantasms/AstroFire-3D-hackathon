---
name: frontend-dashboard
description: Govern the 3-column Aerospace Telemetry Console UI (DESIGN.md), BASS-II ranking table, scientific grounding badges, clickable NASA PSI/NTRS citations, and Playwright verification. Activate when editing frontend/**.
---

# Frontend 3-Column Aerospace Telemetry Console Skill

## 1. Scope & Activation Triggers
Activate when creating or modifying `frontend/**` components, state hooks, styles, or running Playwright UI verification. Always read and enforce `./DESIGN.md` alongside this skill.

## 2. 80/20 Dashboard Layout (Single Screen, 3 Columns)
1. **Left Column (Mission Parameters & Presets):**
   - Quick scenario buttons + controls for Material (`BASS-II`), Gravity (`ISS 0g`, `Moon 0.16g`, `Mars 0.38g`), `O2 %`, and `Airflow (cm/s)`.
2. **Center Column (3D Viewport + BASS-II Empirical Table):**
   - Embedded Three.js Microgravity Chamber on top.
   - Interactive `BASS-II` experimental matrix below: clicking any real NASA test row loads its empirical parameters directly into the simulator.
3. **Right Column (Telemetry, Grounding & Auditable NASA Citations):**
   - **Scientific Grounding Badge (`grounding_status`):** Clearly display whether the active view is `"EMPIRICAL NASA BASS-II DATA"` (`empirical_bass2`) or `"BOUNDED NTRS INTERPOLATION"` (`interpolated_from_ntrs`), along with `safety_copilot.scientific_limitations`.
   - **Numeric Readouts:** Flammability Score (`flammability_score` `0–100`) with multimodal alert badge (`Safe`, `Moderate Alert`, `High Risk`, `Critical Flashover Risk`), Minimum Oxygen Limit (`oxygen_limit_pct`), Burn Rate (`burn_rate_mm_s`), and CO (`co_ppm`) formatted with `tabular-nums font-mono`.
   - **Actionable Protocol & Citations:** Display `suppression_action`, `terrestrial_spinoff`, and clickable cards (`nasa_citations`) linking directly to NASA PSI (`DOI: 10.60555/4qc4-de67`) and NTRS (`20210011385`, `20170001815`).

## 3. Engineering & Visual Verification Rules
1. **Strict Contract Binding:** Consume `contracts/simulation_schema.json` with zero ad-hoc fields. Provide resilient local fallback if the backend API is unreachable.
2. **100% English UI & SI Attribution:** All UI strings, tooltips, and error states must be in **English (EN)**. Add `// SI-assisted: generated with <Model>, reviewed and edited by <Name>` at the top of AI-assisted files, and record any new icon/font in `assets/CREDITS.md`.
3. **Playwright Verification:** Verify at `1440x900` and `1280x720` that the 3-column console renders with zero console errors, aligned `tabular-nums`, and working scenario transitions.
