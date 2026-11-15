# Natural flame detail

The supplied video.mp4 inspired a more continuous luminous body, rolling edges and tapering flame tongues. Four frames were inspected across its approximately one-minute duration.

The experiment still uses the original particle system, emission, lifetime, particle sizes, emitter dimensions and data-driven response curves. Procedural shading replaces the regular circular ripple with two scales of advected noise. Small particle eddies and smooth light flicker add motion; microgravity reduces the disturbance and preserves the rounded shape.

Natural Flame Detail on FireSimulation controls the visual additions (default 1). Set it to zero for the previous shading/motion. The controller creates a private runtime material so the shared rocket exhaust and space-star material retain their original appearance. The flame itself uses no new textures; the optional smoke and ember emitters are described below. Incoming flame color remains the tint source; the new shading changes local brightness rather than supplying its own orange/blue palette. Suppression fades the same flame and disables the extra particle turbulence when extinguished.

The revised natural mode uses alpha composition and distance-sorted particles, preventing additive particle stacks from washing out the new contours. Legacy mode restores the original additive blend. Tapering and noise erosion are stronger in natural mode; the data-driven response calculations, emitter dimensions, lifetime and emission rate remain unchanged.

The test panel has been removed. Natural Flame Detail remains editable on FireSimulation in the Inspector; zero restores the previous shading/motion. Destination and extinguisher actions remain available through their public control methods. The only in-game indicator is hold-E-to-skip progress during travel.

## Smoke and embers

FireSecondaryEffects on FireSimulation adds two independent visual emitters: a 200-particle smoke budget and a 96-particle ember budget. The original flame's size, tint, emission and response equations remain unchanged. Smoke uses soft alpha composition, procedural rolling density and depth-based contact fading. Embers use a private additive copy of the existing material and short velocity-aligned streaks. The shared star/rocket material is never modified.

Smoke follows gravity-driven buoyancy and airflow from the same visual response as the flame. In microgravity with no airflow, there is no artificial upward advection: puffs expand slowly around the source. Embers receive scaled gravity, producing short arcs; they do not fall with Earth gravity when gravity_g is zero. Candle specimens have reduced smoke and no embers. Emission follows visible burning, oxygen conditions, burn rate, detail amount and suppression. These are artistic effects, not estimates of soot production, gas concentration or material-specific ember yield.

On full suppression, new smoke emission and all embers stop immediately. Existing smoke puffs finish their short fade. A payload/material revision clears old particles; legacy comparison mode or disabling an effect also clears it. FireSecondaryEffects exposes independent smoke/ember toggles and amount fields in the Inspector. The scene stores explicit shader and material references for WebGL inclusion.

In microgravity (gravity_g below 0.01), sparks follow the payload's flame_color_hex, including their dimming tails; a blue flame therefore has blue sparks. Other gravity conditions retain the warm ember palette. The palette refreshes when gravity mode or the received color changes, without modifying the shared material.

Final appearance and animation should be reviewed in Unity Play Mode and a fresh WebGL build. This remains an illustrative particle effect, not a fluid solver.
