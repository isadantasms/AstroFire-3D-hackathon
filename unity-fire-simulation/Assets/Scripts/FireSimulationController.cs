// SI-assisted: generated with Codex; pending human review.
using System;
using UnityEngine;

namespace FireSimulation
{
    [DisallowMultipleComponent]
    public sealed class FireSimulationController : MonoBehaviour
    {
        public FirePayload payload = new FirePayload();
        public TextAsset scenarioFile;
        [Tooltip("Leave disabled to start with the Inspector values saved in this scene.")]
        public bool loadScenarioOnStart;
        [Min(0)] public int scenarioIndex;
        [Tooltip("Local airflow direction; wind speed is read from inputs.airflow_cm_s.")]
        public Vector3 airflowDirection = Vector3.right;
        [Min(.01f)] public float visualScale = 1;
        [Min(.01f)] public float transitionSeconds = .5f;
        [Tooltip("Optional guard using the received telemetry oxygen limit. No threshold is inferred locally.")]
        public bool enforceReceivedOxygenLimit = true;
        public Material flameMaterial;
        public Light flameLight;
        public Transform materialSample;
        public bool showTelemetry = true;
        public float BurnFrontMillimeters { get; private set; }

        ParticleSystem flame;
        Material ownedMaterial;
        float intensity, rate, elongation;
        Color color = new Color(.23f, .51f, .96f);
        readonly Gradient particleGradient = new Gradient();
        readonly GradientColorKey[] colorKeys = new GradientColorKey[2];
        readonly GradientAlphaKey[] alphaKeys = new GradientAlphaKey[3];
        Vector3 sampleInitialScale;
        Vector2 telemetryScroll;
        GUIStyle panelStyle, titleStyle, bodyStyle;

        // Artistic response only: the payload remains the source of combustion results.
        public struct VisualResponse
        {
            public bool burning;
            public float oxygen, rate, stretch, radius, lifetime, emission;
            public Vector3 drift;
        }

        public static VisualResponse Evaluate(FirePayload p, Vector3 airflow, bool enforceLimit)
        {
            var i = p.inputs; var s = p.simulation_3d;
            float limit = enforceLimit && p.telemetry != null ? p.telemetry.oxygen_limit_pct : 0;
            // A continuous oxygen response above the supplied extinction boundary.
            float oxygen = Mathf.Clamp01((i.o2_pct - limit) / Mathf.Max(1, 35 - limit)) * s.oxygen_factor;
            bool burning = s.burn_rate_mm_s > 0 && oxygen > 0 && i.o2_pct > limit;
            float rate = Mathf.Sqrt(Mathf.Min(s.burn_rate_mm_s, 100));
            float gravity = Mathf.Sqrt(Mathf.Min(i.gravity_g, 4));
            float wind = Mathf.Min(i.airflow_cm_s, 100) * .045f;
            Vector3 drift = airflow.normalized * wind + Vector3.up * gravity * 1.4f;
            float stretch = (s.flame_geometry == "elongated" ? 1f : 0f) + Mathf.Min(drift.magnitude, 2);
            return new VisualResponse
            {
                burning = burning, oxygen = burning ? oxygen : 0, rate = rate,
                stretch = stretch, drift = drift,
                radius = (.06f + rate * .09f) * Mathf.Lerp(.6f, 1.4f, oxygen),
                lifetime = .6f + Mathf.Min(rate, 3) * .2f + stretch * .12f,
                emission = burning ? (100 + rate * 220) * Mathf.Sqrt(oxygen) : 0
            };
        }

        void Awake()
        {
            if (materialSample == null)
                materialSample = GameObject.Find("Material sample")?.transform;
            if (materialSample != null) sampleInitialScale = materialSample.localScale;
            var emitter = new GameObject("Flame particles");
            emitter.transform.SetParent(transform, false);
            flame = emitter.AddComponent<ParticleSystem>();
            flame.Stop(true, ParticleSystemStopBehavior.StopEmittingAndClear);
            var main = flame.main;
            main.playOnAwake = false;
            main.simulationSpace = ParticleSystemSimulationSpace.Local;
            main.maxParticles = 1800;
            main.gravityModifier = 0;
            var renderer = emitter.GetComponent<ParticleSystemRenderer>();
            renderer.renderMode = ParticleSystemRenderMode.Billboard;
            if (flameMaterial != null) renderer.sharedMaterial = flameMaterial;
            else
            {
                var shader = Shader.Find("FireSimulation/SoftFlame");
                if (shader == null) { Debug.LogError("Assign a SoftFlame material before building.", this); enabled = false; return; }
                ownedMaterial = new Material(shader);
                renderer.sharedMaterial = ownedMaterial;
            }
            var size = flame.sizeOverLifetime;
            size.enabled = true;
            size.size = new ParticleSystem.MinMaxCurve(1, new AnimationCurve(
                new Keyframe(0, .35f), new Keyframe(.2f, 1), new Keyframe(1, 0)));
            if (loadScenarioOnStart && scenarioFile != null) LoadScenario();
            flame.Play();
        }

