# Material specimens

SI-assisted: generated with Codex, reviewed and edited by Esquivel & Elias (21 PyroRangers).

SampleScene uses MaterialSampleView to replace the original sample cube. The component updates in Edit and Play modes from inputs.material_id and thickness_mm. The seven material buttons in the telemetry panel provide manual previews without changing the received burn rate, oxygen or flame color.

| ID | Specimen |
| --- | --- |
| pmma_clear_slab | Translucent cyan acrylic slab |
| pmma_thin_film | Translucent flexible sheet |
| cotton_fiberglass_sibal | Pale woven draped fabric |
| pmma_rod | Clear vertical cylindrical rod |
| pmma_black_rod | Dark opaque vertical cylindrical rod |
| nomex_iii_fabric | Tan woven draped fabric |
| japan_wax_candle | Ivory wax cylinder with a separate dark wick |

IDs are trimmed and case-normalized. The old sample ID nomex_ht90_40 maps to the Nomex III visual for backward compatibility; this alias does not assert equivalence of scientific material properties. Unknown IDs use a generic purple slab and a warning in the telemetry panel.

The emitter follows the current specimen surface/top or candle wick. Elongated flames on slabs and fabrics use a broad surface emitter; rods use their cross-section; candles use a small wick emitter. Spherical geometry keeps radial emission. Changing material clears the previous particles and resets the integrated burn-front distance, avoiding a floating flame at the old origin. Flame color and burn rate remain authoritative payload outputs.

Dimensions and colors are illustrative display choices, not measured sample reconstructions. Thickness controls slab/sheet height and rod diameter using bounded visual magnification; candle height and diameter are fixed illustration dimensions. No sample consumption, melting, material-specific burn prediction or pyrolysis model is implied. Translucent samples use an artistic transparent shader rather than physical refraction.

Fire Simulation > Validate material specimens checks the seven IDs, whitespace handling, legacy alias, generic fallback and specimen flame anchors in the open Unity scene. Rebuild WebGL to include the new component and serialized specimen shader.
