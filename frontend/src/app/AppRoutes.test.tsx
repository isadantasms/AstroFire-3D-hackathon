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

  it('renders a one-line footer with the team credit and three links', () => {
    renderAt('/')
    const footer = screen.getByRole('contentinfo')
    expect(screen.getByTestId('footer-credit')).toHaveTextContent(
      '© 2026 21 Pyro Rangers · Built for NASA Space Apps Challenge 2026',
    )
    expect(within(footer).getByText('Fire')).toBeInTheDocument()
    const footerNav = screen.getByRole('navigation', { name: 'Footer' })
    expect(within(footerNav).getAllByRole('link').map((l) => [l.textContent, l.getAttribute('href')])).toEqual([
      ['Research & Data', '/research'],
      ['SI Usage', '/about#si-usage'],
      ['Credits', '/about#credits'],
    ])
    for (const removed of [
      /For research and education only/,
      /CFD/,
      /10\.60555/,
      /Not affiliated/,
      /NASA insignia/,
      /MIT License/,
    ]) {
      expect(within(footer).queryByText(removed)).toBeNull()
    }
  })

  it('home hero exposes the brand, headline and the three calls to action', () => {
    renderAt('/')
    expect(screen.getByRole('link', { name: 'AstroFire 3D home' })).toBeInTheDocument()
    expect(document.title === '' || !document.title.includes('3D')).toBe(true)
    expect(
      screen.getByRole('heading', { level: 1, name: 'Make the next giant leap safer.' }),
    ).toBeInTheDocument()
    const hero = screen.getByRole('heading', { level: 1 }).closest('section')!
    expect(within(hero).getByRole('link', { name: /Launch Simulator/ })).toHaveAttribute('href', '/simulator')
    expect(within(hero).getByRole('link', { name: 'Documentation' })).toHaveAttribute('href', '/about')
    expect(within(hero).getByRole('link', { name: /Watch the 30s pitch/ })).toHaveAttribute('href', '#')
    expect(within(hero).queryByText(/Not a certified safety assessment/)).toBeNull()
  })

  it('home follows problem -> approach -> solution, then a closing panel', () => {
    renderAt('/')
    expect(screen.getByText('From research to answers', { selector: 'p' }).className).toMatch(/font-mono/)
    expect(screen.getByRole('heading', { level: 2, name: 'How AstroFire 3D helps' })).toBeInTheDocument()

    const steps = within(screen.getByRole('heading', { level: 2, name: 'How AstroFire 3D helps' }).closest('section')!)
    for (const name of ['The problem', 'Our approach', 'The solution']) {
      expect(steps.getAllByText(name).length).toBeGreaterThan(0)
    }
    for (const title of [
      'Fire behaves differently in space, and the data to plan for it is hard to use.',
      'We bring the research together.',
      'AstroFire 3D turns it into a clear answer in seconds.',
    ]) {
      expect(steps.getByRole('heading', { level: 3, name: title })).toBeInTheDocument()
    }
    for (const item of [
      'Without gravity, flames turn round, slow and hard to see.',
      'Cabin airflow and oxygen-richer habitats change how materials burn.',
      'Decades of experiments are spread across reports and raw tables.',
      'SI that reads, compares and cites these sources',
      'Set material, gravity, oxygen and airflow',
      'See the flame in 3D and its fire risk',
      'Size the ISS water-mist extinguisher for that fire',
      'Check the source behind every number',
    ]) {
      expect(steps.getByText(item)).toBeInTheDocument()
    }
    expect(steps.getByText('PSI · BASS-II')).toBeInTheDocument()
    expect(steps.getByText('NTRS')).toBeInTheDocument()
    // The UFSC (VSB-30) item stays hidden until its reference is in docs/references.md.
    expect(screen.queryByText(/UFSC|VSB-30|Brazilian/)).toBeNull()

    const closing = within(screen.getByRole('heading', { level: 2, name: 'Ready to test a scenario?' }).closest('section')!)
    expect(closing.getByRole('link', { name: /Launch Simulator/ })).toHaveAttribute('href', '/simulator')
    expect(closing.getByRole('link', { name: 'Documentation' })).toHaveAttribute('href', '/about')

    // Old sections are gone.
    for (const old of ['The science', 'How it works', 'What makes AstroFire different', 'Back on Earth']) {
      expect(screen.queryByText(old)).toBeNull()
    }
  })

  it('home hero backdrop is decorative and holds still without motion support', () => {
    renderAt('/')
    for (const id of ['home-sky', 'planet-horizon', 'hero-backdrop']) {
      expect(screen.getByTestId(id)).toHaveAttribute('aria-hidden', 'true')
    }
    const sky = screen.getByTestId('home-sky')
    expect(sky.className).toMatch(/fixed/)
    expect(sky.className).toMatch(/pointer-events-none/)
    // jsdom has no matchMedia: treated as reduced motion, so no rocket and no shooting star.
    expect(screen.queryByTestId('sky-rocket')).toBeNull()
    expect(sky.querySelector('.shooting-star')).toBeNull()
    // The scroll trail and its markers are gone.
    expect(screen.queryByTestId('scroll-trail')).toBeNull()
    expect(document.querySelector('.trail-marker')).toBeNull()
    expect(screen.getByText('safer.', { selector: 'span.safer-in' })).toBeInTheDocument()
  })

  it('uses the AstroFire 3D name and wordmark', () => {
    renderAt('/')
    const brand = screen.getByRole('link', { name: 'AstroFire 3D home' })
    expect(brand).toHaveTextContent('AstroFire3D')
    expect(within(brand).getByText('3D').className).toMatch(/9AA8BD/)
    expect(within(screen.getByRole('contentinfo')).getByText('3D').className).toMatch(/9AA8BD/)
  })

  it('home keeps NASA out of the hero title and buttons', () => {
    renderAt('/')
    const hero = screen.getByRole('heading', { level: 1 }).closest('section')!
    expect(within(hero).queryByText(/NASA/)).toBeNull()
  })

  it('sources, licenses and SI usage stay on Research & Data and About after the footer cut', async () => {
    renderAt('/research')
    expect(await screen.findByText('BASS-II (PSI-25, DOI: 10.60555/4qc4-de67)')).toBeInTheDocument()
    cleanup()
    const { container } = renderAt('/about')
    await screen.findByRole('heading', { level: 1, name: 'About AstroFire 3D' }, { timeout: 5000 })
    expect(container.querySelector('#si-usage')).not.toBeNull()
    expect(container.querySelector('#credits')).toHaveTextContent('CC0-1.0')
  })

  it('About page: short product sections in order, no removed technical content', async () => {
    const { container } = renderAt('/about')
    await screen.findByRole('heading', { level: 1, name: 'About AstroFire 3D' }, { timeout: 5000 })
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      'How it works',
      'How we use SI',
      'Limitations',
      'Data & credits',
      '21 Pyro Rangers',
    ])
    for (const block of ['Data', 'Engine', 'Console']) expect(screen.getByText(block)).toBeInTheDocument()
    expect(screen.getByText(/Claude:/).parentElement).toHaveTextContent('code, interface design and website copy')
    expect(screen.getByText(/Gemini:/).parentElement).toHaveTextContent('code assistance and test data generation')
    expect(screen.getByText('Uberlândia, Brazil · NASA Space Apps Challenge 2026')).toBeInTheDocument()
    for (const role of ['Data & physics engine', 'Backend & API', 'Data analysis & model accuracy', 'Science & SI validation', '3D flame chamber', 'Front-end & product']) {
      expect(screen.getByText(role)).toBeInTheDocument()
    }

    const credits = within(container.querySelector('#credits') as HTMLElement)
    expect(credits.getAllByRole('columnheader').map((h) => h.textContent)).toEqual(['Resource', 'Type', 'License', 'Source'])
    expect(credits.getByText(/IBM Plex Sans & IBM Plex Mono/)).toBeInTheDocument()
    expect(credits.getByText('Voxel rocket 3D model (MagicaVoxel)')).toBeInTheDocument()
    expect(credits.queryByText(/Inter & JetBrains Mono/)).toBeNull()
    expect(credits.queryByText(/UFSC|VSB-30/)).toBeNull()

    for (const removed of [/Zero-Hallucination/, /PINN/, /94\.94/, /Single Source of Truth/i, /Lead Architect/]) {
      expect(screen.queryByText(removed)).toBeNull()
    }
    // No absolute wording on the page.
    expect(container.textContent).not.toMatch(/\bzero\b|100%|guaranteed/i)
  })

  it('the Fig. 01 flame figure moved from the Home to Research & Data', async () => {
    renderAt('/')
    expect(screen.queryByText('Two regimes, one console')).toBeNull()
    cleanup()
    renderAt('/research')
    expect(await screen.findByRole('heading', { level: 2, name: 'Two regimes, one console' })).toBeInTheDocument()
    expect(screen.getByText('Illustrative schematic. Not simulation output or measured data.')).toBeInTheDocument()
  })

  it('the BASS-II table moved from the Simulator to Research & Data', async () => {
    renderAt('/research')
    expect(await screen.findByRole('heading', { level: 2, name: 'BASS-II experiment matrix' }, { timeout: 5000 })).toBeInTheDocument()
    expect(await screen.findByText('BASS2-M1')).toBeInTheDocument()
  })

  it.each([
    ['/simulator', 'Simulator'],
    ['/research', 'Research & Data'],
    ['/about', 'About AstroFire 3D'],
    ['/does-not-exist', 'Page not found'],
  ])('route %s renders its page title', async (path, title) => {
    renderAt(path)
    expect(await screen.findByRole('heading', { level: 1, name: title }, { timeout: 5000 })).toBeInTheDocument()
  })
})
