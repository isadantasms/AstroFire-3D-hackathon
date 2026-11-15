// SI-assisted: generated with Codex; pending human review.
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;

namespace FireSimulation.Editor
{
    [InitializeOnLoad]
    public static class DestinationTravelAssets
    {
        static DestinationTravelAssets()
        {
            // Repair imported model references after Unity finishes importing new OBJ assets.
            EditorApplication.delayCall += BindMissing;
            EditorSceneManager.sceneOpened += (scene, mode) => EditorApplication.delayCall += BindMissing;
        }

        static void BindMissing()
        {
            if (EditorApplication.isPlayingOrWillChangePlaymode) return;
            foreach (var travel in Object.FindObjectsByType<DestinationTravel>(FindObjectsSortMode.None))
                Bind(travel);
            foreach(var instance in Object.FindObjectsByType<TravelModelInstance>(FindObjectsSortMode.None))
            {
                {
                    instance.source=LoadModel("Assets/TravelModels/"+instance.name+".obj");
                    instance.palette=AssetDatabase.LoadAssetAtPath<Texture2D>("Assets/TravelModels/"+instance.name+".png");
                    instance.Rebuild();
                    EditorUtility.SetDirty(instance);
                    EditorSceneManager.MarkSceneDirty(instance.gameObject.scene);
                }
            }
            foreach(var extinguisher in Object.FindObjectsByType<ExtinguisherController>(FindObjectsSortMode.None))
            {
                extinguisher.modelSource=LoadModel("Assets/MagicaVoxelModels/Extinguisher/Extinguisher.obj");
                extinguisher.palette=AssetDatabase.LoadAssetAtPath<Texture2D>("Assets/MagicaVoxelModels/Extinguisher/Extinguisher.png");
                extinguisher.Rebuild();EditorUtility.SetDirty(extinguisher);
            }
            if(!SessionState.GetBool("FireSimulation.ExteriorPreviewShown",false) && GameObject.Find("Exterior Travel Stage")!=null)
            {
                SessionState.SetBool("FireSimulation.ExteriorPreviewShown",true);
                ShowExterior();
            }
        }

        [MenuItem("Fire Simulation/Show exterior stage")]
        public static void ShowExterior()
        {
            var stage=GameObject.Find("Exterior Travel Stage");
            if(stage==null) return;
            Selection.activeGameObject=stage;
            if(SceneView.lastActiveSceneView!=null)
                SceneView.lastActiveSceneView.LookAt(new Vector3(1800,0,1000),Quaternion.Euler(23,-25,0),3700);
        }

        [MenuItem("Fire Simulation/Show cabin")]
        public static void ShowCabin()
        {
            if(SceneView.lastActiveSceneView!=null)
                SceneView.lastActiveSceneView.LookAt(new Vector3(0,1,0),Quaternion.Euler(15,-20,0),8);
        }

        [MenuItem("Fire Simulation/Bind travel assets")]
        public static void BindAll()
        {
            BindMissing();
        }

        static Object LoadModel(string path)
        {
            // Each cinematic OBJ has one mesh. Use its real imported file ID.
            foreach (var asset in AssetDatabase.LoadAllAssetsAtPath(path))
                if (asset is Mesh) return asset;
            return AssetDatabase.LoadAssetAtPath<GameObject>(path);
        }

        static void Bind(DestinationTravel travel)
        {
            travel.rocketModel=LoadModel("Assets/TravelModels/RocketShip.obj");
            travel.earthModel=LoadModel("Assets/TravelModels/Earth.obj");
            travel.moonModel=LoadModel("Assets/TravelModels/Moon.obj");
            travel.marsModel=LoadModel("Assets/TravelModels/Mars.obj");
            travel.issModel=LoadModel("Assets/TravelModels/ISS.obj");
            travel.rocketPalette=AssetDatabase.LoadAssetAtPath<Texture2D>("Assets/TravelModels/RocketShip.png");
            travel.earthPalette=AssetDatabase.LoadAssetAtPath<Texture2D>("Assets/TravelModels/Earth.png");
            travel.moonPalette=AssetDatabase.LoadAssetAtPath<Texture2D>("Assets/TravelModels/Moon.png");
            travel.marsPalette=AssetDatabase.LoadAssetAtPath<Texture2D>("Assets/TravelModels/Mars.png");
            travel.issPalette=AssetDatabase.LoadAssetAtPath<Texture2D>("Assets/TravelModels/ISS.png");
            travel.BindLandingMarkers();
            if(travel.earthLanding==null) BakeEarthLanding(travel);
            EditorUtility.SetDirty(travel);
            EditorSceneManager.MarkSceneDirty(travel.gameObject.scene);
        }