        [ContextMenu("Load selected scenario")]
        public void LoadScenario()
        {
            if (scenarioFile == null) return;
            try
            {
                var collection = JsonUtility.FromJson<FireScenarioCollection>(scenarioFile.text);
                if (collection?.scenarios == null || scenarioIndex < 0 || scenarioIndex >= collection.scenarios.Length)
                    throw new ArgumentException("Scenario index is outside the supplied collection.");
                SetPayload(collection.scenarios[scenarioIndex]);
            }
            catch (Exception ex) { Debug.LogWarning("Scenario rejected: " + ex.Message, this); }
        }

        // Unity WebGL SendMessage can call this method with one serialized scenario.
        public void ApplyJson(string json)
        {
            try
            {
                // Require the contract sections: JsonUtility otherwise silently defaults missing data.
                if (string.IsNullOrWhiteSpace(json) || !json.Contains("\"inputs\"") || !json.Contains("\"simulation_3d\""))
                    throw new ArgumentException("Expected one scenario with inputs and simulation_3d sections.");
                SetPayload(JsonUtility.FromJson<FirePayload>(json));
            }
            catch (Exception ex) { Debug.LogWarning("Payload rejected: " + ex.Message, this); }
        }

        public void SetPayload(FirePayload value)
        {
            if (!IsValid(value)) throw new ArgumentException("Invalid geometry, color, or numeric range.");
            payload = value;
            BurnFrontMillimeters = 0;
        }

        static bool Finite(float n) => !float.IsNaN(n) && !float.IsInfinity(n);
        public static bool IsValid(FirePayload p)
        {
            if (p?.inputs == null || p.simulation_3d == null) return false;
            var i = p.inputs; var s = p.simulation_3d;
            return (s.flame_geometry == "spherical" || s.flame_geometry == "elongated")
                && ColorUtility.TryParseHtmlString(s.flame_color_hex, out _)
                && Finite(s.burn_rate_mm_s) && s.burn_rate_mm_s >= 0
                && Finite(s.oxygen_factor) && s.oxygen_factor >= 0 && s.oxygen_factor <= 1
                && Finite(i.gravity_g) && i.gravity_g >= 0 && Finite(i.airflow_cm_s) && i.airflow_cm_s >= 0
                && Finite(i.o2_pct) && i.o2_pct >= 0 && i.o2_pct <= 100
                && Finite(i.thickness_mm) && i.thickness_mm > 0
                && (p.telemetry == null || (Finite(p.telemetry.oxygen_limit_pct) && p.telemetry.oxygen_limit_pct >= 0 && p.telemetry.oxygen_limit_pct <= 100));
        }

        void Update()
        {
            if (flame == null || !IsValid(payload)) return;
            var s = payload.simulation_3d; var i = payload.inputs;
            var response = Evaluate(payload, airflowDirection, enforceReceivedOxygenLimit);
            bool burning = response.burning;
            float t = 1 - Mathf.Exp(-Time.deltaTime / Mathf.Max(.01f, transitionSeconds));
            intensity = Mathf.Lerp(intensity, response.oxygen, t);
            rate = Mathf.Lerp(rate, response.rate, t);
            elongation = Mathf.Lerp(elongation, response.stretch, t);
            ColorUtility.TryParseHtmlString(s.flame_color_hex, out var targetColor);
            color = Color.Lerp(color, targetColor, t);
            float scale = Mathf.Max(.01f, visualScale);
            var main = flame.main;
            main.startLifetime = response.lifetime;
            main.startSpeed = scale * (.08f + rate * .22f);
            main.startSize = scale * (.10f + rate * .16f) * Mathf.Lerp(.6f, 1.4f, intensity);
            main.startColor = new Color(color.r, color.g, color.b, intensity * .7f);
            var emission = flame.emission;
            emission.rateOverTime = response.emission;
            var shape = flame.shape;
            shape.enabled = true;
            shape.shapeType = ParticleSystemShapeType.Sphere;
            shape.radius = scale * response.radius;
            // Geometry now changes the emitter even with zero wind and gravity.
            shape.scale = new Vector3(1, 1 + elongation * .8f, 1);
            Vector3 axis = response.drift.sqrMagnitude > .0001f ? response.drift.normalized : Vector3.up;
            shape.rotation = Quaternion.FromToRotation(Vector3.up, axis).eulerAngles;
            var velocity = flame.velocityOverLifetime;
            velocity.enabled = true;
            velocity.space = ParticleSystemSimulationSpace.Local;
            // Artistic advection/buoyancy, not a CFD model. Keep all axis curves in constant mode.
            // Wind and gravity always apply, including when the received geometry is spherical.
            Vector3 drift = response.drift * scale;
            velocity.x = drift.x; velocity.y = drift.y; velocity.z = drift.z;
            var fade = flame.colorOverLifetime;
            fade.enabled = true;
            colorKeys[0] = new GradientColorKey(Color.white, 0);
            colorKeys[1] = new GradientColorKey(color, 1);
            alphaKeys[0] = new GradientAlphaKey(0, 0);
            alphaKeys[1] = new GradientAlphaKey(1, .15f);
            alphaKeys[2] = new GradientAlphaKey(0, 1);
            particleGradient.SetKeys(colorKeys, alphaKeys);
            fade.color = particleGradient;
            if (flameLight != null) { flameLight.color = color; flameLight.intensity = intensity * (1 + rate); }
            if (materialSample != null)
            {
                // Display magnification: 5 mm corresponds to the original sample thickness.
                var sampleScale = sampleInitialScale;
                sampleScale.y *= Mathf.Clamp(i.thickness_mm / 5, .02f, 20);
                materialSample.localScale = sampleScale;
            }
            if (burning) BurnFrontMillimeters += s.burn_rate_mm_s * Time.deltaTime;
        }

