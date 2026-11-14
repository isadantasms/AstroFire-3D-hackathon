# DESIGN.md — [PROJECT_NAME] Visual System
**Archetype:** NASA ISS Microgravity Science Glovebox (MSG) & Mission Control Telemetry Console.
**Anti-Slop Mandate:** Strictly forbid generic SaaS landing pages, purple/magenta neon gradients, empty decorative glassmorphism, stock photos, or unaligned numbers.

## 1. Color Tokens (Dark Aerospace High-Contrast)
- `--bg-void`: `#070B12` (Main app background & 3D chamber backdrop)
- `--bg-panel`: `#0D131F` (Primary telemetry cards & control modules)
- `--bg-elevated`: `#131C2E` (Hover states, active rows, table headers)
- `--border-subtle`: `#1E293B` (1px structural hairlines — prefer borders over heavy drop shadows)
- `--border-focus`: `#38BDF8` (Active selection / keyboard focus ring)
- `--text-primary`: `#F8FAFC` (Primary headings & live numerical readouts)
- `--text-secondary`: `#94A3B8` (Axis labels, units, NTRS metadata)
- `--text-muted`: `#64748B` (Inactive controls, timestamps)

### Semantic Physical & Risk Tokens
- `--flame-0g-blue`: `#3B82F6` (Diffusion-dominated microgravity spherical flame)
- `--flame-soot-amber`: `#F97316` (Ventilation/partial-gravity radiative soot flame)
- `--risk-nominal`: `#10B981` (Score 0–35: Low flammability / Extinguished below LOI)
- `--risk-warning`: `#F59E0B` (Score 36–70: Moderate alert / Diffusion flame ball)
- `--risk-critical`: `#EF4444` (Score 71–100: High flammability / Ventilation or enriched-O2 spread)

## 2. Typography & Numeric Discipline
- **UI Sans:** `'Inter'`, `-apple-system`, `system-ui`, `sans-serif`
- **Telemetry Mono:** `'JetBrains Mono'`, `'Fira Code'`, `monospace`
- **Mandatory Numeric Rule (`tabular-nums`):** Every numerical readout (`burn_rate_mm_s`, `flammability_score`, `oxygen_limit_pct`, `co_ppm`, `o2_pct`, `airflow_cm_s`) MUST apply `font-variant-numeric: tabular-nums` (`tabular-nums font-mono`) so values never jitter when sliders move.
- **Unit Clarity:** Always pair numbers with explicit physical units (`mm/s`, `% O2`, `cm/s`, `ppm`, `g`).

## 3. 80/20 Layout: Single-Screen 3-Column Console
Fit within `100vh` on desktop (`1280px–1920px`) without vertical page sprawl:
1. **Left Column (280px–320px — Mission Controls):** Scenario Presets + controls for Material, Gravity (`0g ISS`, `0.16g Moon`, `0.38g Mars`), `O2 %`, and `Airflow cm/s`.
2. **Center Column (`1fr` — 3D Chamber + Matrix):** Interactive Three.js Microgravity Chamber (`<canvas>`) on top + collapsible/tabbed `BASS-II` experimental ranking table below.
3. **Right Column (360px–400px — Decision, Grounding & Audit):** Grounding Status Badge (`empirical_bass2` vs. `interpolated_from_ntrs`), Flammability Gauge (`0–100`), Minimum Oxygen Limit (`oxygen_limit_pct`), SI Suppression Protocol (`suppression_action` + `terrestrial_spinoff`), and clickable NASA PSI/NTRS citation cards (`nasa_citations`).
- **WebGL Context Budget:** Maximum **1 active WebGL context** on screen.
