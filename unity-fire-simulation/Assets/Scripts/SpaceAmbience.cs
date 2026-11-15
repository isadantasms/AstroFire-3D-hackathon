// SI-assisted: generated with Codex; pending human review.
using UnityEngine;

namespace FireSimulation
{
    [ExecuteAlways]
    public sealed class SpaceAmbience : MonoBehaviour
    {
        public Shader sunShader;
        public Shader nebulaShader;
        [Range(0,1)] public float nebulaIntensity=.65f;
        public Material starMaterial;
        public Light sunlight;
        public const float FarClip=20000;
        GameObject generated,sun;
        Mesh sunMesh;
        Mesh nebulaMesh;
        Material sunMaterial;
        Material nebulaMaterial;
        Camera observer;

        void OnEnable() => Rebuild();

        public void Configure(Shader shader,Material stars,Shader nebula)
        {
            if(generated!=null && sunShader==shader && starMaterial==stars && nebulaShader==nebula) return;
            sunShader=shader;starMaterial=stars;nebulaShader=nebula;Rebuild();
        }

        public void Rebuild()
        {
            Clear();
            if(sunShader==null || starMaterial==null) return;
            generated=new GameObject("Space ambience (generated)") {hideFlags=HideFlags.HideAndDontSave,layer=30};
            generated.transform.SetParent(transform,false);
            BuildNebula();
            sun=new GameObject("Sun aligned with directional light",typeof(MeshFilter),typeof(MeshRenderer))
                {hideFlags=HideFlags.HideAndDontSave,layer=30};
            sun.transform.SetParent(generated.transform,false);
            sunMesh=new Mesh {name="Sun billboard",hideFlags=HideFlags.HideAndDontSave};
            sunMesh.vertices=new[] {new Vector3(-1,-1,0),new Vector3(1,-1,0),new Vector3(1,1,0),new Vector3(-1,1,0)};
            sunMesh.uv=new[] {Vector2.zero,Vector2.right,Vector2.one,Vector2.up};
            sunMesh.triangles=new[] {0,1,2,0,2,3};sunMesh.RecalculateBounds();
            sun.GetComponent<MeshFilter>().sharedMesh=sunMesh;
            sunMaterial=new Material(sunShader) {hideFlags=HideFlags.HideAndDontSave};
            var renderer=sun.GetComponent<MeshRenderer>();renderer.sharedMaterial=sunMaterial;
            renderer.shadowCastingMode=UnityEngine.Rendering.ShadowCastingMode.Off;renderer.receiveShadows=false;
            sun.transform.localScale=Vector3.one*220;
            BuildStars();
            PositionObjects(null);
        }

        void BuildNebula()
        {
            if(nebulaShader==null) return;
            var obj=new GameObject("Distant nebula and galactic dust",typeof(MeshFilter),typeof(MeshRenderer))
                {hideFlags=HideFlags.HideAndDontSave,layer=30};
            obj.transform.SetParent(generated.transform,false);
            obj.transform.localScale=Vector3.one*10000;
            var vertices=new Vector3[24];var triangles=new int[36];
            int face=0;
            for(int axis=0;axis<3;axis++) for(int sign=-1;sign<=1;sign+=2)
            {
                int a=(axis+1)%3,b=(axis+2)%3,first=face*4,t=face*6;
                for(int corner=0;corner<4;corner++)
                {
                    var point=Vector3.zero;point[axis]=sign;
                    point[a]=corner==0 || corner==3?-1:1;point[b]=corner<2?-1:1;
                    vertices[first+corner]=point;
                }
                triangles[t]=first;triangles[t+1]=first+(sign>0?1:2);triangles[t+2]=first+(sign>0?2:1);
                triangles[t+3]=first;triangles[t+4]=first+(sign>0?2:3);triangles[t+5]=first+(sign>0?3:2);
                face++;
            }
            nebulaMesh=new Mesh {name="Seamless deep-space background",hideFlags=HideFlags.HideAndDontSave};
            nebulaMesh.vertices=vertices;nebulaMesh.triangles=triangles;nebulaMesh.RecalculateBounds();
            obj.GetComponent<MeshFilter>().sharedMesh=nebulaMesh;
            nebulaMaterial=new Material(nebulaShader) {hideFlags=HideFlags.HideAndDontSave};
            nebulaMaterial.SetFloat("_Intensity",nebulaIntensity);
            var renderer=obj.GetComponent<MeshRenderer>();renderer.sharedMaterial=nebulaMaterial;
            renderer.shadowCastingMode=UnityEngine.Rendering.ShadowCastingMode.Off;renderer.receiveShadows=false;
        }

