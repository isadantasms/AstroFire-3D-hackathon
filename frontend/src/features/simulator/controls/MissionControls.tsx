// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { useId, type ReactNode } from 'react'
import { Play } from 'lucide-react'
import type { MaterialInfo } from '../../../types/catalog'
import { clamp, fmt } from '../../../lib/format'
import { AIRFLOW_SLIDER, GRAVITY_OPTIONS, O2_SLIDER, SCENARIO_PRESETS, type ScenarioPreset } from '../presets'
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

export function MissionControls({ draft, materials, resultThicknessMm, running, dispatch, onRun }: MissionControlsProps) {
  const materialSelectId = useId()

  const applyPreset = (preset: ScenarioPreset) =>
    dispatch({
      type: 'applyPreset',
      draft: {
        material_id: preset.material_id,
        gravity_g: preset.gravity_g,
        o2_pct: preset.o2_pct,
        airflow_cm_s: preset.airflow_cm_s,
      },
      material: materials.find((m) => m.material_id === preset.material_id),
    })

  const presetActive = (p: ScenarioPreset) =>
    p.material_id === draft.material_id &&
    p.gravity_g === draft.gravity_g &&
    p.o2_pct === draft.o2_pct &&
    p.airflow_cm_s === draft.airflow_cm_s

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="relative flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-1 pb-4">
        <h2 className="text-base font-semibold text-primary">Mission controls</h2>

        <Field label="Scenario">
          <ul className="flex flex-wrap gap-1.5" aria-label="Scenario presets">
            {SCENARIO_PRESETS.map((preset) => (
              <li key={preset.id}>
                <button
                  type="button"
                  aria-pressed={presetActive(preset)}
                  onClick={() => applyPreset(preset)}
                  className="rounded-full border border-subtle px-3 py-1 text-xs whitespace-nowrap text-secondary transition-colors hover:border-label hover:text-primary aria-pressed:border-brand aria-pressed:bg-brand/10 aria-pressed:text-primary"
                >
                  {preset.name}
                </button>
              </li>
            ))}
          </ul>
        </Field>

        <Field label="Material" htmlFor={materialSelectId}>
          <select
            id={materialSelectId}
            value={draft.material_id}
            onChange={(e) => {
              const material = materials.find((m) => m.material_id === e.target.value)
              if (material) dispatch({ type: 'setMaterial', material })
            }}
            title={materials.find((m) => m.material_id === draft.material_id)?.material_name}
            className="w-full rounded-lg border border-subtle bg-void px-2.5 py-2 text-[0.8125rem] text-primary focus:border-focus"
          >
            {materials.map((m) => (
              <option key={m.material_id} value={m.material_id}>
                {m.material_name}
              </option>
            ))}
          </select>
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
        </Field>

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
          onChange={(v) => dispatch({ type: 'setOxygen', o2_pct: v })}
        />

        <RangeControl
          label="Airflow"
          unit="cm/s"
          ariaUnit="cm/s"
          value={draft.airflow_cm_s}
          slider={AIRFLOW_SLIDER}
          digits={1}
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

function Field({ label, htmlFor, children }: { label: string; htmlFor?: string; children: ReactNode }) {
  return (
    <div>
      {htmlFor ? (
        <label htmlFor={htmlFor} className="mb-2 block text-xs text-secondary">
          {label}
        </label>
      ) : (
        <p className="mb-2 text-xs text-secondary">{label}</p>
      )}
      {children}
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
  onChange: (value: number) => void
}

/** Slider + numeric field. Values are clamped to the schema bounds (0–100). */
function RangeControl({ label, unit, ariaUnit, value, slider, digits, onChange }: RangeControlProps) {
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
    </div>
  )
}
