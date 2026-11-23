// SI-assisted: generated with Codex, reviewed and edited by Esquivel & Elias (21 PyroRangers).
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
#if ENABLE_INPUT_SYSTEM
using UnityEngine.InputSystem;
#endif

namespace FireSimulation
{
    [DefaultExecutionOrder(100)]
    public sealed class DestinationTravel : MonoBehaviour
    {
        public LaboratoryEnvironment environment;
        public FireSimulationController fire;
        public Camera travelCamera;
        public FireOrbitCamera orbit;
        public Material modelMaterial, engineMaterial;
        public Shader atmosphereShader;
        public Shader cloudShader;
        public Shader sunShader;
        public Shader nebulaShader;
        public Object rocketModel, earthModel, moonModel, marsModel, issModel;
        public Texture2D rocketPalette, earthPalette, moonPalette, marsPalette, issPalette;
        public GameObject exteriorStage, sceneRocket;
        public Transform earthLanding, moonLanding, marsLanding, issLanding;
        [Tooltip("Distance from each landing marker (ground/feet position) to the rocket's center.")]
        public float landingClearance = RocketScale + .10f;
        [Tooltip("Baked point on a green land triangle of the imported Earth mesh, in normalized model coordinates.")]
        public Vector3 earthLandingPoint = new Vector3(.859375f,.4375f,-.3125f);
        public Vector3 earthLandingNormal = Vector3.up;
        [Min(3)] public float flightSeconds = 12;
        [Min(.2f)] public float ignitionSeconds = 1.5f;
        public bool IsTravelling { get; private set; }
        public LaboratoryEnvironment.Destination ArrivedDestination { get; private set; }
        public LaboratoryEnvironment.Destination RequestedDestination { get; private set; }
        public LaboratoryEnvironment.Destination FlightDestination { get; private set; }
        public string Phase { get; private set; } = "CABIN";
        public bool Ready { get; private set; }
        public bool CabinActionsAvailable
        {
            get
            {
                if(!Ready || IsTravelling || Phase!="CABIN" || RequestedDestination!=ArrivedDestination) return false;
                if(environment==null) return true;
                var desired=environment.followPayloadGravity && fire?.payload?.inputs!=null
                    ? LaboratoryEnvironment.FromGravity(fire.payload.inputs.gravity_g) : environment.destination;
                return desired==ArrivedDestination;
            }
        }
        public Vector3 ParkedPosition { get; private set; }
        public Quaternion ParkedRotation { get; private set; } = Quaternion.identity;
        public const float RocketScale = .8f;
        public const float StationScale = 1.45f;
        public const float EarthDiameterKm=12756, MarsDiameterKm=6771, MoonDiameterKm=3474;
        [Tooltip("Widen the middle of the flight to show planetary size differences; zero disables it.")]
        [Range(0,1)] public float planetaryOverviewStrength = .65f;
        public const float TakeoffEnd = .18f, LandingStart = .82f;
        public const float SkipHoldSeconds = 1;
        const int SpaceLayer=30, RocketLayer=29, EarthViewLayer=28;
        const int ExteriorMask=(1<<SpaceLayer)|(1<<RocketLayer)|(1<<EarthViewLayer);
        public float SkipProgress => Mathf.Clamp01(skipHeld/SkipHoldSeconds);
        float skipHeld;
        GUIStyle skipLabelStyle;
        int initialCullingMask, savedCullingMask;
        Camera windowCamera;
        RenderTexture windowTexture;
        SpaceAmbience ambience;

        readonly List<Material> owned = new List<Material>();
        readonly List<ParticleSystem> engines = new List<ParticleSystem>();
        GameObject world, ship;
        Vector3 savedPosition;
        Quaternion savedRotation;
        float savedFov, savedFarClip, fade;
        Color savedBackground;
        CameraClearFlags savedClear;
        bool savedOrbit, savedState;
        bool started;
        bool ownsWorld;
        static readonly Vector3 WorldOrigin = new Vector3(300, 0, 0);

        void Start()
        {
            started=true;
            Initialize();
        }

        void OnEnable()
        {
            if(started) Initialize();
        }

