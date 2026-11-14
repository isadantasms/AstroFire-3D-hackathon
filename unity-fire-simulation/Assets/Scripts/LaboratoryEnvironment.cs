// SI-assisted: generated with Codex; pending human review.
using System.Collections.Generic;
using UnityEngine;

namespace FireSimulation
{
    [ExecuteAlways]
    public sealed class LaboratoryEnvironment : MonoBehaviour
    {
        public enum Destination { ISS, Earth, Moon, Mars }
        public FireSimulationController fire;
        public Shader windowShader;
        public Material structureMaterial;
        public bool followPayloadGravity = true;
        public Destination destination;
        [Min(.1f)] public float travelSeconds = 3;
        public DestinationTravel travel;
        GameObject room;
        Material windowMaterial, trimMaterial, lightMaterial;
        readonly List<Material> owned = new List<Material>();
        readonly List<Mesh> windowMeshes = new List<Mesh>();
        Vector4 weights = new Vector4(1, 0, 0, 0), departure;
        Destination active;
        float elapsed;
        bool initialized;
        Texture liveWindowTexture;
        static readonly string[] Labels = { "ISS", "EARTH", "MOON", "MARS" };

        void OnEnable()
        {
            if (windowShader == null || structureMaterial == null) return;
            if (fire == null) fire = GetComponent<FireSimulationController>();
            room = new GameObject("Laboratory interior (generated)") { hideFlags = HideFlags.HideAndDontSave };
            room.transform.SetParent(transform, false);
            room.transform.position = Vector3.zero;
            room.transform.rotation = Quaternion.identity;
            room.transform.localScale = Vector3.one;
            trimMaterial = new Material(structureMaterial) { hideFlags = HideFlags.HideAndDontSave };
            trimMaterial.SetColor("_BaseColor", new Color(.22f, .30f, .35f));
            owned.Add(trimMaterial);
            lightMaterial = new Material(trimMaterial) { hideFlags = HideFlags.HideAndDontSave };
            lightMaterial.SetColor("_BaseColor", new Color(.25f, .65f, .75f));
            lightMaterial.EnableKeyword("_EMISSION");
            lightMaterial.SetColor("_EmissionColor", new Color(.25f, .65f, .8f) * 2);
            owned.Add(lightMaterial);
            // Closed cabin with solid wall thickness on every side, including the exterior.
            Box("Laboratory floor", new Vector3(0, -.25f, -1.25f), new Vector3(7.2f, .2f, 8.8f), structureMaterial);
            Box("Laboratory ceiling", new Vector3(0, 3.65f, -1.25f), new Vector3(7.2f, .25f, 8.8f), structureMaterial);
            Box("Port hull", new Vector3(-3.55f, 1.7f, -1.25f), new Vector3(.25f, 4.1f, 8.8f), structureMaterial);
            Box("Starboard hull", new Vector3(3.55f, 1.7f, -1.25f), new Vector3(.25f, 4.1f, 8.8f), structureMaterial);
            Box("Forward bulkhead", new Vector3(0, 1.7f, -5.55f), new Vector3(7.2f, 4.1f, .25f), structureMaterial);
            Box("Pressure hatch surround", new Vector3(0, 1.4f, -5.35f), new Vector3(1.9f, 2.9f, .15f), trimMaterial);
            Box("Pressure hatch", new Vector3(0, 1.4f, -5.23f), new Vector3(1.65f, 2.65f, .12f), structureMaterial);
            Box("Hatch seam", new Vector3(0, 1.4f, -5.15f), new Vector3(.025f, 2.5f, .025f), lightMaterial);
            Box("Rear wall lower", new Vector3(0, .15f, 3), new Vector3(7, .7f, .20f), structureMaterial);
            Box("Rear wall upper", new Vector3(0, 3.3f, 3), new Vector3(7, .7f, .20f), structureMaterial);
            Box("Rear wall left", new Vector3(-2.9f, 1.75f, 3), new Vector3(1.2f, 2.5f, .20f), structureMaterial);
            Box("Rear wall right", new Vector3(2.9f, 1.75f, 3), new Vector3(1.2f, 2.5f, .20f), structureMaterial);
            CreateWindowRing("Porthole surrounding wall",1.16f,2.4f,.20f,2.91f,structureMaterial,true);
            CreateWindowRing("Voxel circular metal window frame",1.05f,1.16f,.16f,2.82f,trimMaterial,false);
            for(int bolt=0;bolt<12;bolt++)
            {
                float angle=bolt*Mathf.PI*2/12;
                Vector3 boltPosition=new Vector3(Mathf.Round(Mathf.Cos(angle)*1.105f/WindowCellSize)*WindowCellSize,
                    1.75f+Mathf.Round(Mathf.Sin(angle)*1.105f/WindowCellSize)*WindowCellSize,2.80f);
                Box("Porthole voxel fastener",boltPosition,Vector3.one*.045f,structureMaterial);
            }
            for (int side = -1; side <= 1; side += 2)
            {
                Box("Structural column", new Vector3(side * 3.3f, 1.5f, 1), new Vector3(.16f, 3.5f, .25f), trimMaterial);
                Box("Equipment console", new Vector3(side * 1.7f, .25f, .9f), new Vector3(.7f, .8f, .9f), structureMaterial);
                Box("Console face", new Vector3(side * 1.7f, .68f, .8f), new Vector3(.62f, .05f, .65f), trimMaterial);
                Box("Floor guidance strip", new Vector3(side * 1.15f, -.135f, -1.2f), new Vector3(.025f, .012f, 8), lightMaterial);
                Box("Ceiling light strip", new Vector3(side * 2, 3.49f, -1.2f), new Vector3(.12f, .025f, 7.9f), lightMaterial);
                for (int panel = 0; panel < 5; panel++)
                {
                    float z = -4.5f + panel * 1.5f;
                    Box("Hull reinforcement", new Vector3(side * 3.36f, 1.7f, z), new Vector3(.12f, 3.7f, .09f), trimMaterial);
                    Box("Wall equipment panel", new Vector3(side * 3.38f, 1.7f, z + .65f), new Vector3(.05f, 1.4f, 1.1f), trimMaterial);
                    Box("Panel indicator", new Vector3(side * 3.33f, 2.1f, z + .65f), new Vector3(.025f, .035f, .45f), lightMaterial);
                }
                var lamp = new GameObject("Cabin fill light") { hideFlags = HideFlags.HideAndDontSave };
                lamp.transform.SetParent(room.transform, false);
                lamp.transform.localPosition = new Vector3(side * 2, 2.9f, -1.3f);
                var light = lamp.AddComponent<Light>();
                light.type = LightType.Point;
                light.color = new Color(.65f, .8f, 1);
                light.intensity = 2;
                light.range = 7;
                light.shadows = LightShadows.None;
            }
            windowMaterial = new Material(windowShader) { hideFlags = HideFlags.HideAndDontSave };
            SetWindowTexture(liveWindowTexture);
            owned.Add(windowMaterial);
            var window = new GameObject("Round destination observation window",typeof(MeshFilter),typeof(MeshRenderer));
            window.hideFlags = HideFlags.HideAndDontSave;
            window.transform.SetParent(room.transform, false);
            window.transform.localPosition = new Vector3(0, 1.75f, 2.94f);
            window.GetComponent<MeshFilter>().sharedMesh=CreateWindowDisc();
            window.GetComponent<Renderer>().sharedMaterial = windowMaterial;
            var collider = window.GetComponent<Collider>();
            if (collider != null) collider.enabled = false;
            initialized = false;
            Update();
        }

