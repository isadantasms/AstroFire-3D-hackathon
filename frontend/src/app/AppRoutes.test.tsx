// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
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
  it('renders the three primary navigation routes', () => {
    renderAt('/')
    const nav = screen.getByRole('navigation', { name: 'Primary' })
    const links = within(nav).getAllByRole('link')
    expect(links.map((l) => l.textContent)).toEqual([
      'Home',
      'Simulator',
      'Research & Data',
    ])
    expect(links.map((l) => l.getAttribute('href'))).toEqual([
      '/',
      '/simulator',
      '/research',
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
      ['SI Usage', '/#si-usage'],
      ['Credits', '/research#credits'],
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
    expect(screen.getByRole('link', { name: 'AstroFire home' })).toBeInTheDocument()
    expect(document.title === '' || !document.title.includes('3D')).toBe(true)
    expect(
      screen.getByRole('heading', { level: 1, name: 'Make the next giant leap safer.' }),
    ).toBeInTheDocument()
    const hero = screen.getByRole('heading', { level: 1 }).closest('section')!
    expect(within(hero).getByRole('link', { name: /Launch Simulator/ })).toHaveAttribute('href', '/simulator')
    expect(within(hero).getByRole('link', { name: 'Documentation' })).toHaveAttribute('href', '/research')
    expect(within(hero).getByRole('link', { name: /Watch the 30s pitch/ })).toHaveAttribute('href', '#')
    expect(within(hero).queryByText(/Not a certified safety assessment/)).toBeNull()
  })

  it('home follows problem -> approach -> solution, then a closing panel', () => {
    renderAt('/')
    expect(screen.getByText('From research to answers', { selector: 'p' }).className).toMatch(/font-mono/)
    expect(screen.getByRole('heading', { level: 2, name: 'How AstroFire helps' })).toBeInTheDocument()

    const steps = within(screen.getByRole('heading', { level: 2, name: 'How AstroFire helps' }).closest('section')!)
    for (const name of ['The problem', 'Our approach', 'The solution']) {
      expect(steps.getAllByText(name).length).toBeGreaterThan(0)
    }
    for (const title of [
      'Fire behaves differently in space, and the data to plan for it is hard to use.',
      'We bring the research together.',
      'AstroFire turns it into a clear answer in seconds.',
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
    expect(closing.getByRole('link', { name: 'Documentation' })).toHaveAttribute('href', '/research')

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

  it('uses the AstroFire name and wordmark', () => {
    renderAt('/')
    const brand = screen.getByRole('link', { name: 'AstroFire home' })
    expect(brand).toHaveTextContent('AstroFire')
    expect(brand).not.toHaveTextContent('3D')
  })

  it('home keeps NASA out of the hero title and buttons', () => {
    renderAt('/')
    const hero = screen.getByRole('heading', { level: 1 }).closest('section')!
    expect(within(hero).queryByText(/NASA/)).toBeNull()
  })

  it('the About page is gone: SI usage closes the Home, before the final call to action', () => {
    renderAt('/')
    expect(screen.queryByRole('link', { name: 'About & SI Usage' })).toBeNull()
    const h2s = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    expect(h2s).toEqual(['How AstroFire helps', 'How we use SI', 'Ready to test a scenario?'])

    const si = within(document.getElementById('si-usage')!)
    for (const name of ['In the product', 'In development', 'Human review']) {
      expect(si.getByRole('heading', { level: 3, name })).toBeInTheDocument()
    }
    expect(si.getByText(/labeled as SI-generated in the results/)).toBeInTheDocument()
    const tools = si.getByTestId('dev-tools')
    expect(tools).toHaveTextContent('Claude: code, interface design and website copy')
    expect(tools).toHaveTextContent('Gemini: code assistance and test data generation')
    expect(tools).toHaveTextContent('[VOICE TOOL]: narration of the demo video')

    // The team section was removed.
    expect(document.getElementById('team')).toBeNull()
    expect(document.body.textContent).not.toMatch(/\bzero\b|100%|guaranteed/i)
  })

  it('/about redirects to the SI usage section of the Home', async () => {
    renderAt('/about')
    expect(await screen.findByRole('heading', { level: 2, name: 'How we use SI' })).toBeInTheDocument()
  })

  it('Data & credits now live at the end of Research & Data', async () => {
    const { container } = renderAt('/research')
    expect(await screen.findByRole('heading', { level: 2, name: 'References' })).toBeInTheDocument()
    const credits = within(container.querySelector('#credits') as HTMLElement)
    expect(credits.getByRole('heading', { level: 2, name: 'Data & credits' })).toBeInTheDocument()
    expect(credits.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(['NASA data', 'Software & assets'])
    expect(credits.getByText('BASS-II (PSI-25): Burning and Suppression of Solids - II')).toBeInTheDocument()
    expect(credits.getByText(/IBM Plex Sans & IBM Plex Mono/)).toBeInTheDocument()
    expect(credits.getByText('Voxel rocket 3D model (MagicaVoxel)')).toBeInTheDocument()
    expect(credits.queryByText(/UFSC|VSB-30/)).toBeNull()
  })

  it('Research & Data follows the new section order, without the Fig. 01 figure', async () => {
    renderAt('/research')
    expect(await screen.findByRole('heading', { level: 1, name: 'The research behind AstroFire' })).toBeInTheDocument()
    const nav = within(screen.getByRole('navigation', { name: 'On this page' }))
    expect(nav.getAllByRole('link').map((a) => [a.textContent, a.getAttribute('href')])).toEqual([
      ['Investigations', '#investigations'],
      ['BASS-II data', '#bass-ii-data'],
      ['Method', '#method'],
      ['Data notes', '#data-notes'],
      ['References', '#references'],
    ])
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      'Which experiments matter for your habitat?',
      'The experimental data',
      'How results are calculated',
      'About the data',
      'References',
      'Data & credits',
    ])
    expect(screen.queryByText('Two regimes, one console')).toBeNull()
    expect(screen.queryByText(/Hybrid PINN Loss Convergence/)).toBeNull()
  })

  it('investigation cards: corrected SoFIE text, sourced conditions only, guidance in Details', async () => {
    renderAt('/research')
    const sofie = (await screen.findByText('Solid Fuel Ignition and Extinction (RTDFS, NCA, GEL, MIST, SMuRF)')).closest('li')!
    expect(within(sofie).getByText('See source')).toBeInTheDocument()
    expect(within(sofie).getByText(/Several SoFIE principal investigators also authored the BASS-II summary report/)).toBeInTheDocument()
    expect(screen.queryByText(/Direct successor to BASS-II/)).toBeNull()
    expect(screen.queryByText(/15\.0% – 40\.0%|10 kW|370–550 ppm/)).toBeNull()

    // BASS-II range is computed from the 79 dataset records.
    const bass = screen.getByText('Burning and Suppression of Solids–II (BASS-II)').closest('li')!
    expect(within(bass).getByText('13.6–22.2% O₂ · 0.6–47.0 cm/s (79 tests)')).toBeInTheDocument()
    expect(within(bass).getByText('SI-assisted guidance · research only, not an operational procedure')).toBeInTheDocument()
    expect(within(bass).getByRole('link', { name: /View source/ })).toHaveAttribute('href', 'https://doi.org/10.60555/4qc4-de67')
    expect(within(bass).getByRole('link', { name: 'Reference 1' })).toHaveAttribute('href', '#ref-1')
  })

  it('the habitat selector re-ranks the investigations', async () => {
    renderAt('/research')
    const first = () => within(screen.getAllByRole('listitem').find((li) => li.textContent?.startsWith('#1'))!).getByRole('heading', { level: 3 })
    expect((await screen.findByRole('radio', { name: 'Lunar base (0.16 g)' })).getAttribute('aria-checked')).toBe('true')
    expect(first()).toHaveTextContent('Saffire')
    fireEvent.click(screen.getByRole('radio', { name: 'ISS orbital lab (0 g)' }))
    expect(first()).toHaveTextContent('BASS-II')
  })

  it('the BASS-II table shows 10 rows until "Show all 79"', async () => {
    renderAt('/research')
    expect(await screen.findByRole('heading', { level: 3, name: 'BASS-II experiment matrix' }, { timeout: 5000 })).toBeInTheDocument()
    expect(await screen.findByText('BASS2-M1')).toBeInTheDocument()
    const table = screen.getByRole('table', { name: /BASS-II test records/ })
    expect(within(table).getAllByRole('row')).toHaveLength(11)
    fireEvent.click(screen.getByRole('button', { name: 'Show all 79' }))
    expect(within(table).getAllByRole('row')).toHaveLength(80)
    expect(screen.getByText('Observed data · NASA PSI BASS-II')).toBeInTheDocument()
  })

  it('references are numbered and the SAME credit no longer covers other investigations', async () => {
    const { container } = renderAt('/research')
    expect(await screen.findByRole('heading', { level: 2, name: 'References' })).toBeInTheDocument()
    for (let n = 1; n <= 6; n++) expect(container.querySelector(`#ref-${n}`)).not.toBeNull()
    expect(screen.queryByText(/SAME \/ SoFIE \/ FLEX \/ SPICE/)).toBeNull()
  })

  it.each([
    ['/simulator', 'Simulator'],
    ['/research', 'The research behind AstroFire'],
    ['/does-not-exist', 'Page not found'],
  ])('route %s renders its page title', async (path, title) => {
    renderAt(path)
    expect(await screen.findByRole('heading', { level: 1, name: title }, { timeout: 5000 })).toBeInTheDocument()
  })
})