        void Initialize()
        {
            if (environment == null) environment = GetComponent<LaboratoryEnvironment>();
            if (fire == null) fire = GetComponent<FireSimulationController>();
            if (travelCamera == null) travelCamera = Camera.main;
            if (orbit == null && travelCamera != null) orbit = travelCamera.GetComponent<FireOrbitCamera>();
            if (environment == null || travelCamera == null || modelMaterial == null || engineMaterial == null ||
                rocketModel == null || earthModel == null || moonModel == null || marsModel == null || issModel == null ||
                rocketPalette == null || earthPalette == null || moonPalette == null || marsPalette == null || issPalette == null)
            {
                Debug.LogError("Travel assets missing. Run Fire Simulation > Bind travel assets before building.", this);
                enabled = false; return;
            }
            ArrivedDestination = environment.destination;
            RequestedDestination = ArrivedDestination;
            BindLandingMarkers();
            BuildWorld();
            SetLayer(world.transform,SpaceLayer);
            SetLayer(ship.transform,RocketLayer);
            var earth=world.transform.Find("Earth");
            if(earth!=null) SetLayer(earth,EarthViewLayer);
            initialCullingMask=travelCamera.cullingMask;
            travelCamera.cullingMask &= ~ExteriorMask;
            BuildWindowFeed();
            ship.transform.localPosition=LandingAnchor(ArrivedDestination);
            ship.transform.localRotation=LandingRotation(ArrivedDestination);
            ParkedPosition=ship.transform.localPosition;
            ParkedRotation=ship.transform.localRotation;
            environment.travel = this;
            Ready = true;
        }

        public void RequestDestination(LaboratoryEnvironment.Destination destination)
        {
            RequestedDestination = destination;
        }

        void Update()
        {
            if(IsTravelling)
            {
                bool held=false;
#if ENABLE_INPUT_SYSTEM
                held=Keyboard.current!=null && Keyboard.current.eKey.isPressed;
#elif ENABLE_LEGACY_INPUT_MANAGER
                held=Input.GetKey(KeyCode.E);
#endif
                skipHeld=AccumulateSkip(skipHeld,held && Application.isFocused,Time.unscaledDeltaTime);
                if(skipHeld>=SkipHoldSeconds) SkipJourney();
            }
            else skipHeld=0;
            if (Ready && !IsTravelling && RequestedDestination != ArrivedDestination)
                StartCoroutine(Journey(RequestedDestination));
        }

        void LateUpdate()
        {
            if(Ready)
            {
                UpdateWindowFeed();
                if(ambience!=null) ambience.UpdateObserver(IsTravelling && Phase!="RETURNING TO CABIN"?travelCamera:windowCamera);
            }
        }

        void BuildWorld()
        {
            if (exteriorStage != null && sceneRocket != null)
            {
                world=exteriorStage; ship=sceneRocket; ownsWorld=false;
                world.SetActive(true);
                ship.transform.localPosition=LandingAnchor(ArrivedDestination);
                foreach (float x in new[] { -1.04f, 0, 1.04f }) BuildEngine(new Vector3(x, -2.65f, 0));
                BuildSpaceAmbience();
                return;
            }
            ownsWorld=true;
            world = new GameObject("Exterior travel stage");
            world.transform.position = WorldOrigin;
            Model(earthModel, earthPalette, "Earth", BodyPosition(LaboratoryEnvironment.Destination.Earth), PlanetScale(LaboratoryEnvironment.Destination.Earth));
            Model(moonModel, moonPalette, "Moon", BodyPosition(LaboratoryEnvironment.Destination.Moon), PlanetScale(LaboratoryEnvironment.Destination.Moon));
            Model(marsModel, marsPalette, "Mars", BodyPosition(LaboratoryEnvironment.Destination.Mars), PlanetScale(LaboratoryEnvironment.Destination.Mars));
            Model(issModel, issPalette, "International Space Station", BodyPosition(LaboratoryEnvironment.Destination.ISS), StationScale);
            ship = new GameObject("Travelling rocket");
            ship.transform.SetParent(world.transform, false);
            var rocket = Model(rocketModel, rocketPalette, "Rocket exterior", Vector3.zero, RocketScale);
            rocket.transform.SetParent(ship.transform, false);
            foreach (float x in new[] { -1.04f, 0, 1.04f }) BuildEngine(new Vector3(x, -2.65f, 0));
            BuildSpaceAmbience();
        }

        static void SetLayer(Transform root,int layer)
        {
            foreach(var child in root.GetComponentsInChildren<Transform>(true)) child.gameObject.layer=layer;
        }

