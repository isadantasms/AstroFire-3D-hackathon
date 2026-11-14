// SI-assisted: generated with Codex; pending human review.
using UnityEngine;

namespace FireSimulation
{
    [ExecuteAlways]
    public sealed class TravelModelInstance : MonoBehaviour
    {
        public Object source;
        public Texture2D palette;
        public Material appearance;
        public float visualScale = 1;
        public bool usePlanetProportions;
        public LaboratoryEnvironment.Destination planetDestination;
        GameObject instance;
        Material owned;

        void OnEnable()
        {
#if UNITY_EDITOR
            // Resolve imported subassets through Unity rather than relying on guessed OBJ file IDs.
            string path = UnityEditor.AssetDatabase.GetAssetPath(source);
            if (!string.IsNullOrEmpty(path))
                foreach (var asset in UnityEditor.AssetDatabase.LoadAllAssetsAtPath(path))
                    if (asset is Mesh) { source = asset; break; }
#endif
            Rebuild();
        }

        public void Rebuild()
        {
            Clear();
            if (source == null || appearance == null) return;
            if(usePlanetProportions) visualScale=DestinationTravel.PlanetScale(planetDestination);
            instance = CreateModel(source, transform);
            if (instance == null) return;
            instance.name = "Voxel geometry (preview and runtime)";
            instance.hideFlags = HideFlags.HideAndDontSave;
            foreach (var child in instance.GetComponentsInChildren<Transform>())
            { child.gameObject.hideFlags = HideFlags.HideAndDontSave;child.gameObject.layer=gameObject.layer; }
            instance.transform.localPosition = Vector3.zero;
            instance.transform.localRotation = Quaternion.identity;
            instance.transform.localScale = Vector3.one * visualScale;
            owned = new Material(appearance) { hideFlags = HideFlags.HideAndDontSave };
            owned.SetColor("_BaseColor", Color.white);
            owned.SetTexture("_BaseMap", palette);
            owned.SetFloat("_Metallic", .05f); owned.SetFloat("_Smoothness", .25f);
            foreach (var renderer in instance.GetComponentsInChildren<Renderer>())
            {
                var materials = new Material[Mathf.Max(1, renderer.sharedMaterials.Length)];
                for (int i=0;i<materials.Length;i++) materials[i]=owned;
                renderer.sharedMaterials=materials;
            }
        }

        void Update()
        {
            if(usePlanetProportions && Mathf.Abs(visualScale-DestinationTravel.PlanetScale(planetDestination))>.0001f) Rebuild();
        }

        public static GameObject CreateModel(Object template, Transform parent)
        {
            if (template is Mesh mesh)
            {
                var result = new GameObject("Imported voxel mesh", typeof(MeshFilter), typeof(MeshRenderer));
                result.transform.SetParent(parent, false);
                result.GetComponent<MeshFilter>().sharedMesh = mesh;
                return result;
            }
            if (template is GameObject)
            {
                // Non-generic overload avoids Unity's internal Instantiate<T> cast.
                Object clone = Object.Instantiate(template, parent, false);
                if (clone is GameObject result) return result;
                Release(clone);
            }
            Debug.LogError("Expected a Mesh or GameObject model asset, received: " +
                (template == null ? "null" : template.GetType().Name));
            return null;
        }

        void OnDisable() => Clear();
        void Clear()
        {
            if (instance != null) instance.SetActive(false);
            Release(instance); Release(owned); instance=null; owned=null;
        }
        static void Release(Object value)
        {
            if (value == null) return;
            if (Application.isPlaying) Destroy(value); else DestroyImmediate(value);
        }
    }
}
