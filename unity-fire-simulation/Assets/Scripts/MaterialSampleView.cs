// SI-assisted: generated with Codex, reviewed and edited by Esquivel & Elias (21 PyroRangers).
using UnityEngine;

namespace FireSimulation
{
    [ExecuteAlways]
    public sealed class MaterialSampleView : MonoBehaviour
    {
        public FireSimulationController fire;
        public Shader sampleShader;
        public Transform originalSample;
        public float sampleBaseHeight = .21f;
        public static readonly string[] MaterialIds = {
            "pmma_clear_slab", "pmma_thin_film", "cotton_fiberglass_sibal", "pmma_rod",
            "pmma_black_rod", "nomex_iii_fabric", "japan_wax_candle"
        };
        public static readonly string[] MaterialLabels = {
            "Clear PMMA slab", "PMMA film", "SIBAL fabric", "Clear PMMA rod",
            "Black PMMA rod", "Nomex III fabric", "Japan wax candle"
        };
        GameObject generated;
        Material material, wickMaterial;
        Mesh clothMesh;
        Renderer originalRenderer;
        bool originalEnabled;
        string currentId;
        float currentThickness = -1;
        public Vector3 FlameOrigin { get; private set; }
        public Vector3 EmitterSize { get; private set; } = new Vector3(.4f, .04f, .3f);
        public bool IsCandle { get; private set; }

        public static string NormalizeId(string value)
        {
            string id = (value ?? "").Trim().ToLowerInvariant();
            // Backward compatibility for the original supplied test payload.
            return id == "nomex_ht90_40" ? "nomex_iii_fabric" : id;
        }

        public static int MaterialIndex(string value) => System.Array.IndexOf(MaterialIds, NormalizeId(value));

        public void SelectMaterial(int index)
        {
            if (index < 0 || index >= MaterialIds.Length || fire?.payload?.inputs == null) return;
            fire.payload.inputs.material_id = MaterialIds[index];
            fire.payload.inputs.material_name = MaterialLabels[index];
            Refresh();
        }

        void OnEnable()
        {
            if (fire == null) fire = GetComponent<FireSimulationController>();
            if (originalSample == null && fire != null) originalSample = fire.materialSample;
            if (originalSample != null)
            {
                originalRenderer = originalSample.GetComponent<Renderer>();
                if (originalRenderer != null) { originalEnabled = originalRenderer.enabled; originalRenderer.enabled = false; }
            }
            Refresh();
        }

        void Update() => Refresh();