        static void BakeEarthLanding(DestinationTravel travel)
        {
            var mesh=travel.earthModel as Mesh;
            if(mesh==null || !mesh.isReadable) return;
            var vertices=mesh.vertices;var uv=mesh.uv;var triangles=mesh.triangles;
            if(uv.Length!=vertices.Length) return;
            float best=-2;Vector3 point=travel.earthLandingPoint;
            Vector3 preferred=DestinationTravel.SurfaceNormal(LaboratoryEnvironment.Destination.Earth);
            for(int i=0;i<triangles.Length;i+=3)
            {
                int a=triangles[i],b=triangles[i+1],c=triangles[i+2];
                // Palette entry 2 is green land; read real imported UVs, not assumed model axes.
                if(Mathf.FloorToInt(uv[a].x*256)!=1 || Mathf.FloorToInt(uv[b].x*256)!=1 || Mathf.FloorToInt(uv[c].x*256)!=1) continue;
                Vector3 minimum=Vector3.Min(vertices[a],Vector3.Min(vertices[b],vertices[c]));
                Vector3 maximum=Vector3.Max(vertices[a],Vector3.Max(vertices[b],vertices[c]));
                // Center the rocket on a broad, upward-facing green voxel terrace.
                if(maximum.y-minimum.y>.0001f || Vector3.Cross(vertices[b]-vertices[a],vertices[c]-vertices[a]).y<=0) continue;
                Vector3 center=(minimum+maximum)*.5f;
                float alignment=Vector3.Dot(center.normalized,preferred);
                float clearWidth=Mathf.Min(maximum.x-minimum.x,maximum.z-minimum.z)*DestinationTravel.PlanetScale(LaboratoryEnvironment.Destination.Earth);
                if(alignment<.94f || clearWidth<2) continue;
                float score=clearWidth+alignment*.5f;
                if(score>best) { best=score;point=center; }
            }
            if(best<0) throw new System.Exception("Could not find a green land triangle for Earth landing.");
            travel.earthLandingPoint=point;
            travel.earthLandingNormal=Vector3.up;
        }

