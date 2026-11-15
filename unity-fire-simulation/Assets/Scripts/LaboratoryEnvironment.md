# Laboratory observation window

SI-assisted: generated with Codex; pending human review.

The observation window is a voxel-style circular porthole: glass, metal rim and surrounding wall use the same 0.12-unit grid, producing a stepped round silhouette rather than smooth curves. Rim cells have solid thickness and axis-aligned flat faces; fasteners are snapped to the grid. The three regions partition the opening without gaps. A square 768x768 render target preserves image proportions. Generated window meshes are released with the room.

SampleScene contains a LaboratoryEnvironment component on FireSimulation. It generates a closed laboratory interior with solid hull walls, ceiling, floor, forward hatch, illuminated equipment panels, and a panoramic observation window in both Edit and Play modes. Decorative meshes and owned materials are regenerated and cleaned up with the component; only the component and its shader/material references are saved in the scene. The grid component has been removed from SampleScene.

FireOrbitCamera keeps its position and focus inside the cabin bounds during orbit, pan and zoom. The orbit distance is shortened when necessary to avoid the hull, floor and ceiling; the requested distance is preserved when returning to a clear direction. F restores the initial view. These bounds do not provide collision with equipment or the material sample.

During Play, use the top-right ISS / EARTH / MOON / MARS buttons. These set the input gravity and environment label; existing oxygen, material, geometry and backend burn outputs remain as supplied. The existing fire responds to the changed gravity. This is a location preset, not a replacement prediction from the backend.

With Follow Payload Gravity enabled, received gravity automatically selects the nearest presentation preset: ISS 0g, Moon 0.16g, Mars 0.38g or Earth 1g. No field is added to the JSON contract. Intermediate values keep their original simulation gravity. To preview a destination independently, disable Follow Payload Gravity and change Destination in the Inspector.

The window blends destinations over Travel Seconds (default 3) with animated travel streaks. If another destination arrives during a transition, the new journey starts from the current visual blend. Startup displays the current destination immediately. Camera controls and fire continue operating throughout the transition.

The views are procedural illustrations, not photographs, orbital navigation, or scientific terrain reconstructions. The visual travel does not model spacecraft trajectory. No external images, logos or network calls are used. The serialized window shader reference ensures it is included in a WebGL build. Rebuild the WebGL export to include these changes.

Fire Simulation > Validate destination mapping checks all four gravity presets in the Unity Editor. Play Mode and shader rendering still require review in Unity.

### Airflow fan
The interior generates a voxel fan with housing, stationary safety grilles, four blades, and a floor-mounted stand. It appears in scene preview as well and sits 1.15 units upstream of the sample, aligned with `FireSimulationController.airflowDirection` transformed into world space. Gravity continues to influence the flame independently.

During Play, visual rotor speed tracks `payload.inputs.airflow_cm_s` with smooth acceleration/deceleration; zero airflow stops the rotor. A logarithmic curve keeps rotation readable and does not represent calibrated physical RPM. Changes via Inspector or payload are read every frame without additional UI. The fan continues running when the flame is extinguished since it represents cabin ventilation. It reuses existing laboratory materials and the cabin layer, remaining excluded from the exterior travel camera.
