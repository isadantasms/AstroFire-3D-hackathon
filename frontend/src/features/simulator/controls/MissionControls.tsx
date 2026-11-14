// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { useId, useMemo } from 'react'
import { Play, X } from 'lucide-react'
import { ConsolePanel, Tag } from '../../../components/ConsolePanel'
import type { ExperimentRecord, MaterialInfo } from '../../../types/catalog'
import { clamp, fmt } from '../../../lib/format'
import {
  AIRFLOW_SLIDER,
  GRAVITY_OPTIONS,
  O2_SLIDER,
  SCENARIO_PRESETS,
  type ScenarioPreset,
} from '../presets'
import type { DraftInputs, SimulationAction } from '../state/simulationReducer'

interface MissionControlsProps {
  draft: DraftInputs
  materials: MaterialInfo[]
  experiments: ExperimentRecord[]
  disabled: boolean
  running: boolean
  dispatch: (action: SimulationAction) => void
  onRun: () => void
}

export function MissionControls({
  draft,
  materials,
  experiments,
  disabled,
  running,
  dispatch,
  onRun,
}: MissionControlsProps) {
  const materialSelectId = useId()
  const selectedMaterial = materials.find((m) => m.material_id === draft.material_id)

  /** Tested envelope for the selected material, computed from BASS-II records. */
  const envelope = useMemo(() => {
    const rows = experiments.filter((r) => r.material_id === draft.material_id)
    if (rows.length === 0) return null
    const o2 = rows.map((r) => r.initial_o2_pct)
    const flow = rows.map((r) => r.airflow_cm_s)
    return {
      count: rows.length,
      o2: [Math.min(...o2), Math.max(...o2)] as const,
      flow: [Math.min(...flow), Math.max(...flow)] as const,
    }
  }, [experiments, draft.material_id])

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
    !draft.test_id &&
    p.material_id === draft.material_id &&
    p.gravity_g === draft.gravity_g &&
    p.o2_pct === draft.o2_pct &&
    p.airflow_cm_s === draft.airflow_cm_s

  return (
    <div className="flex flex-col gap-3">
      <ConsolePanel title="Scenario presets" aside={<Tag>Inputs only</Tag>}>
        <ul className="grid grid-cols-2 gap-2">
          {SCENARIO_PRESETS.map((preset) => (
            <li key={preset.id}>
              <button
                type="button"
                disabled={disabled}
                aria-pressed={presetActive(preset)}
                onClick={() => applyPreset(preset)}
                className="h-full w-full border border-subtle bg-void px-2.5 py-2 text-left transition-colors hover:border-secondary disabled:opacity-50 aria-pressed:border-focus aria-pressed:bg-elevated"
              >
                <span className="block text-xs font-medium text-primary">{preset.name}</span>
                <span className="mt-0.5 block text-[0.6875rem] leading-snug text-muted">{preset.description}</span>
              </button>
            </li>
          ))}
        </ul>
      </ConsolePanel>

      <ConsolePanel title="Mission parameters">
        <div className="flex flex-col gap-5">
          {draft.test_id ? (
            <div className="flex items-center justify-between gap-2 border border-focus/60 bg-elevated px-3 py-2">
              <p className="text-xs text-secondary">
                Loaded from BASS-II record{' '}
                <span className="font-mono text-primary">{draft.test_id}</span>
              </p>
              <button
                type="button"
                onClick={() => selectedMaterial && dispatch({ type: 'setMaterial', material: selectedMaterial })}
                className="text-muted hover:text-primary"
                aria-label="Clear BASS-II record selection"
              >
                <X className="size-3.5" aria-hidden />
              </button>
            </div>
          ) : null}

          {/* Material */}
          <div>
            <label htmlFor={materialSelectId} className="label-mono">
              Material
            </label>
            <select
              id={materialSelectId}
              value={draft.material_id}
              disabled={disabled}
              onChange={(e) => {
                const material = materials.find((m) => m.material_id === e.target.value)
                if (material) dispatch({ type: 'setMaterial', material })
              }}
              className="mt-2 w-full border border-subtle bg-void px-2.5 py-2 text-sm text-primary disabled:opacity-50"
            >
              {materials.map((m) => (
                <option key={m.material_id} value={m.material_id}>
                  {m.material_name}
                </option>
              ))}
            </select>
            <p className="mt-2 flex items-baseline justify-between text-xs">
              <span className="text-muted">Thickness</span>
              {draft.thickness_mm === null ? (
                <span className="font-mono text-warning">Pending · to verify</span>
              ) : (
                <span className="font-mono text-secondary">
                  <span className="text-primary">{fmt(draft.thickness_mm, 2)}</span> mm ·{' '}
                  {draft.test_id ? 'from record' : 'fixed per material'}
                </span>
              )}
            </p>
          </div>

          {/* Gravity */}
          <fieldset>
            <legend className="label-mono">Gravity</legend>
            <div className="mt-2 grid grid-cols-4 gap-px border border-subtle bg-subtle" role="radiogroup">
              {GRAVITY_OPTIONS.map((g) => {
                const active = draft.gravity_g === g.value
                return (
                  <button
                    key={g.value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    aria-label={`${g.label}, ${g.value} g`}
                    disabled={disabled}
                    onClick={() => dispatch({ type: 'setGravity', gravity_g: g.value })}
                    className={`px-1 py-2 text-center transition-colors disabled:opacity-50 ${
                      active ? 'bg-elevated text-primary shadow-[inset_0_-2px_0_var(--border-focus)]' : 'bg-void text-secondary hover:text-primary'
                    }`}
                  >
                    <span className="block text-xs font-medium">{g.short}</span>
                    <span className="block font-mono text-[0.6875rem] text-muted">{fmt(g.value, 2)} g</span>
                  </button>
                )
              })}
            </div>
            {draft.gravity_g > 0 ? (
              <p className="mt-2 text-[0.6875rem] leading-snug text-muted">
                All BASS-II records were measured in microgravity; partial-gravity and Earth results
                are interpolations.
              </p>
            ) : null}
          </fieldset>

          <RangeControl
            label="Oxygen"
            unit="% O2"
            value={draft.o2_pct}
            slider={O2_SLIDER}
            digits={1}
            disabled={disabled}
            hint={envelope ? `BASS-II tested: ${fmt(envelope.o2[0])}–${fmt(envelope.o2[1])} % O2` : undefined}
            onChange={(v) => dispatch({ type: 'setOxygen', o2_pct: v })}
          />

          <RangeControl
            label="Cabin airflow"
            unit="cm/s"
            value={draft.airflow_cm_s}
            slider={AIRFLOW_SLIDER}
            digits={1}
            disabled={disabled}
            hint={envelope ? `BASS-II tested: ${fmt(envelope.flow[0])}–${fmt(envelope.flow[1])} cm/s` : undefined}
            onChange={(v) => dispatch({ type: 'setAirflow', airflow_cm_s: v })}
          />
        </div>
      </ConsolePanel>

      <button
        type="button"
        onClick={onRun}
        disabled={disabled || running}
        className="inline-flex items-center justify-center gap-2 border border-brand bg-brand px-4 py-3 text-sm font-semibold text-hero transition-colors hover:bg-transparent hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Play className="size-4" aria-hidden />
        {running ? 'Running…' : 'Run Simulation'}
      </button>
    </div>
  )
}

interface RangeControlProps {
  label: string
  unit: string
  value: number
  slider: { min: number; max: number; step: number }
  digits: number
  disabled: boolean
  hint?: string
  onChange: (value: number) => void
}

/** Slider + numeric field. Values are clamped to the schema bounds (0–100). */
function RangeControl({ label, unit, value, slider, digits, disabled, hint, onChange }: RangeControlProps) {
  const id = useId()
  const commit = (raw: string) => {
    const parsed = Number.parseFloat(raw)
    if (!Number.isNaN(parsed)) onChange(Number(clamp(parsed, 0, 100).toFixed(digits)))
  }
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="label-mono">
          {label}
        </label>
        <span className="flex items-baseline gap-1">
          <input
            type="number"
            aria-label={`${label} value in ${unit}`}
            min={0}
            max={100}
            step={slider.step}
            value={value}
            disabled={disabled}
            onChange={(e) => commit(e.target.value)}
            className="w-16 border border-subtle bg-void px-1.5 py-0.5 text-right font-mono text-sm text-primary disabled:opacity-50"
          />
          <span className="font-mono text-xs text-secondary">{unit}</span>
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={slider.min}
        max={slider.max}
        step={slider.step}
        value={clamp(value, slider.min, slider.max)}
        disabled={disabled}
        aria-valuetext={`${fmt(value, digits)} ${unit}`}
        onChange={(e) => commit(e.target.value)}
        className="mt-2 w-full accent-[var(--border-focus)] disabled:opacity-50"
      />
      <div className="flex justify-between font-mono text-[0.625rem] text-muted">
        <span>{slider.min}</span>
        {hint ? <span className="text-secondary">{hint}</span> : null}
        <span>{slider.max}</span>
      </div>
    </div>
  )
}
