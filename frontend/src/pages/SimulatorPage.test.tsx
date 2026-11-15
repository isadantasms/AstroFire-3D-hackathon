// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { SimulatorPage } from './SimulatorPage'
import { createMockClient, mockSimulate } from '../services/api/mockClient'
import type { ApiClient } from '../services/api/client'
import { chamberDevControlsEnabled } from '../features/simulator/chamber/devMode'
import { isCitationShown, shortCitationId } from '../features/simulator/results/resultHelpers'
import { withTestEstimate } from '../test/fixtures'

afterEach(cleanup)

function renderSimulator(client: ApiClient = createMockClient(0)) {
  return render(
    <MemoryRouter>
      <SimulatorPage client={client} />
    </MemoryRouter>,
  )
}

async function runPreset(name: 'ISS · quiescent' | 'Lunar habitat · ventilated' | 'ISS · low oxygen') {
  const trigger = await screen.findByRole('button', { name: 'Material' })
  if (name === 'ISS · quiescent') {
    fireEvent.change(screen.getByRole('spinbutton', { name: /Airflow value/ }), { target: { value: '0.5' } })
  } else if (name === 'Lunar habitat · ventilated') {
    fireEvent.click(trigger)
    fireEvent.click(screen.getByRole('option', { name: /Cotton-Fiberglass/i }))
    fireEvent.click(screen.getByRole('radio', { name: /Lunar/i }))
    fireEvent.change(screen.getByRole('spinbutton', { name: /Oxygen value/ }), { target: { value: '30' } })
    fireEvent.change(screen.getByRole('spinbutton', { name: /Airflow value/ }), { target: { value: '15' } })
  } else if (name === 'ISS · low oxygen') {
    fireEvent.click(trigger)
    fireEvent.click(screen.getByRole('option', { name: /Nomex III/i }))
    fireEvent.change(screen.getByRole('spinbutton', { name: /Oxygen value/ }), { target: { value: '13.5' } })
    fireEvent.change(screen.getByRole('spinbutton', { name: /Airflow value/ }), { target: { value: '2' } })
  }
  fireEvent.click(screen.getByRole('button', { name: 'Run Simulation' }))
  return screen.findByTestId('results')
}

const currentStep = () => within(screen.getByTestId('cycle-bar')).getByRole('listitem', { current: 'step' })