        const float WindowCellSize=.12f;
        static bool WindowCell(int x,int y,float inner,float outer,bool rectangularOutside)
        {
            float px=(x+.5f)*WindowCellSize,py=(y+.5f)*WindowCellSize;
            float squared=px*px+py*py;
            return squared>inner*inner && (rectangularOutside || squared<=outer*outer);
        }

        static void WindowQuad(List<Vector3> vertices,List<int> indices,Vector3 a,Vector3 b,Vector3 c,Vector3 d)
        {
            int first=vertices.Count;
            vertices.AddRange(new[] {a,b,c,d});
            indices.AddRange(new[] {first,first+1,first+2,first,first+2,first+3});
        }

        Mesh CreateWindowDisc()
        {
            var vertices=new List<Vector3>();var indices=new List<int>();
            for(int x=-20;x<20;x++) for(int y=-11;y<11;y++)
            {
                float px=(x+.5f)*WindowCellSize,py=(y+.5f)*WindowCellSize;
                if(px*px+py*py>1.05f*1.05f) continue;
                float l=x*WindowCellSize,r=(x+1)*WindowCellSize,b=y*WindowCellSize,t=(y+1)*WindowCellSize;
                WindowQuad(vertices,indices,new Vector3(l,b,0),new Vector3(l,t,0),new Vector3(r,t,0),new Vector3(r,b,0));
            }
            var uv=new Vector2[vertices.Count];
            for(int i=0;i<vertices.Count;i++) uv[i]=new Vector2(vertices[i].x,vertices[i].y)/2.16f+Vector2.one*.5f;
            var mesh=new Mesh {name="Voxel circular glass",hideFlags=HideFlags.HideAndDontSave};
            mesh.SetVertices(vertices);mesh.uv=uv;mesh.SetTriangles(indices,0);mesh.RecalculateNormals();mesh.RecalculateBounds();
            windowMeshes.Add(mesh);return mesh;
        }