        void BuildWindowFeed()
        {
            windowTexture=new RenderTexture(768,768,24) { name="Cabin live destination view" };
            windowTexture.Create();
            var obj=new GameObject("Cabin window camera");
            obj.transform.SetParent(world.transform,false);
            windowCamera=obj.AddComponent<Camera>();
            windowCamera.targetTexture=windowTexture;
            // Render the feed before Main Camera samples it through the porthole material.
            windowCamera.depth=travelCamera.depth-10;
            windowCamera.cullingMask=1<<SpaceLayer;
            windowCamera.clearFlags=CameraClearFlags.SolidColor;
            windowCamera.backgroundColor=new Color(.003f,.005f,.012f);
            windowCamera.nearClipPlane=.02f;windowCamera.farClipPlane=SpaceAmbience.FarClip;windowCamera.fieldOfView=64;
            windowCamera.depthTextureMode=DepthTextureMode.Depth;
            environment.SetWindowTexture(windowTexture);
            UpdateWindowFeed();
        }

        void UpdateWindowFeed()
        {
            if(windowCamera==null) return;
            windowCamera.enabled=!IsTravelling || Phase=="RETURNING TO CABIN";
            if(ship==null) return;
            // A window mounted on the rocket, not an orbital camera aimed at the planet's center.
            Vector3 viewerOffset=travelCamera!=null ? travelCamera.transform.position-new Vector3(0,.8f,-3.5f) : Vector3.zero;
            Vector3 parallax=Vector3.ClampMagnitude(viewerOffset*.025f,.16f);
            bool earthSurface=ArrivedDestination==LaboratoryEnvironment.Destination.Earth;
            // The Earth porthole sees local terrain and atmosphere, excluding distant bodies and stars.
            windowCamera.cullingMask=earthSurface ? 1<<EarthViewLayer : (1<<SpaceLayer)|(1<<EarthViewLayer);
            windowCamera.backgroundColor=earthSurface ? new Color(.23f,.53f,.82f,0) : new Color(.003f,.005f,.012f);
            environment.SetEarthSurfaceView(earthSurface,new Vector2(parallax.x,parallax.y));
            environment.SetIssWindowView(ArrivedDestination==LaboratoryEnvironment.Destination.ISS && !IsTravelling);
            Vector3 mount=new Vector3(0,.4f,.65f)+parallax;
            Vector3 position=ship.transform.position+ship.transform.rotation*mount;
            Vector3 outward=(ship.transform.forward-ship.transform.up*.22f).normalized;
            windowCamera.transform.SetPositionAndRotation(position,Quaternion.LookRotation(outward,ship.transform.up));
        }

        GameObject Model(Object source, Texture2D palette, string label, Vector3 position, float scale)
        {
            var instance = TravelModelInstance.CreateModel(source, world.transform);
            if (instance == null) throw new System.InvalidOperationException("Cannot create travel model: " + label);
            instance.name = label;
            instance.transform.localPosition = position;
            instance.transform.localRotation = Quaternion.identity;
            instance.transform.localScale = Vector3.one * scale;
            var material = new Material(modelMaterial);
            material.SetColor("_BaseColor", Color.white);
            material.SetColor("_Color", Color.white);
            material.SetTexture("_BaseMap", palette);
            material.SetFloat("_Metallic", .05f);
            material.SetFloat("_Smoothness", .25f);
            owned.Add(material);
            foreach (var renderer in instance.GetComponentsInChildren<Renderer>())
            {
                var materials = new Material[Mathf.Max(1,renderer.sharedMaterials.Length)];
                for (int i = 0; i < materials.Length; i++) materials[i] = material;
                renderer.sharedMaterials = materials;
            }
            if(label=="Earth" || label=="Mars")
            {
                var atmosphere=instance.AddComponent<PlanetAtmosphere>();
                atmosphere.destination=label=="Earth" ? LaboratoryEnvironment.Destination.Earth : LaboratoryEnvironment.Destination.Mars;
                atmosphere.atmosphereShader=atmosphereShader;
                atmosphere.cloudShader=cloudShader;
            }
            return instance;
        }