        [MenuItem("Fire Simulation/Validate travel routes")]
        public static void ValidateRoutes()
        {
            if(!(DestinationTravel.PlanetScale(LaboratoryEnvironment.Destination.Earth) > DestinationTravel.PlanetScale(LaboratoryEnvironment.Destination.Mars)
                && DestinationTravel.PlanetScale(LaboratoryEnvironment.Destination.Mars) > DestinationTravel.PlanetScale(LaboratoryEnvironment.Destination.Moon)))
                throw new System.Exception("Planet scale ordering must be Earth > Mars > Moon.");
            var descending=Quaternion.FromToRotation(Vector3.up,Vector3.down);
            var parked=Quaternion.Euler(0,37,0);
            if(Quaternion.Angle(DestinationTravel.DepartureRotation(parked,descending,0),parked)>.01f)
                throw new System.Exception("Departure must begin at the saved arrival rotation.");
            if(Quaternion.Angle(DestinationTravel.DepartureRotation(parked,descending,1),descending)>.01f)
                throw new System.Exception("Departure must smoothly reach the flight heading.");
            if(Mathf.Abs(DestinationTravel.PlanetScale(LaboratoryEnvironment.Destination.Moon)/DestinationTravel.PlanetScale(LaboratoryEnvironment.Destination.Earth)-DestinationTravel.MoonDiameterKm/DestinationTravel.EarthDiameterKm)>.00001f)
                throw new System.Exception("Moon/Earth ratio mismatch.");
            if(Mathf.Abs(DestinationTravel.PlanetScale(LaboratoryEnvironment.Destination.Mars)/DestinationTravel.PlanetScale(LaboratoryEnvironment.Destination.Earth)-DestinationTravel.MarsDiameterKm/DestinationTravel.EarthDiameterKm)>.00001f)
                throw new System.Exception("Mars/Earth ratio mismatch.");
            if(DestinationTravel.StationScale<=DestinationTravel.RocketScale)
                throw new System.Exception("ISS must be larger than the rocket.");
            for(int destination=1;destination<4;destination++)
            {
                var upright=DestinationTravel.ApproachRotation((LaboratoryEnvironment.Destination)destination,descending,1);
                if(Vector3.Dot(upright*Vector3.up,DestinationTravel.SurfaceNormal((LaboratoryEnvironment.Destination)destination))<.999f) throw new System.Exception("Planet arrival must align with the landing surface.");
                if(Quaternion.Angle(DestinationTravel.ApproachRotation((LaboratoryEnvironment.Destination)destination,descending,0),descending)>.01f)
                    throw new System.Exception("Landing rotation must preserve the initial flight heading.");
            }
            if(Quaternion.Angle(DestinationTravel.ApproachRotation(LaboratoryEnvironment.Destination.ISS,descending,1),descending)>.01f)
                throw new System.Exception("ISS approach must preserve the docking heading.");
            for(int from=0;from<4;from++) for(int to=0;to<4;to++)
            {
                if(from==to) continue;
                var a=DestinationTravel.Anchor((LaboratoryEnvironment.Destination)from);
                var b=DestinationTravel.Anchor((LaboratoryEnvironment.Destination)to);
                if(Vector3.Distance(DestinationTravel.Route(a,b,0),a)>.001f || Vector3.Distance(DestinationTravel.Route(a,b,1),b)>.001f)
                    throw new System.Exception("Invalid route endpoints.");
                var ascent=DestinationTravel.Route(a,b,.09f);
                var descent=DestinationTravel.Route(a,b,.91f);
                if(ascent.y<=Mathf.Lerp(a.y,b.y,.09f) || descent.y<=Mathf.Lerp(a.y,b.y,.91f))
                    throw new System.Exception("The flight arc must rise above the origin-to-destination chord.");
                if(Vector3.Distance(DestinationTravel.Route(a,b,.0001f),a)>.001f || Vector3.Distance(DestinationTravel.Route(a,b,.9999f),b)>.001f)
                    throw new System.Exception("Takeoff and landing must approach zero speed.");
                foreach(float join in new[] { DestinationTravel.TakeoffEnd,DestinationTravel.LandingStart })
                {
                    const float h=.0001f;
                    var left=(DestinationTravel.Route(a,b,join)-DestinationTravel.Route(a,b,join-h))/h;
                    var right=(DestinationTravel.Route(a,b,join+h)-DestinationTravel.Route(a,b,join))/h;
                    if(Vector3.Distance(left,right)>Mathf.Max(2,left.magnitude*.02f))
                        throw new System.Exception("Velocity discontinuity at flight phase boundary.");
                }
                for(int n=0;n<=100;n++)
                {
                    var position=DestinationTravel.Route(a,b,n/100f);
                    if(float.IsNaN(position.x)||float.IsInfinity(position.y)) throw new System.Exception("Invalid route coordinate.");
                }
            }
            foreach(var travel in Object.FindObjectsByType<DestinationTravel>(FindObjectsSortMode.None))
            {
                if(travel.rocketModel==null||travel.earthModel==null||travel.moonModel==null||travel.marsModel==null||travel.issModel==null||travel.travelCamera==null)
                    throw new System.Exception("Bind the travel models and camera first.");
                if(travel.rocketPalette==null||travel.earthPalette==null||travel.moonPalette==null||travel.marsPalette==null||travel.issPalette==null)
                    throw new System.Exception("Travel palettes missing.");
            }
            Debug.Log("All twelve directed routes, planet size ordering, upright landing rotations and travel assets validated.");
        }

