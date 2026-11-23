// SI-assisted: generated with Codex, reviewed and edited by Esquivel & Elias (21 PyroRangers).
Shader "FireSimulation/LaboratoryGrid"
{
    SubShader
    {
        Tags { "RenderPipeline"="UniversalPipeline" "Queue"="Transparent-100" "RenderType"="Transparent" }
        Pass
        {
            Blend SrcAlpha OneMinusSrcAlpha
            ZWrite Off
            ZTest LEqual
            Cull Off
            HLSLPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Core.hlsl"
            struct A { float4 p:POSITION; };
            struct V { float4 p:SV_POSITION; float3 world:TEXCOORD0; };
            V vert(A i)
            {
                V o;
                o.world = float3(i.p.x + _WorldSpaceCameraPos.x, -.17, i.p.z + _WorldSpaceCameraPos.z);
                o.p = TransformWorldToHClip(o.world);
                return o;
            }
            float grid(float2 position, float spacing, float2 footprint)
            {
                float2 distanceToLine = abs(frac(position / spacing + .5) - .5) * spacing;
                float2 pixelDistance = distanceToLine / max(footprint, .00001);
                float lineCoverage = 1 - smoothstep(.35, 1.25, min(pixelDistance.x, pixelDistance.y));
                return lineCoverage * saturate(spacing / max(footprint.x, footprint.y) / 4);
            }
            half4 frag(V i):SV_Target
            {
                float2 footprint = max(fwidth(i.world.xz), .00001);
                // Continuous transition between decimal scales as the camera zooms.
                float level = log10(max(max(footprint.x, footprint.y) * 60, .01));
                float spacing = pow(10, floor(level));
                float fine = grid(i.world.xz, spacing, footprint);
                float major = grid(i.world.xz, spacing * 10, footprint);
                float alpha = lerp(fine, major, frac(level)) * .35;
                float3 color = float3(.28, .36, .43);
                float xAxis = 1 - smoothstep(.6, 1.8, abs(i.world.z) / footprint.y);
                float zAxis = 1 - smoothstep(.6, 1.8, abs(i.world.x) / footprint.x);
                color = lerp(color, float3(.75, .23, .22), xAxis);
                color = lerp(color, float3(.22, .45, .85), zAxis);
                alpha = max(alpha, max(xAxis, zAxis) * .65);
                float distanceToCamera = length(i.world - _WorldSpaceCameraPos);
                float range = max(30, abs(_WorldSpaceCameraPos.y + .17) * 30);
                float fade = 1 - smoothstep(range * .35, range, distanceToCamera);
                float facing = abs(normalize(_WorldSpaceCameraPos - i.world).y);
                fade *= smoothstep(.015, .12, facing);
                return half4(color, alpha * fade);
            }
            ENDHLSL
        }
    }
}
