// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
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
    expect(screen.getByText(/not an approved operational procedure/)).toBeInTheDocument()
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
