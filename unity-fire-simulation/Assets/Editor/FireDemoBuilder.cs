// SI-assisted: generated with Codex; pending human review.
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;

namespace FireSimulation.Editor
{
    public static class FireDemoBuilder
    {
        [MenuItem("Fire Simulation/Open SampleScene")]
        public static void OpenSampleScene()
        {
            if (!EditorSceneManager.SaveCurrentModifiedScenesIfUserWantsTo()) return;
            EditorSceneManager.OpenScene("Assets/Scenes/SampleScene.unity", OpenSceneMode.Single);
            var controller = Object.FindFirstObjectByType<FireSimulationController>();
            if (controller != null) Selection.activeGameObject = controller.gameObject;
        }

        [MenuItem("Fire Simulation/Validate sample payloads")]
        public static void ValidateSamples()
        {
            var file = Object.FindFirstObjectByType<FireSimulationController>()?.scenarioFile;
            if (file == null) throw new System.InvalidOperationException("Sample JSON missing.");
            var data = JsonUtility.FromJson<FireScenarioCollection>(file.text);
            if (data?.scenarios == null || data.scenarios.Length != 3) throw new System.Exception("Expected three sample scenarios.");
            foreach (var scenario in data.scenarios)
                if (!FireSimulationController.IsValid(scenario)) throw new System.Exception("Invalid scenario: " + scenario.scenario_id);
            if (FireSimulationController.IsValid(new FirePayload { simulation_3d = new FlameSettings { oxygen_factor = float.NaN } }))
                throw new System.Exception("Nonfinite input accepted.");
            Debug.Log("All three supplied scenarios passed payload validation; nonfinite input rejected.");
        }

        [MenuItem("Fire Simulation/Validate visual response")]
        public static void ValidateResponse()
        {
            var p = new FirePayload();
            p.inputs.airflow_cm_s = 0;
            var baseline = FireSimulationController.Evaluate(p, Vector3.right, true);
            p.inputs.gravity_g = 1;
            var gravity = FireSimulationController.Evaluate(p, Vector3.right, true);
            Require(gravity.drift.y > baseline.drift.y && gravity.stretch > baseline.stretch, "Gravity must affect spherical flames.");
            p.inputs.gravity_g = 0;
            p.inputs.airflow_cm_s = 15;
            Require(FireSimulationController.Evaluate(p, Vector3.right, true).drift.x > baseline.drift.x, "Airflow must affect spherical flames.");
            p.inputs.airflow_cm_s = 0;
            p.simulation_3d.flame_geometry = "elongated";
            Require(FireSimulationController.Evaluate(p, Vector3.right, true).stretch > baseline.stretch, "Geometry must work without flow.");
            p.simulation_3d.burn_rate_mm_s = 2;
            var fast = FireSimulationController.Evaluate(p, Vector3.right, true);
            Require(fast.radius > baseline.radius && fast.emission > baseline.emission, "Burn rate must affect size and emission.");
            p.inputs.o2_pct = 30;
            Require(FireSimulationController.Evaluate(p, Vector3.right, true).oxygen > fast.oxygen, "Ambient oxygen must have a continuous response.");
            p.simulation_3d.oxygen_factor = 0;
            Require(!FireSimulationController.Evaluate(p, Vector3.right, true).burning, "Zero oxygen factor must extinguish.");
            p.simulation_3d.oxygen_factor = 1;
            p.telemetry.oxygen_limit_pct = 35;
            Require(!FireSimulationController.Evaluate(p, Vector3.right, true).burning, "Received oxygen limit must extinguish.");
            p.telemetry.oxygen_limit_pct = 0;
            p.simulation_3d.burn_rate_mm_s = 0;
            Require(!FireSimulationController.Evaluate(p, Vector3.right, true).burning, "Zero burn rate must extinguish.");
            Debug.Log("Visual response checks passed: gravity, wind, geometry, burn rate, oxygen, and extinction.");
        }

        static void Require(bool condition, string message)
        {
            if (!condition) throw new System.Exception(message);
        }
    }
}