        void BuildEngine(Vector3 position)
        {
            const float exhaustScale=RocketScale/2.7f;
            var exhaust = new GameObject("Engine exhaust");
            exhaust.layer=ship.layer;
            exhaust.transform.SetParent(ship.transform, false);
            exhaust.transform.localPosition = position*exhaustScale;
            exhaust.transform.localRotation = Quaternion.Euler(90, 0, 0);
            var particles = exhaust.AddComponent<ParticleSystem>();
            particles.Stop(true, ParticleSystemStopBehavior.StopEmittingAndClear);
            var main = particles.main;
            main.playOnAwake = false;
            main.loop = true;
            main.startDelay = 0;
            main.simulationSpace = ParticleSystemSimulationSpace.Local;
            main.scalingMode = ParticleSystemScalingMode.Hierarchy;
            main.cullingMode = ParticleSystemCullingMode.AlwaysSimulate;
            main.gravityModifier = 0;
            var inheritVelocity=particles.inheritVelocity;inheritVelocity.enabled=false;
            main.startLifetime = .45f; main.startSpeed = 10*exhaustScale;
            main.startSize = .7f*exhaustScale; main.maxParticles = 500;
            main.startColor = new Color(.35f, .7f, 1, .7f);
            var emission = particles.emission; emission.rateOverTime = 0;
            var shape = particles.shape; shape.shapeType = ParticleSystemShapeType.Cone;
            shape.angle = 9; shape.radius = .16f*exhaustScale;
            var size = particles.sizeOverLifetime; size.enabled = true;
            size.size = new ParticleSystem.MinMaxCurve(1, AnimationCurve.Linear(0, 1, 1, 0));
            var color = particles.colorOverLifetime; color.enabled = true;
            var gradient = new Gradient();
            gradient.SetKeys(new[] { new GradientColorKey(Color.white, 0), new GradientColorKey(new Color(.2f, .5f, 1), .4f), new GradientColorKey(new Color(1,.3f,.04f),1) },
                new[] { new GradientAlphaKey(.8f,0), new GradientAlphaKey(0,1) });
            color.color = gradient;
            particles.GetComponent<ParticleSystemRenderer>().sharedMaterial = engineMaterial;
            engines.Add(particles);
        }

        void BuildSpaceAmbience()
        {
            ambience=world.GetComponent<SpaceAmbience>();
            if(ambience==null) ambience=world.AddComponent<SpaceAmbience>();
            ambience.Configure(sunShader,engineMaterial,nebulaShader);
        }

        public static Vector3 Anchor(LaboratoryEnvironment.Destination destination)
        {
            Vector3 body=BodyPosition(destination);
            if(destination==LaboratoryEnvironment.Destination.ISS) return body+new Vector3(0,0,3);
            return body+SurfaceNormal(destination)*(PlanetScale(destination)+RocketScale+.10f);
        }

        public static Vector3 SurfaceNormal(LaboratoryEnvironment.Destination destination)
            => destination==LaboratoryEnvironment.Destination.Earth ? new Vector3(.8516507f,.4226183f,-.3099755f).normalized : Vector3.up;

        public Vector3 LandingNormal(LaboratoryEnvironment.Destination destination)
        {
            var marker=LandingMarker(destination);
            if(marker!=null) return StageTransform!=null ? StageTransform.InverseTransformDirection(marker.up).normalized : marker.up;
            return destination==LaboratoryEnvironment.Destination.Earth ? earthLandingNormal.normalized : Vector3.up;
        }

        Transform StageTransform => world!=null ? world.transform : exteriorStage!=null ? exteriorStage.transform : null;

        public Transform LandingMarker(LaboratoryEnvironment.Destination destination)
        {
            switch(destination)
            {
                case LaboratoryEnvironment.Destination.Earth:return earthLanding;
                case LaboratoryEnvironment.Destination.Moon:return moonLanding;
                case LaboratoryEnvironment.Destination.Mars:return marsLanding;
                default:return issLanding;
            }
        }

        public void BindLandingMarkers()
        {
            foreach(var root in gameObject.scene.GetRootGameObjects())
                foreach(var item in root.GetComponentsInChildren<Transform>(true))
                {
                    if(earthLanding==null && item.name=="EarthLanding") earthLanding=item;
                    if(moonLanding==null && item.name=="MoonLanding") moonLanding=item;
                    if(marsLanding==null && item.name=="MarsLanding") marsLanding=item;
                    if(issLanding==null && item.name=="IssLanding") issLanding=item;
                }
        }

