// SI-assisted: generated with Codex, reviewed and edited by Esquivel & Elias (21 PyroRangers).
Shader "FireSimulation/SoftFlame"
{
    Properties
    {
        _FlameDetail("Natural flame detail",Range(0,1))=0
        _FlameStretch("Buoyant detail",Range(0,1))=0
        _FlameFlowSpeed("Detail flow speed",Float)=.8
        [HideInInspector] _FlameDstBlend("Destination blend",Float)=1
    }
    SubShader
    {
        Tags { "Queue"="Transparent" "RenderType"="Transparent" "RenderPipeline"="UniversalPipeline" }
        Pass
        {
            Blend SrcAlpha [_FlameDstBlend]
            ZWrite Off
            Cull Off
            HLSLPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #pragma target 3.0
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Core.hlsl"
            CBUFFER_START(UnityPerMaterial)
            float _FlameDetail,_FlameStretch,_FlameFlowSpeed;
            CBUFFER_END
            struct Attributes { float4 positionOS : POSITION; float4 color : COLOR; float2 uv : TEXCOORD0; };
            struct Varyings { float4 positionCS : SV_POSITION; float4 color : COLOR; float2 uv : TEXCOORD0; float3 world:TEXCOORD1; };
            Varyings vert(Attributes v)
            {
                Varyings o;
                o.positionCS = TransformObjectToHClip(v.positionOS.xyz);
                o.color = v.color;
                o.uv = v.uv;
                o.world = TransformObjectToWorld(v.positionOS.xyz);
                return o;
            }
            float flameHash(float2 p)
            {
                float3 v=frac(float3(p.xyx)*.1031);
                v+=dot(v,v.yzx+33.33);
                return frac((v.x+v.y)*v.z);
            }
            float flameNoise(float2 p)
            {
                float2 cell=floor(p),f=frac(p);f=f*f*(3-2*f);
                return lerp(lerp(flameHash(cell),flameHash(cell+float2(1,0)),f.x),
                    lerp(flameHash(cell+float2(0,1)),flameHash(cell+1),f.x),f.y);
            }
            half4 frag(Varyings i) : SV_Target
            {
                float r = length(i.uv * 2 - 1);
                float ripple = sin(i.uv.x * 23 + _Time.y * 4) * sin(i.uv.y * 19 - _Time.y * 6);
                float soft = pow(saturate(1 - r + ripple * .055), 2);
                // The shared engine/star material retains its original appearance.
                if(_FlameDetail<.001) return half4(i.color.rgb*1.7,i.color.a*soft);
                float2 p=i.uv*2-1;
                float2 worldFlow=float2(i.world.x+i.world.z*.73,i.world.y+i.world.z*.31)*3;
                float2 flow=i.uv*3.5+worldFlow-float2(0,_Time.y*_FlameFlowSpeed);
                float broad=flameNoise(flow);
                float fine=flameNoise(flow*2.13+float2(7.1,-_Time.y*.17));
                float roll=flameNoise(flow*.73+9.4)-.5;
                p.x+=roll*.50*_FlameStretch;
                p.y+=(fine-.5)*.18;
                // Buoyant flames form tapered tongues; microgravity keeps a rounded envelope.
                float width=1-saturate(p.y)*_FlameStretch*.65;
                float radius=length(float2(p.x/max(.5,width),p.y));
                float body=pow(saturate(1-radius+(broad-.5)*.36),.9)*.92;
                float filaments=smoothstep(.24,.68,broad*.7+fine*.3+saturate(1-radius)*.20);
                float boundary=1-smoothstep(.82,1,r);
                float detailed=body*filaments*boundary;
                float heat=1-smoothstep(.05,.7,radius);
                float brightness=lerp(.95,1.9,heat);
                return half4(i.color.rgb*1.7*lerp(1,brightness,_FlameDetail),i.color.a*lerp(soft,detailed,_FlameDetail));
            }
            ENDHLSL
        }
    }
}
