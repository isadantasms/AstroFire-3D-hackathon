// SI-assisted: generated with Codex, reviewed and edited by Esquivel & Elias (21 PyroRangers).
using UnityEngine;

namespace FireSimulation
{
    [ExecuteAlways]
    public sealed class PlanetAtmosphere : MonoBehaviour
    {
        public Shader atmosphereShader;
        public Shader cloudShader;
        public LaboratoryEnvironment.Destination destination = LaboratoryEnvironment.Destination.Earth;
        GameObject shell;
        Material material;
        Mesh shellMesh;
        GameObject clouds;
        Material cloudMaterial;
        float cloudRadius;
        bool reportedUnsupported;
        void OnEnable() => Update();
        void Update()
        {
            // The Moon has no dense atmosphere: do not add a glow or a dust-filled sky.
            if(destination==LaboratoryEnvironment.Destination.Moon || destination==LaboratoryEnvironment.Destination.ISS || atmosphereShader==null)
            { Clear(); return; }
            if(Application.isPlaying && !atmosphereShader.isSupported)
            {
                if(!reportedUnsupported)
                {
                    Debug.LogError("Planet atmosphere shader is unsupported by this graphics device: "+SystemInfo.graphicsDeviceType+" / "+SystemInfo.graphicsDeviceVersion+". Check the browser shader compiler log.",this);
                    reportedUnsupported=true;
                }
                if(shell!=null) shell.SetActive(false);
                return;
            }
            if(shell!=null && !shell.activeSelf) shell.SetActive(true);
            if(shell==null || material==null)
            {
                Release(shell);Release(material);Release(shellMesh);
                material=new Material(atmosphereShader) { hideFlags=HideFlags.HideAndDontSave };
                shellMesh=CreateShellMesh();
                // Explicit mesh components avoid CreatePrimitive's stripped collider/default-material dependencies.
                shell=new GameObject("Atmospheric scattering (generated)",typeof(MeshFilter),typeof(MeshRenderer));
                shell.hideFlags=HideFlags.HideAndDontSave;
                shell.layer=gameObject.layer;
                shell.transform.SetParent(transform,false);
                shell.GetComponent<MeshFilter>().sharedMesh=shellMesh;
                var renderer=shell.GetComponent<MeshRenderer>(); renderer.sharedMaterial=material;
                renderer.shadowCastingMode=UnityEngine.Rendering.ShadowCastingMode.Off;
                renderer.receiveShadows=false;
            }
            var model=GetComponent<TravelModelInstance>();
            float radius=model!=null ? model.visualScale : DestinationTravel.PlanetScale(destination);
            bool earth=destination==LaboratoryEnvironment.Destination.Earth;
            float outer=radius*(earth?1.045f:1.028f);
            shell.transform.localPosition=Vector3.zero;
            shell.transform.localScale=Vector3.one*outer*2/Mathf.Max(.0001f,Mathf.Abs(transform.lossyScale.x));
            material.SetVector("_Center",transform.position);
            material.SetFloat("_PlanetRadius",radius);
            material.SetFloat("_ShellRadius",outer);
            material.SetFloat("_Strength",earth ? .48f : .20f);
            material.SetColor("_Tint",earth?new Color(.18f,.48f,1):new Color(.74f,.32f,.14f));
            if(RenderSettings.sun!=null) material.SetVector("_SunDirection",-RenderSettings.sun.transform.forward);
            if(earth && cloudShader!=null)
            {
                if(clouds==null)
                {
                    clouds=new GameObject("Earth voxel cloud groups");
                    clouds.hideFlags=HideFlags.HideAndDontSave;clouds.layer=gameObject.layer;
                    clouds.transform.SetParent(transform,false);
                    cloudMaterial=new Material(cloudShader) { hideFlags=HideFlags.HideAndDontSave };
                    clouds.AddComponent<VoxelCloudLayer>().Build(radius,cloudMaterial);
                    cloudRadius=radius;
                }
                clouds.transform.localPosition=Vector3.zero;
                clouds.transform.localScale=Vector3.one/Mathf.Max(.0001f,Mathf.Abs(transform.lossyScale.x));
                if(Application.isPlaying) clouds.transform.localRotation=Quaternion.Euler(0,Time.time*.25f,0);
                if(Mathf.Abs(cloudRadius-radius)>.001f) { clouds.GetComponent<VoxelCloudLayer>().Build(radius,cloudMaterial);cloudRadius=radius; }
            }
        }
        void OnDisable() => Clear();
        static Mesh CreateShellMesh()
        {
            const int rings=48, segments=96;
            var vertices=new Vector3[(rings+1)*(segments+1)];
            var normals=new Vector3[vertices.Length];
            var triangles=new int[rings*segments*6];
            int t=0;
            for(int y=0;y<=rings;y++)
            {
                float latitude=Mathf.PI*y/rings;
                for(int x=0;x<=segments;x++)
                {
                    float longitude=2*Mathf.PI*x/segments;
                    int i=y*(segments+1)+x;
                    normals[i]=new Vector3(Mathf.Sin(latitude)*Mathf.Cos(longitude),Mathf.Cos(latitude),Mathf.Sin(latitude)*Mathf.Sin(longitude));
                    vertices[i]=normals[i]*.5f;
                    if(y==rings || x==segments) continue;
                    int next=i+segments+1;
                    triangles[t++]=i;triangles[t++]=i+1;triangles[t++]=next;
                    triangles[t++]=i+1;triangles[t++]=next+1;triangles[t++]=next;
                }
            }
            var mesh=new Mesh { name="Atmosphere shell mesh",hideFlags=HideFlags.HideAndDontSave };
            mesh.vertices=vertices;mesh.normals=normals;mesh.triangles=triangles;
            mesh.RecalculateBounds();
            return mesh;
        }
        void Clear()
        {
            Release(shell);Release(material);shell=null;material=null;
            Release(shellMesh);shellMesh=null;
            Release(clouds);Release(cloudMaterial);clouds=null;cloudMaterial=null;
        }
        static void Release(Object value)
        {
            if(value==null) return;
            if(Application.isPlaying) Destroy(value);else DestroyImmediate(value);
        }
    }
}
