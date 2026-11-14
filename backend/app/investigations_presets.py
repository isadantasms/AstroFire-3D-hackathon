# SI-assisted: generated with Gemini, reviewed and edited by Pina, Elias & Dantas
# Source: NASA PSI, BASS-II (PSI-25), DOI 10.60555/4qc4-de67, CC0-1.0
# Reference: Olson et al., NASA/TM-20210011385 (2021); Saffire I-VI (NTRS-20170000230, NTRS-20240002981, NTRS-20260001600); SAME (NTRS-20170007283)
"""
Mission Scenario Presets and NASA PSI/NTRS Investigation Ranking & Comparison Engine.

Directly fulfills the core objectives of the 2026 NASA Space Apps Challenge "Flame in Freefall":
  1. Quick-load validated mission presets (GET /api/presets) synchronized 1:1 with contracts/simulation_schema.json.
  2. Multi-investigation ranking, side-by-side comparison, and safety equipment synthesis (GET /api/investigations)
     across open-licensed NASA campaigns (BASS-II, Saffire I-VI, SoFIE, FLEX, SAME, SPICE), strictly excluding PSI-10.
"""
from __future__ import annotations

from typing import Any, Optional

from .physics_engine import run_simulation
from .schemas import SimulationRequest

PRESET_DEFINITIONS: list[dict[str, Any]] = [
    {
        "preset_id": "iss_0g_quiescent_sphere",
        "title": "ISS 0g Quiescent — Spherical Blue Flame Ball",
        "badge": "Measured Regime (0g Diffusion)",
        "summary": "Zero buoyancy and ultra-low airflow (< 1.0 cm/s) create a stationary, soot-free blue diffusion sphere.",
        "request": {
            "material_id": "pmma_clear_slab",
            "thickness_mm": 2.0,
            "gravity_g": 0.0,
            "o2_pct": 21.0,
            "airflow_cm_s": 0.4,
        },
    },
    {
        "preset_id": "iss_0g_ventilated_goldilocks",
        "title": "ISS 0g Ventilated — Goldilocks Flow Acceleration",
        "badge": "Measured — PSI-25 (Test B8)",
        "summary": "Forced cabin ventilation (10 cm/s) feeds O2 to the flame leading edge, stretching a luminous orange plume.",
        "request": {
            "material_id": "pmma_thin_film",
            "thickness_mm": 0.2,
            "gravity_g": 0.0,
            "o2_pct": 21.0,
            "airflow_cm_s": 10.0,
            "test_id": "BASS2-B8",
        },
    },
    {
        "preset_id": "lunar_base_30o2_enriched",
        "title": "Lunar Base (0.16g, 30% O2) — Critical Flashover Bound",
        "badge": "Bounded, not measured (0.16g)",
        "summary": "Exploration atmosphere (30% O2) + Lunar partial buoyancy + cabin HVAC flow triggers rapid radiative spread.",
        "request": {
            "material_id": "cotton_fiberglass_sibal",
            "thickness_mm": 0.3,
            "gravity_g": 0.16,
            "o2_pct": 30.0,
            "airflow_cm_s": 15.0,
        },
    },
    {
        "preset_id": "martian_habitat_038g",
        "title": "Martian Habitat (0.38g, 24% O2) — Partial-Gravity Plume",
        "badge": "Bounded, not measured (0.38g)",
        "summary": "Martian partial gravity (0.38g) induces upward buoyant stretch comparable to moderate forced flow in 0g.",
        "request": {
            "material_id": "pmma_rod",
            "thickness_mm": 6.35,
            "gravity_g": 0.38,
            "o2_pct": 24.0,
            "airflow_cm_s": 6.0,
        },
    },
    {
        "preset_id": "hypoxia_quenched_below_loi",
        "title": "Hypoxic Quench (< LOI) — Self-Extinguished Safe State",
        "badge": "Extinguished Below LOI",
        "summary": "Ambient O2 (14.2%) drops below the Limiting Oxygen Index, quenching combustion and fading out the 3D flame.",
        "request": {
            "material_id": "nomex_iii_fabric",
            "thickness_mm": 0.5,
            "gravity_g": 0.0,
            "o2_pct": 14.2,
            "airflow_cm_s": 2.0,
        },
    },
]


