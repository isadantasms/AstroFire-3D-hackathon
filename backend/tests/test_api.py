# SI-assisted: generated with Gemini, reviewed and edited by Elias, Pina & Celina
# Source: NASA PSI, BASS-II (PSI-25), DOI 10.60555/4qc4-de67, CC0-1.0
# Reference: Olson et al., NASA/TM-20210011385 (2021)
"""
Automated contract and physics verification suite for [PROJECT_NAME] backend.
Verifies 1:1 compliance with contracts/simulation_schema.json and NASA/TM-20210011385 boundary rules.
"""
import json
import pathlib
from backend.app.main import (
    get_experiments,
    get_health,
    get_investigations,
    get_materials,
    get_model_metrics,
    get_presets,
    post_simulate,
)
from backend.app.schemas import SimulationRequest

SCHEMA_PATH = pathlib.Path(__file__).resolve().parent.parent.parent / "contracts" / "simulation_schema.json"


def validate_against_contract_keys(payload: dict) -> None:
    schema = json.loads(SCHEMA_PATH.read_text(encoding="utf-8"))
    assert set(schema["required"]).issubset(payload.keys())
    assert set(payload.keys()).issubset(schema["properties"].keys())
    assert set(payload["inputs"].keys()) == set(schema["properties"]["inputs"]["required"])
    assert set(payload["simulation_3d"].keys()) == set(schema["properties"]["simulation_3d"]["required"])
    assert set(payload["telemetry"].keys()) == set(schema["properties"]["telemetry"]["required"])
    assert set(payload["safety_copilot"].keys()) == set(schema["properties"]["safety_copilot"]["required"])
    if payload.get("suppression_estimate") is not None:
        assert set(payload["suppression_estimate"].keys()) == set(schema["properties"]["suppression_estimate"]["required"])


def test_health_and_experiments() -> None:
    assert get_health() == {"status": "ok"}
    exps = get_experiments(material_id=None, pi_group=None)
    assert exps["count"] >= 70
    mats = get_materials()
    assert mats["count"] == 7


def test_quiescent_0g_spherical_blue_flame() -> None:
    res = post_simulate(
        SimulationRequest(
            material_id="pmma_clear_slab",
            gravity_g=0.0,
            o2_pct=21.0,
            airflow_cm_s=0.4,
        )
    ).model_dump()
    validate_against_contract_keys(res)
    assert res["simulation_3d"]["flame_geometry"] == "spherical"
    assert res["simulation_3d"]["flame_color_hex"] == "#3B82F6"
    assert res["simulation_3d"]["burn_rate_mm_s"] > 0.0
    assert res["simulation_3d"]["oxygen_factor"] > 0.0


def test_lunar_ventilated_elongated_orange_flame() -> None:
    res = post_simulate(
        SimulationRequest(
            material_id="cotton_fiberglass_sibal",
            gravity_g=0.16,
            o2_pct=30.0,
            airflow_cm_s=15.0,
        )
    ).model_dump()
    validate_against_contract_keys(res)
    assert res["grounding_status"] == "interpolated_from_ntrs"
    assert res["simulation_3d"]["flame_geometry"] == "elongated"
    assert res["simulation_3d"]["flame_color_hex"] == "#F97316"
    assert res["simulation_3d"]["burn_rate_mm_s"] > 1.0


def test_hypoxia_extinction_below_loi() -> None:
    res = post_simulate(
        SimulationRequest(
            material_id="nomex_iii_fabric",
            gravity_g=0.0,
            o2_pct=21.0,
            airflow_cm_s=9.5,
        )
    ).model_dump()
    validate_against_contract_keys(res)
    assert res["simulation_3d"]["oxygen_factor"] == 0.0
    assert res["simulation_3d"]["burn_rate_mm_s"] == 0.0
    assert res["telemetry"]["flammability_score"] <= 15
    assert res["telemetry"]["risk_label"] == "Safe (Extinguished Below LOI)"


def test_direct_empirical_bass2_match() -> None:
    res = post_simulate(SimulationRequest(test_id="BASS2-M16-s1")).model_dump()
    validate_against_contract_keys(res)
    assert res["grounding_status"] == "empirical_bass2"
    assert res["simulation_3d"]["burn_rate_mm_s"] == 0.144


def test_pinn_model_metrics() -> None:
    metrics = get_model_metrics()
    assert metrics["grounding_sources"]["psi_dataset"] == "BASS-II (PSI-25)"
    assert metrics["classification_metrics"]["accuracy_pct"] >= 90.0
    assert metrics["regression_metrics"]["r2_score"] >= 0.90
    assert len(metrics["feature_importance"]) == 5
    assert len(metrics["pinn_loss_curve"]) >= 20


def test_presets_and_investigations() -> None:
    presets_payload = get_presets()
    assert presets_payload["count"] == 5
    for preset in presets_payload["presets"]:
        validate_against_contract_keys(preset["simulation"])

    inv_lunar = get_investigations(target_environment="lunar_base_30o2")
    assert inv_lunar["count"] == 6
    assert inv_lunar["investigations"][0]["investigation_id"] == "SAFFIRE"
    inv_ids = {item["investigation_id"] for item in inv_lunar["investigations"]}
    assert "PSI-10" not in inv_ids
    assert "BASS-II" in inv_ids

    inv_iss = get_investigations(target_environment="iss_space_station")
    assert inv_iss["investigations"][0]["investigation_id"] == "BASS-II"


if __name__ == "__main__":
    test_health_and_experiments()
    test_quiescent_0g_spherical_blue_flame()
    test_lunar_ventilated_elongated_orange_flame()
    test_hypoxia_extinction_below_loi()
    test_direct_empirical_bass2_match()
    test_pinn_model_metrics()
    test_presets_and_investigations()
    print("ALL BACKEND CONTRACT, PHYSICS, PRESETS, INVESTIGATIONS & PINN TESTS PASSED!")