describe('SimulatorPage', () => {
  it('starts clean: cycle bar, MOCK DATA badge, empty state, no banner, table or dev controls', async () => {
    renderSimulator()
    expect(await screen.findByRole('button', { name: 'Run Simulation' })).toBeInTheDocument()
    expect(currentStep()).toHaveTextContent('Simulate')
    expect(screen.getByTestId('mock-badge')).toHaveTextContent('MOCK DATA')
    expect(screen.getByTestId('mock-badge')).toHaveAccessibleDescription(/closest of three sample payloads/)
    expect(screen.queryByTestId('mock-mode-banner')).toBeNull()
    expect(screen.getByTestId('results-empty')).toHaveTextContent(/Pick a scenario.*Run.*Discharge the extinguisher/)
    expect(screen.queryByRole('table')).toBeNull()
    expect(screen.queryByTestId('chamber-dev-controls')).toBeNull()
    expect(screen.queryByText('Geometry')).toBeNull()
    expect(screen.getByTestId('thickness')).toHaveTextContent('—')
    expect(screen.getByTestId('chamber-summary')).toHaveTextContent('—')
    expect(screen.getByText('Research visualization, not a validated simulation.')).toBeInTheDocument()
  })

  it('opens the custom material selector and allows choosing a spacecraft material', async () => {
    renderSimulator()
    const trigger = await screen.findByRole('button', { name: 'Material' })
    fireEvent.click(trigger)
    const listbox = screen.getByRole('listbox', { name: 'Material' })
    expect(within(listbox).getAllByRole('option').length).toBeGreaterThanOrEqual(3)
    fireEvent.click(within(listbox).getByRole('option', { name: /Nomex III/i }))
    expect(screen.queryByRole('listbox')).toBeNull()
    expect(trigger).toHaveTextContent(/Nomex III/i)
  })

  it('runs the ISS quiescent scenario and renders the results in order', async () => {
    renderSimulator()
    await runPreset('ISS · quiescent')
    expect(currentStep()).toHaveTextContent('Measure risk')

    const results = screen.getByTestId('results')
    const titles = within(results).getAllByRole('heading', { level: 3 }).map((h) => h.textContent)
    expect(titles).toEqual(['Risk', 'Telemetry', 'ISS FWM PFE suppression sizing', 'SI copilot', expect.stringMatching(/^Sources/)])

    expect(screen.getByRole('meter', { name: 'Flammability score' })).toHaveAttribute('aria-valuenow', '48')
    expect(screen.getByText('Moderate Alert').className).toMatch(/text-warning/)
    expect(screen.getByTestId('grounding-badge')).toHaveTextContent('NASA experimental data')
    expect(screen.getByText('0.45')).toBeInTheDocument()
    expect(screen.getByText('16.5')).toBeInTheDocument()

    expect(screen.getByTestId('thickness')).toHaveTextContent('5.00 mm')
    expect(screen.getByTestId('chamber-summary')).toHaveTextContent(
      'ISS Microgravity (0.00g Quiescent) · PMMA (Cast Polymethyl Methacrylate Slab) · 5.0 mm · 21.0% O₂ · 0.5 cm/s',
    )
    expect(screen.getByTestId('suppression-guidance')).toHaveTextContent('Research guidance, not an operational procedure')
    expect(screen.getByText('Scientific limitations')).toBeInTheDocument()
    expect(screen.getByTestId('si-generated')).toHaveTextContent('SI-generated')
    expect(screen.getByTestId('on-earth')).toHaveTextContent(/Optical sensor calibration/)

    const link = screen.getByRole('link', { name: /Burning and Suppression of Solids - II \(BASS-II\)\s*\(opens/ })
    expect(link).toHaveAttribute('href', 'https://doi.org/10.60555/4qc4-de67')
    expect(screen.getByText('PSI-25')).toBeInTheDocument()
  })

  it('shows the suppression card awaiting the engine and keeps the discharge disabled with a tooltip', async () => {
    renderSimulator()
    await runPreset('ISS · quiescent')
    const card = screen.getByTestId('suppression-card')
    expect(within(card).getByText('Estimated')).toBeInTheDocument()
    expect(within(card).getByTestId('suppression-awaiting')).toHaveTextContent('Awaiting suppression estimate from engine')
    expect(within(card).getAllByText('—')).toHaveLength(4)

    expect(screen.getByTestId('chamber-state')).toHaveTextContent('Burning')
    const discharge = screen.getByRole('button', { name: /Discharge FWM PFE/ })
    expect(discharge).toBeDisabled()
    expect(discharge).toHaveAccessibleDescription('Suppression estimate not available yet')
  })

  it('shows payload texts as they come (Lunar scenario) inside the guidance block', async () => {
    renderSimulator()
    await runPreset('Lunar habitat · ventilated')
    expect(screen.getByTestId('grounding-badge')).toHaveTextContent('Estimate · interpolated')
    expect(screen.getByText('Critical Flashover Risk').className).toMatch(/text-critical/)
    expect(screen.getByTestId('suppression-guidance')).toHaveTextContent('IMMEDIATE CABIN HVAC SHUTOFF')
  })

  it('the low-oxygen scenario goes straight to Extinguished below the oxygen limit', async () => {
    renderSimulator()
    await runPreset('ISS · low oxygen')
    expect(screen.getByTestId('chamber-state')).toHaveTextContent('Extinguished')
    expect(screen.getByTestId('chamber-extinguished-message')).toHaveTextContent('Extinguished below oxygen limit')
    expect(screen.getByRole('button', { name: /Discharge FWM PFE/ })).toBeDisabled()
    expect(screen.getByText('Safe (Extinguished Below LOI)').className).toMatch(/text-nominal/)
  })

  it('warns that results are stale after a parameter change', async () => {
    renderSimulator()
    await runPreset('ISS · quiescent')
    expect(screen.queryByTestId('stale-banner')).not.toBeInTheDocument()
    fireEvent.change(screen.getByRole('spinbutton', { name: /Oxygen value/ }), { target: { value: '18' } })
    expect(screen.getByTestId('stale-banner')).toHaveTextContent('reflect the previous run')
    expect(currentStep()).toHaveTextContent('Simulate')
  })

  it('runs the simulate -> suppress cycle when the engine provides an estimate', async () => {
    const client: ApiClient = {
      ...createMockClient(0),
      simulate: async (request) => withTestEstimate(mockSimulate(request), 3),
    }
    renderSimulator(client)
    const discharge = await screen.findByRole('button', { name: /Discharge FWM PFE/ })
    expect(discharge).toBeDisabled()
    expect(screen.getByTestId('chamber-state')).toHaveTextContent('Idle')

    await runPreset('ISS · quiescent')
    expect(screen.getByTestId('chamber-state')).toHaveTextContent('Burning')
    expect(discharge).toBeEnabled()
    expect(screen.queryByTestId('suppression-awaiting')).toBeNull()

    vi.useFakeTimers()
    try {
      fireEvent.click(discharge)
      expect(screen.getByTestId('chamber-state')).toHaveTextContent('Suppressing')
      expect(currentStep()).toHaveTextContent('Suppress')
      expect(discharge).toBeDisabled()
      act(() => vi.advanceTimersByTime(2900))
      expect(screen.getByTestId('chamber-state')).toHaveTextContent('Suppressing')
      act(() => vi.advanceTimersByTime(200))
      expect(screen.getByTestId('chamber-state')).toHaveTextContent('Extinguished')
      expect(screen.getByTestId('chamber-state')).toHaveTextContent('after FWM PFE discharge')
    } finally {
      vi.useRealTimers()
    }

    // A new run restarts the cycle.
    fireEvent.click(screen.getByRole('button', { name: 'Run Simulation' }))
    await waitFor(() => expect(screen.getByTestId('chamber-state')).toHaveTextContent('Burning'))
  })

  it('shows an error state with retry when the API fails, without the MOCK DATA badge in live mode', async () => {
    const failing: ApiClient = {
      ...createMockClient(0),
      mode: 'live',
      simulate: () => Promise.reject(new Error('The backend is unreachable. Check that the API is running.')),
    }
    renderSimulator(failing)
    fireEvent.click(await screen.findByRole('button', { name: 'Run Simulation' }))
    const alert = await screen.findByTestId('results-error')
    expect(alert).toHaveTextContent('backend is unreachable')
    expect(within(alert).getByRole('button', { name: 'Retry' })).toBeInTheDocument()
    expect(screen.queryByTestId('mock-badge')).not.toBeInTheDocument()
  })

  it('opens the help modal via the ? button, displays all static step cards, and replays the step-by-step tutorial', async () => {
    renderSimulator()
    const helpBtn = await screen.findByTestId('simulator-help-button')
    fireEvent.click(helpBtn)

    const helpModal = screen.getByTestId('simulator-help-modal')
    expect(helpModal).toHaveTextContent('Simulator Help & Step-by-Step Guide')
    expect(screen.getByTestId('help-card-material')).toBeInTheDocument()
    expect(screen.getByTestId('help-card-gravity')).toBeInTheDocument()
    expect(screen.getByTestId('help-card-atmosphere')).toBeInTheDocument()
    expect(screen.getByTestId('help-card-flame')).toBeInTheDocument()
    expect(screen.getByTestId('help-card-suppress')).toBeInTheDocument()
    expect(screen.getByTestId('help-card-results')).toBeInTheDocument()

    // Replay the interactive tutorial from the help modal.
    fireEvent.click(within(helpModal).getByRole('button', { name: /Replay tutorial/i }))
    expect(screen.queryByTestId('simulator-help-modal')).not.toBeInTheDocument()

    const tutorial = screen.getByTestId('simulator-tutorial')
    expect(tutorial).toHaveTextContent('Welcome to AstroFire 3D')
    expect(within(tutorial).getByRole('button', { name: 'Previous step' })).toBeDisabled()

    // Step forward through the screens and back.
    fireEvent.click(within(tutorial).getByRole('button', { name: 'Next step' }))
    expect(tutorial).toHaveTextContent('Step 1 · Select Material')
    fireEvent.click(within(tutorial).getByRole('button', { name: 'Next step' }))
    expect(tutorial).toHaveTextContent('Step 2 · Choose Gravity Regime')
    fireEvent.click(within(tutorial).getByRole('button', { name: 'Previous step' }))
    expect(tutorial).toHaveTextContent('Step 1 · Select Material')

    // Close tutorial.
    fireEvent.click(within(tutorial).getByRole('button', { name: 'Close tutorial' }))
    expect(screen.queryByTestId('simulator-tutorial')).not.toBeInTheDocument()
  })
})

describe('simulator helpers', () => {
  it('chamber developer controls need ?dev (or the env flag)', () => {
    expect(chamberDevControlsEnabled('')).toBe(false)
    expect(chamberDevControlsEnabled('?dev=1')).toBe(true)
    expect(chamberDevControlsEnabled('?dev')).toBe(true)
    expect(chamberDevControlsEnabled('?dev=0')).toBe(false)
  })

  it('shortens citation ids and hides unregistered Brazilian sources', () => {
    expect(shortCitationId('PSI-25 (DOI: 10.60555/4qc4-de67)')).toBe('PSI-25')
    expect(shortCitationId('NASA/TM-20210011385')).toBe('NASA/TM-20210011385')
    expect(isCitationShown({ id: 'NTRS-20170000230', title: 'Saffire', url: '', finding: '' })).toBe(true)
    expect(isCitationShown({ id: 'UFSC VSB-30', title: 'Sounding rocket study', url: '', finding: '' })).toBe(false)
  })
})
