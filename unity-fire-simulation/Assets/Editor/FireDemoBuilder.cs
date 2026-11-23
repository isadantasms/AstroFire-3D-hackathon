// SI-assisted: generated with Codex, reviewed and edited by Esquivel & Elias (21 PyroRangers).
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

        [MenuItem("Fire Simulation/Validate destination mapping")]
        public static void ValidateDestinations()
        {
            Require(LaboratoryEnvironment.FromGravity(0) == LaboratoryEnvironment.Destination.ISS, "ISS mapping");
            Require(LaboratoryEnvironment.FromGravity(.16f) == LaboratoryEnvironment.Destination.Moon, "Moon mapping");
            Require(LaboratoryEnvironment.FromGravity(.38f) == LaboratoryEnvironment.Destination.Mars, "Mars mapping");
            Require(LaboratoryEnvironment.FromGravity(1) == LaboratoryEnvironment.Destination.Earth, "Earth mapping");
            Debug.Log("All four destination gravity presets mapped correctly.");
        }

        [MenuItem("Fire Simulation/Validate cabin camera bounds")]
        public static void ValidateCabinCamera()
        {
            var minimum = new Vector3(-3.1f, .05f, -5.05f);
            var maximum = new Vector3(3.1f, 3.15f, 2.4f);
            foreach (var requestedFocus in new[] { new Vector3(0, .65f, 0), new Vector3(100, -100, 100), new Vector3(-100, 100, -100) })
            {
                var focus = FireOrbitCamera.ClampFocus(requestedFocus, minimum, maximum);
                for (int yaw = 0; yaw < 360; yaw += 5)
                    for (int pitch = -15; pitch <= 85; pitch += 5)
                    {
                        Vector3 direction = Quaternion.Euler(pitch, yaw, 0) * Vector3.back;
                        float distance = FireOrbitCamera.LimitDistance(focus, direction, 12, minimum, maximum);
                        Vector3 camera = focus + direction * distance;
                        for (int axis = 0; axis < 3; axis++)
                            Require(camera[axis] >= minimum[axis] - .0001f && camera[axis] <= maximum[axis] + .0001f,
                                "Camera escaped cabin bounds.");
                        Require(distance >= 0 && distance <= 12, "Invalid camera distance.");
                    }
            }
            Debug.Log("Cabin camera checks passed: full orbit, pitch range, extreme pan and maximum zoom-out.");
        }

        [MenuItem("Fire Simulation/Validate material specimens")]
        public static void ValidateMaterials()
        {
            Require(MaterialSampleView.MaterialIds.Length == 7, "Expected seven materials.");
            for (int i = 0; i < MaterialSampleView.MaterialIds.Length; i++)
                Require(MaterialSampleView.MaterialIndex(MaterialSampleView.MaterialIds[i]) == i, "Material ID mapping failed.");
            Require(MaterialSampleView.MaterialIndex(" japan_wax_candle ") == 6, "Material whitespace normalization failed.");
            Require(MaterialSampleView.MaterialIndex("nomex_ht90_40") == 5, "Legacy Nomex alias failed.");
            Require(MaterialSampleView.MaterialIndex("unknown_material") == -1, "Unknown material fallback failed.");
            var view = Object.FindFirstObjectByType<MaterialSampleView>();
            if (view == null || view.fire?.payload?.inputs == null) throw new System.Exception("Open SampleScene first.");
            var inputs = view.fire.payload.inputs;
            string previousId = inputs.material_id, previousName = inputs.material_name;
            try
            {
                for (int i = 0; i < 7; i++)
                {
                    view.SelectMaterial(i);
                    Require(view.FlameOrigin.y > view.sampleBaseHeight, "Flame origin below specimen.");
                    Require(view.EmitterSize.x > 0 && view.EmitterSize.y > 0 && view.EmitterSize.z > 0, "Invalid emitter dimensions.");
                    Require(view.IsCandle == (i == 6), "Candle wick profile mismatch.");
                }
            }
            finally { inputs.material_id = previousId; inputs.material_name = previousName; view.Refresh(); }
            Debug.Log("Seven specimen mappings, geometry creation and flame anchors validated.");
        }
    }
}
