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

  it('home exposes the Launch Simulator CTA and spells out SI on first mention', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { level: 1, name: 'AstroFire 3D' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Launch Simulator/ })).toHaveAttribute(
      'href',
      '/simulator',
    )
    expect(screen.getByText(/Super Intelligence \(SI\)/)).toBeInTheDocument()
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