        public Quaternion LandingRotation(LaboratoryEnvironment.Destination destination)
        {
            var marker=LandingMarker(destination);
            if(marker!=null) return StageTransform!=null ? Quaternion.Inverse(StageTransform.rotation)*marker.rotation : marker.rotation;
            return Quaternion.FromToRotation(Vector3.up,LandingNormal(destination));
        }

        Quaternion ArrivalRotation(LaboratoryEnvironment.Destination destination,Quaternion heading,float progress)
        {
            if(LandingMarker(destination)!=null)
                return Quaternion.Slerp(heading,LandingRotation(destination),Ramp(.62f,LandingStart,progress));
            return ApproachRotation(destination,heading,progress,LandingNormal(destination));
        }

        public Vector3 LandingAnchor(LaboratoryEnvironment.Destination destination)
        {
            var marker=LandingMarker(destination);
            if(marker!=null)
            {
                Vector3 point=marker.position+marker.up*Mathf.Max(0,landingClearance);
                return StageTransform!=null ? StageTransform.InverseTransformPoint(point) : point-WorldOrigin;
            }
            if(destination!=LaboratoryEnvironment.Destination.Earth) return Anchor(destination);
            return BodyPosition(destination)+earthLandingPoint*PlanetScale(destination)+LandingNormal(destination)*(RocketScale+.10f);
        }

        public static Vector3 BodyPosition(LaboratoryEnvironment.Destination destination)
        {
            switch(destination)
            {
                case LaboratoryEnvironment.Destination.Earth: return new Vector3(-180,-90,-60);
                // Distances remain compressed for the demo, with distinct Earth orbit/lunar/interplanetary ranges.
                case LaboratoryEnvironment.Destination.Moon: return new Vector3(1250,-PlanetScale(destination),140);
                case LaboratoryEnvironment.Destination.Mars: return new Vector3(3300,-PlanetScale(destination),2100);
                default: return new Vector3(-170,8,-60);
            }
        }

        public static float PlanetScale(LaboratoryEnvironment.Destination destination)
        {
            // Approximate diameters supplied in the visual reference, with one common display scale.
            switch(destination)
            {
                case LaboratoryEnvironment.Destination.Earth: return 90;
                case LaboratoryEnvironment.Destination.Mars: return 90*MarsDiameterKm/EarthDiameterKm;
                case LaboratoryEnvironment.Destination.Moon: return 90*MoonDiameterKm/EarthDiameterKm;
                default: return StationScale;
            }
        }

        public static Quaternion ApproachRotation(LaboratoryEnvironment.Destination destination, Quaternion flightRotation, float progress, Vector3? landingNormal=null)
        {
            if(destination == LaboratoryEnvironment.Destination.ISS) return flightRotation;
            return Quaternion.Slerp(flightRotation, Quaternion.FromToRotation(Vector3.up,landingNormal??SurfaceNormal(destination)), Ramp(.62f,LandingStart,progress));
        }

        public static Quaternion DepartureRotation(Quaternion parkedRotation, Quaternion flightRotation, float progress)
            => Quaternion.Slerp(parkedRotation,flightRotation,Ramp(TakeoffEnd,.34f,progress));

        public static Vector3 Route(Vector3 start, Vector3 end, float t)
        {
            t=Mathf.Clamp01(t);
            // One geometric parabola. Quintic timing makes speed and acceleration vanish at both ends.
            float u=t*t*t*(10+t*(-15+6*t));
            float height=Mathf.Max(20,Vector3.Distance(start,end)*.65f);
            return Vector3.Lerp(start,end,u)+Vector3.up*(4*height*u*(1-u));
        }

        public static float AccumulateSkip(float elapsed,bool pressed,float delta)
            => pressed ? Mathf.Min(SkipHoldSeconds,elapsed+Mathf.Max(0,delta)) : 0;