INVESTIGATIONS_CATALOG: list[dict[str, Any]] = [
    {
        "investigation_id": "BASS-II",
        "psi_or_ntrs_id": "PSI-25 / NASA/TM-20210011385",
        "name": "Burning and Suppression of Solids - II (BASS-II)",
        "doi_or_url": "https://doi.org/10.60555/4qc4-de67",
        "ntrs_url": "https://ntrs.nasa.gov/citations/20210011385",
        "license": "CC0-1.0 / US Gov Public Domain",
        "facility": "ISS Microgravity Science Glovebox (MSG) — 7.6 x 7.6 cm Flow Duct",
        "gravity_regime": "Microgravity (0.00g measured on ISS) + 1g ground baseline",
        "data_availability_status": "full_tabular_in_app",
        "empirical_states_in_app": 79,
        "total_campaign_burns": 129,
        "principal_investigators": [
            "S. L. Olson (NASA GRC)",
            "P. V. Ferkul (USRA/NASA GRC)",
            "J. S. T'ien (CWRU)",
            "S. Bhattacharjee (SDSU)",
            "F. J. Miller & I. S. Wichman (SDSU/MSU)",
            "A. C. Fernandez-Pello (UC Berkeley)",
        ],
        "conditions_tested": {
            "fuels": [
                "PMMA flat slabs (1–5 mm)",
                "PMMA thin films (100–400 um)",
                "PMMA clear & black rods (6.35–19 mm)",
                "SIBAL cotton-fiberglass fabric",
                "Nomex III fire-barrier fabric",
                "Japan wax candle",
            ],
            "o2_range_pct": "13.6% – 29.3% O2 (via N2 dilution in MSG)",
            "airflow_range_cm_s": "0.0 – 55.0 cm/s (opposed and concurrent flow)",
            "pressure_atm": "1.0 atm (101.3 kPa)",
            "sensors": [
                "Compound Specific Analyzer - Combustion Products (CSA-CP: O2 %, CO ppm)",
                "Carbon Dioxide Monitor (CDM: CO2 %)",
                "Hot-wire anemometer (airflow cm/s)",
                "High-definition video & 35-mm still radiometric imaging",
            ],
        },
        "key_similarity": "Shares SIBAL cotton-fiberglass and PMMA reference fuels with Saffire and SoFIE under controlled forced-ventilation ducts.",
        "key_difference": "Systematically varied fan flow in fine steps (0–55 cm/s) and N2 dilution across 129 burns to map the exact U-shaped Limiting Oxygen Index (LOI) and radiative quenching boundary.",
        "safety_controls": {
            "prevention": "Replace upward 1g NASA-STD-6001 Test 1 material screening with stagnation blowoff extrapolation to capture low-flow 0g flammability (LOI drops to 13.5%–15.8% O2 in 'Goldilocks' 2–8 cm/s flow).",
            "detection": "Pair CO/CO2 gas stoichiometry sensors (370–550 ppm CO per 1% CO2) with optical UV/IR detectors because quiescent 0g blue flames produce minimal soot.",
            "suppression": "Immediate cabin HVAC ventilation shutoff (< 2 s) induces radiative quenching; maintain 9+ minutes of solid-phase cooldown before restoring airflow to prevent hot-core re-ignition.",
        },
        "base_relevance_by_environment": {
            "iss_space_station": 99,
            "lunar_base_30o2": 95,
            "martian_habitat": 92,
            "spacecraft_cabin_rover": 96,
        },
    },
    {
        "investigation_id": "SAFFIRE",
        "psi_or_ntrs_id": "Saffire I–VI / NTRS-20170000230 & NTRS-20240002981",
        "name": "Spacecraft Fire Safety Demonstration Project (Saffire I–VI)",
        "doi_or_url": "https://ntrs.nasa.gov/citations/20170000230",
        "ntrs_url": "https://ntrs.nasa.gov/citations/20240002981",
        "license": "CC0-1.0 / US Gov Public Domain",
        "facility": "Unmanned Northrop Grumman Cygnus Spacecraft (17–19 m³ free volume after ISS unberthing)",
        "gravity_regime": "Microgravity (0.00g orbital free-flight at realistic vehicle scale)",
        "data_availability_status": "summary_and_ntrs_bounds",
        "empirical_states_in_app": 0,
        "total_campaign_burns": 24,
        "principal_investigators": [
            "G. A. Ruff (NASA GRC)",
            "D. L. Urban (NASA GRC)",
            "C. Fernandez-Pello",
            "J. S. T'ien",
        ],
        "conditions_tested": {
            "fuels": [
                "Meter-scale SIBAL cotton-fiberglass sheets (0.4 x 0.5–1.0 m)",
                "Thick & ribbed PMMA panels (5–10 mm thick, 40 cm wide)",
                "Nomex fabric (7 x 41 cm)",
                "Silicone & cotton fabrics",
            ],
            "o2_range_pct": "21.0% – 34.0% O2 (including Exploration Atmosphere 34% O2 at 8.2–10.2 psi)",
            "airflow_range_cm_s": "3.0 – 30.0 cm/s vehicle duct flow",
            "pressure_atm": "0.56 – 1.0 atm (8.2 – 14.7 psi)",
            "sensors": [
                "Far Field Diagnostic (FFD) multi-zone temperature & CO2 array",
                "Distributed CO, O2, HCl, and HF acid-gas sensors",
                "Oxygen calorimetry heat release rate (1.5 – 10 kW)",
                "Radiometers & dual-view internal cameras",
            ],
        },
        "key_similarity": "Tests the exact same SIBAL cotton-fiberglass and PMMA materials studied in BASS-II under forced ventilation.",
        "key_difference": "Conducted at full meter-scale inside an uncrewed Cygnus spacecraft (up to 10 kW heat release and 34% O2 reduced-pressure exploration atmospheres), demonstrating enclosure volume confinement effects.",
        "safety_controls": {
            "prevention": "Restrict exposed flammable surface area in 30%–34% O2 Lunar/exploration habitats; enforce firebreaks with Nomex barriers.",
            "detection": "Monitor vehicle-wide CO2, CO, and acid gases (HCl/HF) via Far Field Diagnostics; cabin gas toxicity rises faster than bulk cabin pressure or temperature.",
            "suppression": "Automate ECLSS post-fire acid-gas (HCl) scrubbing and ventilation isolation before crew re-entry into affected modules.",
        },
        "base_relevance_by_environment": {
            "iss_space_station": 93,
            "lunar_base_30o2": 99,
            "martian_habitat": 94,
            "spacecraft_cabin_rover": 98,
        },
    },
    {
        "investigation_id": "SOFIE",
        "psi_or_ntrs_id": "SoFIE (Combustion Integrated Rack — ISS)",
        "name": "Solid Fuel Ignition and Extinction (SoFIE — GEL, RTDFS, MIST, SMOLDER,FEANICS)",
        "doi_or_url": "https://psi.nasa.gov/",
        "ntrs_url": "https://ntrs.nasa.gov/citations/20210011385",
        "license": "CC0-1.0 / US Gov Public Domain",
        "facility": "ISS Combustion Integrated Rack (CIR) Flow Tunnel",
        "gravity_regime": "Microgravity (0.00g ISS CIR chamber)",
        "data_availability_status": "summary_and_ntrs_bounds",
        "empirical_states_in_app": 0,
        "total_campaign_burns": 45,
        "principal_investigators": [
            "P. V. Ferkul",
            "S. L. Olson",
            "J. S. T'ien",
            "C. Fernandez-Pello",
        ],
        "conditions_tested": {
            "fuels": [
                "PMMA spheres, flat plates, and cylinders",
                "Thick thermally-soaked polymers with external radiant heating",
            ],
            "o2_range_pct": "15.0% – 40.0% O2",
            "airflow_range_cm_s": "1.0 – 50.0 cm/s with variable ambient pressure",
            "pressure_atm": "0.5 – 1.0 atm",
            "sensors": [
                " Narrow-band infrared imaging",
                "Laser diagnostic soot volume fraction",
                "Thermocouple solid-phase arrays",
            ],
        },
        "key_similarity": "Direct successor to BASS-II investigating PMMA solid fuels under opposed/concurrent low-velocity flow.",
        "key_difference": "Adds variable chamber pressure and external radiant heat flux inside the CIR to simulate Lunar/Martian exploration cabin atmospheres directly.",
        "safety_controls": {
            "prevention": "Account for external radiative preheating from adjacent avionics racks when certifying thick polymers.",
            "detection": "Infrared thermal imaging of solid surface preheating prior to visible flaming ignition.",
            "suppression": "Eliminate external heat source (de-energize electrical bus) simultaneously with airflow cut.",
        },
        "base_relevance_by_environment": {
            "iss_space_station": 90,
            "lunar_base_30o2": 96,
            "martian_habitat": 95,
            "spacecraft_cabin_rover": 91,
        },
    },
    {
        "investigation_id": "SAME",
        "psi_or_ntrs_id": "SAME / NTRS-20170007283",
        "name": "Smoke Aerosol Measurement Experiment (SAME)",
        "doi_or_url": "https://ntrs.nasa.gov/citations/20170007283",
        "ntrs_url": "https://ntrs.nasa.gov/citations/20170007283",
        "license": "CC0-1.0 / US Gov Public Domain",
        "facility": "ISS Microgravity Science Glovebox (MSG)",
        "gravity_regime": "Microgravity (0.00g non-flaming pyrolysis & aerosol transport)",
        "data_availability_status": "summary_and_ntrs_bounds",
        "empirical_states_in_app": 0,
        "total_campaign_burns": 36,
        "principal_investigators": [
            "D. L. Urban (NASA GRC)",
            "Z. G. Yuan",
            "G. A. Ruff",
            "T. Cleary (NIST)",
        ],
        "conditions_tested": {
            "fuels": [
                "Kapton wiring insulation",
                "Teflon",
                "Silicone",
                "Cellulose paper / cotton",
                "Lamp wick",
            ],
            "o2_range_pct": "21.0% O2 (cabin air)",
            "airflow_range_cm_s": "1.0 – 10.0 cm/s duct transport",
            "pressure_atm": "1.0 atm",
            "sensors": [
                "Ionization smoke detector (space Shuttle heritage)",
                "Photoelectric laser-scattering detector (ISS heritage)",
                "Thermal precipitator (TEM particle morphology)",
                "DustTrak & P-Trak aerosol mass/number monitors",
            ],
        },
        "key_similarity": "Operated inside the ISS MSG to protect spacecraft cabins from early electrical and polymer fire hazards.",
        "key_difference": "Focused specifically on smoke aerosol particle size distributions from overheating/smoldering spacecraft materials rather than open flame spread.",
        "safety_controls": {
            "prevention": "Derate electrical wire currents in 0g because absence of buoyant cooling increases insulation overheating.",
            "detection": "Calibrate dual-wavelength optical detectors for larger microgravity aerosol agglomerates (longer residence time near source in 0g).",
            "suppression": "Cut electrical circuit power during the pyrolysis/smoldering stage before flaming ignition occurs.",
        },
        "base_relevance_by_environment": {
            "iss_space_station": 94,
            "lunar_base_30o2": 88,
            "martian_habitat": 89,
            "spacecraft_cabin_rover": 93,
        },
    },
    {
        "investigation_id": "FLEX",
        "psi_or_ntrs_id": "FLEX (CIR — ISS)",
        "name": "Flame Extinguishment Experiment (FLEX & FLEX-2)",
        "doi_or_url": "https://psi.nasa.gov/",
        "ntrs_url": "https://ntrs.nasa.gov/citations/20170007283",
        "license": "CC0-1.0 / US Gov Public Domain",
        "facility": "ISS Combustion Integrated Rack (CIR) — Multi-User Droplet Combustion Apparatus",
        "gravity_regime": "Microgravity (0.00g quiescent spherical droplet combustion)",
        "data_availability_status": "summary_and_ntrs_bounds",
        "empirical_states_in_app": 0,
        "total_campaign_burns": 200,
        "principal_investigators": [
            "F. A. Williams (UC San Diego)",
            "C. T. Avedisian (Cornell)",
            "M. Y. Choi",
            "V. Nayagam",
        ],
        "conditions_tested": {
            "fuels": [
                "Heptane droplets",
                "Methanol droplets",
                "Decane & biobutanol liquid fuels",
            ],
            "o2_range_pct": "15.0% – 30.0% O2 with N2/CO2/He inerting diluents",
            "airflow_range_cm_s": "0.0 – 5.0 cm/s (quiescent & ultra-slow convective)",
            "pressure_atm": "0.7 – 3.0 atm",
            "sensors": [
                "Backlit high-speed droplet diameter camera",
                "UV (OH*) & visible chemiluminescence intensifiers",
                "Wide-band radiometers",
            ],
        },
        "key_similarity": "Establishes the fundamental physics of spherical blue diffusion flames and radiative extinction in 0g.",
        "key_difference": "Uses liquid fuel droplets rather than solid polymers, discovering low-temperature 'cool flames' that continue reacting invisibly after visible radiative extinction.",
        "safety_controls": {
            "prevention": "Account for invisible cool-flame re-ignition pathways in hydrocarbon vapor leaks.",
            "detection": "Require UV (OH*) / mid-IR spectroscopy to detect dim spherical diffusion flames.",
            "suppression": "Require higher inert gas (CO2/N2/water mist) concentrations in 0g than in 1g due to spherical diffusion geometry.",
        },
        "base_relevance_by_environment": {
            "iss_space_station": 87,
            "lunar_base_30o2": 82,
            "martian_habitat": 81,
            "spacecraft_cabin_rover": 85,
        },
    },
    {
        "investigation_id": "SPICE",
        "psi_or_ntrs_id": "SPICE (MSG — ISS)",
        "name": "Smoke Point In Co-flow Experiment (SPICE)",
        "doi_or_url": "https://psi.nasa.gov/",
        "ntrs_url": "https://ntrs.nasa.gov/citations/20170007283",
        "license": "CC0-1.0 / US Gov Public Domain",
        "facility": "ISS Microgravity Science Glovebox (MSG)",
        "gravity_regime": "Microgravity (0.00g laminar co-flow jet flames)",
        "data_availability_status": "summary_and_ntrs_bounds",
        "empirical_states_in_app": 0,
        "total_campaign_burns": 98,
        "principal_investigators": [
            "D. L. Urban (NASA GRC)",
            "P. B. Sunderland (Univ. of Maryland)",
            "G. M. Faeth",
        ],
        "conditions_tested": {
            "fuels": [
                "Ethylene, propane, methane, and propylene gas jets",
            ],
            "o2_range_pct": "21.0% O2",
            "airflow_range_cm_s": "5.0 – 50.0 cm/s co-flow",
            "pressure_atm": "1.0 atm",
            "sensors": [
                "High-resolution color CCD soot onset imaging",
                "Radiometric heat loss transducers",
            ],
        },
        "key_similarity": "Quantifies the exact transition from clean blue non-sooting flames to luminous orange radiative soot plumes in the ISS MSG.",
        "key_difference": "Studies gaseous jet smoke points rather than solid surface spread, proving how longer residence time in low-g shifts the soot threshold.",
        "safety_controls": {
            "prevention": "Control ventilation velocity to avoid operating in the heavy-soot radiant heat release regime.",
            "detection": "Switch detector sensitivity profiles between blue soot-free regime (< 1 cm/s) and luminous soot-emitting plumes (>= 1 cm/s).",
            "suppression": "Rapid fuel/flow cutoff before radiant soot shell heats adjacent surfaces.",
        },
        "base_relevance_by_environment": {
            "iss_space_station": 84,
            "lunar_base_30o2": 80,
            "martian_habitat": 80,
            "spacecraft_cabin_rover": 82,
        },
    },
]


