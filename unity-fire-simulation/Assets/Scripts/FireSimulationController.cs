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
        [Tooltip("Fine visual motion only; payload color, size, emission and combustion response remain authoritative.")]
        [Range(0,1)] public float naturalFlameDetail = 1;
        [Tooltip("Optional guard using the received telemetry oxygen limit. No threshold is inferred locally.")]
        public bool enforceReceivedOxygenLimit = true;
        public Material flameMaterial;
        public Light flameLight;
        public Transform materialSample;
        public MaterialSampleView specimen;
        public float BurnFrontMillimeters { get; private set; }
        public float Suppression { get; private set; }
        public int Revision { get; private set; }
        public bool HasVisibleFire => IsValid(payload) && Evaluate(payload,airflowDirection,enforceReceivedOxygenLimit).burning && Suppression<.999f;
        public bool NaturalFlameActive => ownedMaterial!=null && ownedMaterial.HasProperty("_FlameDetail") && ownedMaterial.GetFloat("_FlameDetail")>.001f;

        public void SetNaturalFlameDetail(float amount)
        {
            naturalFlameDetail=Mathf.Clamp01(amount);
            if(flame!=null) flame.Clear();
        }

        public void SetSuppression(float amount)
        {
            Suppression=Mathf.Clamp01(amount);
            if(Suppression>=1 && flame!=null)
            {
                flame.Stop(false,ParticleSystemStopBehavior.StopEmittingAndClear);
                if(flameLight!=null) flameLight.intensity=0;
                GetComponent<FireSecondaryEffects>()?.Extinguish();
            }
        }

        public void ResetSuppression()
        {
            Suppression=0;
            if(flame!=null && !flame.isPlaying) flame.Play(false);
        }

        ParticleSystem flame;
        ParticleSystemRenderer flameRenderer;
        Material ownedMaterial;
        float intensity, rate, elongation;
        Color color = new Color(.23f, .51f, .96f);
        readonly Gradient particleGradient = new Gradient();
        readonly GradientColorKey[] colorKeys = new GradientColorKey[2];
        readonly GradientAlphaKey[] alphaKeys = new GradientAlphaKey[3];
        Vector3 sampleInitialScale;
        string activeMaterial;

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
            Application.runInBackground = true;
            if (specimen == null) specimen = GetComponent<MaterialSampleView>();
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
            flameRenderer=renderer;
            renderer.renderMode = ParticleSystemRenderMode.Billboard;
            // An instance is essential: this shader/material is also used by stars and rocket exhaust.
            if (flameMaterial != null) ownedMaterial = new Material(flameMaterial);
            else
            {
                var shader = Shader.Find("FireSimulation/SoftFlame");
                if (shader == null) { Debug.LogError("Assign a SoftFlame material before building.", this); enabled = false; return; }
                ownedMaterial = new Material(shader);
            }
            ownedMaterial.name="Experiment flame (runtime)";
            renderer.sharedMaterial=ownedMaterial;
            var noise=flame.noise;
            noise.quality=ParticleSystemNoiseQuality.Medium;
            noise.separateAxes=true;noise.damping=true;
            noise.octaveCount=2;noise.octaveMultiplier=.5f;noise.octaveScale=2;
            noise.positionAmount=.5f;noise.rotationAmount=0;noise.sizeAmount=0;
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
            Revision++;
            ResetSuppression();
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
            bool hasSpecimen = specimen != null && specimen.isActiveAndEnabled && specimen.sampleShader != null;
            if (hasSpecimen)
            {
                specimen.Refresh();
                string id = MaterialSampleView.NormalizeId(i.material_id);
                if (activeMaterial != id)
                {
                    flame.Clear();
                    BurnFrontMillimeters = 0;
                    activeMaterial = id;
                    Revision++;
                    ResetSuppression();
                }
                flame.transform.position = specimen.FlameOrigin;
                if (flameLight != null) flameLight.transform.position = specimen.FlameOrigin;
            }
            var response = Evaluate(payload, airflowDirection, enforceReceivedOxygenLimit);
            response.oxygen*=1-Suppression;
            response.emission*=1-Suppression;
            response.burning &= Suppression<.999f;
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
            if (hasSpecimen && specimen.IsCandle) main.startSizeMultiplier *= .55f;
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
            if (hasSpecimen)
            {
                if (specimen.IsCandle)
                {
                    shape.radius = .018f;
                    shape.scale = Vector3.one;
                }
                else if (s.flame_geometry == "elongated")
                {
                    shape.shapeType = ParticleSystemShapeType.Box;
                    shape.scale = specimen.EmitterSize;
                    shape.rotation = Vector3.zero;
                }
                else
                {
                    // Keep spherical flames centered around the active specimen, not the old cube.
                    shape.radius = Mathf.Min(shape.radius, specimen.EmitterSize.x * .5f);
                }
            }
            var velocity = flame.velocityOverLifetime;
            velocity.enabled = true;
            velocity.space = ParticleSystemSimulationSpace.Local;
            // Artistic advection/buoyancy, not a CFD model. Keep all axis curves in constant mode.
            // Wind and gravity always apply, including when the received geometry is spherical.
            Vector3 drift = response.drift * scale;
            velocity.x = drift.x; velocity.y = drift.y; velocity.z = drift.z;
            // Small, zero-mean eddies soften the motion without replacing the data-driven advection.
            float detail=Mathf.Clamp01(naturalFlameDetail);
            float buoyancy=Mathf.Clamp01(elongation*.45f);
            float turbulence=scale*response.radius*Mathf.Lerp(.10f,.35f,buoyancy)*detail*(1-Suppression);
            var noise=flame.noise;
            noise.enabled=detail>0 && burning;
            noise.strengthX=turbulence;noise.strengthY=turbulence;noise.strengthZ=turbulence;
            noise.frequency=Mathf.Lerp(.65f,1.15f,buoyancy);
            noise.scrollSpeed=Mathf.Lerp(.18f,.65f,buoyancy);
            if(ownedMaterial.HasProperty("_FlameDetail"))
            {
                ownedMaterial.SetFloat("_FlameDetail",detail);
                ownedMaterial.SetFloat("_FlameStretch",buoyancy);
                ownedMaterial.SetFloat("_FlameFlowSpeed",Mathf.Lerp(.35f,1.1f,buoyancy)+Mathf.Min(i.airflow_cm_s,30)*.012f);
                // Additive stacks wash out detail. Alpha composition keeps the new tongues readable.
                if(ownedMaterial.HasProperty("_FlameDstBlend"))
                    ownedMaterial.SetFloat("_FlameDstBlend",(float)(detail>.001f?UnityEngine.Rendering.BlendMode.OneMinusSrcAlpha:UnityEngine.Rendering.BlendMode.One));
                flameRenderer.sortMode=detail>.001f?ParticleSystemSortMode.Distance:ParticleSystemSortMode.None;
            }
            var fade = flame.colorOverLifetime;
            fade.enabled = true;
            colorKeys[0] = new GradientColorKey(Color.white, 0);
            colorKeys[1] = new GradientColorKey(color, 1);
            alphaKeys[0] = new GradientAlphaKey(0, 0);
            alphaKeys[1] = new GradientAlphaKey(1-Suppression, .15f);
            alphaKeys[2] = new GradientAlphaKey(0, 1);
            particleGradient.SetKeys(colorKeys, alphaKeys);
            fade.color = particleGradient;
            if (flameLight != null)
            {
                float flickerDetail=detail*Mathf.Lerp(.25f,1,buoyancy);
                float flicker=1+(Mathf.PerlinNoise(Time.time*7.3f,4.2f)-.5f)*.14f*flickerDetail
                    +(Mathf.PerlinNoise(Time.time*2.7f,9.1f)-.5f)*.06f*flickerDetail;
                flameLight.color=color;flameLight.intensity=intensity*(1+rate)*flicker;
            }
            if (!hasSpecimen && materialSample != null)
            {
                // Display magnification: 5 mm corresponds to the original sample thickness.
                var sampleScale = sampleInitialScale;
                sampleScale.y *= Mathf.Clamp(i.thickness_mm / 5, .02f, 20);
                materialSample.localScale = sampleScale;
            }
            if (burning) BurnFrontMillimeters += s.burn_rate_mm_s * Time.deltaTime;
        }


        void OnDestroy() { if (ownedMaterial != null) Destroy(ownedMaterial); }
    }
}
