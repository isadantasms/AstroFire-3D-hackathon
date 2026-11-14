// SI-assisted: generated with Codex; pending human review.
using System.Collections;
using UnityEngine;

namespace FireSimulation
{
    [ExecuteAlways]
    public sealed class ExtinguisherController : MonoBehaviour
    {
        public FireSimulationController fire;
        public DestinationTravel travel;
        public Object modelSource;
        public Texture2D palette;
        public Material modelAppearance;
        public Shader sprayShader;
        public Transform storagePoint;
        [Min(.45f)] public float storageLiftHeight=.65f;
        [Min(.3f)] public float storageReleaseDistance=.55f;
        [Min(.1f)] public float spraySeconds=2.5f;
        public Vector3 workingPosition=new Vector3(.85f,.75f,-.35f);
        public bool autoDetectHose=true;
        [Tooltip("Original imported mesh coordinates; auto-detected from the black hose when enabled.")]
        public Vector3 hoseOutletModelPosition=new Vector3(.15f,1.75f,-.8f);
        public Vector3 hoseOutletModelDirection=Vector3.back;
        public bool IsUsing {get;private set;}
        public float Progress => progress;
        GameObject model,nozzle;
        Material bodyMaterial,jetMaterial;
        ParticleSystem spray;
        Vector3 restPosition;
        Quaternion restRotation;
        int revision;
        bool cancelled;
        float progress;

        void OnEnable()
        {
            SnapToStorage();
            if(fire==null) fire=FindFirstObjectByType<FireSimulationController>();
            if(travel==null) travel=FindFirstObjectByType<DestinationTravel>();
#if UNITY_EDITOR
            string path=UnityEditor.AssetDatabase.GetAssetPath(modelSource);
            if(!string.IsNullOrEmpty(path))
                foreach(var asset in UnityEditor.AssetDatabase.LoadAllAssetsAtPath(path))
                    if(asset is Mesh) {modelSource=asset;break;}
#endif
            Rebuild();
        }

        void Start()
        {
            if(Application.isPlaying && spray==null && modelSource!=null && sprayShader!=null) Rebuild();
        }

        void Update()
        {
            if(!IsUsing && storagePoint!=null &&
                ((transform.position-storagePoint.position).sqrMagnitude>.000001f || Quaternion.Angle(transform.rotation,storagePoint.rotation)>.01f))
                SnapToStorage();
        }

        void SnapToStorage()
        {
            if(storagePoint!=null) transform.SetPositionAndRotation(storagePoint.position,storagePoint.rotation);
        }

        public void Rebuild()
        {
            ClearVisuals();
            if(modelSource==null || modelAppearance==null) return;
            model=TravelModelInstance.CreateModel(modelSource,transform);
            if(model==null) return;
            var renderers=model.GetComponentsInChildren<Renderer>();
            if(renderers.Length==0) {ClearVisuals();return;}
            // Normalize and center the provided model without modifying the imported asset.
            model.transform.SetLocalPositionAndRotation(Vector3.zero,Quaternion.identity);
            model.transform.localScale=Vector3.one;
            Bounds bounds=renderers[0].bounds;foreach(var renderer in renderers) bounds.Encapsulate(renderer.bounds);
            float scale=.7f/Mathf.Max(.001f,bounds.size.y);
            Vector3 center=transform.InverseTransformPoint(bounds.center);
            model.transform.localScale=Vector3.one*scale;model.transform.localPosition=-center*scale;
            foreach(var part in model.GetComponentsInChildren<Transform>())
            {part.gameObject.hideFlags=HideFlags.HideAndDontSave;part.gameObject.layer=gameObject.layer;}
            bodyMaterial=new Material(modelAppearance) {hideFlags=HideFlags.HideAndDontSave};
            bodyMaterial.SetColor("_BaseColor",Color.white);bodyMaterial.SetTexture("_BaseMap",palette);
            foreach(var renderer in renderers) renderer.sharedMaterial=bodyMaterial;
            if(autoDetectHose && modelSource is Mesh mesh && mesh.isReadable) LocateOriginalHose(mesh);
            // A transform-only anchor: the imported black hose supplies all visible geometry.
            nozzle=new GameObject("Original hose outlet (anchor only)");
            nozzle.hideFlags=HideFlags.HideAndDontSave;nozzle.transform.SetParent(transform,false);
            nozzle.transform.position=model.transform.TransformPoint(hoseOutletModelPosition+hoseOutletModelDirection.normalized*.02f);
            nozzle.transform.localRotation=model.transform.localRotation*Quaternion.LookRotation(hoseOutletModelDirection.normalized,Vector3.up);
            if(Application.isPlaying && sprayShader!=null) BuildSpray();
        }

