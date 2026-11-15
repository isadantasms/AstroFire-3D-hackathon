# Space ambience

SampleScene separates the Earth/ISS orbital area, the Moon and Mars using compressed display distances. These are presentation distances, not astronomical distances or an orbital model. Planet diameter proportions are unchanged. Landing markers were translated by the same offsets as their respective models, retaining their surface offsets and rotations.

SpaceAmbience on Exterior Travel Stage generates a distant star field and a small solar disk with a soft corona. The disk sits in the direction opposite to the assigned directional light's forward vector, matching the lit sides of the planets and their shadows. RenderSettings.sun references that same scene light. The background follows the active exterior/window camera to avoid foreground-style star parallax during long journeys. The exterior and window cameras use a 20,000-unit far plane; the cabin camera retains its previous clipping settings.

SpaceNebula adds a seamless procedural background with a faint blue/violet gas band and dark dust lanes. Three noise scales provide broad clouds and finer filaments; a slow brightness variation keeps the effect subtle. Four hundred of the existing 1,800 stars follow the same galactic band, without adding particle systems. The background writes no depth and renders before foreground geometry. It uses layer 30, so Earth's daylight porthole continues to exclude it. Adjust Nebula Intensity on Exterior Travel Stage > Space Ambience (default 0.65, zero for a nearly black background).

Only the ISS live porthole enables the occasional stylized light trail in DestinationWindow. It lasts about one second and appears intermittently, rather than continuously. Earth retains its separate daylight view; Moon and Mars do not enable this effect. These are decorative streaks, not a meteor-orbit simulation.

Fire Simulation > Show exterior stage frames the wider destination arrangement. Rebuild WebGL to include the changed scene, shader and scripts.