        public void Refresh()
        {
            if (sampleShader == null || fire?.payload?.inputs == null) return;
            var input = fire.payload.inputs;
            if (float.IsNaN(input.thickness_mm) || float.IsInfinity(input.thickness_mm) || input.thickness_mm <= 0) return;
            string id = NormalizeId(input.material_id);
            if (generated != null && currentId == id && currentThickness == input.thickness_mm) return;
            Clear(); currentId = id; currentThickness = input.thickness_mm;
            generated = new GameObject("Material specimen: " + id) { hideFlags = HideFlags.HideAndDontSave };
            generated.transform.SetParent(transform, false);
            generated.transform.position = new Vector3(0, sampleBaseHeight, 0);
            generated.transform.rotation = Quaternion.identity;
            generated.transform.localScale = Vector3.one;
            material = new Material(sampleShader) { hideFlags = HideFlags.HideAndDontSave };
            float thickness = Mathf.Clamp(input.thickness_mm * .016f, .006f, .2f);
            Color color = new Color(.46f, .84f, .95f, .40f);
            float weave = 0;
            IsCandle = id == "japan_wax_candle";
            bool rod = id == "pmma_rod" || id == "pmma_black_rod";
            bool fabric = id == "cotton_fiberglass_sibal" || id == "nomex_iii_fabric";
            if (rod || IsCandle)
            {
                float height = IsCandle ? .48f : .65f;
                float diameter = IsCandle ? .19f : Mathf.Clamp(input.thickness_mm * .02f, .07f, .28f);
                if (id == "pmma_black_rod") color = new Color(.025f, .03f, .04f, 1);
                if (IsCandle) color = new Color(.95f, .83f, .58f, 1);
                Primitive("Specimen body", PrimitiveType.Cylinder, new Vector3(0, height / 2, 0), new Vector3(diameter, height / 2, diameter), material);
                float tip = height;
                if (IsCandle)
                {
                    wickMaterial = new Material(sampleShader) { hideFlags = HideFlags.HideAndDontSave };
                    wickMaterial.SetColor("_BaseColor", new Color(.08f, .055f, .035f, 1));
                    Primitive("Candle wick", PrimitiveType.Cylinder, new Vector3(0, height + .025f, 0), new Vector3(.013f, .025f, .013f), wickMaterial);
                    tip += .05f;
                }
                FlameOrigin = new Vector3(0, sampleBaseHeight + tip + .015f, 0);
                EmitterSize = IsCandle ? new Vector3(.025f, .025f, .025f) : new Vector3(diameter, .04f, diameter);
            }
            else
            {
                bool film = id == "pmma_thin_film";
                if (fabric) { color = id == "nomex_iii_fabric" ? new Color(.66f, .53f, .29f, 1) : new Color(.86f, .84f, .72f, 1); weave = 1; }
                if (film || fabric)
                {
                    // Draped sheet geometry and woven shading distinguish thin specimens.
                    clothMesh = Sheet(.7f, .48f, fabric ? .025f : .012f);
                    var sheet = new GameObject("Draped specimen", typeof(MeshFilter), typeof(MeshRenderer)) { hideFlags = HideFlags.HideAndDontSave };
                    sheet.transform.SetParent(generated.transform, false);
                    sheet.transform.localPosition = new Vector3(0, thickness / 2 + .025f, 0);
                    sheet.GetComponent<MeshFilter>().sharedMesh = clothMesh;
                    sheet.GetComponent<Renderer>().sharedMaterial = material;
                    if (film) color.a = .25f;
                }
                else
                {
                    if (MaterialIndex(id) < 0) color = new Color(.6f, .3f, .65f, 1);
                    Primitive("Slab specimen", PrimitiveType.Cube, new Vector3(0, thickness / 2, 0), new Vector3(.65f, thickness, .48f), material);
                }
                FlameOrigin = new Vector3(0, sampleBaseHeight + thickness + .055f, 0);
                EmitterSize = new Vector3(.52f, .035f, .36f);
            }
            material.SetColor("_BaseColor", color);
            material.SetFloat("_Weave", weave);
        }

        void Primitive(string name, PrimitiveType type, Vector3 position, Vector3 scale, Material appearance)
        {
            var part = GameObject.CreatePrimitive(type);
            part.name = name; part.hideFlags = HideFlags.HideAndDontSave;
            part.transform.SetParent(generated.transform, false);
            part.transform.localPosition = position; part.transform.localScale = scale;
            part.GetComponent<Renderer>().sharedMaterial = appearance;
            var collider = part.GetComponent<Collider>();
            if(collider != null) collider.enabled = false;
        }

        static Mesh Sheet(float width, float depth, float amplitude)
        {
            const int segments = 20;
            var vertices = new Vector3[(segments + 1) * (segments + 1)];
            var uv = new Vector2[vertices.Length];
            var triangles = new int[segments * segments * 6];
            int t = 0;
            for (int z = 0; z <= segments; z++) for (int x = 0; x <= segments; x++)
            {
                int n = z * (segments + 1) + x;
                float u = x / (float)segments, v = z / (float)segments;
                vertices[n] = new Vector3((u - .5f) * width, Mathf.Sin(u * 13) * Mathf.Sin(v * 7) * amplitude, (v - .5f) * depth);
                uv[n] = new Vector2(u, v);
                if (x == segments || z == segments) continue;
                triangles[t++] = n; triangles[t++] = n + segments + 1; triangles[t++] = n + 1;
                triangles[t++] = n + 1; triangles[t++] = n + segments + 1; triangles[t++] = n + segments + 2;
            }
            var result = new Mesh { name = "Draped material sheet", hideFlags = HideFlags.HideAndDontSave };
            result.vertices = vertices; result.uv = uv; result.triangles = triangles;
            result.RecalculateNormals(); result.RecalculateBounds(); return result;
        }

        void Clear()
        {
            // Hide the previous specimen immediately when replacing it within the same frame.
            if (generated != null) generated.SetActive(false);
            Release(generated); Release(material); Release(wickMaterial); Release(clothMesh);
            generated = null; material = null; wickMaterial = null; clothMesh = null;
        }
        void OnDisable()
        {
            Clear();
            if (originalRenderer != null) originalRenderer.enabled = originalEnabled;
        }
        static void Release(Object value)
        {
            if (value == null) return;
            if (Application.isPlaying) Destroy(value); else DestroyImmediate(value);
        }
    }
}
