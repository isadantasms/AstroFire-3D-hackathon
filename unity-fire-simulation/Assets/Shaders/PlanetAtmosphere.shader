// SI-assisted: generated with Codex; pending human review.
Shader "FireSimulation/PlanetAtmosphere"
{
    Properties
    {
        _Tint("Scattering color", Color)=(.15,.45,1,1)
        _Strength("Optical strength", Float)=.2
        _PlanetRadius("Ground radius", Float)=90
        _ShellRadius("Atmosphere radius", Float)=94
        _Center("World center", Vector)=(0,0,0,0)
        _SunDirection("Light direction", Vector)=(.4,.6,-.7,0)
    }
    SubShader
    {
        Tags { "RenderPipeline"="UniversalPipeline" "Queue"="Transparent+10" "RenderType"="Transparent" }
        Pass
        {
            Name "Atmosphere"
            Tags { "LightMode"="SRPDefaultUnlit" }
            Blend SrcAlpha OneMinusSrcAlpha
            ZWrite Off
            ZTest Always
            Cull Front
            HLSLPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #pragma target 3.0
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Core.hlsl"
            // Browser path intentionally avoids depth textures and lighting feature includes.
            #if !defined(SHADER_API_GLES3) && !defined(SHADER_API_GLES)
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/DeclareDepthTexture.hlsl"
            #endif
            struct A { float4 p:POSITION; };
            struct V { float4 p:SV_POSITION; float3 world:TEXCOORD0; };
            CBUFFER_START(UnityPerMaterial)
            float4 _Tint, _Center, _SunDirection;
            float _Strength, _PlanetRadius, _ShellRadius;
            CBUFFER_END
            V vert(A i) { V o; o.world=TransformObjectToWorld(i.p.xyz); o.p=TransformWorldToHClip(o.world); return o; }
            float2 intersectSphere(float3 origin,float3 ray,float radius)
            {
                float b=dot(origin,ray), c=dot(origin,origin)-radius*radius;
                float discriminant=b*b-c;
                if(discriminant<0) return float2(1,-1);
                float root=sqrt(discriminant); return float2(-b-root,-b+root);
            }
            half4 frag(V i):SV_Target
            {
                float3 ray=normalize(i.world-_WorldSpaceCameraPos);
                float3 origin=_WorldSpaceCameraPos-_Center.xyz;
                float2 hit=intersectSphere(origin,ray,_ShellRadius);
                float begin=max(0,hit.x), finish=hit.y;
                float2 ground=intersectSphere(origin,ray,_PlanetRadius);
                if(ground.y>ground.x && ground.x>0) finish=min(finish,ground.x);
                #if !defined(SHADER_API_GLES3) && !defined(SHADER_API_GLES)
                float2 uv=GetNormalizedScreenSpaceUV(i.p);
                float depth=SampleSceneDepth(uv);
                #if UNITY_REVERSED_Z
                bool hasOpaque=depth>.000001;
                #else
                bool hasOpaque=depth<.999999;
                depth=lerp(UNITY_NEAR_CLIP_VALUE,1,depth);
                #endif
                if(hasOpaque)
                {
                    float3 opaqueWorld=ComputeWorldSpacePosition(uv,depth,UNITY_MATRIX_I_VP);
                    finish=min(finish,length(opaqueWorld-_WorldSpaceCameraPos));
                }
                #endif
                if(finish<=begin) return 0;
                float thickness=max(.001,_ShellRadius-_PlanetRadius);
                // Six fixed samples keep WebGL's fragment program small and predictable.
                float stepSize=(finish-begin)/6;
                float optical=0, lightSum=0;
                float3 sunDirection=normalize(_SunDirection.xyz);
                [unroll] for(int sampleIndex=0;sampleIndex<6;sampleIndex++)
                {
                    float3 samplePoint=origin+ray*(begin+(sampleIndex+.5)*stepSize);
                    float altitude=max(0,length(samplePoint)-_PlanetRadius);
                    float density=exp(-altitude/(thickness*.23));
                    float day=.10+.9*smoothstep(-.2,.5,dot(normalize(samplePoint),sunDirection));
                    float amount=density*stepSize/thickness;
                    optical+=amount; lightSum+=amount*day;
                }
                float alpha=1-exp(-optical*_Strength);
                float illumination=lightSum/max(.0001,optical);
                return float4(_Tint.rgb*(.4+illumination*.8),saturate(alpha));
            }
            ENDHLSL
        }
    }
}
