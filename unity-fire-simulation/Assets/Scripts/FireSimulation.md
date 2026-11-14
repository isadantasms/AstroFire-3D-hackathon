# Fire controls

SI-assisted: generated with Codex; pending human review.

Open SampleScene and select FireSimulation during Play. Edit Payload in the Inspector. Changes stay in this scene and affect the same particle system; new particles adopt color/size changes while existing particles finish their lifetime.

| Input | Response |
| --- | --- |
| gravity_g | Upward drift and stretching, including spherical geometry |
| airflow_cm_s | Directional drift and stretching along Airflow Direction, including spherical geometry |
| flame_geometry | Spherical or stretched emitter, even at zero gravity and zero airflow |
| burn_rate_mm_s | Particle speed, radius, emission, lifetime, glow, and integrated burn-front distance; zero extinguishes |
| o2_pct | Continuous flame density, opacity and size response above the received oxygen limit |
| oxygen_factor | Multiplier for flame intensity; zero extinguishes |
| flame_color_hex | Particle and glow color |
| thickness_mm | Sample mesh thickness; display magnification maps 5 mm to its original height |
| oxygen_limit_pct | Extinction boundary when Enforce Received Oxygen Limit is enabled |
| flammability_score, risk_label, co_ppm, co2_pct | Telemetry overlay; these are reported outcomes, not additional combustion forces |
| Material identity, environment label, advice, citations | Overlay context; material properties must be supplied through backend outputs, not guessed from a name |

These are artistic response curves, not validated fluid dynamics or material combustion predictions. Geometry defines a base shape; actual gravity and wind can deform it. Thickness does not change backend burn rate. The burn-front distance is reported but does not consume the sample mesh. High values are bounded for rendering performance. The panel can be hidden with Show Telemetry.

Use Fire Simulation > Validate visual response to check independent gravity/wind/geometry controls and oxygen/rate extinction in the Unity Editor. The scripts were compiled against Unity 6000.2 libraries; this menu's runtime checks and visual Play Mode review must be run inside Unity.
