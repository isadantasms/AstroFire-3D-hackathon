# Visual Assets, Icons & Typography Credits — AstroFire 3D

In accordance with the 2026 NASA Space Apps Challenge rules, all icons, fonts, 3D models and visual assets used in AstroFire 3D are listed below with their licenses. Items marked "To verify" still need an author or license from the team.

| Asset / Package | Type | License | Source Link | Used In |
| --- | --- | --- | --- | --- |
| **Lucide Icons** (`lucide-react`) | UI Vector Icons | ISC License | https://lucide.dev/license | `frontend/` telemetry badges & controls |
| **IBM Plex Sans** | UI, headings and PDF report text | SIL Open Font License 1.1 | https://github.com/IBM/plex | `frontend/` interface text and headings |
| **IBM Plex Mono** | Telemetry Monospace Font | SIL Open Font License 1.1 | https://github.com/IBM/plex | `frontend/` labels, numbers and units (`tabular-nums`) |
| **Fontsource** (`@fontsource/ibm-plex-sans`, `@fontsource/ibm-plex-mono`) | Self-hosted font packaging | MIT License (packaging) | https://fontsource.org | `frontend/src/main.tsx` |
| **AstroFire 3D logo & favicon** | Simple vector mark (rocket inside an orange ring). AstroFire 3D logo: concept generated with ChatGPT; simplified vector artwork recreated with Claude Code (SI-assisted) and reviewed by the team. The ChatGPT image itself is not used. | MIT License (this repository) | `frontend/public/brand/`, `frontend/public/favicon.svg`, `frontend/public/favicon-32.png`, `frontend/src/components/BrandMark.tsx` | Header, footer, browser tab, PDF report |
| **Home sky, rocket and planet horizon** | Animated inline SVG/CSS illustration written as code with Claude (SI-assisted headers) | MIT License (this repository) | `frontend/src/components/home/`, `frontend/src/components/RocketHeroBackdrop.tsx` | Home page |
| **3D voxel models** (Earth, ISS, Mars, Moon, RocketShip, Extinguisher) created by the team with MagicaVoxel | Voxel 3D models | MIT License (this repository) | https://ephtracy.github.io/ (MagicaVoxel editor) | `unity-fire-simulation/Assets/MagicaVoxelModels/`, `Assets/TravelModels/` |
| **Unity WebGL template images** (loading bar, Unity logo) | Engine template assets | Unity Terms of Service | https://unity.com/legal/terms-of-service | `unity-fire-simulation/WebGlSimulation/TemplateData/` |

<!-- TODO(logo): if the team redraws the logo by hand, change the logo credit to
"AstroFire 3D logo designed by the team; initial concept explored with ChatGPT and Claude Code (SI-assisted)." -->

> **Compliance Note:** No official NASA logos, seals or mission insignias are included in this repository. The AstroFire 3D logo is vector artwork written as code with Claude Code from a ChatGPT concept (the raster concept image is not used) and acknowledged above; any raster image or video generated with SI must carry the visible watermark `"Generated with SI (<tool>)"`.
