// SI-assisted: generated with Codex; pending human review.
Shader "FireSimulation/SoftFlame"
{
    SubShader
    {
        Tags { "Queue"="Transparent" "RenderType"="Transparent" "RenderPipeline"="UniversalPipeline" }
        Pass
        {
            Blend SrcAlpha One
            ZWrite Off
            Cull Off
            HLSLPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Core.hlsl"
            struct Attributes { float4 positionOS : POSITION; float4 color : COLOR; float2 uv : TEXCOORD0; };
            struct Varyings { float4 positionCS : SV_POSITION; float4 color : COLOR; float2 uv : TEXCOORD0; };
            Varyings vert(Attributes v)
            {
                Varyings o;
                o.positionCS = TransformObjectToHClip(v.positionOS.xyz);
                o.color = v.color;
                o.uv = v.uv;
                return o;
            }
            half4 frag(Varyings i) : SV_Target
            {
                float r = length(i.uv * 2 - 1);
                float ripple = sin(i.uv.x * 23 + _Time.y * 4) * sin(i.uv.y * 19 - _Time.y * 6);
                float soft = pow(saturate(1 - r + ripple * .055), 2);
                return half4(i.color.rgb * 1.7, i.color.a * soft);
            }
            ENDHLSL
        }
    }
}
