// SI-assisted: generated with Gemini, aligned with Esquivel's FireSimulationController.cs, FireOrbitCamera.cs, LaboratoryStage.cs, Flame.shader & LaboratoryGrid.shader — [PROJECT_NAME]
(function (global) {
  "use strict";

  var SAMPLE_SCENARIOS = [
    {
      scenario_id: "scenario_01_iss_quiescent_0g_blue_sphere",
      grounding_status: "empirical_bass2",
      inputs: {
        material_id: "pmma_clear_slab",
        material_name: "PMMA (Cast Polymethyl Methacrylate Slab)",
        thickness_mm: 5.0,
        gravity_g: 0.0,
        environment_label: "ISS Microgravity (0.00g Quiescent)",
        o2_pct: 21.0,
        airflow_cm_s: 0.5
      },
      simulation_3d: {
        flame_geometry: "spherical",
        burn_rate_mm_s: 0.45,
        flame_color_hex: "#3B82F6",
        oxygen_factor: 0.62
      },
      telemetry: {
        flammability_score: 48,
        risk_label: "Moderate Alert",
        oxygen_limit_pct: 16.5,
        co_ppm: 115.0,
        co2_pct: 1.2
      },
      safety_copilot: {
        diagnosis: "Quiescent 0g regime (gravity_g = 0.0g, airflow_cm_s < 1.0 cm/s). Buoyancy is absent; oxygen transport occurs strictly via slow molecular diffusion, forming a stationary spherical blue flame ball around the acrylic sample.",
        suppression_action: "Keep cabin ventilation OFF to prevent advective oxygen feeding; apply localized fine water mist or inert N2/CO2 flood into the containment glovebox.",
        terrestrial_spinoff: "Optical sensor calibration for clean, low-soot blue diffusion flames that evade conventional terrestrial photoelectric smoke detectors.",
        scientific_limitations: "Direct empirical regime from NASA PSI BASS-II (PSI-25) microgravity glovebox tests. Valid for quiescent/ultra-low forced flow (< 1.0 cm/s) at 1 atm cabin pressure."
      },
      nasa_citations: [
        {
          id: "PSI-25 (DOI: 10.60555/4qc4-de67)",
          title: "Burning and Suppression of Solids - II (BASS-II)",
          url: "https://doi.org/10.60555/4qc4-de67",
          finding: "Demonstrates spherical, soot-free blue diffusion flame stabilization in microgravity under ultra-low flow conditions."
        },
        {
          id: "NASA/TM-20210011385",
          title: "Burning and Suppression of Solids - II (BASS-II) Summary Report (Olson et al., 2021)",
          url: "https://ntrs.nasa.gov/citations/20210011385",
          finding: "Documents low-velocity microgravity spread rates and extinction thresholds for solid PMMA samples."
        }
      ]
    },
    {
      scenario_id: "scenario_02_lunar_ventilated_elongated_soot",
      grounding_status: "interpolated_from_ntrs",
      inputs: {
        material_id: "cotton_fiberglass_sibal",
        material_name: "Cotton-Fiberglass Blend (Saffire / BASS Fabric)",
        thickness_mm: 0.3,
        gravity_g: 0.16,
        environment_label: "Lunar Habitat (0.16g + Enriched O2 Ventilation)",
        o2_pct: 30.0,
        airflow_cm_s: 15.0
      },
      simulation_3d: {
        flame_geometry: "elongated",
        burn_rate_mm_s: 2.15,
        flame_color_hex: "#F97316",
        oxygen_factor: 0.92
      },
      telemetry: {
        flammability_score: 88,
        risk_label: "Critical Flashover Risk",
        oxygen_limit_pct: 15.2,
        co_ppm: 460.0,
        co2_pct: 3.8
      },
      safety_copilot: {
        diagnosis: "Combined partial-gravity buoyancy (0.16g Lunar) and forced cabin ventilation (15.0 cm/s) at 30% O2 stretch the reaction zone into an elongated, radiative soot-heavy orange plume with accelerated surface spread.",
        suppression_action: "IMMEDIATE CABIN HVAC SHUTOFF (< 2 seconds) to eliminate forced convective O2 supply, followed by cabin pressure reduction or targeted water mist suppression.",
        terrestrial_spinoff: "High-efficiency HVAC fire-damper automation for aircraft cabins, submarines, and cleanrooms with forced ventilation.",
        scientific_limitations: "Bounded physical interpolation combining BASS-II forced-flow empirical curves (NASA/TM-20210011385 Table 7.1 & Table A.6) with Saffire exploration atmosphere bounds (NTRS-20170000230 & NTRS-20260001600) scaled for 0.16g Lunar partial buoyancy."
      },
      nasa_citations: [
        {
          id: "NASA/TM-20210011385",
          title: "Burning and Suppression of Solids - II (BASS-II) Summary Report (Olson et al., 2021)",
          url: "https://ntrs.nasa.gov/citations/20210011385",
          finding: "Table 7.1 & Table A.6: Forced air velocities between 4 and 29 cm/s transition microgravity flames on SIBAL fabric from circular blue domes to elongated luminous plumes with higher spread rates."
        },
        {
          id: "NTRS-20170000230",
          title: "Operation and Development Status of the Spacecraft Fire Experiments (Saffire)",
          url: "https://ntrs.nasa.gov/citations/20170000230",
          finding: "Evaluates SIBAL cotton-fiberglass and PMMA flame spread under spacecraft cabin ventilation and exploration atmospheres relevant to Lunar and Martian habitats."
        }
      ]
    },
    {
      scenario_id: "scenario_03_hypoxia_extinguished_below_loi",
      grounding_status: "empirical_bass2",
      inputs: {
        material_id: "nomex_iii_fabric",
        material_name: "Nomex III / HT90-40 (Flame-Retardant Spacecraft Fabric)",
        thickness_mm: 0.5,
        gravity_g: 0.0,
        environment_label: "ISS Microgravity (0.00g Hypoxic Quench)",
        o2_pct: 13.5,
        airflow_cm_s: 2.0
      },
      simulation_3d: {
        flame_geometry: "spherical",
        burn_rate_mm_s: 0.0,
        flame_color_hex: "#3B82F6",
        oxygen_factor: 0.0
      },
      telemetry: {
        flammability_score: 8,
        risk_label: "Safe (Extinguished Below LOI)",
        oxygen_limit_pct: 17.5,
        co_ppm: 12.0,
        co2_pct: 0.1
      },
      safety_copilot: {
        diagnosis: "Ambient oxygen concentration (13.5% O2) is strictly below the material's Limiting Oxygen Index / Minimum Oxygen Concentration (LOI/MOC = 17.5% O2). Heat losses exceed chemical heat release, quenching the reaction.",
        suppression_action: "No active extinguishant required; maintain hypoxic atmosphere below 17.5% O2 and vent residual pyrolysis smoke through HEPA/charcoal filtration.",
        terrestrial_spinoff: "Hypoxic fire-prevention systems (normobaric nitrogen-enriched atmospheres) for server data centers and archival vaults.",
        scientific_limitations: "Empirical extinction boundary grounded in NASA BASS-II Limiting Oxygen Index (LOI) determinations (NASA/TM-20210011385). Re-ignition remains possible if cabin O2 is restored while the sample core exceeds pyrolysis temperature."
      },
      nasa_citations: [
        {
          id: "PSI-25 (DOI: 10.60555/4qc4-de67)",
          title: "Burning and Suppression of Solids - II (BASS-II)",
          url: "https://doi.org/10.60555/4qc4-de67",
          finding: "Establishes extinction limits as oxygen concentration and opposed airflow velocity are systematically stepped down until flame quench."
        },
        {
          id: "NASA/TM-20210011385",
          title: "Burning and Suppression of Solids - II (BASS-II) Summary Report (Olson et al., 2021)",
          url: "https://ntrs.nasa.gov/citations/20210011385",
          finding: "Defines the Minimum Oxygen Concentration (MOC / LOI) curve below which solid fuel samples self-extinguish in microgravity."
        }
      ]
    }
  ];

  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }
  function clamp01(v) {
    return clamp(v, 0, 1);
  }
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }
  function isFiniteNum(n) {
    return typeof n === "number" && Number.isFinite(n);
  }
  function parseHexColor(hex) {
    if (typeof hex !== "string") return null;
    var m = /^#?([0-9a-fA-F]{6})$/.exec(hex.trim());
    if (!m) return null;
    var intVal = parseInt(m[1], 16);
    return {
      r: ((intVal >> 16) & 255) / 255,
      g: ((intVal >> 8) & 255) / 255,
      b: (intVal & 255) / 255
    };
  }

  // Exact port of FireSimulationController.IsValid(FirePayload p)
  function isValidPayload(p) {
    if (!p || !p.inputs || !p.simulation_3d) return false;
    var i = p.inputs;
    var s = p.simulation_3d;
    return (
      (s.flame_geometry === "spherical" || s.flame_geometry === "elongated") &&
      parseHexColor(s.flame_color_hex) !== null &&
      isFiniteNum(s.burn_rate_mm_s) && s.burn_rate_mm_s >= 0 &&
      isFiniteNum(s.oxygen_factor) && s.oxygen_factor >= 0 && s.oxygen_factor <= 1 &&
      isFiniteNum(i.gravity_g) && i.gravity_g >= 0 &&
      isFiniteNum(i.airflow_cm_s) && i.airflow_cm_s >= 0 &&
      isFiniteNum(i.o2_pct) && i.o2_pct >= 0 && i.o2_pct <= 100 &&
      isFiniteNum(i.thickness_mm) && i.thickness_mm > 0 &&
      (!p.telemetry || (isFiniteNum(p.telemetry.oxygen_limit_pct) && p.telemetry.oxygen_limit_pct >= 0 && p.telemetry.oxygen_limit_pct <= 100))
    );
  }

  // Exact port of FireSimulationController.Evaluate(FirePayload p, Vector3 airflow, bool enforceLimit)
  function evaluateVisualResponse(p, enforceLimit) {
    var i = p.inputs;
    var s = p.simulation_3d;
    var limit = enforceLimit && p.telemetry ? p.telemetry.oxygen_limit_pct : 0;
    var oxygen = clamp01((i.o2_pct - limit) / Math.max(1, 35 - limit)) * s.oxygen_factor;
    var burning = s.burn_rate_mm_s > 0 && oxygen > 0 && i.o2_pct > limit;
    var rate = Math.sqrt(Math.min(s.burn_rate_mm_s, 100));
    var gravity = Math.sqrt(Math.min(i.gravity_g, 4));
    var wind = Math.min(i.airflow_cm_s, 100) * 0.045;
    var drift = { x: wind, y: gravity * 1.4, z: 0 };
    var driftMag = Math.hypot(drift.x, drift.y, drift.z);
    var stretch = (s.flame_geometry === "elongated" ? 1.0 : 0.0) + Math.min(driftMag, 2.0);
    return {
      burning: burning,
      oxygen: burning ? oxygen : 0,
      rate: rate,
      stretch: stretch,
      drift: drift,
      driftMag: driftMag,
      radius: (0.06 + rate * 0.09) * lerp(0.6, 1.4, oxygen),
      lifetime: 0.6 + Math.min(rate, 3) * 0.2 + stretch * 0.12,
      emission: burning ? (100 + rate * 220) * Math.sqrt(oxygen) : 0
    };
  }

  function createHUD(container, state, applyScenarioIndex, toggleTelemetry) {
    var isEmbedded = window.self !== window.top || new URLSearchParams(window.location.search).get("embed") === "1";

    var toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.style.cssText = [
      "position:absolute",
      "top:10px",
      "right:12px",
      "z-index:20",
      "background:rgba(10,23,36,0.92)",
      "color:#59e0ff",
      "border:1px solid rgba(89,224,255,0.35)",
      "padding:5px 10px",
      "font:600 11px/1.2 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace",
      "letter-spacing:0.06em",
      "cursor:pointer",
      "text-transform:uppercase"
    ].join(";");
    toggleBtn.textContent = state.showTelemetry ? "Hide Lab HUD" : "Show Lab HUD";
    toggleBtn.onclick = function () {
      toggleTelemetry(!state.showTelemetry);
      toggleBtn.textContent = state.showTelemetry ? "Hide Lab HUD" : "Show Lab HUD";
    };
    container.appendChild(toggleBtn);

    var panel = document.createElement("div");
    panel.id = "unity-imgui-telemetry";
    panel.style.cssText = [
      "position:absolute",
      "top:16px",
      "left:16px",
      "bottom:56px",
      "width:min(340px, 34%)",
      "background:rgba(10, 23, 36, 0.94)",
      "border:1px solid rgba(89, 224, 255, 0.22)",
      "box-sizing:border-box",
      "padding:16px",
      "display:flex",
      "flex-direction:column",
      "color:rgb(199, 217, 235)",
      "font-family:ui-sans-serif,system-ui,-apple-system,sans-serif",
      "font-size:12px",
      "line-height:1.45",
      "z-index:15",
      "pointer-events:auto",
      "user-select:text"
    ].join(";");

    var title = document.createElement("div");
    title.textContent = "COMBUSTION LAB";
    title.style.cssText = "font-size:19px;font-weight:700;color:rgb(89,224,255);letter-spacing:0.04em;margin-bottom:2px;";
    panel.appendChild(title);

    var subtitle = document.createElement("div");
    subtitle.textContent = "LIVE EXPERIMENT / VISUAL PREVIEW";
    subtitle.style.cssText = "font-size:11px;color:rgb(160,185,208);letter-spacing:0.06em;margin-bottom:10px;";
    panel.appendChild(subtitle);

    var scenarioBar = document.createElement("div");
    scenarioBar.style.cssText = "display:flex;gap:4px;margin-bottom:10px;flex-wrap:wrap;";
    var labels = ["01: 0g Sphere", "02: 0.16g Plume", "03: Hypoxic Quench"];
    var scenarioBtns = labels.map(function (label, idx) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = label;
      b.style.cssText = [
        "flex:1",
        "min-width:82px",
        "padding:4px 6px",
        "font:600 10px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace",
        "background:rgba(18,38,58,0.9)",
        "color:#c7d9eb",
        "border:1px solid rgba(89,224,255,0.25)",
        "cursor:pointer"
      ].join(";");
      b.onclick = function () {
        applyScenarioIndex(idx);
      };
      scenarioBar.appendChild(b);
      return b;
    });
    panel.appendChild(scenarioBar);

    var scrollArea = document.createElement("div");
    scrollArea.style.cssText = "flex:1;overflow-y:auto;padding-right:4px;display:flex;flex-direction:column;gap:8px;";
    panel.appendChild(scrollArea);

    container.appendChild(panel);

    var controlsHint = document.createElement("div");
    controlsHint.style.cssText = [
      "position:absolute",
      "bottom:14px",
      "right:16px",
      "left:16px",
      "pointer-events:none",
      "text-align:right",
      "font:600 11px/1.3 ui-monospace,SFMono-Regular,Menlo,monospace",
      "color:rgba(199,217,235,0.82)",
      "letter-spacing:0.05em",
      "z-index:10"
    ].join(";");
    controlsHint.textContent = "LMB / RMB  ORBIT     MMB / SHIFT  PAN     WHEEL  ZOOM     F  RESET";
    container.appendChild(controlsHint);

    function renderReadout() {
      panel.style.display = state.showTelemetry ? "flex" : "none";
      toggleBtn.textContent = state.showTelemetry ? "Hide Lab HUD" : "Show Lab HUD";

      var p = state.payload;
      if (!p) return;
      scenarioBtns.forEach(function (btn, idx) {
        var active = SAMPLE_SCENARIOS[idx] && SAMPLE_SCENARIOS[idx].scenario_id === p.scenario_id;
        btn.style.borderColor = active ? "#59e0ff" : "rgba(89,224,255,0.22)";
        btn.style.background = active ? "rgba(89,224,255,0.18)" : "rgba(18,38,58,0.85)";
        btn.style.color = active ? "#ffffff" : "#c7d9eb";
      });

      var i = p.inputs || {};
      var s = p.simulation_3d || {};
      var t = p.telemetry || {};
      var c = p.safety_copilot || {};
      var citations = Array.isArray(p.nasa_citations) ? p.nasa_citations : [];

      var riskColor = "#59e0ff";
      if (t.flammability_score >= 71) riskColor = "#f97316";
      else if (t.flammability_score >= 36) riskColor = "#facc15";
      else riskColor = "#34d399";

      var html = [];
      html.push(
        '<div style="font-family:ui-monospace,monospace;font-size:11px;color:#8ab4d8;word-break:break-word;">' +
          escapeHtml((p.scenario_id || "Inspector preview") + " | " + (p.grounding_status || "empirical_bass2")) +
        "</div>"
      );
      if (!isValidPayload(p)) {
        html.push('<div style="color:#f87171;font-weight:700;">Invalid payload: check geometry, color and numeric ranges.</div>');
      }
      html.push(
        '<div style="background:rgba(6,13,21,0.65);border:1px solid rgba(148,163,184,0.16);padding:8px;">' +
          '<div style="font-weight:700;color:#f1f5f9;">' + escapeHtml((i.material_name || "") + " | " + (i.material_id || "")) + "</div>" +
          '<div style="color:#59e0ff;font-size:11px;margin-top:2px;">' + escapeHtml(i.environment_label || "") + "</div>" +
          '<div style="font-family:ui-monospace,monospace;font-size:11px;margin-top:6px;">' +
            "Thickness " + fmtNum(i.thickness_mm) + " mm | Gravity " + fmtNum(i.gravity_g) + " g<br>" +
            "O2 " + fmtNum(i.o2_pct) + "% | Airflow " + fmtNum(i.airflow_cm_s) + " cm/s<br>" +
            "Geometry: " + escapeHtml(s.flame_geometry || "") + " | Rate: " + fmtNum(s.burn_rate_mm_s) + " mm/s" +
          "</div>" +
        "</div>"
      );
      if (p.telemetry) {
        html.push(
          '<div style="background:rgba(6,13,21,0.65);border-left:3px solid ' + riskColor + ';padding:8px;font-family:ui-monospace,monospace;font-size:11px;">' +
            '<div style="font-weight:700;color:' + riskColor + ';">Risk ' + fmtNum(t.flammability_score) + "/100 | " + escapeHtml(t.risk_label || "") + "</div>" +
            '<div style="margin-top:4px;">CO ' + fmtNum(t.co_ppm) + " ppm | CO2 " + fmtNum(t.co2_pct) + "% | O2 limit " + fmtNum(t.oxygen_limit_pct) + "%</div>" +
            '<div id="unity-burn-front-readout" style="margin-top:4px;color:#59e0ff;">Burn front (integrated input): ' + state.burnFrontMillimeters.toFixed(2) + " mm</div>" +
          "</div>"
        );
      }
      if (p.safety_copilot) {
        html.push(
          '<div style="display:flex;flex-direction:column;gap:6px;font-size:11.5px;">' +
            '<div><strong style="color:#59e0ff;">Diagnosis:</strong> ' + escapeHtml(c.diagnosis || "") + "</div>" +
            '<div><strong style="color:#facc15;">Suppression:</strong> ' + escapeHtml(c.suppression_action || "") + "</div>" +
            '<div><strong style="color:#94a3b8;">Limitations:</strong> ' + escapeHtml(c.scientific_limitations || "") + "</div>" +
            '<div><strong style="color:#34d399;">Earth Spinoff:</strong> ' + escapeHtml(c.terrestrial_spinoff || "") + "</div>" +
          "</div>"
        );
      }
      if (citations.length) {
        var citHtml = citations.map(function (cit) {
          if (!cit) return "";
          return (
            '<div style="border-top:1px solid rgba(148,163,184,0.15);padding-top:6px;font-size:11px;">' +
              '<div style="font-weight:700;color:#e2e8f0;">' + escapeHtml((cit.id || "") + " | " + (cit.title || "")) + "</div>" +
              '<div style="color:#59e0ff;word-break:break-all;font-family:ui-monospace,monospace;font-size:10px;">' + escapeHtml(cit.url || "") + "</div>" +
              '<div style="color:#94a3b8;margin-top:2px;">' + escapeHtml(cit.finding || "") + "</div>" +
            "</div>"
          );
        }).join("");
        html.push('<div style="display:flex;flex-direction:column;gap:6px;">' + citHtml + "</div>");
      }
      scrollArea.innerHTML = html.join("");
    }

    function updateBurnFrontOnly() {
      var el = document.getElementById("unity-burn-front-readout");
      if (el) {
        el.textContent = "Burn front (integrated input): " + state.burnFrontMillimeters.toFixed(2) + " mm";
      }
    }

    if (isEmbedded) {
      state.showTelemetry = false;
    }
    renderReadout();

    return {
      renderReadout: renderReadout,
      updateBurnFrontOnly: updateBurnFrontOnly
    };
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function fmtNum(n) {
    if (typeof n !== "number" || !Number.isFinite(n)) return "0";
    return Number(n.toFixed(2)).toString();
  }

  global.createUnityInstance = function (canvas, config, onProgress) {
    return new Promise(function (resolve) {
      if (typeof onProgress === "function") {
        onProgress(0.35);
        setTimeout(function () { onProgress(0.8); }, 40);
      }

      var container = canvas.parentElement || document.body;
      if (getComputedStyle(container).position === "static") {
        container.style.position = "relative";
      }

      var state = {
        payload: JSON.parse(JSON.stringify(SAMPLE_SCENARIOS[0])),
        burnFrontMillimeters: 0,
        showTelemetry: true,
        enforceReceivedOxygenLimit: true,
        visualScale: 1.0,
        transitionSeconds: 0.5,
        intensity: 0.62,
        rate: Math.sqrt(0.45),
        elongation: 0.0,
        color: { r: 0.23, g: 0.51, b: 0.96 },
        camera: {
          focus: { x: 0, y: 0.55, z: 0 },
          distance: 3.6,
          yaw: -22,
          pitch: 18,
          initialFocus: { x: 0, y: 0.55, z: 0 },
          initialDistance: 3.6,
          initialYaw: -22,
          initialPitch: 18
        },
        particles: [],
        smokeParticles: [],
        running: true
      };

      var hud = createHUD(
        container,
        state,
        function applyScenarioIndex(idx) {
          if (SAMPLE_SCENARIOS[idx]) {
            setPayload(JSON.parse(JSON.stringify(SAMPLE_SCENARIOS[idx])));
          }
        },
        function toggleTelemetry(show) {
          state.showTelemetry = Boolean(show);
          hud.renderReadout();
        }
      );

      function setPayload(nextPayload) {
        if (!isValidPayload(nextPayload)) {
          console.warn("Payload rejected: Invalid geometry, color, or numeric range.");
          return;
        }
        state.payload = nextPayload;
        state.burnFrontMillimeters = 0;
        hud.renderReadout();
      }

      function applyJson(json) {
        try {
          var parsed = typeof json === "string" ? JSON.parse(json) : json;
          if (!parsed || !parsed.inputs || !parsed.simulation_3d) {
            throw new Error("Expected one scenario with inputs and simulation_3d sections.");
          }
          setPayload(parsed);
        } catch (err) {
          console.warn("Payload rejected:", err.message);
        }
      }

      // Orbit / Pan / Zoom camera controls matching FireOrbitCamera.cs
      var dragMode = null;
      var lastPointer = { x: 0, y: 0 };

      canvas.addEventListener("contextmenu", function (e) {
        e.preventDefault();
      });

      canvas.addEventListener("mousedown", function (e) {
        lastPointer.x = e.clientX;
        lastPointer.y = e.clientY;
        if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
          dragMode = "pan";
        } else if (e.button === 0 || e.button === 2) {
          dragMode = "orbit";
        }
      });

      window.addEventListener("mousemove", function (e) {
        if (!dragMode) return;
        var dx = e.clientX - lastPointer.x;
        var dy = e.clientY - lastPointer.y;
        lastPointer.x = e.clientX;
        lastPointer.y = e.clientY;

        if (dragMode === "orbit") {
          state.camera.yaw += dx * 0.28;
          state.camera.pitch = clamp(state.camera.pitch + dy * 0.25, -12, 82);
        } else if (dragMode === "pan") {
          var scale = state.camera.distance * 0.0018;
          var yawRad = (state.camera.yaw * Math.PI) / 180;
          var rightX = Math.cos(yawRad);
          var rightZ = -Math.sin(yawRad);
          state.camera.focus.x -= dx * rightX * scale;
          state.camera.focus.z -= dx * rightZ * scale;
          state.camera.focus.y += dy * scale;
        }
      });

      window.addEventListener("mouseup", function () {
        dragMode = null;
      });

      canvas.addEventListener(
        "wheel",
        function (e) {
          e.preventDefault();
          var scroll = -Math.sign(e.deltaY) * 0.9;
          state.camera.distance = clamp(state.camera.distance * Math.exp(-scroll * 0.12), 0.9, 11.0);
        },
        { passive: false }
      );

      window.addEventListener("keydown", function (e) {
        if (e.key === "f" || e.key === "F") {
          state.camera.focus = {
            x: state.camera.initialFocus.x,
            y: state.camera.initialFocus.y,
            z: state.camera.initialFocus.z
          };
          state.camera.distance = state.camera.initialDistance;
          state.camera.yaw = state.camera.initialYaw;
          state.camera.pitch = state.camera.initialPitch;
        }
      });

      // 3D Projection helper matching FireOrbitCamera
      function project3D(worldPt, width, height) {
        var cam = state.camera;
        var yaw = (cam.yaw * Math.PI) / 180;
        var pitch = (cam.pitch * Math.PI) / 180;

        var cosY = Math.cos(yaw), sinY = Math.sin(yaw);
        var cosP = Math.cos(pitch), sinP = Math.sin(pitch);

        var forward = { x: sinY * cosP, y: -sinP, z: cosY * cosP };
        var right = { x: cosY, y: 0, z: -sinY };
        var up = {
          x: sinY * sinP,
          y: cosP,
          z: cosY * sinP
        };

        var camPos = {
          x: cam.focus.x - forward.x * cam.distance,
          y: cam.focus.y - forward.y * cam.distance,
          z: cam.focus.z - forward.z * cam.distance
        };

        var dx = worldPt.x - camPos.x;
        var dy = worldPt.y - camPos.y;
        var dz = worldPt.z - camPos.z;

        var vx = dx * right.x + dy * right.y + dz * right.z;
        var vy = dx * up.x + dy * up.y + dz * up.z;
        var vz = dx * forward.x + dy * forward.y + dz * forward.z;

        if (vz <= 0.08) return null;
        var fovScale = Math.min(width, height) * 0.92;
        var centerOffsetX = state.showTelemetry && width > 640 ? width * 0.14 : 0;
        return {
          x: width * 0.5 + centerOffsetX + (vx / vz) * fovScale,
          y: height * 0.54 - (vy / vz) * fovScale,
          depth: vz,
          scale: fovScale / vz
        };
      }

      var ctx = canvas.getContext("2d");
      var lastTime = performance.now();
      var spawnAccumulator = 0;

      function spawnParticle(response) {
        // Spherical or stretched emitter matching FireSimulationController.Update
        var u = Math.random();
        var v = Math.random();
        var theta = u * 2 * Math.PI;
        var phi = Math.acos(2 * v - 1);
        var r = Math.cbrt(Math.random()) * response.radius * state.visualScale;

        var sx = r * Math.sin(phi) * Math.cos(theta);
        var sy = r * Math.cos(phi) * (1 + state.elongation * 0.8);
        var sz = r * Math.sin(phi) * Math.sin(theta);

        // Rotate emitter toward drift axis if drift is non-zero
        var drift = response.drift;
        var driftLen = Math.hypot(drift.x, drift.y, drift.z);
        var px = sx, py = sy, pz = sz;
        if (driftLen > 0.0001) {
          var ax = drift.x / driftLen;
          var ay = drift.y / driftLen;
          // Rotate local +Y toward (ax, ay, 0)
          px = sx * ay + sy * ax;
          py = -sx * ax + sy * ay;
        }

        var speed = state.visualScale * (0.08 + state.rate * 0.22);
        var outLen = Math.hypot(px, py, pz) || 1;
        var vx = (px / outLen) * speed * 0.35 + drift.x * state.visualScale;
        var vy = (py / outLen) * speed * 0.35 + drift.y * state.visualScale;
        var vz = (pz / outLen) * speed * 0.35 + drift.z * state.visualScale;

        state.particles.push({
          x: px,
          y: 0.42 + py,
          z: pz,
          vx: vx,
          vy: vy,
          vz: vz,
          age: 0,
          lifetime: response.lifetime * (0.8 + Math.random() * 0.4),
          baseSize: state.visualScale * (0.14 + state.rate * 0.18) * lerp(0.6, 1.4, state.intensity) * (0.85 + Math.random() * 0.3),
          phase: Math.random() * Math.PI * 2
        });
      }

      function drawFloorGrid(width, height) {
        var floorY = -0.17;
        var extent = 6;
        var step = 0.5;

        ctx.lineWidth = 1;
        for (var i = -extent; i <= extent; i += step) {
          var isMajor = Math.abs(i % 2) < 0.001;
          var isZero = Math.abs(i) < 0.001;

          // Lines parallel to X axis (varying Z = i)
          var p1 = project3D({ x: -extent, y: floorY, z: i }, width, height);
          var p2 = project3D({ x: extent, y: floorY, z: i }, width, height);
          if (p1 && p2) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            if (isZero) {
              ctx.strokeStyle = "rgba(191, 59, 56, 0.72)"; // Red X-axis from LaboratoryGrid.shader
              ctx.lineWidth = 1.6;
            } else {
              ctx.strokeStyle = isMajor ? "rgba(71, 92, 110, 0.48)" : "rgba(71, 92, 110, 0.22)";
              ctx.lineWidth = 1;
            }
            ctx.stroke();
          }

          // Lines parallel to Z axis (varying X = i)
          var q1 = project3D({ x: i, y: floorY, z: -extent }, width, height);
          var q2 = project3D({ x: i, y: floorY, z: extent }, width, height);
          if (q1 && q2) {
            ctx.beginPath();
            ctx.moveTo(q1.x, q1.y);
            ctx.lineTo(q2.x, q2.y);
            if (isZero) {
              ctx.strokeStyle = "rgba(56, 115, 217, 0.72)"; // Blue Z-axis from LaboratoryGrid.shader
              ctx.lineWidth = 1.6;
            } else {
              ctx.strokeStyle = isMajor ? "rgba(71, 92, 110, 0.48)" : "rgba(71, 92, 110, 0.22)";
              ctx.lineWidth = 1;
            }
            ctx.stroke();
          }
        }
      }

      function drawMaterialSampleAndPedestal(width, height, response) {
        var thicknessMm = state.payload && state.payload.inputs ? state.payload.inputs.thickness_mm : 5;
        var scaleY = clamp(thicknessMm / 5.0, 0.08, 4.0);
        var halfW = 0.34;
        var halfD = 0.22;
        var halfH = 0.045 * scaleY;
        var centerY = 0.36;

        // Draw Pedestal post from floor (-0.17) to sample holder (0.32)
        var pedBot = project3D({ x: 0, y: -0.17, z: 0 }, width, height);
        var pedTop = project3D({ x: 0, y: centerY - halfH, z: 0 }, width, height);
        if (pedBot && pedTop) {
          ctx.beginPath();
          ctx.moveTo(pedBot.x, pedBot.y);
          ctx.lineTo(pedTop.x, pedTop.y);
          ctx.strokeStyle = "rgba(148, 163, 184, 0.45)";
          ctx.lineWidth = Math.max(2, pedTop.scale * 0.035);
          ctx.stroke();
        }

        // 3D Box vertices for Material Sample
        var verts = [
          { x: -halfW, y: centerY - halfH, z: -halfD },
          { x: halfW, y: centerY - halfH, z: -halfD },
          { x: halfW, y: centerY - halfH, z: halfD },
          { x: -halfW, y: centerY - halfH, z: halfD },
          { x: -halfW, y: centerY + halfH, z: -halfD },
          { x: halfW, y: centerY + halfH, z: -halfD },
          { x: halfW, y: centerY + halfH, z: halfD },
          { x: -halfW, y: centerY + halfH, z: halfD }
        ];
        var proj = verts.map(function (v) { return project3D(v, width, height); });
        if (proj.some(function (p) { return !p; })) return;

        // Top face
        ctx.beginPath();
        ctx.moveTo(proj[4].x, proj[4].y);
        ctx.lineTo(proj[5].x, proj[5].y);
        ctx.lineTo(proj[6].x, proj[6].y);
        ctx.lineTo(proj[7].x, proj[7].y);
        ctx.closePath();
        ctx.fillStyle = "rgba(51, 65, 85, 0.88)";
        ctx.fill();
        ctx.strokeStyle = "rgba(148, 163, 184, 0.7)";
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Front/side edges
        var edges = [
          [0, 1], [1, 2], [2, 3], [3, 0],
          [0, 4], [1, 5], [2, 6], [3, 7]
        ];
        ctx.beginPath();
        edges.forEach(function (e) {
          ctx.moveTo(proj[e[0]].x, proj[e[0]].y);
          ctx.lineTo(proj[e[1]].x, proj[e[1]].y);
        });
        ctx.strokeStyle = "rgba(100, 116, 139, 0.65)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Airflow vector indicators when airflow_cm_s > 0.5
        var airflow = state.payload && state.payload.inputs ? state.payload.inputs.airflow_cm_s : 0;
        if (airflow > 0.5) {
          var zOffsets = [-0.28, 0, 0.28];
          ctx.strokeStyle = "rgba(89, 224, 255, 0.42)";
          ctx.lineWidth = 1.3;
          zOffsets.forEach(function (zo) {
            var aStart = project3D({ x: -1.1, y: 0.45, z: zo }, width, height);
            var aEnd = project3D({ x: -0.52, y: 0.45, z: zo }, width, height);
            var aTip1 = project3D({ x: -0.6, y: 0.49, z: zo }, width, height);
            var aTip2 = project3D({ x: -0.6, y: 0.41, z: zo }, width, height);
            if (aStart && aEnd && aTip1 && aTip2) {
              ctx.beginPath();
              ctx.moveTo(aStart.x, aStart.y);
              ctx.lineTo(aEnd.x, aEnd.y);
              ctx.moveTo(aTip1.x, aTip1.y);
              ctx.lineTo(aEnd.x, aEnd.y);
              ctx.lineTo(aTip2.x, aTip2.y);
              ctx.stroke();
            }
          });
        }
      }

      function stepFrame(now) {
        if (!state.running) return;
        var dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
        lastTime = now;

        // Match canvas internal resolution to CSS display size
        var rect = canvas.getBoundingClientRect();
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var targetW = Math.max(300, Math.round(rect.width * dpr));
        var targetH = Math.max(200, Math.round(rect.height * dpr));
        if (canvas.width !== targetW || canvas.height !== targetH) {
          canvas.width = targetW;
          canvas.height = targetH;
        }
        ctx.save();
        ctx.scale(dpr, dpr);
        var width = rect.width;
        var height = rect.height;

        // Update controller parameters (exact port of FireSimulationController.Update)
        var p = state.payload;
        var response = evaluateVisualResponse(p, state.enforceReceivedOxygenLimit);
        var t = 1 - Math.exp(-dt / Math.max(0.01, state.transitionSeconds));
        state.intensity = lerp(state.intensity, response.oxygen, t);
        state.rate = lerp(state.rate, response.rate, t);
        state.elongation = lerp(state.elongation, response.stretch, t);

        var parsedColor = parseHexColor(p.simulation_3d.flame_color_hex) || { r: 0.23, g: 0.51, b: 0.96 };
        state.color.r = lerp(state.color.r, parsedColor.r, t);
        state.color.g = lerp(state.color.g, parsedColor.g, t);
        state.color.b = lerp(state.color.b, parsedColor.b, t);

        if (response.burning) {
          state.burnFrontMillimeters += p.simulation_3d.burn_rate_mm_s * dt;
          hud.updateBurnFrontOnly();
        }

        // Background + dynamic point light glow on laboratory stage
        ctx.fillStyle = "#060d15";
        ctx.fillRect(0, 0, width, height);

        var originScreen = project3D({ x: 0, y: 0.45, z: 0 }, width, height);
        if (originScreen && state.intensity > 0.01) {
          var glowRadius = Math.max(80, originScreen.scale * (0.9 + state.rate * 0.55) * state.intensity);
          var bgGlow = ctx.createRadialGradient(
            originScreen.x,
            originScreen.y,
            0,
            originScreen.x,
            originScreen.y,
            glowRadius
          );
          var cr = Math.round(state.color.r * 255);
          var cg = Math.round(state.color.g * 255);
          var cb = Math.round(state.color.b * 255);
          bgGlow.addColorStop(0, "rgba(" + cr + "," + cg + "," + cb + "," + (0.26 * state.intensity).toFixed(3) + ")");
          bgGlow.addColorStop(0.5, "rgba(" + cr + "," + cg + "," + cb + "," + (0.08 * state.intensity).toFixed(3) + ")");
          bgGlow.addColorStop(1, "rgba(6,13,21,0)");
          ctx.fillStyle = bgGlow;
          ctx.fillRect(0, 0, width, height);
        }

        drawFloorGrid(width, height);
        drawMaterialSampleAndPedestal(width, height, response);

        // Emit new particles scaled for smooth 60fps canvas rendering
        var effectiveRate = Math.min(240, response.emission * 0.55);
        spawnAccumulator += effectiveRate * dt;
        while (spawnAccumulator >= 1 && state.particles.length < 450) {
          spawnAccumulator -= 1;
          spawnParticle(response);
        }

        // Update and depth-sort particles
        var alive = [];
        for (var idx = 0; idx < state.particles.length; idx++) {
          var pt = state.particles[idx];
          pt.age += dt;
          if (pt.age >= pt.lifetime) continue;
          var normAge = pt.age / pt.lifetime;
          // Soft turbulence ripple from Flame.shader
          var rippleX = Math.sin(pt.phase + now * 0.004) * 0.04;
          var rippleZ = Math.cos(pt.phase * 1.3 - now * 0.005) * 0.04;
          pt.x += (pt.vx + rippleX) * dt;
          pt.y += pt.vy * dt;
          pt.z += (pt.vz + rippleZ) * dt;

          // Size curve from FireSimulationController.Awake: Keyframe(0, 0.35), Keyframe(0.2, 1), Keyframe(1, 0)
          var sizeCurve = normAge < 0.2
            ? lerp(0.35, 1.0, normAge / 0.2)
            : lerp(1.0, 0.0, (normAge - 0.2) / 0.8);

          // Alpha curve from FireSimulationController.Update: Keyframe(0, 0), Keyframe(0.15, 1), Keyframe(1, 0)
          var alphaCurve = normAge < 0.15
            ? normAge / 0.15
            : 1.0 - (normAge - 0.15) / 0.85;

          var projPt = project3D({ x: pt.x, y: pt.y, z: pt.z }, width, height);
          if (projPt) {
            alive.push({
              ref: pt,
              proj: projPt,
              normAge: normAge,
              size: Math.max(2, pt.baseSize * sizeCurve * projPt.scale),
              alpha: clamp01(alphaCurve * state.intensity * 0.78)
            });
          }
        }
        state.particles = alive.map(function (item) { return item.ref; });

        // Sort back-to-front
        alive.sort(function (a, b) { return b.proj.depth - a.proj.depth; });

        // Additive blending matching Shader "FireSimulation/SoftFlame" (Blend SrcAlpha One)
        ctx.save();
        ctx.globalCompositeOperation = "lighter";

        // Core stationary/elongated diffusion envelope
        if (originScreen && state.intensity > 0.02) {
          var envCenter = project3D(
            {
              x: response.drift.x * 0.18,
              y: 0.44 + response.drift.y * 0.15,
              z: 0
            },
            width,
            height
          );
          if (envCenter) {
            var envRx = Math.max(14, response.radius * 1.45 * envCenter.scale * (1 + state.elongation * 0.35));
            var envRy = Math.max(14, response.radius * 1.35 * envCenter.scale);
            var angle = Math.atan2(-response.drift.y, response.drift.x);
            ctx.save();
            ctx.translate(envCenter.x, envCenter.y);
            if (response.driftMag > 0.02) {
              ctx.rotate(angle);
            }
            ctx.scale(1, envRy / envRx);
            var coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, envRx);
            var r255 = Math.min(255, Math.round(state.color.r * 1.4 * 255));
            var g255 = Math.min(255, Math.round(state.color.g * 1.4 * 255));
            var b255 = Math.min(255, Math.round(state.color.b * 1.4 * 255));
            coreGrad.addColorStop(0, "rgba(255,255,255," + (0.65 * state.intensity).toFixed(3) + ")");
            coreGrad.addColorStop(0.35, "rgba(" + r255 + "," + g255 + "," + b255 + "," + (0.52 * state.intensity).toFixed(3) + ")");
            coreGrad.addColorStop(1, "rgba(" + r255 + "," + g255 + "," + b255 + ",0)");
            ctx.fillStyle = coreGrad;
            ctx.beginPath();
            ctx.arc(0, 0, envRx, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }

        // Draw individual additive flame particles (colorOverLifetime: white at 0 -> target color at 1)
        for (var j = 0; j < alive.length; j++) {
          var item = alive[j];
          var pr = Math.min(255, Math.round(lerp(1.0, state.color.r * 1.5, item.normAge) * 255));
          var pg = Math.min(255, Math.round(lerp(1.0, state.color.g * 1.5, item.normAge) * 255));
          var pb = Math.min(255, Math.round(lerp(1.0, state.color.b * 1.5, item.normAge) * 255));

          var grad = ctx.createRadialGradient(
            item.proj.x,
            item.proj.y,
            0,
            item.proj.x,
            item.proj.y,
            item.size
          );
          grad.addColorStop(0, "rgba(255,255,255," + (item.alpha * 0.9).toFixed(3) + ")");
          grad.addColorStop(0.4, "rgba(" + pr + "," + pg + "," + pb + "," + (item.alpha * 0.75).toFixed(3) + ")");
          grad.addColorStop(1, "rgba(" + pr + "," + pg + "," + pb + ",0)");

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(item.proj.x, item.proj.y, item.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // Extinguished badge when oxygen_factor == 0 or o2_pct <= oxygen_limit_pct
        if (!response.burning && state.intensity < 0.08 && originScreen) {
          ctx.save();
          ctx.font = "600 12px ui-monospace, SFMono-Regular, Menlo, monospace";
          ctx.fillStyle = "rgba(148, 163, 184, 0.9)";
          ctx.textAlign = "center";
          ctx.fillText("FLAME EXTINGUISHED (BELOW O2 LIMIT / ZERO BURN RATE)", originScreen.x, originScreen.y - 42);
          ctx.restore();
        }

        ctx.restore();
        requestAnimationFrame(stepFrame);
      }

      if (typeof onProgress === "function") {
        onProgress(1.0);
      }
      requestAnimationFrame(stepFrame);

      var unityInstance = {
        SendMessage: function (objectName, methodName, value) {
          if (methodName === "ApplyJson") {
            applyJson(value);
          } else if (methodName === "LoadScenario") {
            var idx = Number(value) || 0;
            if (SAMPLE_SCENARIOS[idx]) {
              setPayload(JSON.parse(JSON.stringify(SAMPLE_SCENARIOS[idx])));
            }
          }
        },
        SetShowTelemetry: function (show) {
          state.showTelemetry = Boolean(show);
          hud.renderReadout();
        },
        SetFullscreen: function (fullscreen) {
          if (fullscreen && container.requestFullscreen) {
            container.requestFullscreen().catch(function () {});
          } else if (!fullscreen && document.exitFullscreen) {
            document.exitFullscreen().catch(function () {});
          }
        },
        Quit: function () {
          state.running = false;
          return Promise.resolve();
        }
      };

      resolve(unityInstance);
    });
  };
})(window);
