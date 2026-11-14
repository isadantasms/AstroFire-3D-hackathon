# SI-assisted: generated with Gemini, reviewed and edited by Elias, Pina & Celina
# Source: NASA PSI, BASS-II (PSI-25), DOI 10.60555/4qc4-de67, CC0-1.0
# Reference: Olson et al., NASA/TM-20210011385 (2021)
"""
Schemas synchronized 1:1 with contracts/simulation_schema.json.
Uses Pydantic V2 (extra='forbid') when installed, with a strict zero-dependency Python 3.12
dataclass validator fallback so tests and the local HTTP server run even without pip packages.
"""
from dataclasses import asdict, dataclass, fields
from typing import Any, Literal, Optional

try:
    from pydantic import BaseModel, ConfigDict, Field

    HAS_PYDANTIC = True
except ImportError:
    HAS_PYDANTIC = False


if HAS_PYDANTIC:

    class StrictModel(BaseModel):
        model_config = ConfigDict(extra="forbid")

    class SimulationRequest(StrictModel):
        material_id: str = Field(default="pmma_clear_slab")
        thickness_mm: Optional[float] = Field(default=None, ge=0.01, le=50.0)
        gravity_g: float = Field(default=0.0, ge=0.0, le=1.0)
        o2_pct: float = Field(default=21.0, ge=0.0, le=100.0)
        airflow_cm_s: float = Field(default=5.0, ge=0.0, le=100.0)
        test_id: Optional[str] = Field(default=None)

    class SimulationInputs(StrictModel):
        material_id: str
        material_name: str
        thickness_mm: float = Field(..., ge=0.01, le=50.0)
        gravity_g: float = Field(..., ge=0.0, le=1.0)
        environment_label: str
        o2_pct: float = Field(..., ge=0.0, le=100.0)
        airflow_cm_s: float = Field(..., ge=0.0, le=100.0)

    class Simulation3D(StrictModel):
        flame_geometry: Literal["spherical", "elongated"]
        burn_rate_mm_s: float = Field(..., ge=0.0)
        flame_color_hex: str = Field(..., pattern=r"^#[0-9A-Fa-f]{6}$")
        oxygen_factor: float = Field(..., ge=0.0, le=1.0)

    class Telemetry(StrictModel):
        flammability_score: int = Field(..., ge=0, le=100)
        risk_label: Literal[
            "Safe (Extinguished Below LOI)",
            "Moderate Alert",
            "High Risk",
            "Critical Flashover Risk",
        ]
        oxygen_limit_pct: float = Field(..., ge=0.0, le=100.0)
        co_ppm: float = Field(..., ge=0.0)
        co2_pct: float = Field(..., ge=0.0)

    class SafetyCopilot(StrictModel):
        diagnosis: str
        suppression_action: str
        terrestrial_spinoff: str
        scientific_limitations: str

    class NasaCitation(StrictModel):
        id: str
        title: str
        url: str
        finding: str

    class SuppressionEstimate(StrictModel):
        cooling_efficiency_pct: float = Field(..., ge=0.0, le=100.0)
        estimated_flame_power_kw: float = Field(..., ge=0.0)
        estimated_mist_volume_ml: float = Field(..., ge=0.0)
        tank_capacity_used_pct: float = Field(..., ge=0.0, le=100.0)
        estimated_discharge_seconds: float = Field(..., ge=0.0)
        confined_rack_note: str

    class SimulationContractResponse(StrictModel):
        scenario_id: str
        grounding_status: Literal[
            "empirical_bass2",
            "interpolated_from_ntrs",
            "theoretical_extrapolation_to_verify",
        ]
        inputs: SimulationInputs
        simulation_3d: Simulation3D
        telemetry: Telemetry
        safety_copilot: SafetyCopilot
        nasa_citations: list[NasaCitation] = Field(..., min_length=1)
        suppression_estimate: Optional[SuppressionEstimate] = None

else:

    class StrictDataclassMixin:
        def model_dump(self) -> dict[str, Any]:
            return asdict(self)

        @classmethod
        def from_dict(cls, data: dict[str, Any]):
            allowed = {f.name for f in fields(cls)}
            extra_keys = set(data.keys()) - allowed
            if extra_keys:
                raise ValueError(f"Extra fields forbidden in {cls.__name__}: {extra_keys}")
            return cls(**data)

    @dataclass
    class SimulationRequest(StrictDataclassMixin):
        material_id: str = "pmma_clear_slab"
        thickness_mm: Optional[float] = None
        gravity_g: float = 0.0
        o2_pct: float = 21.0
        airflow_cm_s: float = 5.0
        test_id: Optional[str] = None

    @dataclass
    class SimulationInputs(StrictDataclassMixin):
        material_id: str
        material_name: str
        thickness_mm: float
        gravity_g: float
        environment_label: str
        o2_pct: float
        airflow_cm_s: float

    @dataclass
    class Simulation3D(StrictDataclassMixin):
        flame_geometry: str
        burn_rate_mm_s: float
        flame_color_hex: str
        oxygen_factor: float

    @dataclass
    class Telemetry(StrictDataclassMixin):
        flammability_score: int
        risk_label: str
        oxygen_limit_pct: float
        co_ppm: float
        co2_pct: float

    @dataclass
    class SafetyCopilot(StrictDataclassMixin):
        diagnosis: str
        suppression_action: str
        terrestrial_spinoff: str
        scientific_limitations: str

    @dataclass
    class NasaCitation(StrictDataclassMixin):
        id: str
        title: str
        url: str
        finding: str

    @dataclass
    class SuppressionEstimate(StrictDataclassMixin):
        cooling_efficiency_pct: float
        estimated_flame_power_kw: float
        estimated_mist_volume_ml: float
        tank_capacity_used_pct: float
        estimated_discharge_seconds: float
        confined_rack_note: str

    @dataclass
    class SimulationContractResponse(StrictDataclassMixin):
        scenario_id: str
        grounding_status: str
        inputs: SimulationInputs
        simulation_3d: Simulation3D
        telemetry: Telemetry
        safety_copilot: SafetyCopilot
        nasa_citations: list[NasaCitation]
        suppression_estimate: Optional[SuppressionEstimate] = None
