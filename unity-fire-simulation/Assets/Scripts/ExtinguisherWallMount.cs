// SI-assisted: generated with Codex, reviewed and edited by Esquivel & Elias (21 PyroRangers).
using UnityEngine;

namespace FireSimulation
{
    [ExecuteAlways]
    public sealed class ExtinguisherWallMount : MonoBehaviour
    {
        public Material appearance;
        GameObject geometry;
        Material material;
        void OnEnable()
        {
            if(appearance==null) return;
            geometry=new GameObject("Voxel wall bracket geometry") {hideFlags=HideFlags.HideAndDontSave};
            geometry.transform.SetParent(transform,false);
            material=new Material(appearance) {hideFlags=HideFlags.HideAndDontSave};
            material.SetColor("_BaseColor",new Color(.20f,.25f,.29f));
            Box("Wall mounting plate",Vector3.zero,new Vector3(.08f,.95f,.72f));
            Box("Bottom cradle",new Vector3(-.18f,-.365f,0),new Vector3(.44f,.04f,.70f));
            foreach(float height in new[] {-.12f,.08f})
            {
                Box("Front retaining band",new Vector3(-.39f,height,0),new Vector3(.035f,.035f,.58f));
                Box("Retaining band side",new Vector3(-.18f,height,-.28f),new Vector3(.44f,.035f,.035f));
                Box("Retaining band side",new Vector3(-.18f,height,.28f),new Vector3(.44f,.035f,.035f));
            }
        }
        void Box(string label,Vector3 position,Vector3 scale)
        {
            var part=GameObject.CreatePrimitive(PrimitiveType.Cube);part.name=label;part.hideFlags=HideFlags.HideAndDontSave;
            part.transform.SetParent(geometry.transform,false);part.transform.localPosition=position;part.transform.localScale=scale;
            part.GetComponent<Renderer>().sharedMaterial=material;
            var collider=part.GetComponent<Collider>();if(collider!=null) collider.enabled=false;
        }
        void OnDisable()
        {
            if(Application.isPlaying) {Destroy(geometry);Destroy(material);}
            else {if(geometry!=null) DestroyImmediate(geometry);if(material!=null) DestroyImmediate(material);}
            geometry=null;material=null;
        }
    }
}
