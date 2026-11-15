// SI-assisted: generated with Codex; pending human review.
Shader "FireSimulation/FireSmoke"
{
    Properties {_SoftDistance("Surface fade distance",Float)=.08}
    SubShader
    {
        Tags {"RenderPipeline"="UniversalPipeline" "Queue"="Transparent" "RenderType"="Transparent"}
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
            #pragma target 3.0
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Core.hlsl"
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/DeclareDepthTexture.hlsl"
            CBUFFER_START(UnityPerMaterial)
            float _SoftDistance;
            CBUFFER_END
            struct A {float4 position:POSITION;float4 color:COLOR;float2 uv:TEXCOORD0;};
            struct V {float4 position:SV_POSITION;float4 color:COLOR;float2 uv:TEXCOORD0;float3 world:TEXCOORD1;};
            V vert(A input)
            {
                V output;output.position=TransformObjectToHClip(input.position.xyz);output.color=input.color;
                output.uv=input.uv;output.world=TransformObjectToWorld(input.position.xyz);return output;
            }
            float hash(float2 p)
            {
                float3 v=frac(float3(p.xyx)*.1031);v+=dot(v,v.yzx+33.33);
                return frac((v.x+v.y)*v.z);
            }
            float noise(float2 p)
            {
                float2 c=floor(p),f=frac(p);f=f*f*(3-2*f);
                return lerp(lerp(hash(c),hash(c+float2(1,0)),f.x),lerp(hash(c+float2(0,1)),hash(c+1),f.x),f.y);
            }
            half4 frag(V input):SV_Target
            {
                float2 p=input.uv*2-1;
                float2 flow=input.uv*3+float2(input.world.x+input.world.z*.7,input.world.y)*1.3-float2(0,_Time.y*.10);
                float broad=noise(flow),fine=noise(flow*2.07+8.1);
                p+=float2(broad-.5,fine-.5)*.2;
                float density=(1-smoothstep(.12,1,length(p)))*lerp(.5,1,broad*.7+fine*.3);
                float depth=SampleSceneDepth(GetNormalizedScreenSpaceUV(input.position));
                float sceneDepth=LinearEyeDepth(depth,_ZBufferParams);
                float particleDepth=-TransformWorldToView(input.world).z;
                float contact=saturate((sceneDepth-particleDepth)/max(.001,_SoftDistance));
                float shade=.8+.25*(1-input.uv.y)+broad*.12;
                return half4(input.color.rgb*shade,input.color.a*density*contact);
            }
            ENDHLSL
        }
    }
}