        void OnGUI()
        {
            if (!showTelemetry || payload == null) return;
            if (panelStyle == null)
            {
                panelStyle = new GUIStyle(GUI.skin.box) { padding = new RectOffset(18, 18, 18, 18) };
                titleStyle = new GUIStyle(GUI.skin.label) { fontSize = 20, fontStyle = FontStyle.Bold, wordWrap = true };
                titleStyle.normal.textColor = new Color(.35f, .88f, 1);
                bodyStyle = new GUIStyle(GUI.skin.label) { fontSize = 12, wordWrap = true, richText = false };
                bodyStyle.normal.textColor = new Color(.78f, .85f, .92f);
            }
            float width = Mathf.Min(360, Screen.width * .32f);
            var previousColor = GUI.backgroundColor;
            GUI.backgroundColor = new Color(.04f, .09f, .14f, .96f);
            GUILayout.BeginArea(new Rect(16, 16, width - 24, Screen.height - 72), panelStyle);
            GUI.backgroundColor = previousColor;
            GUILayout.Label("COMBUSTION LAB", titleStyle);
            GUILayout.Label("LIVE EXPERIMENT / VISUAL PREVIEW", bodyStyle);
            GUILayout.Space(14);
            telemetryScroll = GUILayout.BeginScrollView(telemetryScroll);
            // Apply readable wrapping to the existing payload readout.
            var oldLabel = GUI.skin.label;
            GUI.skin.label = bodyStyle;
            GUILayout.Label(payload.scenario_id + " | " + payload.grounding_status);
            if (!IsValid(payload)) GUILayout.Label("Invalid payload: check geometry, color and numeric ranges.");
            var i = payload.inputs;
            if (i != null)
            {
                GUILayout.Label(i.material_name + " | " + i.material_id);
                GUILayout.Label(i.environment_label);
                GUILayout.Label($"Thickness {i.thickness_mm:0.##} mm | Gravity {i.gravity_g:0.##} g");
                GUILayout.Label($"O2 {i.o2_pct:0.##}% | Airflow {i.airflow_cm_s:0.##} cm/s");
            }
            var telemetry = payload.telemetry;
            if (telemetry != null)
            {
                GUILayout.Label($"Risk {telemetry.flammability_score}/100 | {telemetry.risk_label}");
                GUILayout.Label($"CO {telemetry.co_ppm:0.##} ppm | CO2 {telemetry.co2_pct:0.##}% | O2 limit {telemetry.oxygen_limit_pct:0.##}%");
            }
            GUILayout.Label($"Burn front (integrated input): {BurnFrontMillimeters:0.##} mm");
            if (payload.safety_copilot != null)
            {
                GUILayout.Label(payload.safety_copilot.diagnosis);
                GUILayout.Label(payload.safety_copilot.suppression_action);
                GUILayout.Label(payload.safety_copilot.scientific_limitations);
                GUILayout.Label(payload.safety_copilot.terrestrial_spinoff);
            }
            if (payload.nasa_citations != null)
                foreach (var citation in payload.nasa_citations)
                    if (citation != null) GUILayout.Label(citation.id + " | " + citation.title + "\n" + citation.url + "\n" + citation.finding);
            GUI.skin.label = oldLabel;
            GUILayout.EndScrollView();
            GUILayout.EndArea();
            GUI.Label(new Rect(width + 16, Screen.height - 40, Screen.width - width - 24, 28),
                "RMB  ORBIT     MMB  PAN     WHEEL  ZOOM     F  RESET", bodyStyle);
        }

        void OnDestroy() { if (ownedMaterial != null) Destroy(ownedMaterial); }
    }
}
