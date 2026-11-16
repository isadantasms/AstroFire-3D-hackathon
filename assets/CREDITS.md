# Visual Assets, Icons & Typography Credits — AstroFire 3D

In accordance with the 2026 NASA Space Apps Challenge rules, all icons, fonts, 3D models, emblems, and visual assets used in AstroFire 3D are listed below with their licenses and provenance.

| Asset / Package | Type | License | Source Link | Used In |
| --- | --- | --- | --- | --- |
| **Lucide Icons** (`lucide-react`) | UI Vector Icons | ISC License | https://lucide.dev/license | `frontend/` telemetry badges & controls |
| **IBM Plex Sans, Serif & Mono** | UI, headings, telemetry (`tabular-nums`) and PDF report text | SIL Open Font License 1.1 | https://github.com/IBM/plex | `frontend/` interface text, numbers and technical PDF |
| **Fontsource** (`@fontsource/ibm-plex-sans`, `@fontsource/ibm-plex-mono`) | Self-hosted font packaging | MIT License (packaging) | https://fontsource.org | `frontend/src/main.tsx` |
| **AstroFire 3D logo & favicon** | Simple vector mark (rocket inside an orange ring). Concept generated with ChatGPT; simplified vector artwork recreated as SVG code with Claude Code (SI-assisted) and reviewed by 21 PyroRangers. The ChatGPT raster concept image is not used. | MIT License (this repository) | `frontend/public/brand/`, `frontend/public/favicon.svg`, `frontend/public/favicon-32.png`, `frontend/src/components/BrandMark.tsx` | Header, footer, browser tab, PDF report |
| **21 PyroRangers group emblem** | Team emblem generated with Google Imagen via Gemini (SI). Carries visible attribution `"Generated with SI (Google Image Gen)"` on the source image and explicit attribution on the cover of the technical documentation PDF. | Google Terms of Service (SI-generated asset, attributed) | https://gemini.google.com | Technical documentation PDF cover & header |
| **Home sky, rocket and planet horizon** | Animated inline SVG/CSS illustration written as code with Claude (SI-assisted headers) and reviewed by 21 PyroRangers | MIT License (this repository) | `frontend/src/components/home/`, `frontend/src/components/RocketHeroBackdrop.tsx` | Home page |
| **3D voxel models** (Earth, ISS, Mars, Moon, RocketShip, Extinguisher) created by 21 PyroRangers with MagicaVoxel | Voxel 3D models | MIT License (this repository) | https://ephtracy.github.io/ (MagicaVoxel editor) | `unity-fire-simulation/Assets/MagicaVoxelModels/`, `Assets/TravelModels/` |
| **Unity WebGL template & TextMeshPro assets** (loading bar, Unity logo, Liberation Sans OFL & EmojiOne sample sprites) | Engine template & package assets | Unity Terms of Service / SIL OFL 1.1 | https://unity.com/legal/terms-of-service | `unity-fire-simulation/WebGlSimulation/TemplateData/`, `Assets/TextMesh Pro/` |

> **Compliance Note:** No official NASA logos, seals, flags, or mission insignias are included anywhere in this repository or in any generated media. Any raster image or video generated with SI carries a visible watermark (`"Generated with SI (<tool>)"`), and SI-generated audio/code/data is acknowledged in descriptive text and metadata.