def get_presets() -> dict[str, Any]:
    """
    Returns mission presets with pre-validated simulation payloads conforming strictly
    to contracts/simulation_schema.json.
    """
    presets_out = []
    for item in PRESET_DEFINITIONS:
        req = SimulationRequest(**item["request"])
        sim_response = run_simulation(req)
        presets_out.append(
            {
                "preset_id": item["preset_id"],
                "title": item["title"],
                "badge": item["badge"],
                "summary": item["summary"],
                "request": item["request"],
                "simulation": sim_response.model_dump(),
            }
        )
    return {
        "count": len(presets_out),
        "presets": presets_out,
    }


def get_investigations(target_environment: Optional[str] = None) -> dict[str, Any]:
    """
    Ranks and compares NASA PSI & NTRS microgravity combustion investigations for a target
    mission habitat (iss_space_station, lunar_base_30o2, martian_habitat, spacecraft_cabin_rover).
    Strictly excludes PSI-10 per NASA open-license compliance rules.
    """
    env_key = (target_environment or "lunar_base_30o2").strip().lower()
    valid_envs = {
        "iss_space_station": "ISS / Orbital Space Station (0.00g, 21% O2, 14.7 psi)",
        "lunar_base_30o2": "Lunar Surface Habitat / Artemis Moon Base (0.16g, 30–34% O2, 8.2–10.2 psi)",
        "martian_habitat": "Martian Surface Habitat (0.38g, 21–24% O2, Partial-Gravity Convection)",
        "spacecraft_cabin_rover": "Crew Spacecraft Cabin & Pressurized Rover (0.00g–0.38g Confined Volume)",
    }
    if env_key not in valid_envs:
        env_key = "lunar_base_30o2"

    ranked = []
    for inv in INVESTIGATIONS_CATALOG:
        score = int(inv["base_relevance_by_environment"].get(env_key, 85))
        entry = dict(inv)
        entry["relevance_score"] = score
        entry["target_environment"] = env_key
        ranked.append(entry)

    ranked.sort(key=lambda r: r["relevance_score"], reverse=True)
    for idx, item in enumerate(ranked, start=1):
        item["rank"] = idx

    return {
        "target_environment": env_key,
        "target_environment_label": valid_envs[env_key],
        "available_environments": valid_envs,
        "compliance_notice": (
            "All listed investigations are open-licensed (CC0-1.0 / US Government Public Domain). "
            "Investigation PSI-10 (ACME/Flame Design) is strictly excluded due to missing open license in NASA PSI. "
            "Not endorsed by NASA."
        ),
        "partial_gravity_scientific_boundary": (
            "No direct partial-gravity (0.16g Lunar or 0.38g Martian) combustion datasets exist in NASA PSI today "
            "(future LUCI and FM2 campaigns will address this gap). Lunar and Martian scenarios in this console are "
            "explicitly presented as bounded physical interpolations between 0g forced-flow (BASS-II / Saffire) and 1g baselines."
        ),
        "count": len(ranked),
        "investigations": ranked,
        "cross_investigation_synthesis": {
            "core_similarities": (
                "BASS-II, Saffire, and SoFIE share standardized spacecraft reference fuels (PMMA cast acrylic, "
                "SIBAL cotton-fiberglass fabric, and Nomex fire barriers) and demonstrate that low-velocity forced "
                "ventilation (2–15 cm/s) makes materials burn at lower O2 concentrations in microgravity than in 1g."
            ),
            "core_differences": (
                "BASS-II maps small-sample (cm-scale) extinction boundaries across 129 burns in the ISS MSG; "
                "Saffire I–VI scales up to meter-sized samples and 34% O2 exploration atmospheres inside uncrewed "
                "Cygnus vehicles; SAME characterizes pre-ignition smoke aerosol morphology; FLEX and SPICE isolate "
                "droplet cool flames and gas-jet soot thresholds."
            ),
            "terrestrial_applications": (
                "1) High-sensitivity optical/multi-criteria smoke detectors for cleanrooms, aircraft cabins, and EV battery bays; "
                "2) Automated HVAC fire-damper interlocks that starve compartment fires of convective oxygen; "
                "3) Normobaric hypoxic fire prevention (14–15% O2 nitrogen dilution) for server data centers and museums."
            ),
        },
    }
