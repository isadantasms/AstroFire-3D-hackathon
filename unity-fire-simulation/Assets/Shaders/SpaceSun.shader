// SI-assisted: generated with Codex, reviewed and edited by Esquivel & Elias (21 PyroRangers).
Shader "FireSimulation/SpaceSun"
{
    SubShader
    {
        Tags {"RenderPipeline"="UniversalPipeline" "Queue"="Transparent+5" "RenderType"="Transparent"}
        Pass
        {
            Tags {"LightMode"="SRPDefaultUnlit"}
            Blend SrcAlpha OneMinusSrcAlpha
            ZWrite Off
            ZTest LEqual
            Cull Off
            HLSLPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Core.hlsl"
            struct A {float4 position:POSITION;float2 uv:TEXCOORD0;};
            struct V {float4 position:SV_POSITION;float2 uv:TEXCOORD0;};
            V vert(A input) {V output;output.position=TransformObjectToHClip(input.position.xyz);output.uv=input.uv;return output;}
            half4 frag(V input):SV_Target
            {
                float2 pixel=(floor(input.uv*128)+.5)/128;
                float radius=length(pixel*2-1);
                float disk=1-smoothstep(.30,.33,radius);
                float corona=exp(-max(0,radius-.30)*8)*.24;
                float alpha=max(disk,corona)*(1-smoothstep(.85,1,radius));
                float3 color=lerp(float3(1,.58,.20),float3(1,.98,.83),disk);
                return half4(color,alpha);
            }
            ENDHLSL
        }
    }
}