        public void LocateOriginalHose(Mesh mesh)
        {
            var vertices=mesh.vertices;var uv=mesh.uv;
            if(vertices.Length!=uv.Length) return;
            float minZ=float.PositiveInfinity;
            for(int i=0;i<vertices.Length;i++)
                if(uv[i].x>.99f) minZ=Mathf.Min(minZ,vertices[i].z);
            if(float.IsInfinity(minZ)) return;
            Vector3 minimum=Vector3.one*float.PositiveInfinity,maximum=Vector3.one*float.NegativeInfinity;
            for(int i=0;i<vertices.Length;i++)
                if(uv[i].x>.99f && Mathf.Abs(vertices[i].z-minZ)<.0001f)
                { minimum=Vector3.Min(minimum,vertices[i]);maximum=Vector3.Max(maximum,vertices[i]); }
            hoseOutletModelPosition=(minimum+maximum)*.5f;
            hoseOutletModelDirection=Vector3.back;
        }

        Quaternion AimOriginalHose(Vector3 position,Vector3 target)
        {
            Vector3 localForward=nozzle.transform.localRotation*Vector3.forward;
            Quaternion rotation=Quaternion.LookRotation((target-position).normalized,Vector3.up)*Quaternion.Inverse(Quaternion.LookRotation(localForward,Vector3.up));
            // Account for the outlet being offset above and beside the model's center.
            for(int i=0;i<6;i++)
            {
                Vector3 outlet=position+rotation*nozzle.transform.localPosition;
                Vector3 direction=target-outlet;
                if(direction.sqrMagnitude<.000001f) break;
                rotation=Quaternion.FromToRotation(rotation*localForward,direction.normalized)*rotation;
            }
            return rotation;
        }

        void BuildSpray()
        {
            var obj=new GameObject("Extinguisher spray");obj.transform.SetParent(nozzle.transform,false);
            obj.transform.localPosition=Vector3.zero;obj.transform.localRotation=Quaternion.identity;
            spray=obj.AddComponent<ParticleSystem>();spray.Stop(true,ParticleSystemStopBehavior.StopEmittingAndClear);
            var main=spray.main;main.playOnAwake=false;main.loop=true;main.simulationSpace=ParticleSystemSimulationSpace.World;
            main.startLifetime=.3f;main.startSpeed=4;main.startSize=new ParticleSystem.MinMaxCurve(.07f,.16f);
            main.startColor=new Color(.88f,.95f,1,.55f);main.maxParticles=600;main.gravityModifier=0;
            var emission=spray.emission;emission.rateOverTime=0;
            var shape=spray.shape;shape.shapeType=ParticleSystemShapeType.Cone;shape.angle=10;shape.radius=.025f;
            var fade=spray.colorOverLifetime;fade.enabled=true;
            var gradient=new Gradient();gradient.SetKeys(new[] {new GradientColorKey(Color.white,0),new GradientColorKey(Color.white,1)},
                new[] {new GradientAlphaKey(0,0),new GradientAlphaKey(1,.15f),new GradientAlphaKey(0,1)});fade.color=gradient;
            var size=spray.sizeOverLifetime;size.enabled=true;size.size=new ParticleSystem.MinMaxCurve(1,AnimationCurve.Linear(0,.4f,1,1.5f));
            jetMaterial=new Material(sprayShader);spray.GetComponent<ParticleSystemRenderer>().sharedMaterial=jetMaterial;
        }

        public void UseExtinguisher()
        {
            if(!Application.isPlaying || IsUsing || fire==null || !fire.HasVisibleFire || (travel!=null && travel.IsTravelling) || spray==null) return;
            StartCoroutine(Extinguish());
        }

