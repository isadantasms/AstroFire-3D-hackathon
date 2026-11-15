// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { SimulatorPage } from '../../../pages/SimulatorPage'
import { createMockClient } from '../../../services/api/mockClient'
import type { ReportModel } from './reportModel'

const downloadSpy = vi.fn<(report: ReportModel) => Promise<void>>(() => Promise.resolve())
vi.mock('./downloadReportPdf', () => ({ downloadReportPdf: (r: ReportModel) => downloadSpy(r) }))

afterEach(() => {
  cleanup()
  downloadSpy.mockClear()
})

function renderSimulator() {
  return render(
    <MemoryRouter>
      <SimulatorPage client={createMockClient(0)} />
    </MemoryRouter>,
  )
}

type Preset = 'quiescent' | 'lunar' | 'low-oxygen'

async function run(preset: Preset) {
  const trigger = await screen.findByRole('button', { name: 'Material' })
  if (preset === 'quiescent') {
    fireEvent.change(screen.getByRole('spinbutton', { name: /Airflow value/ }), { target: { value: '0.5' } })
  } else if (preset === 'lunar') {
    fireEvent.click(trigger)
    fireEvent.click(screen.getByRole('option', { name: /Cotton-Fiberglass/i }))
    fireEvent.click(screen.getByRole('radio', { name: /Lunar/i }))
    fireEvent.change(screen.getByRole('spinbutton', { name: /Oxygen value/ }), { target: { value: '30' } })
    fireEvent.change(screen.getByRole('spinbutton', { name: /Airflow value/ }), { target: { value: '15' } })
  } else {
    fireEvent.click(trigger)
    fireEvent.click(screen.getByRole('option', { name: /Nomex III/i }))
    fireEvent.change(screen.getByRole('spinbutton', { name: /Oxygen value/ }), { target: { value: '13.5' } })
    fireEvent.change(screen.getByRole('spinbutton', { name: /Airflow value/ }), { target: { value: '2' } })
  }
  fireEvent.click(screen.getByRole('button', { name: 'Run Simulation' }))
  await screen.findByTestId('results')
}

const SECTIONS = [
  'Abstract',
  '1.Scenario parameters',
  '2.Flammability telemetry',
  '3.Flame behavior',
  '4.Flammability regime map',
  '5.Empirical context',
  '6.Interpretation',
  '7.Suppression',
  '8.Terrestrial applications',
  '9.Limitations and data grounding',
  'References',
]

