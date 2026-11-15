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
  '4.Interpretation',
  '5.Suppression',
  '6.Terrestrial applications',
  '7.Limitations and data grounding',
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
    ['quiescent', 'scenario_01_iss_quiescent_0g_blue_sphere', 'Spherical flame'],
    ['lunar', 'scenario_02_lunar_ventilated_elongated_soot', 'Elongated flame'],
    ['low-oxygen', 'scenario_03_hypoxia_extinguished_below_loi', 'No sustained flame'],
  ] as const)('%s: opens the detailed report built from the payload', async (preset, scenarioId, figureLabel) => {
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
    expect(d.getByTestId('report-grounding')).toBeInTheDocument()
    expect(d.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(SECTIONS)
    expect(d.getByText('Figure 1. Illustrative visualization of the simulated flame. ' + figureLabel + '.')).toBeInTheDocument()
    expect(d.getByText('Minimum oxygen needed to sustain the flame')).toBeInTheDocument()
    expect(d.getByText('Research guidance, not an operational procedure.')).toBeInTheDocument()
    // The sample payloads have no suppression estimate yet.
    expect(d.getByTestId('report-sizing-unavailable')).toHaveTextContent('Suppression sizing: Not available.')
    expect(d.getByText('Diagnosis text from templates drafted with SI and reviewed by the team.')).toBeInTheDocument()
    expect(d.getByTestId('report-mock-note')).toHaveTextContent('Sample text written with Gemini')
    // Sections 4, 5 and 7 cite the sources; the abstract ends with the same citation.
    expect(d.getAllByText('[1, 2]').length).toBe(3)
    expect(d.getByText(/^This report analyzes .* \[1, 2\]$/)).toBeInTheDocument()
    expect(d.getByRole('button', { name: 'Close report' })).toHaveFocus()
  })

  it('scenario_03 explains that there is no sustained flame', async () => {
    renderSimulator()
    await run('low-oxygen')
    fireEvent.click(screen.getByRole('button', { name: 'Open full report' }))
    expect(within(screen.getByRole('dialog')).getByText(/^No sustained flame\. The simulation reports a burn rate of 0\.00 mm\/s/)).toBeInTheDocument()
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
