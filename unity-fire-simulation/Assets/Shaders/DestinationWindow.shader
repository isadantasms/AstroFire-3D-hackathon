// SI-assisted: generated with Codex, reviewed and edited by Esquivel & Elias (21 PyroRangers).
Shader "FireSimulation/DestinationWindow"
{
    Properties
    {
        _Destinations("ISS Earth Moon Mars", Vector) = (1,0,0,0)
        _Travel("Travel", Float) = 0
        _Arrival("Arrival", Float) = 1
        _WindowView("Live destination",2D)="black" {}
        _UseWindowView("Use live view",Float)=0
        _EarthSurfaceView("Earth surface sky",Float)=0
        _IssWindowView("Occasional ISS light trails",Float)=0
        _EarthViewOffset("Earth view parallax",Vector)=(0,0,0,0)
    }
    SubShader
    {
        Tags { "RenderPipeline"="UniversalPipeline" "RenderType"="Opaque" }
        Pass
        {
            Cull Off
            HLSLPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Core.hlsl"
            TEXTURE2D(_WindowView);SAMPLER(sampler_WindowView);
            struct A { float4 p:POSITION; float2 uv:TEXCOORD0; };
            struct V { float4 p:SV_POSITION; float2 uv:TEXCOORD0; };
            CBUFFER_START(UnityPerMaterial)
            float4 _Destinations;
            float _Travel, _Arrival;
            float _UseWindowView;
            float _EarthSurfaceView;
            float _IssWindowView;
            float4 _EarthViewOffset;
            float4 _WindowView_TexelSize;
            CBUFFER_END
            V vert(A i) { V o; o.p=TransformObjectToHClip(i.p.xyz); o.uv=i.uv; return o; }
            float hash(float2 p) { return frac(sin(dot(p,float2(127.1,311.7)))*43758.5453); }
            float noise(float2 p)
            {
                float2 a=floor(p), f=frac(p); f=f*f*(3-2*f);
                return lerp(lerp(hash(a),hash(a+float2(1,0)),f.x),lerp(hash(a+float2(0,1)),hash(a+1),f.x),f.y);
            }
            float3 terrain(float2 uv, float3 sky, float3 soil, float relief)
            {
                float horizon=.42 + sin(uv.x*12)*relief + sin(uv.x*31)*relief*.3;
                float land=1-smoothstep(horizon-.003,horizon+.003,uv.y);
                float textureNoise=noise(uv*float2(70,30));
                float3 ground=soil*(.65+textureNoise*.5);
                float3 atmosphere=lerp(sky*1.7,sky,saturate((uv.y-.4)*1.7));
                return lerp(atmosphere,ground,land);
            }
            float3 earthSky(float2 uv)
            {
                // Quantized cloud silhouettes match the cabin's voxel style.
                float2 pixel=floor((uv+_EarthViewOffset.xy*.35)*float2(160,120))/float2(160,120);
                float3 sky=lerp(float3(.70,.85,.95),float3(.14,.43,.78),saturate(pixel.y));
                float2 drift=float2(_Time.y*.0015,0);
                float cloudShape=noise(floor((pixel+drift)*float2(48,32))/float2(4,4));
                float clouds=step(.58,cloudShape)*smoothstep(.43,.58,pixel.y);
                float3 cloudColor=lerp(float3(.77,.86,.92),float3(.98,.99,1),step(.68,cloudShape));
                return lerp(sky,cloudColor,clouds*.88);
            }
            float3 issLightTrail(float2 uv)
            {
                // One brief, softly fading streak every 9-15 seconds; confined to the ISS porthole.
                float cycle=floor(_Time.y/12);
                float startTime=2+hash(float2(cycle,17))*4;
                float progress=(_Time.y-cycle*12-startTime)/1.1;
                float visible=step(0,progress)*step(progress,1);
                float2 direction=normalize(float2(.9,-.55-hash(float2(cycle,31))*.35));
                float2 origin=float2(.05+hash(float2(cycle,8))*.4,1.08);
                float2 head=origin+direction*progress*1.4;
                float2 delta=uv-head;
                float behind=dot(delta,-direction);
                float across=abs(delta.x*direction.y-delta.y*direction.x);
                float tail=saturate(1-behind/.22)*step(0,behind)*step(behind,.22);
                float width=lerp(.0007,.003,tail);
                float glow=exp(-across*across/(width*width))*tail;
                float pointGlow=exp(-dot(delta,delta)/.000025);
                float fade=smoothstep(0,.12,progress)*(1-smoothstep(.72,1,progress));
                return float3(.65,.83,1)*(glow*.65+pointGlow)*visible*fade;
            }

            half4 frag(V i):SV_Target
            {
                if(_UseWindowView>.5)
                {
                    float2 screenUV=i.uv;
                    #if UNITY_UV_STARTS_AT_TOP
                    if(_WindowView_TexelSize.y<0) screenUV.y=1-screenUV.y;
                    #endif
                    float4 live=SAMPLE_TEXTURE2D(_WindowView,sampler_WindowView,screenUV);
                    float3 image=live.rgb;
                    if(_EarthSurfaceView>.5)
                    {
                        float3 sky=earthSky(i.uv);
                        float haze=smoothstep(.18,.63,i.uv.y)*.22;
                        float3 ground=lerp(live.rgb,float3(.68,.82,.87),haze);
                        image=lerp(sky,ground,saturate(live.a));
                    }
                    if(_IssWindowView>.5) image+=issLightTrail(i.uv);
                    float edge=pow(saturate(length(i.uv*2-1)),12);
                    float reflection=pow(saturate(1-abs(i.uv.x+i.uv.y*.6-.75)*7),16)*.015;
                    return half4(image*float3(.97,.99,1)+float3(.08,.16,.22)*edge*.16+reflection,1);
                }
                float2 uv=(i.uv-.5)*(1+_Travel*.35)+.5;
                uv.x+=sin(_Time.y*.08)*.008;
                float2 cell=floor(uv*float2(280,150));
                float star=step(.996,hash(cell))*(.4+.6*sin(hash(cell+1)*6+_Time.y*.5));
                float3 space=float3(.003,.008,.024)+star*.8;
                // Stylized orbital Earth limb, not an astronomical reconstruction.
                float2 planet=(uv-float2(.52,-.47))*float2(1, .55);
                float radius=length(planet);
                float disk=1-smoothstep(.61,.615,radius);
                float clouds=smoothstep(.52,.72,noise(uv*19+float2(_Time.y*.008,0)));
                float continents=smoothstep(.46,.6,noise(uv*9));
                float3 earth=lerp(float3(.015,.12,.32),float3(.09,.25,.17),continents);
                earth=lerp(earth,float3(.73,.86,.94),clouds*.8);
                float3 orbit=lerp(space,earth,disk)+float3(.08,.3,.65)*exp(-abs(radius-.615)*180)*.7;
                float3 terrestrial=terrain(uv,float3(.12,.32,.57),float3(.13,.22,.12),.022);
                terrestrial+=pow(saturate(1-length((uv-float2(.78,.78))*float2(1,1.9))*9),4)*float3(1,.85,.56);
                float3 lunar=terrain(uv,space,float3(.32,.33,.35),.045);
                float craters=smoothstep(.36,.39,frac(length(frac(uv*float2(17,9))-.5)));
                lunar*=lerp(.9,1,craters);
                float3 mars=terrain(uv,float3(.25,.12,.095),float3(.55,.22,.105),.065);
                float3 view=orbit*_Destinations.x+terrestrial*_Destinations.y+lunar*_Destinations.z+mars*_Destinations.w;
                // Travel streaks and blue veil peak halfway through the destination transition.
                float streak=pow(saturate(sin(uv.y*650+hash(floor(uv.y*200))*20)),24);
                streak*=pow(saturate(sin(uv.x*9-_Time.y*15)),8);
                view=lerp(view,space,.6*_Travel)+_Travel*(streak*float3(.35,.65,1)+float3(.025,.05,.09));
                float edge=smoothstep(0,.05,min(min(i.uv.x,1-i.uv.x),min(i.uv.y,1-i.uv.y)));
                return half4(view*edge,1);
            }
            ENDHLSL
        }
    }
}