describe('Full report', () => {
  it('the three report buttons stay disabled until a simulation has run', async () => {
    renderSimulator()
    await screen.findByRole('button', { name: 'Run Simulation' })
    for (const name of ['Full report', 'Open full report', 'Download PDF']) {
      const button = screen.getByRole('button', { name })
      expect(button).toBeDisabled()
      expect(button).toHaveAccessibleDescription('Run a simulation first')
    }
  })

  it.each([
    ['quiescent', 'scenario_01_iss_quiescent_0g_blue_sphere', 'Molecular diffusion'],
    ['lunar', 'scenario_02_lunar_ventilated_elongated_soot', 'Advective transport'],
    ['low-oxygen', 'scenario_03_hypoxia_extinguished_below_loi', 'No sustained flame'],
  ] as const)('%s: opens the detailed report built from the payload', async (preset, scenarioId, mechanism) => {
    renderSimulator()
    await run(preset)
    const header = screen.getByRole('button', { name: 'Full report' })
    expect(header).toBeEnabled()
    expect(header).toHaveAccessibleDescription('Open detailed analysis')
    fireEvent.click(header)

    const dialog = screen.getByRole('dialog', { name: 'Scenario Fire Safety Analysis' })
    const d = within(dialog)
    expect(d.getByText(scenarioId)).toBeInTheDocument()
    expect(d.getByText('Mock')).toBeInTheDocument()
    expect(d.getByTestId('report-mock-note')).toHaveTextContent('Sample text written with Gemini')
    expect(d.getByTestId('report-provenance')).toHaveTextContent('Experimental reference data: PSI-25 / BASS-II dataset')
    // AstroFire 3D report, not NASA's: no NASA in the header or the KPI strip.
    expect(dialog.querySelector('header')!.textContent).not.toMatch(/NASA/)
    expect(d.getByTestId('report-kpis').textContent).not.toMatch(/NASA/)

    expect(d.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(SECTIONS)
    const kpis = within(d.getByTestId('report-kpis'))
    for (const label of ['Flammability score', 'Burn rate', 'Oxygen margin (ΔO₂)', 'Data grounding']) {
      expect(kpis.getByText(label)).toBeInTheDocument()
    }
    expect(kpis.getByText('derived')).toBeInTheDocument()

    // Figures: risk bar, flame schematic and regime map, each with a numbered caption.
    expect(d.getByRole('img', { name: /Flammability score \d+ of 100/ })).toBeInTheDocument()
    expect(d.getByRole('img', { name: `Illustrative schematic: ${mechanism.toLowerCase()}` })).toBeInTheDocument()
    expect(d.getByRole('img', { name: /Flammability regime map/ })).toBeInTheDocument()
    for (const n of [1, 2, 3]) expect(d.getByText(new RegExp(`^Figure ${n}\\.`))).toBeInTheDocument()

    expect(d.getByText('Minimum oxygen needed to sustain the flame at this flow and gravity')).toBeInTheDocument()
    expect(d.getByText('Research guidance, not an operational procedure.')).toBeInTheDocument()
    // The sample payloads have no suppression estimate yet.
    expect(d.getByTestId('report-sizing-awaiting')).toHaveTextContent('Suppression sizing is awaiting the engine estimate for this scenario.')
    expect(d.getByText('Diagnosis and guidance texts come from templates drafted with SI and reviewed by the team.')).toBeInTheDocument()
    expect(d.getByText('Research tool. Not a certified safety assessment or operational procedure.')).toBeInTheDocument()
    // No loose "Not available", code names or hex colours anywhere in the report body.
    expect(d.getByTestId('report-body').textContent).not.toMatch(/Not available|gravity_g|airflow_cm_s|#[0-9A-Fa-f]{6}/)
    // Sections 6, 7 and 9 cite the payload sources; the abstract ends with the same citation.
    expect(d.getAllByText('[1, 2]').length).toBe(3)
    expect(d.getByText(/^This report analyzes .* \[1, 2\]$/)).toBeInTheDocument()
    expect(d.getByRole('button', { name: 'Close report' })).toHaveFocus()
  })

  it('scenario_03 explains physically why there is no sustained flame', async () => {
    renderSimulator()
    await run('low-oxygen')
    fireEvent.click(screen.getByRole('button', { name: 'Open full report' }))
    expect(within(screen.getByRole('dialog')).getByText(/is below the oxygen limit \(17\.5% O₂\): heat losses exceed the heat released/)).toBeInTheDocument()
  })

  it('closes with Esc, the X button and the backdrop', async () => {
    renderSimulator()
    await run('quiescent')
    const open = () => fireEvent.click(screen.getByRole('button', { name: 'Full report' }))

    open()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).toBeNull()

    open()
    fireEvent.click(screen.getByRole('button', { name: 'Close report' }))
    expect(screen.queryByRole('dialog')).toBeNull()

    open()
    fireEvent.click(screen.getByTestId('report-backdrop'))
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('Download PDF passes the report of the current result', async () => {
    renderSimulator()
    await run('lunar')
    fireEvent.click(screen.getByRole('button', { name: 'Download PDF' }))
    await waitFor(() => expect(downloadSpy).toHaveBeenCalledTimes(1))
    const report = downloadSpy.mock.calls[0][0]
    expect(report.scenarioId).toBe('scenario_02_lunar_ventilated_elongated_soot')
    expect(report.mock).toBe(true)
  })
})
