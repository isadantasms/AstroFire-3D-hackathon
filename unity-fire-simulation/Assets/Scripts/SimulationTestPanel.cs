// SI-assisted: generated with Codex; pending human review.
using UnityEngine;

namespace FireSimulation
{
    [DisallowMultipleComponent]
    public sealed class SimulationTestPanel : MonoBehaviour
    {
        public FireSimulationController fire;
        public LaboratoryEnvironment environment;
        public DestinationTravel travel;
        public ExtinguisherController extinguisher;
        bool expanded=true;
        Vector2 scroll;
        static SimulationTestPanel active;
        static readonly string[] Locations={"ISS","Terra","Lua","Marte"};
        static readonly string[] LocationIds={"ISS","Earth","Moon","Mars"};
        static readonly string[] Materials={"PMMA placa","PMMA filme","SIBAL","PMMA haste","PMMA preta","Nomex III","Vela"};
        float Scale => Mathf.Clamp(Screen.width/1200f,.65f,1.2f);
        Rect PanelRect => new Rect(12,12,300,expanded?Mathf.Min(690,Screen.height/Scale-24):40);

        void OnEnable()
        {
            active=this;
            if(fire==null) fire=GetComponent<FireSimulationController>();
            if(environment==null) environment=GetComponent<LaboratoryEnvironment>();
            if(travel==null) travel=GetComponent<DestinationTravel>();
            if(extinguisher==null) extinguisher=FindFirstObjectByType<ExtinguisherController>();
        }
        void OnDisable() { if(active==this) active=null; }

        public static bool BlocksPointer(Vector2 screenPosition)
        {
            if(active==null || !active.isActiveAndEnabled) return false;
            return active.PanelRect.Contains(new Vector2(screenPosition.x,Screen.height-screenPosition.y)/active.Scale)
                || GUIUtility.hotControl!=0;
        }

        void OnGUI()
        {
            if(!Application.isPlaying) return;
            var matrix=GUI.matrix;int depth=GUI.depth;bool enabled=GUI.enabled;
            GUI.matrix=Matrix4x4.Scale(Vector3.one*Scale);GUI.depth=-9000;
            GUILayout.BeginArea(PanelRect,GUI.skin.box);
            if(GUILayout.Button(expanded?"TESTES  —  Recolher":"TESTES  —  Expandir",GUILayout.Height(28))) expanded=!expanded;
            if(expanded)
            {
                scroll=GUILayout.BeginScrollView(scroll);
                DrawControls();
                GUILayout.EndScrollView();
            }
            GUILayout.EndArea();
            GUI.enabled=enabled;GUI.depth=depth;GUI.matrix=matrix;
        }

        void DrawControls()
        {
            if(fire?.payload?.inputs==null || fire.payload.simulation_3d==null)
            { GUILayout.Label("Aguardando simulação...");return; }
            var p=fire.payload;
            bool cabin=travel==null || travel.CabinActionsAvailable;
            GUILayout.Label(travel!=null && travel.IsTravelling ? "Viagem: "+Locations[(int)travel.FlightDestination] :
                "Local: "+Locations[(int)(travel!=null && travel.Ready?travel.ArrivedDestination:environment.destination)]);
            GUILayout.Label("Destino");
            GUI.enabled=travel==null || (travel.Ready && !travel.IsTravelling);
            int current=(int)(travel!=null && travel.Ready?travel.RequestedDestination:environment.destination);
            int selected=GUILayout.SelectionGrid(current,Locations,4,GUILayout.Height(28));
            if(selected!=current && environment!=null)
            {
                environment.SetDestination(LocationIds[selected]);
                if(travel!=null) travel.RequestDestination((LaboratoryEnvironment.Destination)selected);
                cabin=false;
            }
            GUI.enabled=travel!=null && travel.IsTravelling;
            if(GUILayout.Button("Pular viagem",GUILayout.Height(26))) travel.SkipAnimation();
            GUI.enabled=cabin;
            GUILayout.Space(6);
            GUILayout.Label("Material");
            int material=MaterialSampleView.MaterialIndex(p.inputs.material_id);
            int next=GUILayout.SelectionGrid(material,Materials,2,GUILayout.Height(88));
            if(next!=material && next>=0 && fire.specimen!=null) fire.specimen.SelectMaterial(next);
            GUILayout.Label($"Gravidade: {p.inputs.gravity_g:0.00} g");
            bool changed=false;
            p.inputs.o2_pct=Slider("Oxigênio",p.inputs.o2_pct,0,40,"%",ref changed);
            p.inputs.airflow_cm_s=Slider("Fluxo de ar",p.inputs.airflow_cm_s,0,30,"cm/s",ref changed);
            p.inputs.thickness_mm=Slider("Espessura",p.inputs.thickness_mm,.1f,20,"mm",ref changed);
            p.simulation_3d.burn_rate_mm_s=Slider("Taxa de queima",p.simulation_3d.burn_rate_mm_s,0,3,"mm/s",ref changed);
            p.simulation_3d.oxygen_factor=Slider("Fator de oxigênio",p.simulation_3d.oxygen_factor,0,1,"",ref changed);
            int geometry=p.simulation_3d.flame_geometry=="elongated"?1:0;
            int shape=GUILayout.SelectionGrid(geometry,new[] {"Esférico","Alongado"},2,GUILayout.Height(25));
            if(shape!=geometry) {p.simulation_3d.flame_geometry=shape==0?"spherical":"elongated";changed=true;}
            GUILayout.BeginHorizontal();
            if(GUILayout.Button("Azul")) {p.simulation_3d.flame_color_hex="#3B82F6";changed=true;}
            if(GUILayout.Button("Laranja")) {p.simulation_3d.flame_color_hex="#FF8A30";changed=true;}
            GUILayout.EndHorizontal();
            if(changed) fire.SetPayload(p);
            GUILayout.Space(6);
            GUI.enabled=cabin && extinguisher!=null && !extinguisher.IsUsing && fire.HasVisibleFire;
            if(GUILayout.Button("Usar extintor",GUILayout.Height(30))) extinguisher.UseExtinguisher();
            GUI.enabled=cabin;
            if(GUILayout.Button("Reacender / reiniciar queima",GUILayout.Height(26)))
            { fire.SetPayload(p); }
            GUI.enabled=true;
            if(!cabin) GUILayout.Label("Controles bloqueados durante a viagem.");
            else if(extinguisher!=null && extinguisher.IsUsing) GUILayout.Label($"Extintor: {extinguisher.Progress:P0}");
            else if(!fire.HasVisibleFire) GUILayout.Label("Sem chama: confira O₂ e os fatores de queima.");
            GUILayout.Label("Painel local para testes.");
        }

        static float Slider(string label,float value,float minimum,float maximum,string unit,ref bool changed)
        {
            GUILayout.Label($"{label}: {value:0.00} {unit}");
            float next=GUILayout.HorizontalSlider(value,Mathf.Min(minimum,value),Mathf.Max(maximum,value));
            if(!Mathf.Approximately(next,value)) changed=true;
            return next;
        }
    }
}
