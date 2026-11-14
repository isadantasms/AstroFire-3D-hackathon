// SI-assisted: generated with Codex; pending human review.
Shader "FireSimulation/EarthClouds"
{
    SubShader
    {
        Tags { "RenderPipeline"="UniversalPipeline" "RenderType"="Opaque" }
        Pass
        {
            ZWrite On
            Cull Back
            HLSLPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Core.hlsl"
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Lighting.hlsl"
            struct A { float4 p:POSITION;float3 n:NORMAL; };
            struct V { float4 p:SV_POSITION;float3 normal:TEXCOORD0; };
            V vert(A i) { V o;o.p=TransformObjectToHClip(i.p.xyz);o.normal=TransformObjectToWorldNormal(i.n);return o; }
            half4 frag(V i):SV_Target
            {
                Light sun=GetMainLight();
                float lightLevel=.48+.52*saturate(dot(normalize(i.normal),sun.direction));
                return half4(float3(.93,.97,1)*lightLevel,1);
            }
            ENDHLSL
        }
    }
}
