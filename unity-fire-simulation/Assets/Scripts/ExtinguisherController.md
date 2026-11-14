# Extinguisher interaction

SI-assisted: generated with Codex; pending human review.

Withdrawal first lifts the extinguisher 0.65 units without rotation, then pulls it 0.55 units away from the wall before aiming at the specimen. Return reverses these stages: align above and outside the bracket, slide inward, then lower into the cradle. Storage Lift Height and Storage Release Distance are editable for changes to the mount geometry.

The resting extinguisher is attached to Extinguisher Wall Mount on the cabin's right wall. The voxel bracket has a wall plate, bottom cradle and retaining bands. Extinguisher Dock Point defines its storage pose; the prop snaps to that point while idle and after use/cancellation. Its original model and hose are unchanged. Move the wall-mount parent to reposition the complete assembly; the bracket stays on the wall when the extinguisher moves toward the sample.

SampleScene contains Fire Extinguisher, using the user-provided MagicaVoxelModels/Extinguisher OBJ and palette. The model is centered and displayed at 0.7 units high without changing the source geometry. No extra nozzle or hose geometry is added. A transform-only anchor marks the tip of the original black hose.

Auto Detect Hose reads the original imported mesh UVs for its black palette entry and centers the outlet on the furthest negative-Z black cap. Read/Write is enabled on this small model for that lookup. The model-space outlet coordinates and direction remain editable when auto detection is disabled. The particle jet is a child of the outlet anchor with identity local rotation. During deployment and discharge, the whole extinguisher rotates to aim the original hose axis at the flame, accounting for the outlet offset from the model center; the particle emitter is not independently steered away from the visible hose.

During Play, USE EXTINGUISHER appears at the bottom-right of the cabin view. It moves the extinguisher toward the specimen, aims a pale spray at its current flame origin for 2.5 seconds, reduces flame emission/opacity/light, clears the extinguished particles, then returns the extinguisher to its saved position. Working Position and Spray Seconds are editable on the component. The button is disabled for extinguished/nonburning input or while an action is already running; it is hidden during travel.

Suppression is local visual state on FireSimulationController, separate from the backend JSON. At completion the flame stays out until RESTART FIRE PREVIEW, a new valid payload or a material change. Restart does not create combustion if the received inputs already say the material is extinguished. The displayed backend risk and gas values are not recalculated. This is an illustrative extinguishing action, not a prediction of suppressant effectiveness or extinguishing time.

New payload/material revisions or travel cancel an in-progress action and restore the prop. Repeated clicks cannot start parallel animations. Scene disabling also stops the jet and restores the resting pose. Model meshes/materials and particles are cleaned up by the component. The editor asset binder resolves the imported Mesh before instantiation, as with travel assets.

Rebuild WebGL to include this interaction and its serialized spray shader. Visual timing, nozzle alignment and shader rendering still need review in Unity Play Mode.
