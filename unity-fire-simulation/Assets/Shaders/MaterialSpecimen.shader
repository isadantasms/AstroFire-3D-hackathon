// SI-assisted: generated with Codex; pending human review.
Shader "FireSimulation/MaterialSpecimen"
{
    Properties { _BaseColor("Color", Color)=(.5,.8,1,.4) _Weave("Weave", Float)=0 }
    SubShader
    {
        Tags { "RenderPipeline"="UniversalPipeline" "Queue"="Transparent-20" "RenderType"="Transparent" }
        Pass
        {
            Blend SrcAlpha OneMinusSrcAlpha
            ZWrite Off
            Cull Off
            HLSLPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Core.hlsl"
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Lighting.hlsl"
            struct A { float4 p:POSITION; float3 n:NORMAL; float2 uv:TEXCOORD0; };
            struct V { float4 p:SV_POSITION; float3 n:TEXCOORD0; float2 uv:TEXCOORD1; float3 world:TEXCOORD2; };
            CBUFFER_START(UnityPerMaterial)
            float4 _BaseColor;
            float _Weave;
            CBUFFER_END
            V vert(A i)
            {
                V o; o.world=TransformObjectToWorld(i.p.xyz); o.p=TransformWorldToHClip(o.world);
                o.n=TransformObjectToWorldNormal(i.n); o.uv=i.uv; return o;
            }
            half4 frag(V i):SV_Target
            {
                float3 normal=normalize(i.n), viewDirection=normalize(_WorldSpaceCameraPos-i.world);
                Light key=GetMainLight();
                float diffuse=.4+.6*abs(dot(normal,key.direction));
                float fresnel=pow(1-abs(dot(normal,viewDirection)),3);
                float sheen=pow(saturate(abs(dot(normal,normalize(key.direction+viewDirection)))),48);
                float2 footprint=max(fwidth(i.uv)*100,.001);
                float weave=sin(i.uv.x*628)*sin(i.uv.y*628)*.12/(1+max(footprint.x,footprint.y));
                float3 color=_BaseColor.rgb*diffuse*(1+weave*_Weave);
                color+=lerp(.3, .04, _Weave)*sheen+fresnel*lerp(.18,.025,_Weave);
                return half4(color,saturate(_BaseColor.a+fresnel*.4));
            }
            ENDHLSL
        }
    }
}