        IEnumerator Journey(LaboratoryEnvironment.Destination target)
        {
            IsTravelling = true; FlightDestination = target;
            foreach(var extinguisher in Object.FindObjectsByType<ExtinguisherController>(FindObjectsSortMode.None))
                extinguisher.CancelForTravel();
            skipHeld=0;
            savedPosition = travelCamera.transform.position; savedRotation = travelCamera.transform.rotation;
            savedFov = travelCamera.fieldOfView; savedClear = travelCamera.clearFlags; savedBackground = travelCamera.backgroundColor;
            savedFarClip=travelCamera.farClipPlane;
            savedCullingMask=travelCamera.cullingMask;
            savedOrbit = orbit != null && orbit.enabled;
            savedState = true;
            if (orbit != null) orbit.enabled = false;
            Phase = "LEAVING CABIN";
            Vector3 window = new Vector3(0, 1.65f, 2.35f);
            Quaternion windowLook = Quaternion.LookRotation(Vector3.forward);
            yield return Animate(1.3f, t =>
            {
                float ease = Mathf.SmoothStep(0,1,t);
                travelCamera.transform.SetPositionAndRotation(Vector3.Lerp(savedPosition,window,ease),Quaternion.Slerp(savedRotation,windowLook,ease));
                fade = Ramp(.65f,1,t);
            });
            world.SetActive(true);
            travelCamera.cullingMask=ExteriorMask;
            travelCamera.clearFlags = CameraClearFlags.SolidColor;
            travelCamera.backgroundColor = new Color(.003f,.005f,.012f);
            travelCamera.fieldOfView = 48;
            travelCamera.farClipPlane=SpaceAmbience.FarClip;
            Vector3 start = ParkedPosition, end = LandingAnchor(target);
            Quaternion departureRotation=ParkedRotation;
            Vector3 departureView = ObservationOffset(ArrivedDestination), arrivalView = ObservationOffset(target);
            ship.transform.localPosition = start;
            ship.transform.localRotation = departureRotation;
            Phase = "ENGINE IGNITION";
            yield return Animate(Mathf.Max(.2f,ignitionSeconds), t =>
            {
                fade = 1-Ramp(0,.55f,t);
                SetThrust(.65f*Mathf.SmoothStep(0,1,t));
                FollowShip(Vector3.Lerp(departureView*.5f,departureView,Mathf.SmoothStep(0,1,t)));
            });
            Phase = "IN FLIGHT";
            yield return Animate(Mathf.Max(1,flightSeconds), t =>
            {
                float ease = Mathf.SmoothStep(0,1,t);
                Phase=t<TakeoffEnd?"TAKEOFF":t>LandingStart?"LANDING":"IN FLIGHT";
                Vector3 position = Route(start,end,t);
                Vector3 tangent = Route(start,end,Mathf.Min(1,t+.0005f))-Route(start,end,Mathf.Max(0,t-.0005f));
                ship.transform.localPosition = position;
                if (tangent.sqrMagnitude > .00001f)
                {
                    Quaternion departing=DepartureRotation(departureRotation,Quaternion.FromToRotation(Vector3.up,tangent.normalized),t);
                    ship.transform.localRotation = ArrivalRotation(target,departing,t);
                }
                SetThrust(t<TakeoffEnd ? Mathf.Lerp(.65f,1,t/TakeoffEnd) : Mathf.Lerp(1,.45f,Ramp(LandingStart,1,t)));
                Vector3 observation=OrbitObservation(departureView,arrivalView,Ramp(.40f,.94f,t));
                // A wide mid-flight shot exposes planet silhouettes; close surface shots hide scale differences.
                float overview=Mathf.Pow(Mathf.Sin(Mathf.PI*t),8)*planetaryOverviewStrength;
                observation=Vector3.Slerp(observation.normalized,new Vector3(1,.6f,-1).normalized,overview)
                    *Mathf.Lerp(observation.magnitude,360,overview);
                FollowShip(observation);
            });
            Phase = "ARRIVAL";
            ship.transform.localPosition = end;
            if(LandingMarker(target)!=null || target != LaboratoryEnvironment.Destination.ISS) ship.transform.localRotation=LandingRotation(target);
            yield return Animate(1.2f, t => { SetThrust(.45f*(1-Mathf.SmoothStep(0,1,t))); FollowShip(arrivalView); });
            SetThrust(0);
            ParkedPosition=ship.transform.localPosition;
            ParkedRotation=ship.transform.localRotation;
            ArrivedDestination = target;
            Phase = "RETURNING TO CABIN";
            yield return Animate(.6f, t => fade=t);
            travelCamera.cullingMask=savedCullingMask;
            travelCamera.clearFlags = savedClear; travelCamera.backgroundColor = savedBackground; travelCamera.fieldOfView = savedFov;
            yield return Animate(1, t =>
            {
                float ease = Mathf.SmoothStep(0,1,t);
                travelCamera.transform.SetPositionAndRotation(Vector3.Lerp(window,savedPosition,ease),Quaternion.Slerp(windowLook,savedRotation,ease));
                fade=1-ease;
            });
            RestoreCamera();
            Phase = "CABIN"; IsTravelling = false;
        }