        void CreateWindowRing(string label,float inner,float outer,float depth,float z,Material appearance,bool rectangularOutside)
        {
            var vertices=new List<Vector3>();var indices=new List<int>();
            for(int x=-20;x<20;x++) for(int y=-11;y<11;y++)
            {
                if(!WindowCell(x,y,inner,outer,rectangularOutside)) continue;
                float l=x*WindowCellSize,r=(x+1)*WindowCellSize,b=y*WindowCellSize,t=(y+1)*WindowCellSize;
                Vector3 a=new Vector3(l,b,0),bb=new Vector3(l,t,0),c=new Vector3(r,t,0),d=new Vector3(r,b,0),back=Vector3.forward*depth;
                WindowQuad(vertices,indices,a,bb,c,d);
                WindowQuad(vertices,indices,a+back,d+back,c+back,bb+back);
                if(x==-20 || !WindowCell(x-1,y,inner,outer,rectangularOutside)) WindowQuad(vertices,indices,a,a+back,bb+back,bb);
                if(x==19 || !WindowCell(x+1,y,inner,outer,rectangularOutside)) WindowQuad(vertices,indices,d,c,c+back,d+back);
                if(y==-11 || !WindowCell(x,y-1,inner,outer,rectangularOutside)) WindowQuad(vertices,indices,a,d,d+back,a+back);
                if(y==10 || !WindowCell(x,y+1,inner,outer,rectangularOutside)) WindowQuad(vertices,indices,bb,bb+back,c+back,c);
            }
            var mesh=new Mesh {name=label+" voxel blocks",hideFlags=HideFlags.HideAndDontSave};
            mesh.SetVertices(vertices);mesh.SetTriangles(indices,0);mesh.RecalculateNormals();mesh.RecalculateBounds();windowMeshes.Add(mesh);
            var obj=new GameObject(label,typeof(MeshFilter),typeof(MeshRenderer)) {hideFlags=HideFlags.HideAndDontSave};
            obj.transform.SetParent(room.transform,false);obj.transform.localPosition=new Vector3(0,1.75f,z);
            obj.GetComponent<MeshFilter>().sharedMesh=mesh;obj.GetComponent<Renderer>().sharedMaterial=appearance;
        }

