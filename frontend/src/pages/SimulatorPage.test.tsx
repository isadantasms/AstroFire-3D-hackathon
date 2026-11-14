// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { SimulatorPage } from './SimulatorPage'
import { createMockClient } from '../services/api/mockClient'
import type { ApiClient } from '../services/api/client'

afterEach(cleanup)

function renderSimulator(client: ApiClient = createMockClient(0)) {
  return render(
    <MemoryRouter>
      <SimulatorPage client={client} />
    </MemoryRouter>,
  )
}

describe('SimulatorPage', () => {
  it('shows the mock banner and the empty state before the first run', async () => {
    renderSimulator()
    expect(await screen.findByRole('button', { name: 'Run Simulation' })).toBeInTheDocument()
    expect(screen.getByTestId('mock-mode-banner')).toHaveTextContent('MOCK DATA')
    expect(screen.getByTestId('results-empty')).toBeInTheDocument()
    expect(screen.getByTestId('chamber-placeholder')).toHaveTextContent('Static placeholder')
  })

  it('runs a simulation and renders grounding, telemetry and citations labeled as mock', async () => {
    renderSimulator()
    fireEvent.click(await screen.findByRole('button', { name: 'Run Simulation' }))

    expect(await screen.findByTestId('results')).toBeInTheDocument()
    expect(screen.getByTestId('mock-notice')).toHaveTextContent('MOCK DATA')
    expect(screen.getByTestId('grounding-badge')).toHaveTextContent('Bounded NTRS interpolation')
    expect(screen.getByRole('meter', { name: 'Flammability score' })).toBeInTheDocument()
    expect(screen.getAllByText(/not an approved operational procedure/).length).toBeGreaterThanOrEqual(2)
    expect(screen.getByRole('link', { name: /PSI-25/ })).toHaveAttribute('href', 'https://doi.org/10.60555/4qc4-de67')
  })

  it('warns that results are stale after a parameter change', async () => {
    renderSimulator()
    fireEvent.click(await screen.findByRole('button', { name: 'Run Simulation' }))
    await screen.findByTestId('results')
    expect(screen.queryByTestId('stale-banner')).not.toBeInTheDocument()

    fireEvent.change(screen.getByRole('spinbutton', { name: /Oxygen value/ }), { target: { value: '18' } })
    expect(screen.getByTestId('stale-banner')).toHaveTextContent('reflect the previous run')
  })

  it('selecting a BASS-II row fills the controls and marks the record', async () => {
    renderSimulator()
    const table = await screen.findByRole('table')
    const row = within(table).getByText('BASS2-M1').closest('tr')
    expect(row).not.toBeNull()
    fireEvent.click(row!)

    expect(screen.getByText(/Loaded from BASS-II record/)).toHaveTextContent('BASS2-M1')
    expect(screen.getByRole('spinbutton', { name: /Oxygen value/ })).toHaveValue(22.2)
    expect(screen.getByRole('spinbutton', { name: /Cabin airflow value/ })).toHaveValue(9)
    expect(row).toHaveAttribute('aria-selected', 'true')
  })

  it('runs the simulate -> suppress cycle using the backend discharge time', async () => {
    renderSimulator()
    const discharge = await screen.findByRole('button', { name: /Discharge FWM PFE/ })
    expect(discharge).toBeDisabled()
    expect(screen.getByTestId('chamber-state')).toHaveTextContent('Idle')

    fireEvent.click(screen.getByRole('button', { name: 'Run Simulation' }))
    await screen.findByTestId('results')
    expect(screen.getByTestId('chamber-state')).toHaveTextContent('Burning')
    expect(discharge).toBeEnabled()

    vi.useFakeTimers()
    try {
      fireEvent.click(discharge)
      expect(screen.getByTestId('chamber-state')).toHaveTextContent('Suppressing')
      expect(discharge).toBeDisabled()

      // Mock estimated_discharge_seconds is 3 s: still suppressing just before, extinguished after.
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

  it('keeps the discharge disabled when the run has no sustained flame', async () => {
    renderSimulator()
    fireEvent.click(await screen.findByRole('button', { name: /Hypoxic Quench/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Run Simulation' }))
    await screen.findByTestId('results')
    expect(screen.getByTestId('chamber-state')).toHaveTextContent('no sustained flame')
    expect(screen.getByRole('button', { name: /Discharge FWM PFE/ })).toBeDisabled()
  })

  it('shows the suppression sizing card as estimates with units and no hardcoded tank volume', async () => {
    renderSimulator()
    fireEvent.click(await screen.findByRole('button', { name: 'Run Simulation' }))
    const card = await screen.findByRole('region', { name: 'ISS FWM PFE suppression sizing' })
    expect(within(card).getByText('Estimated')).toBeInTheDocument()
    expect(within(card).getByText('Est. mist volume')).toBeInTheDocument()
    expect(within(card).getByText('mL')).toBeInTheDocument()
    expect(within(card).getByText('Est. discharge time')).toBeInTheDocument()
    expect(within(card).getByText('% used')).toBeInTheDocument()
    expect(within(card).getByText('Est. cooling eff.')).toBeInTheDocument()
    expect(within(card).getByText('% at 0.00 g')).toBeInTheDocument()
    expect(within(card).getByText(/not an approved operational procedure/)).toBeInTheDocument()
    expect(within(card).getByText('Sources to verify')).toBeInTheDocument()
    expect(card).not.toHaveTextContent('2.72')
  })

  it('shows an error state with retry when the API fails', async () => {
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
    expect(screen.queryByTestId('mock-mode-banner')).not.toBeInTheDocument()
  })
})
