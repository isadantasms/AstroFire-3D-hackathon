// SI-assisted: generated with Codex, reviewed and edited by Esquivel & Elias (21 PyroRangers).
using System;
using UnityEngine;

namespace FireSimulation
{
    [Serializable] public class FireInputs
    {
        public string material_id, material_name, environment_label;
        [Min(0)] public float thickness_mm = 5;
        [Range(0, 2)] public float gravity_g;
        [Range(0, 100)] public float o2_pct = 21;
        [Min(0)] public float airflow_cm_s = .5f;
    }

    [Serializable] public class FlameSettings
    {
        [Tooltip("spherical or elongated, as provided by the backend")]
        public string flame_geometry = "spherical";
        [Min(0)] public float burn_rate_mm_s = .45f;
        public string flame_color_hex = "#3B82F6";
        [Range(0, 1)] public float oxygen_factor = .62f;
    }

    [Serializable] public class FireTelemetry
    {
        public int flammability_score;
        public string risk_label;
        public float oxygen_limit_pct, co_ppm, co2_pct;
    }

    [Serializable] public class FireAdvice
    {
        public string diagnosis, suppression_action, terrestrial_spinoff, scientific_limitations;
    }

    [Serializable] public class FireCitation { public string id, title, url, finding; }

    [Serializable] public class FirePayload
    {
        public string scenario_id = "Inspector preview", grounding_status;
        public FireInputs inputs = new FireInputs();
        public FlameSettings simulation_3d = new FlameSettings();
        public FireTelemetry telemetry = new FireTelemetry();
        public FireAdvice safety_copilot;
        public FireCitation[] nasa_citations;
    }

    [Serializable] public class FireScenarioCollection
    {
        public string project, schema_ref;
        public FirePayload[] scenarios;
    }
}
