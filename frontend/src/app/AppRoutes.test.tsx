// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { AppRoutes } from './AppRoutes'

afterEach(cleanup)

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  )
}

describe('site structure', () => {
  it('renders the four primary navigation routes', () => {
    renderAt('/')
    const nav = screen.getByRole('navigation', { name: 'Primary' })
    const links = within(nav).getAllByRole('link')
    expect(links.map((l) => l.textContent)).toEqual([
      'Home',
      'Simulator',
      'Research & Data',
      'About & SI Usage',
    ])
    expect(links.map((l) => l.getAttribute('href'))).toEqual([
      '/',
      '/simulator',
      '/research',
      '/about',
    ])
  })

  it('renders the footer disclaimer and SI / Credits links', () => {
    renderAt('/')
    expect(screen.getByTestId('footer-disclaimer')).toHaveTextContent(
      'For research and education only.',
    )
    const footerNav = screen.getByRole('navigation', { name: 'Footer' })
    expect(within(footerNav).getByRole('link', { name: 'SI Usage' })).toHaveAttribute(
      'href',
      '/about#si-usage',
    )
    expect(within(footerNav).getByRole('link', { name: /Credits/ })).toHaveAttribute(
      'href',
      '/about#credits',
    )
  })

  it('home hero exposes the brand, headline and the three calls to action', () => {
    renderAt('/')
    expect(screen.getByRole('link', { name: 'AstroFire 3D home' })).toHaveTextContent('AstroFire 3D')
    expect(
      screen.getByRole('heading', { level: 1, name: 'Make the next giant leap safer.' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Launch Simulator/ })).toHaveAttribute('href', '/simulator')
    expect(screen.getByRole('link', { name: 'Documentation' })).toHaveAttribute('href', '/about')
    expect(screen.getByRole('link', { name: /Watch the 30s pitch/ })).toHaveAttribute('href', '#')
    expect(screen.getByText('For research and education. Not a certified safety assessment.')).toBeInTheDocument()
  })

  it('home keeps NASA out of the hero title and buttons', () => {
    renderAt('/')
    const hero = screen.getByRole('heading', { level: 1 }).closest('section')!
    expect(within(hero).queryByText(/NASA/)).toBeNull()
    expect(screen.getByText('Illustrative schematic. Not simulation output or measured data.')).toBeInTheDocument()
    expect(screen.getByTestId('footer-data-source')).toHaveTextContent('BASS-II (PSI-25)')
  })

  it.each([
    ['/simulator', 'Simulator'],
    ['/research', 'Research & Data'],
    ['/about', 'About & SI Usage'],
    ['/does-not-exist', 'Page not found'],
  ])('route %s renders its page title', async (path, title) => {
    renderAt(path)
    expect(await screen.findByRole('heading', { level: 1, name: title })).toBeInTheDocument()
  })
})
