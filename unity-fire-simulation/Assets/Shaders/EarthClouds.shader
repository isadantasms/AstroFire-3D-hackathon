// SI-assisted: generated with Codex; pending human review.
Shader "FireSimulation/EarthClouds"
{
    SubShader
    {
        Tags { "RenderPipeline"="UniversalPipeline" "RenderType"="Opaque" }
        Pass
        {
            Name "Clouds"
            Tags { "LightMode"="UniversalForwardOnly" }
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
        // Include cloud blocks in camera depth, including MSAA/depth-prepass paths.
        Pass
        {
            Name "DepthOnly"
            Tags { "LightMode"="DepthOnly" }
            ZWrite On
            ColorMask R
            Cull Back
            HLSLPROGRAM
            #pragma vertex DepthOnlyVertex
            #pragma fragment DepthOnlyFragment
            #include "Packages/com.unity.render-pipelines.universal/Shaders/DepthOnlyPass.hlsl"
            ENDHLSL
        }
        // The PC renderer's SSAO can request a combined depth/normal prepass.
        Pass
        {
            Name "DepthNormalsOnly"
            Tags { "LightMode"="DepthNormalsOnly" }
            ZWrite On
            Cull Back
            HLSLPROGRAM
            #pragma vertex DepthNormalsVertex
            #pragma fragment DepthNormalsFragment
            #pragma multi_compile_fragment _ _GBUFFER_NORMALS_OCT
            #include "Packages/com.unity.render-pipelines.universal/Shaders/DepthNormalsPass.hlsl"
            ENDHLSL
        }
    }
}
