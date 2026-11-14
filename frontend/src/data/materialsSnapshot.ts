// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
// Source: backend/app/physics_engine.py -> MATERIAL_CATALOG (copied verbatim, subset of fields)
import type { MaterialInfo } from '../types/catalog'

/**
 * Repository snapshot of the backend material catalog, used in mock mode and as a
 * fallback when the live API is unreachable. In live mode, GET /api/materials wins.
 * Values are copied verbatim; do not edit here without changing the backend catalog.
 */
export const MATERIALS_SNAPSHOT: readonly (MaterialInfo & { loi_min_pct: number })[] = [
  {
    material_id: 'pmma_clear_slab',
    material_name: 'PMMA Clear Cast Slab (Spacecraft Window/Panel Acrylic)',
    nominal_thickness_mm: 2.0,
    loi_min_pct: 16.5,
  },
  {
    material_id: 'pmma_thin_film',
    material_name: 'PMMA Thin Film (100-400 um Polymer Insulation)',
    nominal_thickness_mm: 0.1,
    loi_min_pct: 15.8,
  },
  {
    material_id: 'cotton_fiberglass_sibal',
    material_name: 'SIBAL Cotton-Fiberglass Fabric Blend (Crew Textile)',
    nominal_thickness_mm: 0.3,
    loi_min_pct: 16.8,
  },
  {
    material_id: 'pmma_rod',
    material_name: 'PMMA Cylindrical Rod (Cable Conduit / Structural Element)',
    nominal_thickness_mm: 6.35,
    loi_min_pct: 13.5,
  },
  {
    material_id: 'pmma_black_rod',
    material_name: 'PMMA Black Cast Rod (Carbon-Doped Structural Acrylic)',
    nominal_thickness_mm: 6.35,
    loi_min_pct: 14.8,
  },
  {
    material_id: 'nomex_iii_fabric',
    material_name: 'Nomex III (DuPont ISS Fire-Barrier Fabric)',
    nominal_thickness_mm: 0.5,
    loi_min_pct: 24.5,
  },
  {
    material_id: 'japan_wax_candle',
    material_name: 'Japan Wax Candle (BASS-I/II Hemispherical Reference)',
    nominal_thickness_mm: 5.0,
    loi_min_pct: 16.0,
  },
]
