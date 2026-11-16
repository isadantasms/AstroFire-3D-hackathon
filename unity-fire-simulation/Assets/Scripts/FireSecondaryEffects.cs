// SI-assisted: generated with Codex, reviewed and edited by Esquivel & Elias (21 PyroRangers).
using UnityEngine;

namespace FireSimulation
{
    [DefaultExecutionOrder(50)]
    [RequireComponent(typeof(FireSimulationController))]
    public sealed class FireSecondaryEffects : MonoBehaviour
    {
        public FireSimulationController fire;
        public Shader smokeShader;
        public Material sparkMaterial;
        public bool enableSmoke=true,enableSparks=true;
        [Range(0,2)] public float smokeAmount=.75f;
        [Range(0,2)] public float sparkAmount=.65f;
        GameObject generated;
        ParticleSystem smoke,sparks;
        Material smokeMaterial,emberMaterial;
        int revision=-1;
        readonly Gradient sparkGradient=new Gradient();
        readonly GradientColorKey[] sparkColors=new GradientColorKey[3];
        readonly GradientAlphaKey[] sparkAlpha={new GradientAlphaKey(0,0),new GradientAlphaKey(1,.06f),new GradientAlphaKey(.7f,.6f),new GradientAlphaKey(0,1)};
        bool paletteReady,microgravityPalette;
        string sparkColor;

        void OnEnable()
        {
            if(fire==null) fire=GetComponent<FireSimulationController>();
            if(Application.isPlaying) Build();
        }

        void Build()
        {
            Clear();
            if(fire==null || smokeShader==null || sparkMaterial==null) return;
            generated=new GameObject("Smoke and embers (local visual effects)") {hideFlags=HideFlags.HideAndDontSave,layer=gameObject.layer};
            generated.transform.SetParent(transform,false);
            smokeMaterial=new Material(smokeShader) {hideFlags=HideFlags.HideAndDontSave};
            emberMaterial=new Material(sparkMaterial) {hideFlags=HideFlags.HideAndDontSave};
            // A private legacy/additive material: never change the flame, stars or engine material.
            if(emberMaterial.HasProperty("_FlameDetail")) emberMaterial.SetFloat("_FlameDetail",0);
            if(emberMaterial.HasProperty("_FlameDstBlend")) emberMaterial.SetFloat("_FlameDstBlend",(float)UnityEngine.Rendering.BlendMode.One);
            smoke=CreateParticles("Soft rolling smoke",smokeMaterial,200);
            var main=smoke.main;
            main.startLifetime=new ParticleSystem.MinMaxCurve(2,3);
            main.startRotation=new ParticleSystem.MinMaxCurve(0,Mathf.PI*2);
            var size=smoke.sizeOverLifetime;size.enabled=true;
            size.size=new ParticleSystem.MinMaxCurve(1,new AnimationCurve(new Keyframe(0,.25f),new Keyframe(.3f,1),new Keyframe(1,2.1f)));
            var noise=smoke.noise;noise.enabled=true;noise.quality=ParticleSystemNoiseQuality.Medium;
            noise.frequency=.35f;noise.scrollSpeed=.18f;noise.octaveCount=2;noise.positionAmount=.4f;
            noise.rotationAmount=.15f;noise.sizeAmount=0;
            var smokeFade=smoke.colorOverLifetime;smokeFade.enabled=true;
            var smokeGradient=new Gradient();
            smokeGradient.SetKeys(new[] {new GradientColorKey(Color.white,0),new GradientColorKey(new Color(.8f,.85f,.9f),1)},
                new[] {new GradientAlphaKey(0,0),new GradientAlphaKey(.32f,.16f),new GradientAlphaKey(.2f,.65f),new GradientAlphaKey(0,1)});
            smokeFade.color=smokeGradient;

            sparks=CreateParticles("Sparse glowing embers",emberMaterial,96);
            main=sparks.main;main.startLifetime=new ParticleSystem.MinMaxCurve(.45f,1.15f);main.startColor=Color.white;
            var renderer=sparks.GetComponent<ParticleSystemRenderer>();renderer.renderMode=ParticleSystemRenderMode.Stretch;
            renderer.lengthScale=1.8f;renderer.velocityScale=.035f;renderer.cameraVelocityScale=0;
            size=sparks.sizeOverLifetime;size.enabled=true;size.size=new ParticleSystem.MinMaxCurve(1,AnimationCurve.Linear(0,1,1,.1f));
            var sparkFade=sparks.colorOverLifetime;sparkFade.enabled=true;
            UpdateSparkColors(false,null);
        }