        void Box(string name, Vector3 position, Vector3 scale, Material material)
        {
            var box = GameObject.CreatePrimitive(PrimitiveType.Cube);
            box.name = name;
            box.hideFlags = HideFlags.HideAndDontSave;
            box.transform.SetParent(room.transform, false);
            box.transform.localPosition = position;
            box.transform.localScale = scale;
            box.GetComponent<Renderer>().sharedMaterial = material;
            // Decorative geometry must not affect the fire or camera physics.
            var collider = box.GetComponent<Collider>();
            if(collider != null) collider.enabled = false;
        }

        public static Destination FromGravity(float gravity)
        {
            // Presentation presets only; partial gravity physics remains the received value.
            float[] values = { 0, .16f, .38f, 1 };
            Destination[] places = { Destination.ISS, Destination.Moon, Destination.Mars, Destination.Earth };
            int best = 0;
            for (int n = 1; n < values.Length; n++)
                if (Mathf.Abs(gravity - values[n]) < Mathf.Abs(gravity - values[best])) best = n;
            return places[best];
        }

        // Can also be called by Unity WebGL SendMessage with ISS, Earth, Moon or Mars.
        public void SetDestination(string location)
        {
            if (!System.Enum.TryParse(location, true, out Destination selected) || !System.Enum.IsDefined(typeof(Destination), selected)) return;
            destination = selected;
            if (fire?.payload?.inputs == null) return;
            var input = fire.payload.inputs;
            input.gravity_g = selected == Destination.ISS ? 0 : selected == Destination.Moon ? .16f : selected == Destination.Mars ? .38f : 1;
            input.environment_label = Labels[(int)selected];
            // Preserve the other received combustion fields: location selection is not a new backend prediction.
        }

        void Update()
        {
            if (windowMaterial == null) return;
            if (followPayloadGravity && fire?.payload?.inputs != null) destination = FromGravity(fire.payload.inputs.gravity_g);
            if (!initialized)
            {
                active = destination;
                weights = Weight(active);
                elapsed = travelSeconds;
                initialized = true;
            }
            if (Application.isPlaying && travel != null && travel.Ready)
            {
                travel.RequestDestination(destination);
                active = travel.ArrivedDestination;
                weights = Weight(active);
                windowMaterial.SetVector("_Destinations", weights);
                windowMaterial.SetFloat("_Travel", 0);
                windowMaterial.SetFloat("_Arrival", 1);
                return;
            }
            if (active != destination)
            {
                departure = weights; active = destination; elapsed = 0;
            }
            if (Application.isPlaying) elapsed += Time.deltaTime;
            else { elapsed = travelSeconds; departure = Weight(active); }
            float progress = Mathf.Clamp01(elapsed / Mathf.Max(.1f, travelSeconds));
            weights = Vector4.Lerp(departure, Weight(active), Mathf.SmoothStep(0, 1, progress));
            windowMaterial.SetVector("_Destinations", weights);
            windowMaterial.SetFloat("_Travel", Mathf.Sin(progress * Mathf.PI));
            windowMaterial.SetFloat("_Arrival", progress);
        }

        static Vector4 Weight(Destination value)
        {
            var result = Vector4.zero; result[(int)value] = 1; return result;
        }

        public void SetWindowTexture(Texture texture)
        {
            liveWindowTexture=texture;
            if(windowMaterial==null) return;
            windowMaterial.SetTexture("_WindowView",texture);
            windowMaterial.SetFloat("_UseWindowView",texture!=null?1:0);
        }

        public void SetEarthSurfaceView(bool enabled,Vector2 parallax)
        {
            if(windowMaterial==null) return;
            windowMaterial.SetFloat("_EarthSurfaceView",enabled?1:0);
            windowMaterial.SetVector("_EarthViewOffset",new Vector4(parallax.x,parallax.y,0,0));
        }


        void OnDisable()
        {
            Release(room); room = null;
            foreach (var material in owned) Release(material);
            foreach(var mesh in windowMeshes) Release(mesh);
            windowMeshes.Clear();
            owned.Clear(); windowMaterial = null;
        }
        static void Release(Object obj)
        {
            if (obj == null) return;
            if (Application.isPlaying) Destroy(obj); else DestroyImmediate(obj);
        }
    }
}
