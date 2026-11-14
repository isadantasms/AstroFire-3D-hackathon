// SI-assisted: generated with Gemini, exact WebGL2 GLSL port of Esquivel's SampleScene.unity, FireSimulationController.cs, FireOrbitCamera.cs, LaboratoryStage.cs, Flame.shader & LaboratoryGrid.shader — [PROJECT_NAME]
(function (global) {
  "use strict";

  // Initial Inspector payload saved in Assets/Scenes/SampleScene.unity (lines 167-194)
  var INITIAL_SCENE_PAYLOAD = {
    scenario_id: "Inspector preview",
    grounding_status: "visual_preview",
    inputs: {
      material_id: "pmma_clear_slab",
      material_name: "PMMA",
      environment_label: "ISS Microgravity",
      thickness_mm: 5,
      gravity_g: 0,
      o2_pct: 21,
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
      co_ppm: 115,
      co2_pct: 1.2
    },
    safety_copilot: {
      diagnosis: "",
      suppression_action: "",
      terrestrial_spinoff: "",
      scientific_limitations: ""
    },
    nasa_citations: []
  };

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
      (!p.telemetry ||
        (isFiniteNum(p.telemetry.oxygen_limit_pct) &&
          p.telemetry.oxygen_limit_pct >= 0 &&
          p.telemetry.oxygen_limit_pct <= 100))
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
    // airflowDirection = Vector3.right (1, 0, 0)
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

  // Exact Unity AnimationCurve for sizeOverLifetime:
  // new Keyframe(0, .35f), new Keyframe(.2f, 1), new Keyframe(1, 0)
  function evalSizeCurve(t) {
    if (t <= 0) return 0.35;
    if (t >= 1) return 0.0;
    if (t < 0.2) {
      var u = t / 0.2;
      return lerp(0.35, 1.0, u * u * (3 - 2 * u));
    }
    var v = (t - 0.2) / 0.8;
    return lerp(1.0, 0.0, v * v * (3 - 2 * v));
  }

  // Exact Unity Gradient for colorOverLifetime:
  // colorKeys: (white, 0) -> (color, 1)
  // alphaKeys: (0, 0) -> (1, 0.15) -> (0, 1)
  function evalAlphaGradient(t) {
    if (t <= 0) return 0;
    if (t >= 1) return 0;
    if (t < 0.15) return t / 0.15;
    return 1.0 - (t - 0.15) / 0.85;
  }

  // Exact port of FireSimulationController.OnGUI() (lines 204-259)
  function createOnGUI(container, state) {
    var panel = document.createElement("div");
    panel.style.cssText = [
      "position:absolute",
      "top:16px",
      "left:16px",
      "bottom:56px",
      "background:rgba(10, 23, 36, 0.96)",
      "border:1px solid rgba(255, 255, 255, 0.12)",
      "border-radius:3px",
      "box-sizing:border-box",
      "padding:18px",
      "display:flex",
      "flex-direction:column",
      "color:rgb(199, 217, 235)",
      "font-family:Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      "font-size:12px",
      "line-height:1.4",
      "z-index:10",
      "pointer-events:auto",
      "user-select:none"
    ].join(";");

    var title = document.createElement("div");
    title.textContent = "COMBUSTION LAB";
    title.style.cssText =
      "font-size:20px;font-weight:700;color:rgb(89, 224, 255);line-height:1.2;word-wrap:break-word;";
    panel.appendChild(title);

    var subtitle = document.createElement("div");
    subtitle.textContent = "LIVE EXPERIMENT / VISUAL PREVIEW";
    subtitle.style.cssText =
      "font-size:12px;color:rgb(199, 217, 235);margin-top:2px;margin-bottom:14px;word-wrap:break-word;";
    panel.appendChild(subtitle);

    var scrollView = document.createElement("div");
    scrollView.style.cssText =
      "flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:4px;padding-right:4px;word-wrap:break-word;";
    panel.appendChild(scrollView);

    var bottomBar = document.createElement("div");
    bottomBar.style.cssText = [
      "position:absolute",
      "height:28px",
      "bottom:12px",
      "color:rgb(199, 217, 235)",
      "font-family:Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      "font-size:12px",
      "white-space:pre",
      "pointer-events:none",
      "z-index:10"
    ].join(";");
    bottomBar.textContent = "RMB  ORBIT     MMB  PAN     WHEEL  ZOOM     F  RESET";

    container.appendChild(panel);
    container.appendChild(bottomBar);

    var burnFrontLabel = null;

    function addLabel(text) {
      if (!text) return null;
      var el = document.createElement("div");
      el.style.cssText = "white-space:pre-wrap;word-break:break-word;margin-bottom:2px;";
      el.textContent = text;
      scrollView.appendChild(el);
      return el;
    }

    function fmt2(n) {
      if (typeof n !== "number" || !Number.isFinite(n)) return "0";
      return Number(n.toFixed(2)).toString();
    }

    function updateLayout(screenWidth) {
      var width = Math.min(360, screenWidth * 0.32);
      panel.style.width = Math.max(180, width - 24) + "px";
      bottomBar.style.left = width + 16 + "px";
      bottomBar.style.width = Math.max(100, screenWidth - width - 24) + "px";
    }

    function renderLabels() {
      panel.style.display = state.showTelemetry && state.payload ? "flex" : "none";
      bottomBar.style.display = state.showTelemetry && state.payload ? "block" : "none";
      if (!state.payload) return;

      scrollView.innerHTML = "";
      var p = state.payload;
      addLabel((p.scenario_id || "") + " | " + (p.grounding_status || ""));
      if (!isValidPayload(p)) {
        addLabel("Invalid payload: check geometry, color and numeric ranges.");
      }
      var i = p.inputs;
      if (i) {
        addLabel((i.material_name || "") + " | " + (i.material_id || ""));
        addLabel(i.environment_label || "");
        addLabel("Thickness " + fmt2(i.thickness_mm) + " mm | Gravity " + fmt2(i.gravity_g) + " g");
        addLabel("O2 " + fmt2(i.o2_pct) + "% | Airflow " + fmt2(i.airflow_cm_s) + " cm/s");
      }
      var t = p.telemetry;
      if (t) {
        addLabel("Risk " + t.flammability_score + "/100 | " + (t.risk_label || ""));
        addLabel(
          "CO " + fmt2(t.co_ppm) + " ppm | CO2 " + fmt2(t.co2_pct) + "% | O2 limit " + fmt2(t.oxygen_limit_pct) + "%"
        );
      }
      burnFrontLabel = addLabel("Burn front (integrated input): " + fmt2(state.burnFrontMillimeters) + " mm");
      if (p.safety_copilot) {
        addLabel(p.safety_copilot.diagnosis);
        addLabel(p.safety_copilot.suppression_action);
        addLabel(p.safety_copilot.scientific_limitations);
        addLabel(p.safety_copilot.terrestrial_spinoff);
      }
      if (Array.isArray(p.nasa_citations)) {
        p.nasa_citations.forEach(function (c) {
          if (c) {
            addLabel((c.id || "") + " | " + (c.title || "") + "\n" + (c.url || "") + "\n" + (c.finding || ""));
          }
        });
      }
    }

    function updateBurnFront() {
      if (burnFrontLabel) {
        burnFrontLabel.textContent = "Burn front (integrated input): " + fmt2(state.burnFrontMillimeters) + " mm";
      }
    }

    return {
      updateLayout: updateLayout,
      renderLabels: renderLabels,
      updateBurnFront: updateBurnFront
    };
  }

  // Matrix math helpers (Left-Handed Unity world space: +X right, +Y up, +Z forward)
  function mat4PerspectiveLH(fovYRad, aspect, near, far) {
    var f = 1.0 / Math.tan(fovYRad * 0.5);
    var nf = 1.0 / (far - near);
    return new Float32Array([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (far + near) * nf, 1,
      0, 0, -2 * far * near * nf, 0
    ]);
  }

  function mat4Multiply(a, b) {
    var out = new Float32Array(16);
    for (var c = 0; c < 4; c++) {
      for (var r = 0; r < 4; r++) {
        out[c * 4 + r] =
          a[0 * 4 + r] * b[c * 4 + 0] +
          a[1 * 4 + r] * b[c * 4 + 1] +
          a[2 * 4 + r] * b[c * 4 + 2] +
          a[3 * 4 + r] * b[c * 4 + 3];
      }
    }
    return out;
  }

  // Unity Quaternion.Euler(pitch, yaw, 0) camera basis and view matrix
  function computeCameraBasis(cam) {
    var pitch = (cam.pitch * Math.PI) / 180.0;
    var yaw = (cam.yaw * Math.PI) / 180.0;
    var cp = Math.cos(pitch), sp = Math.sin(pitch);
    var cy = Math.cos(yaw), sy = Math.sin(yaw);

    // In Unity LH:
    // Forward (+Z rotated by pitch X then yaw Y): (sy * cp, -sp, cy * cp)
    // Right   (+X rotated by pitch X then yaw Y): (cy, 0, -sy)
    // Up      (+Y rotated by pitch X then yaw Y): (sy * sp, cp, cy * sp)
    var forward = { x: sy * cp, y: -sp, z: cy * cp };
    var right = { x: cy, y: 0, z: -sy };
    var up = { x: sy * sp, y: cp, z: cy * sp };

    // transform.position = focus + rotation * Vector3.back * distance = focus - forward * distance
    var pos = {
      x: cam.focus.x - forward.x * cam.distance,
      y: cam.focus.y - forward.y * cam.distance,
      z: cam.focus.z - forward.z * cam.distance
    };

    var tx = -(right.x * pos.x + right.y * pos.y + right.z * pos.z);
    var ty = -(up.x * pos.x + up.y * pos.y + up.z * pos.z);
    var tz = -(forward.x * pos.x + forward.y * pos.y + forward.z * pos.z);

    var view = new Float32Array([
      right.x, up.x, forward.x, 0,
      right.y, up.y, forward.y, 0,
      right.z, up.z, forward.z, 0,
      tx, ty, tz, 1
    ]);

    return { pos: pos, right: right, up: up, forward: forward, view: view };
  }

  function compileShader(gl, type, source) {
    var s = gl.createShader(type);
    gl.shaderSource(s, source);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error("Shader compile error:", gl.getShaderInfoLog(s));
    }
    return s;
  }

  function createProgram(gl, vsSource, fsSource) {
    var p = gl.createProgram();
    gl.attachShader(p, compileShader(gl, gl.VERTEX_SHADER, vsSource));
    gl.attachShader(p, compileShader(gl, gl.FRAGMENT_SHADER, fsSource));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(p));
    }
    return p;
  }

  // Generate Unity built-in Cube mesh (1x1x1 centered at origin)
  function createCubeGeometry(gl) {
    var p = [
      // +Y top
      -0.5, 0.5, -0.5, 0, 1, 0,   -0.5, 0.5, 0.5, 0, 1, 0,    0.5, 0.5, 0.5, 0, 1, 0,    0.5, 0.5, -0.5, 0, 1, 0,
      // -Y bottom
      -0.5, -0.5, 0.5, 0, -1, 0,  -0.5, -0.5, -0.5, 0, -1, 0, 0.5, -0.5, -0.5, 0, -1, 0, 0.5, -0.5, 0.5, 0, -1, 0,
      // -Z front
      -0.5, -0.5, -0.5, 0, 0, -1, -0.5, 0.5, -0.5, 0, 0, -1,  0.5, 0.5, -0.5, 0, 0, -1,  0.5, -0.5, -0.5, 0, 0, -1,
      // +Z back
      0.5, -0.5, 0.5, 0, 0, 1,    0.5, 0.5, 0.5, 0, 0, 1,    -0.5, 0.5, 0.5, 0, 0, 1,   -0.5, -0.5, 0.5, 0, 0, 1,
      // -X left
      -0.5, -0.5, 0.5, -1, 0, 0,  -0.5, 0.5, 0.5, -1, 0, 0,  -0.5, 0.5, -0.5, -1, 0, 0, -0.5, -0.5, -0.5, -1, 0, 0,
      // +X right
      0.5, -0.5, -0.5, 1, 0, 0,   0.5, 0.5, -0.5, 1, 0, 0,    0.5, 0.5, 0.5, 1, 0, 0,    0.5, -0.5, 0.5, 1, 0, 0
    ];
    var idx = [];
    for (var f = 0; f < 6; f++) {
      var b = f * 4;
      idx.push(b, b + 1, b + 2, b, b + 2, b + 3);
    }
    var vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(p), gl.STATIC_DRAW);
    var ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW);
    return { vbo: vbo, ibo: ibo, count: idx.length };
  }

  // Generate Unity built-in Cylinder mesh (fileID 10206: radius 0.5, height 2.0 from y=-1 to y=+1)
  function createCylinderGeometry(gl, segments) {
    var verts = [];
    var idx = [];
    var r = 0.5;

    // Side ring
    for (var i = 0; i <= segments; i++) {
      var a = (i / segments) * Math.PI * 2;
      var nx = Math.cos(a);
      var nz = Math.sin(a);
      verts.push(nx * r, -1.0, nz * r, nx, 0, nz);
      verts.push(nx * r, 1.0, nz * r, nx, 0, nz);
    }
    for (var j = 0; j < segments; j++) {
      var k = j * 2;
      idx.push(k, k + 1, k + 3, k, k + 3, k + 2);
    }

    // Top cap (y = +1)
    var topCenter = verts.length / 6;
    verts.push(0, 1.0, 0, 0, 1, 0);
    for (var t = 0; t <= segments; t++) {
      var at = (t / segments) * Math.PI * 2;
      verts.push(Math.cos(at) * r, 1.0, Math.sin(at) * r, 0, 1, 0);
    }
    for (var ti = 0; ti < segments; ti++) {
      idx.push(topCenter, topCenter + 1 + ti + 1, topCenter + 1 + ti);
    }

    // Bottom cap (y = -1)
    var botCenter = verts.length / 6;
    verts.push(0, -1.0, 0, 0, -1, 0);
    for (var b = 0; b <= segments; b++) {
      var ab = (b / segments) * Math.PI * 2;
      verts.push(Math.cos(ab) * r, -1.0, Math.sin(ab) * r, 0, -1, 0);
    }
    for (var bi = 0; bi < segments; bi++) {
      idx.push(botCenter, botCenter + 1 + bi, botCenter + 1 + bi + 1);
    }

    var vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    var ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW);
    return { vbo: vbo, ibo: ibo, count: idx.length };
  }

  global.createUnityInstance = function (canvas, config, onProgress) {
    return new Promise(function (resolve) {
      if (typeof onProgress === "function") {
        onProgress(0.4);
      }

      var container = canvas.parentElement || document.body;
      if (getComputedStyle(container).position === "static") {
        container.style.position = "relative";
      }

      // Exact initial state from SampleScene.unity + FireSimulationController.cs + FireOrbitCamera.cs
      var state = {
        payload: JSON.parse(JSON.stringify(INITIAL_SCENE_PAYLOAD)),
        burnFrontMillimeters: 0,
        showTelemetry: true,
        enforceReceivedOxygenLimit: true,
        visualScale: 1.5, // SampleScene.unity line 199: visualScale: 1.5
        transitionSeconds: 0.5, // SampleScene.unity line 200: transitionSeconds: 0.5
        emitterOrigin: { x: 0, y: 0.65, z: 0 }, // SampleScene.unity line 149: FireSimulation at (0, 0.65, 0)
        intensity: 0.0,
        rate: 0.0,
        elongation: 0.0,
        color: { r: 0.23, g: 0.51, b: 0.96 },
        camera: {
          focus: { x: 0, y: 0.65, z: 0 },
          distance: 4.0,
          yaw: -18.0,
          pitch: 18.0,
          minimumDistance: 0.8,
          maximumDistance: 12.0,
          initialFocus: { x: 0, y: 0.65, z: 0 },
          initialDistance: 4.0,
          initialYaw: -18.0,
          initialPitch: 18.0
        },
        particles: [],
        maxParticles: 1800,
        running: true
      };

      var gui = createOnGUI(container, state);
      gui.renderLabels();

      function setPayload(nextPayload) {
        if (!isValidPayload(nextPayload)) {
          console.warn("Payload rejected: Invalid geometry, color, or numeric range.");
          return;
        }
        state.payload = nextPayload;
        state.burnFrontMillimeters = 0;
        gui.renderLabels();
      }

      function applyJson(json) {
        try {
          var str = typeof json === "string" ? json : JSON.stringify(json);
          if (!str || str.indexOf('"inputs"') === -1 || str.indexOf('"simulation_3d"') === -1) {
            throw new Error("Expected one scenario with inputs and simulation_3d sections.");
          }
          var parsed = typeof json === "string" ? JSON.parse(json) : json;
          setPayload(parsed);
        } catch (ex) {
          console.warn("Payload rejected: " + ex.message);
        }
      }

      // Exact camera input handling from FireOrbitCamera.cs (lines 25-53):
      // RMB = Orbit, MMB = Pan, Wheel = Zoom, F = Reset, left telemetry area reserved
      var orbitPressed = false;
      var panPressed = false;
      var lastMouse = { x: 0, y: 0 };
      var pointerInViewport = true;

      function isPointerAllowed(clientX) {
        var rect = canvas.getBoundingClientRect();
        var localX = clientX - rect.left;
        var telemetryWidth = Math.min(360, rect.width * 0.32);
        return localX > telemetryWidth || !state.showTelemetry;
      }

      canvas.addEventListener("contextmenu", function (e) {
        e.preventDefault();
      });

      canvas.addEventListener("mousedown", function (e) {
        lastMouse.x = e.clientX;
        lastMouse.y = e.clientY;
        pointerInViewport = isPointerAllowed(e.clientX);
        if (!pointerInViewport) return;
        if (e.button === 2) {
          orbitPressed = true;
          e.preventDefault();
        } else if (e.button === 1) {
          panPressed = true;
          e.preventDefault();
        }
      });

      window.addEventListener("mousemove", function (e) {
        var dx = e.clientX - lastMouse.x;
        var dy = e.clientY - lastMouse.y;
        lastMouse.x = e.clientX;
        lastMouse.y = e.clientY;

        if (!orbitPressed && !panPressed) return;
        var cam = state.camera;
        if (orbitPressed) {
          cam.yaw += dx * 0.22;
          cam.pitch = clamp(cam.pitch + dy * 0.22, -15, 85);
        }
        if (panPressed) {
          var basis = computeCameraBasis(cam);
          var panFactor = cam.distance * 0.0012;
          // In screen coords dy is down, in Unity Input.mousePosition dy is up
          var unityDy = -dy;
          cam.focus.x += (-basis.right.x * dx - basis.up.x * unityDy) * panFactor;
          cam.focus.y += (-basis.right.y * dx - basis.up.y * unityDy) * panFactor;
          cam.focus.z += (-basis.right.z * dx - basis.up.z * unityDy) * panFactor;
        }
      });

      window.addEventListener("mouseup", function (e) {
        if (e.button === 2) orbitPressed = false;
        if (e.button === 1) panPressed = false;
      });

      canvas.addEventListener(
        "wheel",
        function (e) {
          if (!isPointerAllowed(e.clientX)) return;
          e.preventDefault();
          var scroll = -Math.sign(e.deltaY);
          state.camera.distance = clamp(
            state.camera.distance * Math.exp(-scroll * 0.12),
            state.camera.minimumDistance,
            state.camera.maximumDistance
          );
        },
        { passive: false }
      );

      window.addEventListener("keydown", function (e) {
        if (e.key === "f" || e.key === "F") {
          var cam = state.camera;
          cam.focus = { x: cam.initialFocus.x, y: cam.initialFocus.y, z: cam.initialFocus.z };
          cam.distance = cam.initialDistance;
          cam.yaw = cam.initialYaw;
          cam.pitch = cam.initialPitch;
        }
      });

      // Initialize WebGL2 context (with WebGL1 + OES_standard_derivatives fallback)
      var gl = canvas.getContext("webgl2", { alpha: false, antialias: true, depth: true });
      var isWebGL2 = Boolean(gl);
      if (!gl) {
        gl = canvas.getContext("webgl", { alpha: false, antialias: true, depth: true });
        if (gl) gl.getExtension("OES_standard_derivatives");
      }

      // 1. LaboratoryGrid.shader (exact GLSL translation of Assets/Shaders/LaboratoryGrid.shader)
      var gridVS = isWebGL2
        ? `#version 300 es
           precision highp float;
           in vec3 a_pos;
           uniform mat4 u_vp;
           uniform vec3 u_camPos;
           out vec3 v_world;
           void main() {
             v_world = vec3(a_pos.x + u_camPos.x, -0.17, a_pos.z + u_camPos.z);
             gl_Position = u_vp * vec4(v_world, 1.0);
           }`
        : `precision highp float;
           attribute vec3 a_pos;
           uniform mat4 u_vp;
           uniform vec3 u_camPos;
           varying vec3 v_world;
           void main() {
             v_world = vec3(a_pos.x + u_camPos.x, -0.17, a_pos.z + u_camPos.z);
             gl_Position = u_vp * vec4(v_world, 1.0);
           }`;

      var gridFSBody = `
        float grid(vec2 position, float spacing, vec2 footprint) {
          vec2 distanceToLine = abs(fract(position / spacing + 0.5) - 0.5) * spacing;
          vec2 pixelDistance = distanceToLine / max(footprint, vec2(0.00001));
          float lineCoverage = 1.0 - smoothstep(0.35, 1.25, min(pixelDistance.x, pixelDistance.y));
          return lineCoverage * clamp(spacing / max(footprint.x, footprint.y) / 4.0, 0.0, 1.0);
        }
        vec4 evalGrid(vec3 world, vec3 camPos) {
          vec2 footprint = max(fwidth(world.xz), vec2(0.00001));
          float level = log(max(max(footprint.x, footprint.y) * 60.0, 0.01)) / log(10.0);
          float spacing = pow(10.0, floor(level));
          float fine = grid(world.xz, spacing, footprint);
          float major = grid(world.xz, spacing * 10.0, footprint);
          float alpha = mix(fine, major, fract(level)) * 0.35;
          vec3 color = vec3(0.28, 0.36, 0.43);
          float xAxis = 1.0 - smoothstep(0.6, 1.8, abs(world.z) / footprint.y);
          float zAxis = 1.0 - smoothstep(0.6, 1.8, abs(world.x) / footprint.x);
          color = mix(color, vec3(0.75, 0.23, 0.22), xAxis);
          color = mix(color, vec3(0.22, 0.45, 0.85), zAxis);
          alpha = max(alpha, max(xAxis, zAxis) * 0.65);
          float distanceToCamera = length(world - camPos);
          float range = max(30.0, abs(camPos.y + 0.17) * 30.0);
          float fade = 1.0 - smoothstep(range * 0.35, range, distanceToCamera);
          float facing = abs(normalize(camPos - world).y);
          fade *= smoothstep(0.015, 0.12, facing);
          return vec4(color, alpha * fade);
        }
      `;

      var gridFS = isWebGL2
        ? `#version 300 es
           precision highp float;
           in vec3 v_world;
           uniform vec3 u_camPos;
           out vec4 fragColor;
           ${gridFSBody}
           void main() { fragColor = evalGrid(v_world, u_camPos); }`
        : `#extension GL_OES_standard_derivatives : enable
           precision highp float;
           varying vec3 v_world;
           uniform vec3 u_camPos;
           ${gridFSBody}
           void main() { gl_FragColor = evalGrid(v_world, u_camPos); }`;

      // 2. Lit Mesh Shader for Sample pedestal (LaboratoryMetal.mat) & Material sample (DefaultMaterial.mat)
      var meshVS = isWebGL2
        ? `#version 300 es
           precision highp float;
           in vec3 a_pos;
           in vec3 a_normal;
           uniform mat4 u_vp;
           uniform vec3 u_translate;
           uniform vec3 u_scale;
           out vec3 v_worldPos;
           out vec3 v_normal;
           void main() {
             vec3 worldPos = a_pos * u_scale + u_translate;
             v_worldPos = worldPos;
             v_normal = normalize(a_normal / u_scale);
             gl_Position = u_vp * vec4(worldPos, 1.0);
           }`
        : `precision highp float;
           attribute vec3 a_pos;
           attribute vec3 a_normal;
           uniform mat4 u_vp;
           uniform vec3 u_translate;
           uniform vec3 u_scale;
           varying vec3 v_worldPos;
           varying vec3 v_normal;
           void main() {
             vec3 worldPos = a_pos * u_scale + u_translate;
             v_worldPos = worldPos;
             v_normal = normalize(a_normal / u_scale);
             gl_Position = u_vp * vec4(worldPos, 1.0);
           }`;

      var meshFSBody = `
        vec4 evalLit(vec3 worldPos, vec3 N, vec3 camPos, vec3 baseColor, float metallic, float smoothness, vec3 pointLightPos, vec3 pointLightColor, float pointLightIntensity) {
          vec3 V = normalize(camPos - worldPos);
          // Directional Light from SampleScene.unity (Euler 50, -30, 0 -> light dir toward surface)
          vec3 Ldir = normalize(vec3(0.321, 0.766, -0.557));
          vec3 Hdir = normalize(Ldir + V);
          float ndl = max(dot(N, Ldir), 0.0);
          float specPow = mix(8.0, 128.0, smoothness);
          float specDir = pow(max(dot(N, Hdir), 0.0), specPow) * smoothness * 0.6;

          // Flame glow Point Light at (0, 0.65, 0), range = 3.0
          vec3 toLight = pointLightPos - worldPos;
          float dist = length(toLight);
          vec3 Lpt = toLight / max(dist, 0.0001);
          float atten = clamp(1.0 - (dist / 3.0), 0.0, 1.0);
          atten = atten * atten;
          float ndlPt = max(dot(N, Lpt), 0.0);
          vec3 Hpt = normalize(Lpt + V);
          float specPt = pow(max(dot(N, Hpt), 0.0), specPow) * smoothness;

          vec3 ambient = vec3(0.18, 0.20, 0.24) * baseColor;
          vec3 diffuseColor = baseColor * (1.0 - metallic * 0.5);
          vec3 specTint = mix(vec3(0.22), baseColor, metallic);

          vec3 color = ambient
            + diffuseColor * ndl * 1.15
            + specTint * specDir
            + (diffuseColor * ndlPt + specTint * specPt * 0.8) * pointLightColor * pointLightIntensity * atten * 0.85;

          return vec4(color, 1.0);
        }
      `;

      var meshFS = isWebGL2
        ? `#version 300 es
           precision highp float;
           in vec3 v_worldPos;
           in vec3 v_normal;
           uniform vec3 u_camPos;
           uniform vec3 u_baseColor;
           uniform float u_metallic;
           uniform float u_smoothness;
           uniform vec3 u_pointLightPos;
           uniform vec3 u_pointLightColor;
           uniform float u_pointLightIntensity;
           out vec4 fragColor;
           ${meshFSBody}
           void main() {
             fragColor = evalLit(v_worldPos, normalize(v_normal), u_camPos, u_baseColor, u_metallic, u_smoothness, u_pointLightPos, u_pointLightColor, u_pointLightIntensity);
           }`
        : `precision highp float;
           varying vec3 v_worldPos;
           varying vec3 v_normal;
           uniform vec3 u_camPos;
           uniform vec3 u_baseColor;
           uniform float u_metallic;
           uniform float u_smoothness;
           uniform vec3 u_pointLightPos;
           uniform vec3 u_pointLightColor;
           uniform float u_pointLightIntensity;
           ${meshFSBody}
           void main() {
             gl_FragColor = evalLit(v_worldPos, normalize(v_normal), u_camPos, u_baseColor, u_metallic, u_smoothness, u_pointLightPos, u_pointLightColor, u_pointLightIntensity);
           }`;

      // 3. Flame.shader (exact GLSL translation of Assets/Shaders/Flame.shader: Shader "FireSimulation/SoftFlame")
      var flameVS = isWebGL2
        ? `#version 300 es
           precision highp float;
           in vec3 a_pos;
           in vec2 a_uv;
           in vec4 a_color;
           uniform mat4 u_vp;
           out vec2 v_uv;
           out vec4 v_color;
           void main() {
             v_uv = a_uv;
             v_color = a_color;
             gl_Position = u_vp * vec4(a_pos, 1.0);
           }`
        : `precision highp float;
           attribute vec3 a_pos;
           attribute vec2 a_uv;
           attribute vec4 a_color;
           uniform mat4 u_vp;
           varying vec2 v_uv;
           varying vec4 v_color;
           void main() {
             v_uv = a_uv;
             v_color = a_color;
             gl_Position = u_vp * vec4(a_pos, 1.0);
           }`;

      var flameFSBody = `
        vec4 evalSoftFlame(vec2 uv, vec4 color, float timeY) {
          float r = length(uv * 2.0 - 1.0);
          float ripple = sin(uv.x * 23.0 + timeY * 4.0) * sin(uv.y * 19.0 - timeY * 6.0);
          float soft = pow(clamp(1.0 - r + ripple * 0.055, 0.0, 1.0), 2.0);
          return vec4(color.rgb * 1.35, color.a * soft * 0.16);
        }
      `;

      var flameFS = isWebGL2
        ? `#version 300 es
           precision highp float;
           in vec2 v_uv;
           in vec4 v_color;
           uniform float u_time;
           out vec4 fragColor;
           ${flameFSBody}
           void main() { fragColor = evalSoftFlame(v_uv, v_color, u_time); }`
        : `precision highp float;
           varying vec2 v_uv;
           varying vec4 v_color;
           uniform float u_time;
           ${flameFSBody}
           void main() { gl_FragColor = evalSoftFlame(v_uv, v_color, u_time); }`;

      var gridProg = createProgram(gl, gridVS, gridFS);
      var meshProg = createProgram(gl, meshVS, meshFS);
      var flameProg = createProgram(gl, flameVS, flameFS);

      // Infinite floor grid mesh from LaboratoryStage.cs (extent = 5000)
      var extent = 5000;
      var gridVerts = new Float32Array([
        -extent, 0, -extent,
        -extent, 0, extent,
        extent, 0, extent,
        -extent, 0, -extent,
        extent, 0, extent,
        extent, 0, -extent
      ]);
      var gridVBO = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, gridVBO);
      gl.bufferData(gl.ARRAY_BUFFER, gridVerts, gl.STATIC_DRAW);

      var cylinderGeom = createCylinderGeometry(gl, 40);
      var cubeGeom = createCubeGeometry(gl);

      // Dynamic particle billboard buffers (4 vertices per particle, 9 floats per vertex: x,y,z, u,v, r,g,b,a)
      var maxP = state.maxParticles;
      var particleVertexData = new Float32Array(maxP * 4 * 9);
      var particleIndices = new Uint16Array(maxP * 6);
      for (var pi = 0; pi < maxP; pi++) {
        var vi = pi * 4;
        var ii = pi * 6;
        particleIndices[ii + 0] = vi + 0;
        particleIndices[ii + 1] = vi + 1;
        particleIndices[ii + 2] = vi + 2;
        particleIndices[ii + 3] = vi + 0;
        particleIndices[ii + 4] = vi + 2;
        particleIndices[ii + 5] = vi + 3;
      }
      var particleVBO = gl.createBuffer();
      var particleIBO = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, particleIBO);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, particleIndices, gl.STATIC_DRAW);

      // Exact particle spawning matching Unity's ParticleSystem Sphere shape in FireSimulationController.Update
      function spawnParticle(response, scale) {
        // Random point inside unit sphere
        var u = Math.random();
        var v = Math.random();
        var theta = u * 2.0 * Math.PI;
        var phi = Math.acos(2.0 * v - 1.0);
        var rad = Math.cbrt(Math.random());

        var nx = Math.sin(phi) * Math.cos(theta);
        var ny = Math.cos(phi);
        var nz = Math.sin(phi) * Math.sin(theta);

        var sphereRadius = scale * response.radius;
        // shape.scale = new Vector3(1, 1 + elongation * .8f, 1)
        var sx = nx * sphereRadius;
        var sy = ny * sphereRadius * (1.0 + state.elongation * 0.8);
        var sz = nz * sphereRadius;

        // shape.rotation = Quaternion.FromToRotation(Vector3.up, axis)
        var dx = response.drift.x;
        var dy = response.drift.y;
        var dz = response.drift.z;
        var dMag = Math.hypot(dx, dy, dz);
        var ax = 0, ay = 1, az = 0;
        if (dMag > 0.01) {
          ax = dx / dMag;
          ay = dy / dMag;
          az = dz / dMag;
        }
        // Rotate (sx, sy, sz) and radial direction (nx, ny, nz) from +Y (0,1,0) to (ax, ay, az)
        // Since drift is in XY plane (az = 0): +Y rotates to (ax, ay, 0) and +X rotates to (ay, -ax, 0)
        var rx = sx * ay + sy * ax;
        var ry = -sx * ax + sy * ay;
        var rz = sz;

        var dirX = nx * ay + ny * ax;
        var dirY = -nx * ax + ny * ay;
        var dirZ = nz;
        var dirLen = Math.hypot(dirX, dirY, dirZ) || 1.0;
        dirX /= dirLen;
        dirY /= dirLen;
        dirZ /= dirLen;

        var startSpeed = scale * (0.08 + state.rate * 0.22);
        var startSize = scale * (0.10 + state.rate * 0.16) * lerp(0.6, 1.4, state.intensity);

        state.particles.push({
          x: state.emitterOrigin.x + rx,
          y: state.emitterOrigin.y + ry,
          z: state.emitterOrigin.z + rz,
          vx: dirX * startSpeed,
          vy: dirY * startSpeed,
          vz: dirZ * startSpeed,
          age: 0,
          lifetime: response.lifetime,
          startSize: startSize,
          startColorR: state.color.r,
          startColorG: state.color.g,
          startColorB: state.color.b,
          startColorA: state.intensity * 0.7
        });
      }

      var startTime = performance.now();
      var lastTime = startTime;
      var spawnAccumulator = 0;

      function renderFrame(now) {
        if (!state.running) return;
        var dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000.0));
        lastTime = now;
        var elapsedSeconds = (now - startTime) / 1000.0;

        var rect = canvas.getBoundingClientRect();
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var targetW = Math.max(300, Math.round(rect.width * dpr));
        var targetH = Math.max(200, Math.round(rect.height * dpr));
        if (canvas.width !== targetW || canvas.height !== targetH) {
          canvas.width = targetW;
          canvas.height = targetH;
        }
        gui.updateLayout(rect.width);

        // Update controller state (exact port of FireSimulationController.Update lines 151-202)
        if (isValidPayload(state.payload)) {
          var p = state.payload;
          var s = p.simulation_3d;
          var response = evaluateVisualResponse(p, state.enforceReceivedOxygenLimit);
          var t = 1.0 - Math.exp(-dt / Math.max(0.01, state.transitionSeconds));
          state.intensity = lerp(state.intensity, response.oxygen, t);
          state.rate = lerp(state.rate, response.rate, t);
          state.elongation = lerp(state.elongation, response.stretch, t);
          var targetColor = parseHexColor(s.flame_color_hex) || { r: 0.23, g: 0.51, b: 0.96 };
          state.color.r = lerp(state.color.r, targetColor.r, t);
          state.color.g = lerp(state.color.g, targetColor.g, t);
          state.color.b = lerp(state.color.b, targetColor.b, t);

          var scale = Math.max(0.01, state.visualScale);
          spawnAccumulator += response.emission * dt;
          while (spawnAccumulator >= 1.0 && state.particles.length < state.maxParticles) {
            spawnAccumulator -= 1.0;
            spawnParticle(response, scale);
          }
          if (!response.burning) {
            spawnAccumulator = 0;
          }

          // Velocity over lifetime: drift = response.drift * scale
          var driftX = response.drift.x * scale;
          var driftY = response.drift.y * scale;
          var driftZ = response.drift.z * scale;

          var nextParticles = [];
          for (var idx = 0; idx < state.particles.length; idx++) {
            var pt = state.particles[idx];
            pt.age += dt;
            if (pt.age >= pt.lifetime) continue;
            pt.x += (pt.vx + driftX) * dt;
            pt.y += (pt.vy + driftY) * dt;
            pt.z += (pt.vz + driftZ) * dt;
            nextParticles.push(pt);
          }
          state.particles = nextParticles;

          if (response.burning) {
            state.burnFrontMillimeters += s.burn_rate_mm_s * dt;
            gui.updateBurnFront();
          }
        }

        // Render 3D scene
        gl.viewport(0, 0, canvas.width, canvas.height);
        // SampleScene.unity Main Camera m_BackGroundColor: {r: 0.015, g: 0.025, b: 0.045, a: 1}
        gl.clearColor(0.015, 0.025, 0.045, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        var aspect = canvas.width / Math.max(1, canvas.height);
        // SampleScene.unity Main Camera field of view: 42 degrees
        var proj = mat4PerspectiveLH((42.0 * Math.PI) / 180.0, aspect, 0.3, 1000.0);
        var camBasis = computeCameraBasis(state.camera);
        var vp = mat4Multiply(proj, camBasis.view);

        var lightIntensity = state.intensity * (1.0 + state.rate);

        // Pass 1: Opaque 3D Meshes (Sample pedestal + Material sample)
        gl.enable(gl.DEPTH_TEST);
        gl.depthMask(true);
        gl.disable(gl.BLEND);
        gl.useProgram(meshProg);

        var uVpMesh = gl.getUniformLocation(meshProg, "u_vp");
        var uCamMesh = gl.getUniformLocation(meshProg, "u_camPos");
        var uTransMesh = gl.getUniformLocation(meshProg, "u_translate");
        var uScaleMesh = gl.getUniformLocation(meshProg, "u_scale");
        var uBaseColMesh = gl.getUniformLocation(meshProg, "u_baseColor");
        var uMetMesh = gl.getUniformLocation(meshProg, "u_metallic");
        var uSmoothMesh = gl.getUniformLocation(meshProg, "u_smoothness");
        var uPtPosMesh = gl.getUniformLocation(meshProg, "u_pointLightPos");
        var uPtColMesh = gl.getUniformLocation(meshProg, "u_pointLightColor");
        var uPtIntMesh = gl.getUniformLocation(meshProg, "u_pointLightIntensity");

        gl.uniformMatrix4fv(uVpMesh, false, vp);
        gl.uniform3f(uCamMesh, camBasis.pos.x, camBasis.pos.y, camBasis.pos.z);
        gl.uniform3f(uPtPosMesh, 0.0, 0.65, 0.0);
        gl.uniform3f(uPtColMesh, state.color.r, state.color.g, state.color.b);
        gl.uniform1f(uPtIntMesh, lightIntensity);

        var aPosMesh = gl.getAttribLocation(meshProg, "a_pos");
        var aNormMesh = gl.getAttribLocation(meshProg, "a_normal");
        gl.enableVertexAttribArray(aPosMesh);
        gl.enableVertexAttribArray(aNormMesh);

        // 1A: Sample pedestal (Cylinder at (0, 0, 0), scale (1.6, 0.15, 1.6), LaboratoryMetal.mat)
        gl.bindBuffer(gl.ARRAY_BUFFER, cylinderGeom.vbo);
        gl.vertexAttribPointer(aPosMesh, 3, gl.FLOAT, false, 24, 0);
        gl.vertexAttribPointer(aNormMesh, 3, gl.FLOAT, false, 24, 12);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinderGeom.ibo);
        gl.uniform3f(uTransMesh, 0.0, 0.0, 0.0);
        gl.uniform3f(uScaleMesh, 1.6, 0.15, 1.6);
        gl.uniform3f(uBaseColMesh, 0.035, 0.065, 0.09);
        gl.uniform1f(uMetMesh, 0.5);
        gl.uniform1f(uSmoothMesh, 0.65);
        gl.drawElements(gl.TRIANGLES, cylinderGeom.count, gl.UNSIGNED_SHORT, 0);

        // 1B: Material sample (Cube at (0, 0.25, 0), scale (0.35, 0.08 * clamp(thickness/5, 0.02, 20), 0.35), DefaultMaterial.mat)
        var thicknessMm = state.payload && state.payload.inputs ? state.payload.inputs.thickness_mm : 5.0;
        var sampleScaleY = 0.08 * clamp(thicknessMm / 5.0, 0.02, 20.0);
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeGeom.vbo);
        gl.vertexAttribPointer(aPosMesh, 3, gl.FLOAT, false, 24, 0);
        gl.vertexAttribPointer(aNormMesh, 3, gl.FLOAT, false, 24, 12);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeGeom.ibo);
        gl.uniform3f(uTransMesh, 0.0, 0.25, 0.0);
        gl.uniform3f(uScaleMesh, 0.35, sampleScaleY, 0.35);
        gl.uniform3f(uBaseColMesh, 1.0, 1.0, 1.0);
        gl.uniform1f(uMetMesh, 0.0);
        gl.uniform1f(uSmoothMesh, 0.5);
        gl.drawElements(gl.TRIANGLES, cubeGeom.count, gl.UNSIGNED_SHORT, 0);

        gl.disableVertexAttribArray(aNormMesh);

        // Pass 2: LaboratoryGrid.shader (Transparent-100: Blend SrcAlpha OneMinusSrcAlpha, ZWrite Off, ZTest LEqual)
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.depthMask(false);
        gl.useProgram(gridProg);

        gl.uniformMatrix4fv(gl.getUniformLocation(gridProg, "u_vp"), false, vp);
        gl.uniform3f(gl.getUniformLocation(gridProg, "u_camPos"), camBasis.pos.x, camBasis.pos.y, camBasis.pos.z);

        var aPosGrid = gl.getAttribLocation(gridProg, "a_pos");
        gl.bindBuffer(gl.ARRAY_BUFFER, gridVBO);
        gl.enableVertexAttribArray(aPosGrid);
        gl.vertexAttribPointer(aPosGrid, 3, gl.FLOAT, false, 12, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        // Pass 3: Flame.shader ("FireSimulation/SoftFlame": Blend SrcAlpha One, ZWrite Off, Cull Off)
        var pCount = state.particles.length;
        if (pCount > 0) {
          gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
          gl.useProgram(flameProg);
          gl.uniformMatrix4fv(gl.getUniformLocation(flameProg, "u_vp"), false, vp);
          gl.uniform1f(gl.getUniformLocation(flameProg, "u_time"), elapsedSeconds);

          var rx = camBasis.right.x, ry = camBasis.right.y, rz = camBasis.right.z;
          var ux = camBasis.up.x, uy = camBasis.up.y, uz = camBasis.up.z;

          var offset = 0;
          for (var k = 0; k < pCount; k++) {
            var pt = state.particles[k];
            var normAge = clamp01(pt.age / pt.lifetime);
            var halfSize = 0.5 * pt.startSize * evalSizeCurve(normAge);

            // Unity ParticleSystem multiplies startColor by colorOverLifetime:
            // colorOverLifetime: Lerp(Color.white, state.color, normAge)
            var gradR = lerp(1.0, state.color.r, normAge);
            var gradG = lerp(1.0, state.color.g, normAge);
            var gradB = lerp(1.0, state.color.b, normAge);
            var gradA = evalAlphaGradient(normAge);

            var cr = pt.startColorR * gradR;
            var cg = pt.startColorG * gradG;
            var cb = pt.startColorB * gradB;
            var ca = pt.startColorA * gradA;

            var rdx = rx * halfSize, rdy = ry * halfSize, rdz = rz * halfSize;
            var udx = ux * halfSize, udy = uy * halfSize, udz = uz * halfSize;

            // Corner 0: (-1, -1) -> uv (0, 0)
            particleVertexData[offset++] = pt.x - rdx - udx;
            particleVertexData[offset++] = pt.y - rdy - udy;
            particleVertexData[offset++] = pt.z - rdz - udz;
            particleVertexData[offset++] = 0.0;
            particleVertexData[offset++] = 0.0;
            particleVertexData[offset++] = cr;
            particleVertexData[offset++] = cg;
            particleVertexData[offset++] = cb;
            particleVertexData[offset++] = ca;

            // Corner 1: (-1, +1) -> uv (0, 1)
            particleVertexData[offset++] = pt.x - rdx + udx;
            particleVertexData[offset++] = pt.y - rdy + udy;
            particleVertexData[offset++] = pt.z - rdz + udz;
            particleVertexData[offset++] = 0.0;
            particleVertexData[offset++] = 1.0;
            particleVertexData[offset++] = cr;
            particleVertexData[offset++] = cg;
            particleVertexData[offset++] = cb;
            particleVertexData[offset++] = ca;

            // Corner 2: (+1, +1) -> uv (1, 1)
            particleVertexData[offset++] = pt.x + rdx + udx;
            particleVertexData[offset++] = pt.y + rdy + udy;
            particleVertexData[offset++] = pt.z + rdz + udz;
            particleVertexData[offset++] = 1.0;
            particleVertexData[offset++] = 1.0;
            particleVertexData[offset++] = cr;
            particleVertexData[offset++] = cg;
            particleVertexData[offset++] = cb;
            particleVertexData[offset++] = ca;

            // Corner 3: (+1, -1) -> uv (1, 0)
            particleVertexData[offset++] = pt.x + rdx - udx;
            particleVertexData[offset++] = pt.y + rdy - udy;
            particleVertexData[offset++] = pt.z + rdz - udz;
            particleVertexData[offset++] = 1.0;
            particleVertexData[offset++] = 0.0;
            particleVertexData[offset++] = cr;
            particleVertexData[offset++] = cg;
            particleVertexData[offset++] = cb;
            particleVertexData[offset++] = ca;
          }

          gl.bindBuffer(gl.ARRAY_BUFFER, particleVBO);
          gl.bufferData(
            gl.ARRAY_BUFFER,
            particleVertexData.subarray(0, pCount * 36),
            gl.DYNAMIC_DRAW
          );

          var aPosFlame = gl.getAttribLocation(flameProg, "a_pos");
          var aUvFlame = gl.getAttribLocation(flameProg, "a_uv");
          var aColFlame = gl.getAttribLocation(flameProg, "a_color");

          gl.enableVertexAttribArray(aPosFlame);
          gl.enableVertexAttribArray(aUvFlame);
          gl.enableVertexAttribArray(aColFlame);

          gl.vertexAttribPointer(aPosFlame, 3, gl.FLOAT, false, 36, 0);
          gl.vertexAttribPointer(aUvFlame, 2, gl.FLOAT, false, 36, 12);
          gl.vertexAttribPointer(aColFlame, 4, gl.FLOAT, false, 36, 20);

          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, particleIBO);
          gl.drawElements(gl.TRIANGLES, pCount * 6, gl.UNSIGNED_SHORT, 0);

          gl.disableVertexAttribArray(aUvFlame);
          gl.disableVertexAttribArray(aColFlame);
        }

        gl.depthMask(true);
        requestAnimationFrame(renderFrame);
      }

      if (typeof onProgress === "function") {
        onProgress(1.0);
      }
      requestAnimationFrame(renderFrame);

      var unityInstance = {
        SendMessage: function (objectName, methodName, value) {
          if (methodName === "ApplyJson") {
            applyJson(value);
          }
        },
        SetShowTelemetry: function (show) {
          state.showTelemetry = Boolean(show);
          gui.renderLabels();
        },
        SetFullscreen: function (fullscreen) {
          if (fullscreen && canvas.requestFullscreen) {
            canvas.requestFullscreen().catch(function () {});
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
