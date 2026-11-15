// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha & Elias
import { useEffect, useId, useRef, useState } from 'react'
import { Check, ChevronDown, Play } from 'lucide-react'
import type { MaterialInfo } from '../../../types/catalog'
import { clamp, fmt } from '../../../lib/format'
import { AIRFLOW_SLIDER, GRAVITY_OPTIONS, O2_SLIDER } from '../presets'
import { BASS2_RANGES } from '../../../data/experimentsSnapshot'
import type { DraftInputs, SimulationAction } from '../state/simulationReducer'

interface MissionControlsProps {
  draft: DraftInputs
  materials: MaterialInfo[]
  /** inputs.thickness_mm of the latest result; null before the first run. */
  resultThicknessMm: number | null
  running: boolean
  dispatch: (action: SimulationAction) => void
  onRun: () => void
}

function splitMaterialLabel(raw: string): { title: string; subtitle: string | null } {
  const idx = raw.indexOf('(')
  if (idx === -1) return { title: raw.trim(), subtitle: null }
  const title = raw.slice(0, idx).trim()
  const subtitle = raw.slice(idx + 1).replace(/\)\s*$/, '').trim()
  return { title, subtitle: subtitle || null }
}

export function MissionControls({ draft, materials, resultThicknessMm, running, dispatch, onRun }: MissionControlsProps) {
  const materialLabelId = useId()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const selectedMaterial = materials.find((m) => m.material_id === draft.material_id) ?? materials[0]

  useEffect(() => {
    if (!open) return
    const handlePointerDown = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const selectedLabel = splitMaterialLabel(selectedMaterial?.material_name ?? draft.material_id)

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="relative flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-1 pb-4">
        <h2 className="text-base font-semibold text-primary">Mission controls</h2>

        <div>
          <p id={materialLabelId} className="mb-2 text-xs text-secondary">
            Material
          </p>
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              aria-labelledby={materialLabelId}
              aria-haspopup="listbox"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className={`flex w-full items-center justify-between gap-2.5 rounded-xl border bg-void px-3 py-2.5 text-left transition-colors focus-visible:outline-none ${
                open ? 'border-focus bg-elevated/40' : 'border-subtle hover:border-label/60 focus-visible:border-focus'
              }`}
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[0.8125rem] font-medium text-primary">
                  {selectedLabel.title}
                </span>
                {selectedLabel.subtitle ? (
                  <span className="mt-0.5 block truncate text-[0.6875rem] text-muted">
                    {selectedLabel.subtitle}
                  </span>
                ) : null}
              </span>
              <span className="flex shrink-0 items-center gap-2">
                {selectedMaterial ? (
                  <span className="rounded-md border border-subtle bg-panel px-1.5 py-0.5 font-mono text-[0.65rem] text-secondary tabular-nums">
                    {fmt(selectedMaterial.nominal_thickness_mm, 2)} mm
                  </span>
                ) : null}
                <ChevronDown
                  className={`size-4 text-secondary transition-transform duration-150 ${open ? 'rotate-180 text-focus' : ''}`}
                  aria-hidden
                />
              </span>
            </button>

            {open ? (
              <ul
                role="listbox"
                aria-labelledby={materialLabelId}
                className="absolute z-30 mt-1.5 max-h-72 w-full overflow-y-auto rounded-xl border border-subtle bg-panel p-1 shadow-xl"
              >
                {materials.map((m) => {
                  const active = m.material_id === draft.material_id
                  const label = splitMaterialLabel(m.material_name)
                  return (
                    <li key={m.material_id}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={active}
                        onClick={() => {
                          dispatch({ type: 'setMaterial', material: m })
                          setOpen(false)
                        }}
                        className={`flex w-full items-start justify-between gap-2 rounded-lg px-2.5 py-2 text-left transition-colors ${
                          active ? 'bg-elevated text-primary' : 'text-secondary hover:bg-void/60 hover:text-primary'
                        }`}
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block text-xs font-medium text-primary">{label.title}</span>
                          {label.subtitle ? (
                            <span className="mt-0.5 block text-[0.6875rem] text-muted">{label.subtitle}</span>
                          ) : null}
                        </span>
                        <span className="flex shrink-0 items-center gap-1.5 pt-0.5">
                          <span className="font-mono text-[0.65rem] text-muted tabular-nums">
                            {fmt(m.nominal_thickness_mm, 2)} mm
                          </span>
                          <Check className={`size-3.5 text-focus ${active ? 'opacity-100' : 'opacity-0'}`} aria-hidden />
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            ) : null}
          </div>

          <p className="mt-2 flex items-baseline justify-between text-xs" data-testid="thickness">
            <span className="text-muted">Thickness</span>
            <span className="font-mono text-secondary tabular-nums">
              {resultThicknessMm === null ? (
                '—'
              ) : (
                <>
                  <span className="text-primary">{fmt(resultThicknessMm, 2)}</span> mm
                </>
              )}
            </span>
          </p>
        </div>

        <fieldset>
          <legend className="mb-2 text-xs text-secondary">Gravity</legend>
          <div className="grid grid-cols-4 gap-1 rounded-lg border border-subtle bg-void p-1" role="radiogroup">
            {GRAVITY_OPTIONS.map((g) => {
              const active = draft.gravity_g === g.value
              return (
                <button
                  key={g.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  aria-label={`${g.label}, ${g.value} g`}
                  onClick={() => dispatch({ type: 'setGravity', gravity_g: g.value })}
                  className={`rounded-md px-1 py-1.5 text-center transition-colors ${
                    active ? 'bg-elevated text-primary' : 'text-secondary hover:text-primary'
                  }`}
                >
                  <span className="block text-xs font-medium">{g.short}</span>
                  <span className="block font-mono text-[0.625rem] text-muted tabular-nums">{fmt(g.value, 2)} g</span>
                </button>
              )
            })}
          </div>
        </fieldset>

        <RangeControl
          label="Oxygen"
          unit="% O₂"
          ariaUnit="percent O2"
          value={draft.o2_pct}
          slider={O2_SLIDER}
          digits={1}
          tested={BASS2_RANGES.o2Pct}
          onChange={(v) => dispatch({ type: 'setOxygen', o2_pct: v })}
        />

        <RangeControl
          label="Airflow"
          unit="cm/s"
          ariaUnit="cm/s"
          value={draft.airflow_cm_s}
          slider={AIRFLOW_SLIDER}
          digits={1}
          tested={BASS2_RANGES.airflowCmS}
          onChange={(v) => dispatch({ type: 'setAirflow', airflow_cm_s: v })}
        />
      </div>

      {/* Always visible at the base of the column. */}
      <div className="shrink-0 border-t border-subtle pt-3">
        <button
          type="button"
          onClick={onRun}
          disabled={running}
          className="inline-flex w-full items-center justify-center gap-2 rounded-[10px] bg-brand px-4 py-3 text-sm font-semibold text-hero shadow-[0_10px_30px_-12px_rgb(242_140_40/0.7)] transition-transform duration-200 ease-out hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          <Play className="size-4 fill-current" aria-hidden />
          {running ? 'Running…' : 'Run Simulation'}
        </button>
      </div>
    </div>
  )
}

interface RangeControlProps {
  label: string
  unit: string
  ariaUnit: string
  value: number
  slider: { min: number; max: number; step: number }
  digits: number
  /** Min–max tested in the 79 BASS-II records (the same range shown on Research & Data). */
  tested?: { min: number; max: number }
  onChange: (value: number) => void
}

/** Slider + numeric field. Values are clamped to the schema bounds (0–100). */
function RangeControl({ label, unit, ariaUnit, value, slider, digits, tested, onChange }: RangeControlProps) {
  const id = useId()
  const commit = (raw: string) => {
    const parsed = Number.parseFloat(raw)
    if (!Number.isNaN(parsed)) onChange(Number(clamp(parsed, 0, 100).toFixed(digits)))
  }
  return (
    <div>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-xs text-secondary">
          {label}
        </label>
        <span className="flex items-baseline gap-1.5">
          <input
            type="number"
            aria-label={`${label} value in ${ariaUnit}`}
            min={0}
            max={100}
            step={slider.step}
            value={value}
            onChange={(e) => commit(e.target.value)}
            className="w-16 rounded-md border border-subtle bg-void px-1.5 py-0.5 text-right font-mono text-sm text-primary tabular-nums focus:border-focus"
          />
          <span className="w-8 font-mono text-xs text-muted">{unit}</span>
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={slider.min}
        max={slider.max}
        step={slider.step}
        value={clamp(value, slider.min, slider.max)}
        aria-valuetext={`${fmt(value, digits)} ${ariaUnit}`}
        onChange={(e) => commit(e.target.value)}
        className="mt-2 w-full accent-[var(--brand-orange)]"
      />
      <div className="flex justify-between font-mono text-[0.625rem] text-muted tabular-nums">
        <span>{slider.min}</span>
        <span>{slider.max}</span>
      </div>
      {tested ? (
        <p className="mt-0.5 font-mono text-[0.625rem] text-muted tabular-nums">
          BASS-II tested: {fmt(tested.min, 1)}–{fmt(tested.max, 1)} {unit}
        </p>
      ) : null}
    </div>
  )
}
