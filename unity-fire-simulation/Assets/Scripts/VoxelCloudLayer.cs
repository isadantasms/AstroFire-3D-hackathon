// SI-assisted: generated with Codex, reviewed and edited by Esquivel & Elias (21 PyroRangers).
using System.Collections.Generic;
using UnityEngine;

namespace FireSimulation
{
    [ExecuteAlways]
    public sealed class VoxelCloudLayer : MonoBehaviour
    {
        Mesh mesh;
        public void Build(float radius, Material material)
        {
            Clear();
            var vertices=new List<Vector3>();var normals=new List<Vector3>();var triangles=new List<int>();
            var random=new System.Random(7137);
            float cell=radius/60;
            for(int group=0;group<75;group++)
            {
                float y=(float)random.NextDouble()*1.8f-.9f;
                float angle=(float)random.NextDouble()*Mathf.PI*2;
                Vector3 normal=new Vector3(Mathf.Sqrt(1-y*y)*Mathf.Cos(angle),y,Mathf.Sqrt(1-y*y)*Mathf.Sin(angle));
                Vector3 tangent=Vector3.Cross(normal,Vector3.up).normalized,side=Vector3.Cross(normal,tangent);
                int blocks=random.Next(4,8);
                for(int block=0;block<blocks;block++)
                {
                    Vector3 center=normal*(radius+cell*4.5f)+tangent*((float)random.NextDouble()-.5f)*cell*9+side*((float)random.NextDouble()-.5f)*cell*5;
                    center=new Vector3(Mathf.Round(center.x/cell),Mathf.Round(center.y/cell),Mathf.Round(center.z/cell))*cell;
                    Vector3 size=new Vector3(random.Next(2,5),random.Next(1,3),random.Next(2,5))*cell;
                    for(int axis=0;axis<3;axis++) for(int sign=-1;sign<=1;sign+=2)
                    {
                        int a=(axis+1)%3,b=(axis+2)%3;
                        Vector3 n=Vector3.zero;n[axis]=sign;
                        int first=vertices.Count;
                        foreach(var uv in new[] {new Vector2(-1,-1),new Vector2(1,-1),new Vector2(1,1),new Vector2(-1,1)})
                        {
                            Vector3 p=center;p[axis]+=size[axis]*sign*.5f;p[a]+=size[a]*uv.x*.5f;p[b]+=size[b]*uv.y*.5f;
                            vertices.Add(p);normals.Add(n);
                        }
                        if(sign>0) triangles.AddRange(new[] {first,first+1,first+2,first,first+2,first+3});
                        else triangles.AddRange(new[] {first,first+2,first+1,first,first+3,first+2});
                    }
                }
            }
            mesh=new Mesh {name="Voxel cloud clusters",hideFlags=HideFlags.HideAndDontSave};
            mesh.SetVertices(vertices);mesh.SetNormals(normals);mesh.SetTriangles(triangles,0);mesh.RecalculateBounds();
            var filter=GetComponent<MeshFilter>();if(filter==null) filter=gameObject.AddComponent<MeshFilter>();filter.sharedMesh=mesh;
            var renderer=GetComponent<MeshRenderer>();if(renderer==null) renderer=gameObject.AddComponent<MeshRenderer>();renderer.sharedMaterial=material;
            renderer.shadowCastingMode=UnityEngine.Rendering.ShadowCastingMode.Off;
        }
        void OnDisable()=>Clear();
        void Clear()
        {
            if(mesh==null) return;
            if(Application.isPlaying) Destroy(mesh);else DestroyImmediate(mesh);mesh=null;
        }
    }
}