        void BuildStars()
        {
            var obj=new GameObject("Distant star field") {hideFlags=HideFlags.HideAndDontSave,layer=30};
            obj.transform.SetParent(generated.transform,false);
            var stars=obj.AddComponent<ParticleSystem>();stars.Stop(true,ParticleSystemStopBehavior.StopEmittingAndClear);
            var main=stars.main;main.playOnAwake=false;main.maxParticles=1800;
            main.simulationSpace=ParticleSystemSimulationSpace.Local;main.startSpeed=0;
            var emission=stars.emission;emission.enabled=false;
            var renderer=stars.GetComponent<ParticleSystemRenderer>();renderer.sharedMaterial=starMaterial;
            renderer.shadowCastingMode=UnityEngine.Rendering.ShadowCastingMode.Off;
            var random=new System.Random(2026);
            var data=new ParticleSystem.Particle[1800];
            for(int i=0;i<data.Length;i++)
            {
                float y=(float)random.NextDouble()*2-1,angle=(float)random.NextDouble()*Mathf.PI*2;
                Vector3 direction=new Vector3(Mathf.Sqrt(1-y*y)*Mathf.Cos(angle),y,Mathf.Sqrt(1-y*y)*Mathf.Sin(angle));
                if(i<400)
                {
                    Vector3 axis=new Vector3(.45f,.82f,-.35f).normalized;
                    direction=(Vector3.ProjectOnPlane(direction,axis).normalized+axis*((float)random.NextDouble()-.5f)*.25f).normalized;
                }
                data[i].position=direction*(10000+(float)random.NextDouble()*2000);
                data[i].startSize=3+(float)random.NextDouble()*5;
                Color tint=Color.Lerp(new Color(.66f,.8f,1),new Color(1,.86f,.68f),(float)random.NextDouble());
                tint.a=.35f+(float)random.NextDouble()*.4f;data[i].startColor=tint;
                data[i].startLifetime=data[i].remainingLifetime=100000;
            }
            stars.SetParticles(data,data.Length);stars.Pause();
        }

        public void UpdateObserver(Camera view)
        {
            observer=view;
            if(generated==null) Rebuild();
            PositionObjects(view);
        }

        void LateUpdate()
        {
            if(generated==null) Rebuild();
            Camera view=observer;
#if UNITY_EDITOR
            if(!Application.isPlaying && UnityEditor.SceneView.lastActiveSceneView!=null)
            {
                view=UnityEditor.SceneView.lastActiveSceneView.camera;
                view.farClipPlane=Mathf.Max(view.farClipPlane,FarClip);
            }
#endif
            PositionObjects(view);
        }

        void PositionObjects(Camera view)
        {
            if(generated==null || sun==null) return;
            Vector3 origin=view!=null?view.transform.position:transform.position;
            generated.transform.position=origin;
            if(nebulaMaterial!=null) nebulaMaterial.SetFloat("_Intensity",nebulaIntensity);
            // Direction towards the light source is opposite to the direction its rays travel.
            Light light=sunlight!=null?sunlight:RenderSettings.sun;
            Vector3 direction=light!=null?-light.transform.forward:new Vector3(.4f,.6f,-.7f).normalized;
            sun.transform.position=origin+direction*14000;
            sun.transform.rotation=Quaternion.LookRotation(-direction,Vector3.up);
        }

        void OnDisable() => Clear();
        void Clear()
        {
            if(generated!=null) generated.SetActive(false);
            Release(generated);Release(sunMaterial);Release(sunMesh);
            Release(nebulaMaterial);Release(nebulaMesh);
            nebulaMaterial=null;nebulaMesh=null;
            generated=null;sun=null;sunMaterial=null;sunMesh=null;
        }
        static void Release(Object item)
        {
            if(item==null) return;
            if(Application.isPlaying) Destroy(item);else DestroyImmediate(item);
        }
    }
}
