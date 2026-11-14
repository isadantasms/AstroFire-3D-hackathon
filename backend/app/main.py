# SI-assisted: generated with Gemini, reviewed and edited by Elias, Pina & Celina
# Source: NASA PSI, BASS-II (PSI-25), DOI 10.60555/4qc4-de67, CC0-1.0
# Reference: Olson et al., NASA/TM-20210011385 (2021)
"""
FastAPI entrypoint for [PROJECT_NAME] (NASA Space Apps Challenge 2026 - Flame in Freefall).
Exposes deterministic < 5ms endpoints synchronized strictly with contracts/simulation_schema.json.
Includes a zero-dependency stdlib HTTP server fallback if FastAPI/Uvicorn is not yet installed.
"""
import json
from http.server import BaseHTTPRequestHandler, HTTPServer
from typing import Optional
from urllib.parse import parse_qs, urlparse

from .ml_pipeline import METRICS_OUTPUT_PATH, run_training_pipeline
from .physics_engine import EMPIRICAL_CACHE, MATERIAL_CATALOG, run_simulation
from .schemas import SimulationContractResponse, SimulationRequest

try:
    from fastapi import FastAPI, Query
    from fastapi.middleware.cors import CORSMiddleware

    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


def get_health() -> dict[str, str]:
    return {"status": "ok"}


def get_materials() -> dict[str, object]:
    return {
        "count": len(MATERIAL_CATALOG),
        "materials": list(MATERIAL_CATALOG.values()),
    }


def get_experiments(
    material_id: Optional[str] = None,
    pi_group: Optional[str] = None,
) -> dict[str, object]:
    records = EMPIRICAL_CACHE
    if material_id:
        records = [r for r in records if r["material_id"] == material_id]
    if pi_group:
        records = [r for r in records if pi_group.lower() in r["pi_group"].lower()]
    return {
        "source_doi": "10.60555/4qc4-de67",
        "source_ntrs": "NASA/TM-20210011385",
        "license": "CC0-1.0",
        "count": len(records),
        "experiments": records,
    }


def post_simulate(request: SimulationRequest) -> SimulationContractResponse:
    return run_simulation(request)


def get_model_metrics() -> dict[str, object]:
    if METRICS_OUTPUT_PATH.exists():
        return json.loads(METRICS_OUTPUT_PATH.read_text(encoding="utf-8"))
    return run_training_pipeline()


if HAS_FASTAPI:
    app = FastAPI(
        title="[PROJECT_NAME] — Microgravity Combustion & Fire Safety API",
        description=(
            "Deterministic physical-empirical engine grounded on NASA PSI BASS-II (PSI-25, DOI: 10.60555/4qc4-de67) "
            "and NASA/TM-20210011385. Strictly excludes unlicensed dataset PSI-10."
        ),
        version="1.0.0",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/api/health")
    def api_health() -> dict[str, str]:
        return get_health()

    @app.get("/api/materials")
    def api_materials() -> dict[str, object]:
        return get_materials()

    @app.get("/api/experiments")
    def api_experiments(
        material_id: Optional[str] = Query(default=None, description="Filter by material_id"),
        pi_group: Optional[str] = Query(default=None, description="Filter by Principal Investigator group"),
    ) -> dict[str, object]:
        return get_experiments(material_id=material_id, pi_group=pi_group)

    @app.post("/api/simulate", response_model=SimulationContractResponse)
    def api_simulate(request: SimulationRequest) -> SimulationContractResponse:
        return post_simulate(request)

    @app.get("/api/model-metrics")
    def api_model_metrics() -> dict[str, object]:
        return get_model_metrics()


class FallbackHTTPHandler(BaseHTTPRequestHandler):
    def _send_json(self, status_code: int, payload: object) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self) -> None:
        self._send_json(200, {"status": "ok"})

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        qs = parse_qs(parsed.query)
        if parsed.path == "/api/health":
            self._send_json(200, get_health())
        elif parsed.path == "/api/materials":
            self._send_json(200, get_materials())
        elif parsed.path == "/api/experiments":
            mat = qs.get("material_id", [None])[0]
            pi = qs.get("pi_group", [None])[0]
            self._send_json(200, get_experiments(material_id=mat, pi_group=pi))
        elif parsed.path == "/api/model-metrics":
            self._send_json(200, get_model_metrics())
        else:
            self._send_json(404, {"error": "Not found"})

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path == "/api/simulate":
            length = int(self.headers.get("Content-Length", "0"))
            raw = self.rfile.read(length).decode("utf-8") if length > 0 else "{}"
            data = json.loads(raw)
            req = SimulationRequest(**data) if HAS_FASTAPI else SimulationRequest.from_dict(data)
            res = post_simulate(req)
            self._send_json(200, res.model_dump())
        else:
            self._send_json(404, {"error": "Not found"})


if __name__ == "__main__":
    server = HTTPServer(("0.0.0.0", 8000), FallbackHTTPHandler)
    print("[PROJECT_NAME] API listening on http://0.0.0.0:8000")
    server.serve_forever()
