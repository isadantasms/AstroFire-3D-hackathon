---
name: simulator-3d
description: Govern the WebGL/Three.js Microgravity Flame Simulator driven by the 4 visual variables in contracts/simulation_schema.json. Activate when editing 3D scene, particle systems, shaders, or camera controls.
---

# 3D Microgravity Combustion Simulator Skill

## 1. Scope & Activation Triggers
Activate when creating or modifying Three.js/WebGL components, particle systems, shaders, or the 3D viewport wrapper.

## 2. Visual & Physics Rules (80/20 Spec)
- **Zero Heavy Fluid CFD from Scratch:** Use a fast, high-impact WebGL/Three.js Particle System + custom shader inside a dark **ISS Microgravity Science Glovebox (MSG)** test chamber (`#070B12` backdrop, millimeter reference grid, central sample holder, subtle airflow directional indicator).
- **FORBIDDEN:** Do NOT render generic terrestrial campfire cones rising upward in `0g`, and NEVER place official NASA logos on chamber walls.
- **Driven Strictly by the 4 Visual Keys in `simulation_3d` (`contracts/simulation_schema.json`):**
  1. `flame_geometry` (`"spherical"` | `"elongated"`):
     - `"spherical"`: Zero buoyancy (`0g` without ventilation). Particles emit radially in all directions forming a symmetric floating *flame ball* around the sample.
     - `"elongated"`: Particles stretch and advect along the cabin ventilation flow or partial-gravity (`0.16g` Lunar / `0.38g` Martian) vector.
  2. `burn_rate_mm_s` (`number`): Controls particle emission speed, turbulence frequency, and flame envelope radius.
  3. `flame_color_hex` (`string` HEX): Controls core/wake shader color (`"#3B82F6"` clean blue diffusion in quiescent `0g` vs. `"#F97316"` luminous orange/amber soot under airflow or partial gravity).
  4. `oxygen_factor` (`number` `0.0` to `1.0`): Controls overall flame opacity and particle density. When `0.0` (hypoxia below `oxygen_limit_pct`), smoothly fade out the flame over `600ms`, leaving only brief dissipating grey smoke.

## 3. WebGL Performance & Memory Discipline
1. **Single WebGL Context:** Maintain only 1 `THREE.WebGLRenderer` (`Math.min(window.devicePixelRatio, 2)`).
2. **Smooth Transitions (`lerp`):** Interpolate (`THREE.MathUtils.lerp` and `Color.lerp`) between states in `requestAnimationFrame` when sliders or presets change — never recreate the scene on state updates.
3. **Clean Disposal (`.dispose()`):** Dispose of geometries, materials, and textures on unmount and handle responsive container resizing via `ResizeObserver`.
4. **SI Code Header:** Include `// SI-assisted: generated with <Model>, reviewed and edited by Esquivel` at the top of AI-assisted 3D files.