        public void SkipAnimation()
        {
            if (IsTravelling || RequestedDestination != ArrivedDestination)
            {
                if (!IsTravelling || RequestedDestination != FlightDestination)
                    FlightDestination = RequestedDestination;
                SkipJourney();
            }
        }

        void SkipJourney()
        {
            StopAllCoroutines();
            Vector3 end=LandingAnchor(FlightDestination);
            Vector3 tangent=end-Route(ParkedPosition,end,.999f);
            Quaternion heading=tangent.sqrMagnitude>.00001f ? Quaternion.FromToRotation(Vector3.up,tangent.normalized) : Quaternion.identity;
            ship.transform.localPosition=end;
            ship.transform.localRotation=ArrivedDestination==FlightDestination ? ParkedRotation : ArrivalRotation(FlightDestination,heading,1);
            ParkedPosition=end;ParkedRotation=ship.transform.localRotation;
            ArrivedDestination=FlightDestination;
            SetThrust(0);
            foreach(var engine in engines) engine.Clear();
            RestoreCamera();
            IsTravelling=false;skipHeld=0;Phase="CABIN";
        }

        IEnumerator Animate(float seconds, System.Action<float> frame)
        {
            float elapsed=0;
            while (elapsed<seconds) { frame(Mathf.Clamp01(elapsed/seconds)); elapsed+=Time.deltaTime; yield return null; }
            frame(1);
        }

        static float Ramp(float start,float end,float t) => Mathf.SmoothStep(0,1,Mathf.InverseLerp(start,end,t));

        Vector3 ObservationOffset(LaboratoryEnvironment.Destination destination)
        {
            // Close spacecraft shot, with the much larger planetary horizon behind the rocket.
            if(destination==LaboratoryEnvironment.Destination.ISS) return new Vector3(5,3,8);
            Vector3 normal=(LandingAnchor(destination)-BodyPosition(destination)).normalized;
            Vector3 tangent=Vector3.ProjectOnPlane(new Vector3(5,0,-8),normal).normalized;
            // View Earth from the opposite side of the rocket, facing away from the terrain.
            if(destination==LaboratoryEnvironment.Destination.Earth) tangent=-tangent;
            return normal*5+tangent*9;
        }

        public static Vector3 OrbitObservation(Vector3 from,Vector3 to,float progress)
        {
            // Move around the rocket on an arc; a straight interpolation can cut through its center.
            return Vector3.Slerp(from.normalized,to.normalized,progress)*Mathf.Lerp(from.magnitude,to.magnitude,progress);
        }

        public static Vector3 PushOutsidePlanet(Vector3 camera,Vector3 center,float radius)
        {
            Vector3 delta=camera-center;
            float clearance=radius+Mathf.Max(1.25f,radius*.05f);
            if(delta.sqrMagnitude<clearance*clearance)
                return center+(delta.sqrMagnitude>.000001f?delta.normalized:Vector3.up)*clearance;
            return camera;
        }

        public static Vector3 SafeCameraPosition(Vector3 localPosition)
        {
            localPosition=PushOutsidePlanet(localPosition,BodyPosition(LaboratoryEnvironment.Destination.Earth),PlanetScale(LaboratoryEnvironment.Destination.Earth));
            localPosition=PushOutsidePlanet(localPosition,BodyPosition(LaboratoryEnvironment.Destination.Moon),PlanetScale(LaboratoryEnvironment.Destination.Moon));
            localPosition=PushOutsidePlanet(localPosition,BodyPosition(LaboratoryEnvironment.Destination.Mars),PlanetScale(LaboratoryEnvironment.Destination.Mars));
            return localPosition;
        }

        void FollowShip(Vector3 offset)
        {
            Vector3 position=ship.transform.position;
            Vector3 safe=SafeCameraPosition(ship.transform.localPosition+offset);
            Vector3 cameraPosition=world.transform.TransformPoint(safe);
            travelCamera.transform.SetPositionAndRotation(cameraPosition,Quaternion.LookRotation(position-cameraPosition,world.transform.up));
        }