        [MenuItem("Fire Simulation/Validate skip hold")]
        public static void ValidateSkip()
        {
            float hold=0;
            for(int n=0;n<9;n++) hold=DestinationTravel.AccumulateSkip(hold,true,.1f);
            if(hold>=DestinationTravel.SkipHoldSeconds) throw new System.Exception("Skip triggered too early.");
            hold=DestinationTravel.AccumulateSkip(hold,false,.1f);
            if(hold!=0) throw new System.Exception("Releasing E must reset progress.");
            hold=DestinationTravel.AccumulateSkip(hold,true,1);
            if(hold!=DestinationTravel.SkipHoldSeconds) throw new System.Exception("One second must complete the hold.");
            if(DestinationTravel.AccumulateSkip(hold,true,2)!=1) throw new System.Exception("Skip progress must be clamped.");
            Debug.Log("Hold-to-skip duration, reset on release and saturation validated.");
        }

        [MenuItem("Fire Simulation/Validate landing markers")]
        public static void ValidateLandingMarkers()
        {
            foreach(var travel in Object.FindObjectsByType<DestinationTravel>(FindObjectsSortMode.None))
            {
                travel.BindLandingMarkers();
                for(int i=0;i<4;i++)
                {
                    var destination=(LaboratoryEnvironment.Destination)i;
                    var marker=travel.LandingMarker(destination);
                    if(marker==null) throw new System.Exception("Landing marker missing: "+destination);
                    var stage=travel.exteriorStage.transform;
                    Vector3 worldPoint=stage.TransformPoint(travel.LandingAnchor(destination));
                    Vector3 expected=marker.position+marker.up*Mathf.Max(0,travel.landingClearance);
                    if(Vector3.Distance(worldPoint,expected)>.001f) throw new System.Exception("Landing position mismatch: "+destination);
                    if(Quaternion.Angle(stage.rotation*travel.LandingRotation(destination),marker.rotation)>.01f)
                        throw new System.Exception("Landing rotation mismatch: "+destination);
                }
            }
            Debug.Log("All four scene landing markers resolve to the correct world positions and rotations.");
        }

        [MenuItem("Fire Simulation/Validate exterior camera clearance")]
        public static void ValidateCameraClearance()
        {
            for(int i=1;i<4;i++)
            {
                var destination=(LaboratoryEnvironment.Destination)i;
                Vector3 center=DestinationTravel.BodyPosition(destination);
                float radius=DestinationTravel.PlanetScale(destination);
                foreach(var direction in new[] {Vector3.zero,Vector3.up,Vector3.down,Vector3.left,Vector3.right,Vector3.forward,Vector3.back})
                {
                    Vector3 camera=DestinationTravel.SafeCameraPosition(center+direction*radius*.8f);
                    if(Vector3.Distance(camera,center)<radius+Mathf.Max(1.25f,radius*.05f)-.001f)
                        throw new System.Exception("Camera penetrated planet clearance: "+destination);
                }
            }
            for(int n=0;n<=100;n++)
            {
                var offset=DestinationTravel.OrbitObservation(new Vector3(5,3,-8),new Vector3(-5,5,8),n/100f);
                if(offset.magnitude<9) throw new System.Exception("Camera orbit collapsed toward rocket center.");
            }
            Debug.Log("Exterior camera sphere clearance and orbital transition radius validated.");
        }

        [MenuItem("Fire Simulation/Validate model instantiation")]
        public static void ValidateInstantiation()
        {
            foreach (string name in new[] { "RocketShip", "Earth", "Moon", "Mars", "ISS" })
            {
                var asset=LoadModel("Assets/TravelModels/"+name+".obj");
                if(!(asset is Mesh) && !(asset is GameObject))
                    throw new System.Exception("Invalid imported model type: "+name);
                var instance=TravelModelInstance.CreateModel(asset,null);
                try
                {
                    if(instance==null || instance.GetComponentsInChildren<MeshFilter>().Length==0)
                        throw new System.Exception("Model instantiation failed: "+name);
                }
                finally { if(instance!=null) Object.DestroyImmediate(instance); }
            }
            Debug.Log("All five imported models instantiated successfully without generic casts.");
        }
    }
}