        ParticleSystem CreateParticles(string label,Material material,int budget)
        {
            var obj=new GameObject(label) {hideFlags=HideFlags.HideAndDontSave,layer=gameObject.layer};
            obj.transform.SetParent(generated.transform,false);
            var particles=obj.AddComponent<ParticleSystem>();particles.Stop(true,ParticleSystemStopBehavior.StopEmittingAndClear);
            var main=particles.main;main.playOnAwake=false;main.loop=true;main.maxParticles=budget;
            main.simulationSpace=ParticleSystemSimulationSpace.World;main.gravityModifier=0;
            var emission=particles.emission;emission.enabled=false;emission.rateOverTime=0;
            var shape=particles.shape;shape.shapeType=ParticleSystemShapeType.Sphere;shape.radius=.02f;
            var renderer=obj.GetComponent<ParticleSystemRenderer>();renderer.sharedMaterial=material;
            renderer.sortMode=ParticleSystemSortMode.Distance;
            renderer.shadowCastingMode=UnityEngine.Rendering.ShadowCastingMode.Off;renderer.receiveShadows=false;
            return particles;
        }

        void Update()
        {
            if(!Application.isPlaying || fire==null) return;
            if(generated==null) Build();
            if(smoke==null || sparks==null) return;
            if(!fire.isActiveAndEnabled || !FireSimulationController.IsValid(fire.payload) || fire.naturalFlameDetail<=.001f)
            {ClearParticles();return;}
            if(revision!=fire.Revision) {ClearParticles();revision=fire.Revision;}
            var p=fire.payload;
            var response=FireSimulationController.Evaluate(p,fire.airflowDirection,fire.enforceReceivedOxygenLimit);
            bool burning=response.burning && fire.Suppression<.999f;
            float scale=Mathf.Max(.01f,fire.visualScale);
            float detail=Mathf.Clamp01(fire.naturalFlameDetail);
            float activity=Mathf.Clamp01(response.emission/180)*(1-fire.Suppression);
            var specimen=fire.specimen;
            bool hasSpecimen=specimen!=null && specimen.isActiveAndEnabled;
            bool candle=hasSpecimen && specimen.IsCandle;
            Vector3 origin=hasSpecimen?specimen.FlameOrigin:fire.transform.position;
            Vector3 drift=fire.transform.TransformDirection(response.drift)*scale;
            Vector3 axis=drift.sqrMagnitude>.0001f?drift.normalized:Vector3.up;
            smoke.transform.position=origin+axis*(candle?.025f:scale*response.radius*.45f);
            sparks.transform.position=origin;

            var main=smoke.main;
            float puffSize=scale*(.10f+response.radius*1.2f)*(candle?.35f:1);
            main.startSize=new ParticleSystem.MinMaxCurve(puffSize*.75f,puffSize*1.1f);
            main.startSpeed=new ParticleSystem.MinMaxCurve(scale*.018f,scale*.065f);
            float wind=Mathf.Min(p.inputs.airflow_cm_s,100);
            main.startLifetime=new ParticleSystem.MinMaxCurve(2/(1+wind*.015f),3/(1+wind*.015f));
            float oxygenShortfall=1-Mathf.Clamp01(p.inputs.o2_pct/35);
            main.startColor=Color.Lerp(new Color(.49f,.52f,.55f,.34f),new Color(.32f,.35f,.39f,.48f),oxygenShortfall);
            var shape=smoke.shape;
            shape.shapeType=hasSpecimen && !candle && p.simulation_3d.flame_geometry=="elongated"?ParticleSystemShapeType.Box:ParticleSystemShapeType.Sphere;
            shape.scale=shape.shapeType==ParticleSystemShapeType.Box?specimen.EmitterSize:Vector3.one;
            shape.radius=candle?.012f:response.radius*scale*.65f;
            var noise=smoke.noise;noise.strength=scale*.10f;
            SetDrift(smoke,drift*.42f);
            smokeMaterial.SetFloat("_SoftDistance",scale*.07f);

            main=sparks.main;
            main.startSize=new ParticleSystem.MinMaxCurve(scale*.006f,scale*.015f);
            main.startSpeed=new ParticleSystem.MinMaxCurve(scale*.22f,scale*.55f);
            bool microgravity=p.inputs.gravity_g<.01f;
            UpdateSparkColors(microgravity,p.simulation_3d.flame_color_hex);
            shape=sparks.shape;shape.shapeType=microgravity?ParticleSystemShapeType.Sphere:ParticleSystemShapeType.Cone;
            shape.radius=Mathf.Min(response.radius*scale*.5f,.08f*scale);shape.angle=28;
            sparks.transform.rotation=Quaternion.FromToRotation(Vector3.forward,axis);
            SetDrift(sparks,drift*.45f);
            var force=sparks.forceOverLifetime;force.enabled=true;force.space=ParticleSystemSimulationSpace.World;
            Vector3 gravity=fire.transform.TransformDirection(Vector3.down)*Mathf.Min(p.inputs.gravity_g,4)*scale*1.4f;
            force.x=gravity.x;force.y=gravity.y;force.z=gravity.z;
            float pulse=Mathf.SmoothStep(0,1,Mathf.InverseLerp(.42f,.68f,Mathf.PerlinNoise(Time.time*1.7f,3.2f)));
            float smokeRate=burning && enableSmoke && smokeAmount>0?(6+24*activity)*smokeAmount*(candle?.18f:1)*(1-fire.Suppression)*detail:0;
            float sparkRate=burning && enableSparks && !candle && sparkAmount>0?(.6f+activity*5)*sparkAmount*(.3f+pulse*2)*(1-fire.Suppression)*detail:0;
            SetRate(smoke,smokeRate,!enableSmoke || smokeAmount<=0);
            SetRate(sparks,sparkRate,!burning || !enableSparks || candle || sparkAmount<=0);
        }