        void SetThrust(float power)
        {
            power=Mathf.Clamp01(power);
            const float exhaustScale=RocketScale/2.7f;
            foreach(var engine in engines)
            {
                var emission=engine.emission;
                emission.enabled=power>0;
                emission.rateOverTime=260*power;
                var main=engine.main;
                main.startSpeedMultiplier=10*exhaustScale*Mathf.Lerp(.3f,1,power);
                main.startSizeMultiplier=.85f*exhaustScale*Mathf.Lerp(.4f,1,power);
                main.startLifetimeMultiplier=Mathf.Lerp(.15f,.45f,power);
                // A stopped emitter can still contain live particles: isPlaying alone is insufficient.
                if (power>0 && !engine.isEmitting) engine.Play(false);
                if (power<=0 && engine.isEmitting) engine.Stop(false,ParticleSystemStopBehavior.StopEmitting);
            }
        }

        void RestoreCamera()
        {
            fade=0;
            if (!savedState) return;
            if (travelCamera!=null)
            {
                travelCamera.transform.SetPositionAndRotation(savedPosition,savedRotation);
                travelCamera.fieldOfView=savedFov; travelCamera.clearFlags=savedClear; travelCamera.backgroundColor=savedBackground;
                travelCamera.farClipPlane=savedFarClip;
                travelCamera.cullingMask=savedCullingMask;
            }
            if (orbit!=null) orbit.enabled=savedOrbit;
            savedState=false;
        }

        // Only the hold-to-skip indicator and cinematic fade remain on screen.
        void OnGUI()
        {
            if(!Application.isPlaying || Event.current.type!=EventType.Repaint || (fade<=0 && !IsTravelling)) return;
            int depth=GUI.depth;var color=GUI.color;
            GUI.depth=-10000;
            if(fade>0)
            {
                GUI.color=new Color(0,0,0,fade);
                GUI.DrawTexture(new Rect(0,0,Screen.width,Screen.height),Texture2D.whiteTexture);
            }
            if(IsTravelling) DrawSkipIndicator();
            GUI.color=color;GUI.depth=depth;
        }

        void DrawSkipIndicator()
        {
            float scale=Mathf.Clamp(Screen.width/1280f,.7f,1.15f);
            float width=190*scale,height=42*scale,padding=12*scale;
            var panel=new Rect(Screen.width-width-18*scale,Screen.height-height-18*scale,width,height);
            GUI.color=new Color(.025f,.045f,.065f,.65f);
            GUI.DrawTexture(panel,Texture2D.whiteTexture);
            if(skipLabelStyle==null) skipLabelStyle=new GUIStyle(GUI.skin.label) {alignment=TextAnchor.MiddleRight};
            skipLabelStyle.fontSize=Mathf.RoundToInt(12*scale);
            skipLabelStyle.normal.textColor=new Color(.88f,.92f,.96f);
            GUI.color=Color.white;
            GUI.Label(new Rect(panel.x+padding,panel.y+4*scale,width-padding*2,23*scale),"Hold E to skip",skipLabelStyle);
            var bar=new Rect(panel.x+padding,panel.yMax-10*scale,width-padding*2,3*scale);
            GUI.color=new Color(1,1,1,.18f);
            GUI.DrawTexture(bar,Texture2D.whiteTexture);
            if(SkipProgress>0)
            {
                GUI.color=new Color(.36f,.81f,.94f,.95f);
                bar.width*=SkipProgress;
                GUI.DrawTexture(bar,Texture2D.whiteTexture);
            }
        }

        void OnDisable()
        {
            StopAllCoroutines(); RestoreCamera();
            if(environment!=null) environment.SetWindowTexture(null);
            if(environment!=null) environment.SetIssWindowView(false);
            if(windowTexture!=null) { windowTexture.Release();Destroy(windowTexture);windowTexture=null; }
            if(windowCamera!=null) { Destroy(windowCamera.gameObject);windowCamera=null; }
            if(Ready && travelCamera!=null) travelCamera.cullingMask=initialCullingMask;
            if (ownsWorld && world!=null) Destroy(world);
            else if (world!=null)
            {
                foreach(var engine in engines) if(engine!=null) Destroy(engine.gameObject);
                world.SetActive(false);
            }
            world=null; ship=null;ambience=null;
            foreach(var material in owned) if(material!=null) Destroy(material);
            owned.Clear(); engines.Clear(); Ready=false; IsTravelling=false;
        }
    }
}
