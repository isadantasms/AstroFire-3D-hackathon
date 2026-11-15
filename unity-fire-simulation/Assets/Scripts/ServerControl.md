# Runtime control without UI

SI-assisted: generated with Codex; pending human review.

The only in-game UI is the small hold-E-to-skip progress indicator in the bottom-right during destination travel. Test panels, destination/material selectors and extinguisher buttons have been removed. The cinematic black fade remains a transition effect. Inspector fields, public control methods and full-viewport mouse/keyboard camera controls remain available.

The application's server integration can call these public Unity methods on the main thread. This change does not create HTTP routes, poll a server or invent endpoint URLs.

| Scene object | Component | Method | Input |
| --- | --- | --- | --- |
| FireSimulation | FireSimulationController | ApplyJson | One scenario JSON string, including inputs and simulation_3d |
| FireSimulation | LaboratoryEnvironment | SetDestination | ISS, Earth, Moon or Mars |
| FireSimulation | DestinationTravel | SkipAnimation | No argument |
| Fire Extinguisher | ExtinguisherController | UseExtinguisher | No argument |
| FireSimulation | FireSimulationController | ResetSuppression | No argument |

For WebGL, the host page can forward an endpoint response with `unityInstance.SendMessage("FireSimulation", "ApplyJson", JSON.stringify(payload))`. Material changes are part of inputs.material_id in that payload. No-argument actions can be forwarded with `unityInstance.SendMessage("Fire Extinguisher", "UseExtinguisher")` or `unityInstance.SendMessage("FireSimulation", "SkipAnimation")`.

Extinguisher commands are ignored while a destination change is pending or its animation is playing, including the return to the cabin. These commands are not queued. Starting a trip immediately cancels an ongoing extinguisher action, clears its spray and returns it to the wall mount. It becomes available again when the cabin has arrived and no further trip is pending.

Read-only progress/state properties remain available to a future host bridge: DestinationTravel.IsTravelling, Phase, ArrivedDestination, RequestedDestination, SkipProgress; ExtinguisherController.IsUsing and Progress; FireSimulationController.Suppression and BurnFrontMillimeters. Unity SendMessage invokes methods; it does not return these properties to JavaScript automatically.

Save the scene and rebuild WebGL to update the exported application.