        bool ValidOperation => fire!=null && fire.Revision==revision && (travel==null || !travel.IsTravelling);
        Vector3 Target => fire.specimen!=null ? fire.specimen.FlameOrigin : fire.transform.position;
        IEnumerator Extinguish()
        {
            IsUsing=true;cancelled=false;progress=0;revision=fire.Revision;
            restPosition=storagePoint!=null?storagePoint.position:transform.position;
            restRotation=storagePoint!=null?storagePoint.rotation:transform.rotation;
            Vector3 raised=restPosition+(restRotation*Vector3.up)*Mathf.Max(.45f,storageLiftHeight);
            Vector3 released=raised-(restRotation*Vector3.right)*Mathf.Max(.3f,storageReleaseDistance);
            // Clear the retaining bands before pulling out or rotating the original model.
            yield return Animate(.4f,t=>transform.SetPositionAndRotation(Vector3.Lerp(restPosition,raised,Mathf.SmoothStep(0,1,t)),restRotation));
            if(cancelled) {Finish();yield break;}
            yield return Animate(.35f,t=>transform.SetPositionAndRotation(Vector3.Lerp(raised,released,Mathf.SmoothStep(0,1,t)),restRotation));
            if(cancelled) {Finish();yield break;}
            Vector3 target=Target;Quaternion aimed=AimOriginalHose(workingPosition,target);
            yield return Animate(.7f,t=>transform.SetPositionAndRotation(Vector3.Lerp(released,workingPosition,Mathf.SmoothStep(0,1,t)),Quaternion.Slerp(restRotation,aimed,Mathf.SmoothStep(0,1,t))));
            if(cancelled) {Finish();yield break;}
            float initial=fire.Suppression;
            var emission=spray.emission;emission.rateOverTime=240;spray.Play();
            yield return Animate(Mathf.Max(.1f,spraySeconds),t=>
            {
                transform.rotation=AimOriginalHose(transform.position,Target);
                progress=t;fire.SetSuppression(Mathf.Lerp(initial,1,Mathf.SmoothStep(0,1,t)));
            });
            spray.Stop(false,ParticleSystemStopBehavior.StopEmitting);
            if(!cancelled) fire.SetSuppression(1);
            Vector3 from=transform.position;Quaternion rotation=transform.rotation;
            if(!cancelled) yield return Animate(.7f,t=>transform.SetPositionAndRotation(Vector3.Lerp(from,released,Mathf.SmoothStep(0,1,t)),Quaternion.Slerp(rotation,restRotation,Mathf.SmoothStep(0,1,t))));
            if(!cancelled) yield return Animate(.35f,t=>transform.SetPositionAndRotation(Vector3.Lerp(released,raised,Mathf.SmoothStep(0,1,t)),restRotation));
            if(!cancelled) yield return Animate(.4f,t=>transform.SetPositionAndRotation(Vector3.Lerp(raised,restPosition,Mathf.SmoothStep(0,1,t)),restRotation));
            Finish();
        }

        IEnumerator Animate(float duration,System.Action<float> frame)
        {
            float elapsed=0;
            while(elapsed<duration)
            {
                if(!ValidOperation) {cancelled=true;yield break;}
                frame(elapsed/duration);elapsed+=Time.deltaTime;yield return null;
            }
            if(ValidOperation) frame(1);else cancelled=true;
        }

        void Finish()
        {
            if(spray!=null) spray.Stop(false,ParticleSystemStopBehavior.StopEmittingAndClear);
            if(IsUsing) transform.SetPositionAndRotation(restPosition,restRotation);
            SnapToStorage();
            IsUsing=false;progress=0;
        }


        void OnDisable() {StopAllCoroutines();Finish();ClearVisuals();}
        void ClearVisuals()
        {
            Release(model);Release(nozzle);if(spray!=null) Release(spray.gameObject);
            Release(bodyMaterial);Release(jetMaterial);
            model=null;nozzle=null;spray=null;bodyMaterial=null;jetMaterial=null;
        }
        static void Release(Object obj)
        {if(obj==null)return;if(Application.isPlaying)Destroy(obj);else DestroyImmediate(obj);}
    }
}
