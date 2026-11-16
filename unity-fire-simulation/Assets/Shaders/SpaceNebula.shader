// SI-assisted: generated with Codex, reviewed and edited by Esquivel & Elias (21 PyroRangers).
Shader "FireSimulation/SpaceNebula"
{
    Properties { _Intensity("Nebula intensity",Range(0,1))=.65 }
    SubShader
    {
        Tags {"RenderPipeline"="UniversalPipeline" "Queue"="Background" "RenderType"="Background"}
        Pass
        {
            Tags {"LightMode"="SRPDefaultUnlit"}
            ZWrite Off
            ZTest LEqual
            Cull Front
            HLSLPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #pragma target 3.0
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Core.hlsl"
            CBUFFER_START(UnityPerMaterial)
            float _Intensity;
            CBUFFER_END
            struct A {float4 position:POSITION;};
            struct V {float4 position:SV_POSITION;float3 direction:TEXCOORD0;};
            V vert(A input)
            {
                V output;output.position=TransformObjectToHClip(input.position.xyz);
                output.direction=input.position.xyz;return output;
            }
            float hash3(float3 p)
            {
                p=frac(p*.1031);p+=dot(p,p.yzx+33.33);
                return frac((p.x+p.y)*p.z);
            }
            float noise3(float3 p)
            {
                float3 cell=floor(p),f=frac(p);f=f*f*(3-2*f);
                return lerp(
                    lerp(lerp(hash3(cell),hash3(cell+float3(1,0,0)),f.x),
                         lerp(hash3(cell+float3(0,1,0)),hash3(cell+float3(1,1,0)),f.x),f.y),
                    lerp(lerp(hash3(cell+float3(0,0,1)),hash3(cell+float3(1,0,1)),f.x),
                         lerp(hash3(cell+float3(0,1,1)),hash3(cell+1),f.x),f.y),f.z);
            }
            half4 frag(V input):SV_Target
            {
                float3 direction=normalize(input.direction);
                float3 axis=normalize(float3(.45,.82,-.35));
                // Sample in 3D direction space so all six background faces join without seams.
                float3 p=direction*3.8+float3(7.1,13.8,2.4);
                float broad=noise3(p);
                float medium=noise3(p*2.03+4.7);
                float fine=noise3(p*4.11-8.3);
                float clouds=broad*.57+medium*.28+fine*.15;
                float latitude=abs(dot(direction,axis)+(broad-.5)*.18);
                float band=exp(-latitude*latitude*23);
                float filaments=smoothstep(.30,.76,clouds);
                float dust=smoothstep(.40,.70,medium)*smoothstep(.36,.62,broad);
                float blueRegion=exp(-dot(direction-float3(.70,.16,.69),direction-float3(.70,.16,.69))*2.8);
                float violetRegion=exp(-dot(direction-float3(-.78,.26,-.57),direction-float3(-.78,.26,-.57))*2.2);
                float3 gas=lerp(float3(.15,.045,.23),float3(.035,.17,.23),saturate(blueRegion*1.4));
                float patches=saturate(blueRegion+violetRegion+.16);
                float breath=.97+.03*sin(_Time.y*.08);
                float3 galaxy=float3(.025,.036,.065)*band*filaments*(1-dust*.70);
                float3 nebula=gas*patches*filaments*filaments*(.2+band*.8)*(1-dust*.55);
                float3 color=float3(.0015,.0025,.007)+(galaxy+nebula)*_Intensity*breath;
                return half4(color,1);
            }
            ENDHLSL
        }
    }
}