        void UpdateSparkColors(bool microgravity,string flameHex)
        {
            if(paletteReady && microgravityPalette==microgravity && (!microgravity || sparkColor==flameHex)) return;
            if(microgravity && ColorUtility.TryParseHtmlString(flameHex,out var tint))
            {
                // Follow the supplied flame hue throughout the spark's life, including its fading tail.
                sparkColors[0]=new GradientColorKey(Color.Lerp(tint,Color.white,.20f),0);
                sparkColors[1]=new GradientColorKey(tint,.45f);
                sparkColors[2]=new GradientColorKey(new Color(tint.r*.35f,tint.g*.35f,tint.b*.35f),1);
            }
            else
            {
                sparkColors[0]=new GradientColorKey(new Color(1,.9f,.55f),0);
                sparkColors[1]=new GradientColorKey(new Color(1,.42f,.08f),.45f);
                sparkColors[2]=new GradientColorKey(new Color(.55f,.12f,.02f),1);
            }
            sparkGradient.SetKeys(sparkColors,sparkAlpha);
            var fade=sparks.colorOverLifetime;fade.color=sparkGradient;
            paletteReady=true;microgravityPalette=microgravity;sparkColor=flameHex;
        }

        static void SetDrift(ParticleSystem particles,Vector3 drift)
        {
            var velocity=particles.velocityOverLifetime;velocity.enabled=true;velocity.space=ParticleSystemSimulationSpace.World;
            velocity.x=drift.x;velocity.y=drift.y;velocity.z=drift.z;
        }
        static void SetRate(ParticleSystem particles,float rate,bool clear)
        {
            if(particles==null) return;
            var emission=particles.emission;emission.rateOverTime=rate;emission.enabled=rate>.001f;
            if(rate>.001f)
            {if(!particles.isEmitting) particles.Play(false);}
            else if(particles.isPlaying || clear)
                particles.Stop(false,clear?ParticleSystemStopBehavior.StopEmittingAndClear:ParticleSystemStopBehavior.StopEmitting);
        }
        public void Extinguish()
        {
            SetRate(sparks,0,true);
            SetRate(smoke,0,false);
        }
        public void ClearParticles()
        {
            SetRate(sparks,0,true);SetRate(smoke,0,true);
        }
        void OnDisable() => Clear();
        void Clear()
        {
            ClearParticles();
            if(generated!=null) generated.SetActive(false);
            Release(generated);Release(smokeMaterial);Release(emberMaterial);
            generated=null;smoke=null;sparks=null;smokeMaterial=null;emberMaterial=null;revision=-1;
            paletteReady=false;sparkColor=null;
        }
        static void Release(Object item)
        {if(item==null)return;if(Application.isPlaying)Destroy(item);else DestroyImmediate(item);}
    }
}
