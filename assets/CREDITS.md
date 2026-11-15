# Visual Assets, Icons & Typography Credits — AstroFire

In accordance with the 2026 NASA Space Apps Challenge rules, all icons, fonts, 3D models and visual assets used in AstroFire are listed below with their licenses. Items marked "To verify" still need an author or license from the team.

| Asset / Package | Type | License | Source Link | Used In |
| --- | --- | --- | --- | --- |
| **Lucide Icons** (`lucide-react`) | UI Vector Icons | ISC License | https://lucide.dev/license | `frontend/` telemetry badges & controls |
| **IBM Plex Sans** | UI & Heading Typography | SIL Open Font License 1.1 | https://github.com/IBM/plex | `frontend/` interface text and headings |
| **IBM Plex Serif** | PDF report body text | SIL Open Font License 1.1 | https://github.com/IBM/plex | `frontend/src/features/simulator/report/` (scenario report PDF) |
| **IBM Plex Mono** | Telemetry Monospace Font | SIL Open Font License 1.1 | https://github.com/IBM/plex | `frontend/` labels, numbers and units (`tabular-nums`) |
| **Fontsource** (`@fontsource/ibm-plex-sans`, `@fontsource/ibm-plex-serif`, `@fontsource/ibm-plex-mono`) | Self-hosted font packaging | MIT License (packaging) | https://fontsource.org | `frontend/src/main.tsx` |
| **AstroFire logo & favicon** | Vector mark (flame whose base forms a hollow sphere, tilted orbit, four-point sparkle). AstroFire logo created with Claude Code (SI-assisted) and reviewed by the team. | MIT License (this repository) | `frontend/public/brand/`, `frontend/public/favicon.svg`, `frontend/public/favicon-32.png`, `frontend/src/components/BrandMark.tsx` | Header, footer, browser tab, PDF report |
| **Home sky, rocket and planet horizon** | Animated inline SVG/CSS illustration written as code with Claude (SI-assisted headers) | MIT License (this repository) | `frontend/src/components/home/`, `frontend/src/components/RocketHeroBackdrop.tsx` | Home page |
| **MagicaVoxel 3D models**: Earth, ISS, Mars, Moon, RocketShip, Extinguisher | Voxel 3D models | To verify (TODO: author and license) | https://ephtracy.github.io/ (MagicaVoxel editor) | `unity-fire-simulation/Assets/MagicaVoxelModels/`, `Assets/TravelModels/` |
| **Unity WebGL template images** (loading bar, Unity logo) | Engine template assets | Unity Terms of Service (edition to verify) | https://unity.com/legal/terms-of-service | `unity-fire-simulation/WebGlSimulation/TemplateData/` |

<!-- TODO(logo): when the team redesigns the logo, change the logo credit to
"AstroFire logo designed by the team; initial concept explored with Claude Code (SI-assisted)." -->

> **Compliance Note:** No official NASA logos, seals or mission insignias are included in this repository. The AstroFire logo is vector artwork written as code with Claude Code and acknowledged above; any raster image or video generated with SI must carry the visible watermark `"Generated with SI (<tool>)"`.
