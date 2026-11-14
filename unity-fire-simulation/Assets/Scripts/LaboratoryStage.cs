// SI-assisted: generated with Codex; pending human review.
using UnityEngine;

namespace FireSimulation
{
    [ExecuteAlways]
    public sealed class LaboratoryStage : MonoBehaviour
    {
        public Shader gridShader;
        GameObject generated;
        Mesh mesh;
        Material gridMaterial;

        void OnEnable()
        {
            if (generated != null || gridShader == null) return;
            generated = new GameObject("Camera-relative floor grid (generated)");
            generated.hideFlags = HideFlags.HideAndDontSave;
            generated.transform.SetParent(transform, false);
            generated.transform.position = Vector3.zero;
            gridMaterial = new Material(gridShader) { hideFlags = HideFlags.HideAndDontSave };
            // Camera-relative geometry, world-anchored lines. Works for Game and Scene cameras.
            const float extent = 5000;
            mesh = new Mesh { name = "Infinite floor grid", hideFlags = HideFlags.HideAndDontSave };
            mesh.vertices = new[] {
                new Vector3(-extent, 0, -extent), new Vector3(-extent, 0, extent),
                new Vector3(extent, 0, extent), new Vector3(extent, 0, -extent)
            };
            mesh.triangles = new[] { 0, 1, 2, 0, 2, 3 };
            mesh.bounds = new Bounds(Vector3.zero, Vector3.one * 1000000);
            generated.AddComponent<MeshFilter>().sharedMesh = mesh;
            var renderer = generated.AddComponent<MeshRenderer>();
            renderer.sharedMaterial = gridMaterial;
            renderer.shadowCastingMode = UnityEngine.Rendering.ShadowCastingMode.Off;
            renderer.receiveShadows = false;
            renderer.lightProbeUsage = UnityEngine.Rendering.LightProbeUsage.Off;
            renderer.reflectionProbeUsage = UnityEngine.Rendering.ReflectionProbeUsage.Off;
        }

        void OnDisable()
        {
            Release(generated); Release(mesh); Release(gridMaterial);
            generated = null; mesh = null; gridMaterial = null;
        }

        static void Release(Object value)
        {
            if (value == null) return;
            if (Application.isPlaying) Destroy(value); else DestroyImmediate(value);
        }
    }
}
