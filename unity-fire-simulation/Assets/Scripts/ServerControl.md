# Runtime control without UI

SI-assisted: generated with Codex; pending human review.

The Unity view no longer renders telemetry panels, material selectors, destination buttons, extinguisher buttons, instructions or skip progress bars. The cinematic black fade is retained as a transition effect. Existing Inspector fields and mouse/keyboard camera controls remain available for development. The previous UI walkthroughs in module notes no longer apply.

The application's server integration can call these public Unity methods on the main thread. This change does not create HTTP routes, poll a server or invent endpoint URLs.

| Scene object | Component | Method | Input |
| --- | --- | --- | --- |
| FireSimulation | FireSimulationController | ApplyJson | One scenario JSON string, including inputs and simulation_3d |
| FireSimulation | LaboratoryEnvironment | SetDestination | ISS, Earth, Moon or Mars |
| FireSimulation | DestinationTravel | SkipAnimation | No argument |
| Fire Extinguisher | ExtinguisherController | UseExtinguisher | No argument |
| FireSimulation | FireSimulationController | ResetSuppression | No argument |

For WebGL, the host page can forward an endpoint response with `unityInstance.SendMessage("FireSimulation", "ApplyJson", JSON.stringify(payload))`. Material changes are part of inputs.material_id in that payload. No-argument actions can be forwarded with `unityInstance.SendMessage("Fire Extinguisher", "UseExtinguisher")` or `unityInstance.SendMessage("FireSimulation", "SkipAnimation")`.

Read-only progress/state properties remain available to a future host bridge: DestinationTravel.IsTravelling, Phase, ArrivedDestination, RequestedDestination, SkipProgress; ExtinguisherController.IsUsing and Progress; FireSimulationController.Suppression and BurnFrontMillimeters. Unity SendMessage invokes methods; it does not return these properties to JavaScript automatically.

Save the scene and rebuild WebGL to update the exported application.
