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
      'Documentation',
    ])
    expect(links.map((l) => l.getAttribute('href'))).toEqual([
      '/',
      '/simulator',
      '/documentation',
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
      ['Documentation', '/documentation'],
      ['SI Usage', '/#si-usage'],
      ['Credits', '/documentation#credits'],
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
    expect(within(hero).getByRole('link', { name: 'Documentation' })).toHaveAttribute('href', '/documentation')
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
    // Step selector: one panel visible at a time.
    const tabs = steps.getAllByRole('tab')
    expect(tabs.map((t) => t.getAttribute('aria-selected'))).toEqual(['true', 'false', 'false'])
    const titles = [
      'Fire behaves differently in space, and the data to understand it is scattered.',
      'We bring the research together.',
      'Explore fire behavior, backed by science.',
    ]
    expect(steps.getByRole('heading', { level: 3, name: titles[0] })).toBeInTheDocument()
    expect(steps.queryByRole('heading', { level: 3, name: titles[1] })).toBeNull()
    fireEvent.click(steps.getByRole('button', { name: /Next: our approach/ }))
    expect(steps.getByRole('heading', { level: 3, name: titles[1] })).toBeInTheDocument()
    expect(tabs[1]).toHaveFocus()
    fireEvent.keyDown(tabs[1], { key: 'ArrowDown' })
    expect(steps.getByRole('heading', { level: 3, name: titles[2] })).toBeInTheDocument()
    expect(tabs[2]).toHaveAttribute('aria-selected', 'true')
    expect(steps.queryByRole('link', { name: /Try it in the Simulator/ })).toBeNull()
    // Launch Simulator button under the steps.
    expect(steps.getByRole('link', { name: /Launch Simulator/ })).toHaveAttribute('href', '/simulator')
    fireEvent.keyDown(tabs[2], { key: 'Home' })
    expect(steps.getByRole('heading', { level: 3, name: titles[0] })).toBeInTheDocument()
    for (const item of [
      'Without gravity, hot gases don’t rise, so flames can become slow, round and hard to see.',
      'Oxygen concentration and cabin airflow change how materials burn.',
      'NASA’s experimental findings are spread across datasets and technical reports.',
      // "Six" comes from the number of investigations in the ranking.
      'Six NASA investigations summarized, ranked and interpreted for each habitat: spacecraft, space stations, lunar and Martian bases, and pressurized rovers.',
      'A rule-based engine matches each scenario to the research; diagnosis and guidance texts were drafted with Super Intelligence (SI) and reviewed by the team.',
      'Configure material, gravity, oxygen and airflow.',
      'Visualize the flame in 3D and examine risk indicators.',
      // The mock payloads have no suppression estimate, so the extinguisher is not promised here.
      'Get prevention, detection and suppression guidance.',
      'Export a detailed PDF report with the source behind each result.',
      'See how this research also supports fire safety on Earth.',
    ]) {
      expect(steps.getByText(item)).toBeInTheDocument()
    }
    expect(steps.getByText(/^Experimental combustion data from NASA PSI \(BASS-II\)/)).toHaveTextContent(
      'Experimental combustion data from NASA PSI (BASS-II)PSI · BASS-II and NASA technical reports (NTRS)NTRS.',
    )
    expect(steps.getByText('PSI · BASS-II').className).toMatch(/font-mono/)
    expect(steps.getByText('NTRS').className).toMatch(/font-mono/)
    expect(screen.queryByText(/water-mist extinguisher estimate/)).toBeNull()
    expect(screen.getAllByText(/fire safety on Earth/)).toHaveLength(1)
    // The UFSC (VSB-30) item stays hidden until its reference is in docs/references.md.
    expect(screen.queryByText(/UFSC|VSB-30|Brazilian/)).toBeNull()

    const closing = within(screen.getByRole('heading', { level: 2, name: 'Explore combustion beyond Earth.' }).closest('section')!)
    expect(closing.getByText('Configure a scenario, visualize flame behavior, and examine the evidence behind the analysis.')).toBeInTheDocument()
    expect(closing.getByRole('link', { name: /Launch Simulator/ })).toHaveAttribute('href', '/simulator')
    expect(closing.getByRole('link', { name: 'Explore Research' })).toHaveAttribute('href', '/documentation')

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
    expect(h2s).toEqual([
      'How AstroFire helps',
      'How we use SI',
      'Built on real research',
      'Explore combustion beyond Earth.',
    ])

    // Short SI block (the full disclosure is in docs/technical-notes.md).
    const si = within(screen.getByTestId('si-compact'))
    expect(screen.getByTestId('si-compact')).toHaveAttribute('id', 'si-usage')
    expect(si.getByText('Transparency', { selector: 'p' })).toBeInTheDocument()
    expect(si.getByText(/A rule-based engine matches each scenario to NASA data/)).toBeInTheDocument()
    expect(si.getByText(/ChatGPT, Codex, Gemini and Claude Code/)).toBeInTheDocument()
    expect(si.getByText(/\[VOICE TOOL\]/)).toBeInTheDocument()
    expect(si.getByText(/The team conceived the solution/)).toBeInTheDocument()
    expect(document.body.textContent).not.toMatch(/recreated by the team|SI interprets the experimental data/)

    // Evidence strip: counts come from the data, plus the badge legend.
    const evidence = within(screen.getByTestId('evidence-strip'))
    expect(evidence.getByText('79 BASS-II tests from NASA PSI')).toBeInTheDocument()
    expect(evidence.getByText('6 NASA investigations compared by habitat')).toBeInTheDocument()
    expect(evidence.getByText('Every source cited')).toBeInTheDocument()
    expect(evidence.getByRole('link', { name: /Explore the research/ })).toHaveAttribute('href', '/documentation')
    expect(evidence.getByTestId('badge-legend')).toHaveTextContent(/NASA experimental data.*Estimate.*Illustrative/)

    // The team section was removed.
    expect(document.getElementById('team')).toBeNull()
    expect(document.body.textContent).not.toMatch(/\bzero\b|100%|guaranteed/i)
  })

  it('/about redirects to the SI usage section of the Home', async () => {
    renderAt('/about')
    expect(await screen.findByRole('heading', { level: 2, name: 'How we use SI' })).toBeInTheDocument()
  })

  it('Credits & licenses close the Documentation page, with the to-verify rows', async () => {
    const { container } = renderAt('/documentation')
    expect(await screen.findByRole('heading', { level: 2, name: 'References' })).toBeInTheDocument()
    const credits = within(container.querySelector('#credits') as HTMLElement)
    expect(credits.getByRole('heading', { level: 2, name: 'Credits & licenses' })).toBeInTheDocument()
    expect(credits.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(['Data & research', 'Software & assets'])
    expect(credits.getByText('BASS-II (PSI-25): Burning and Suppression of Solids - II')).toBeInTheDocument()
    expect(credits.getByText(/IBM Plex Sans, IBM Plex Serif & IBM Plex Mono/)).toBeInTheDocument()
    expect(credits.getByText('MagicaVoxel 3D models: Earth, ISS, Mars, Moon, RocketShip, Extinguisher')).toBeInTheDocument()
    expect(credits.getByText('AstroFire logo created with Claude Code (SI-assisted) and reviewed by the team.')).toBeInTheDocument()
    expect(credits.getByText('Unity (3D chamber engine and WebGL template)')).toBeInTheDocument()
    expect(credits.getByText(/^Codex \(OpenAI\)/)).toBeInTheDocument()
    for (const name of [
      'Antigravity: coding environment used with Gemini',
      'Google Colab: model training and validation',
      'UFSC/INPE · VSB-30 sounding-rocket study',
    ]) {
      const row = credits.getByText(name).closest('tr')!
      expect(within(row).getByText('To verify')).toBeInTheDocument()
    }
  })

  it('Documentation: header, shortcuts, full-documentation card and section order', async () => {
    renderAt('/documentation')
    expect(await screen.findByRole('heading', { level: 1, name: 'Documentation' })).toBeInTheDocument()
    expect(screen.getByText('The research, data and methods behind AstroFire.')).toBeInTheDocument()
    const nav = within(screen.getByRole('navigation', { name: 'On this page' }))
    expect(nav.getAllByRole('link').map((a) => [a.textContent, a.getAttribute('href')])).toEqual([
      ['Full documentation', '#full-documentation'],
      ['Investigations', '#investigations'],
      ['Data', '#data'],
      ['References', '#references'],
      ['Credits', '#credits'],
    ])
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      'AstroFire · Technical Documentation',
      'Which experiments matter for your habitat?',
      'The experimental data',
      'About the data',
      'References',
      'Credits & licenses',
    ])

    const card = within(document.getElementById('full-documentation')!)
    expect(card.getByText(/Everything about the project in one document/)).toBeInTheDocument()
    expect(within(card.getByTestId('doc-contents')).getAllByRole('listitem').map((li) => li.textContent?.replace(/^\d+/, ''))).toEqual([
      'Problem and challenge alignment',
      'Product overview',
      'Using the simulator',
      'Science and calculations',
      'Data and curation',
      'Model and validation',
      'Architecture and data contract',
      'Use of Super Intelligence (SI)',
      'Limitations',
      'Team and credits',
      'References',
    ])
    // The PDF is not published yet: both actions are disabled with "Coming soon".
    for (const name of ['Download full documentation (PDF)', 'Read the SI disclosure']) {
      const action = card.getByRole('button', { name })
      expect(action).toBeDisabled()
      expect(action).toHaveAccessibleDescription('Coming soon')
    }

    // Removed from the page (kept in docs/technical-notes.md).
    expect(document.getElementById('method')).toBeNull()
    expect(screen.queryByText(/Method, in short|Two regimes, one console|Hybrid PINN Loss Convergence/)).toBeNull()
    expect(screen.queryByText(/Ignition\/quench accuracy|Factor importance|cross-validation/i)).toBeNull()
  })

  it('investigation cards: corrected SoFIE text, sourced conditions only, guidance in Details', async () => {
    renderAt('/documentation')
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
    renderAt('/documentation')
    expect(await screen.findByText(/Team-assigned relevance \(High \/ Medium\)/)).toBeInTheDocument()
    expect(screen.queryByText(/\/100/)).toBeNull()
    expect(screen.getAllByTestId('relevance').map((b) => b.textContent?.replace('Team-assigned relevance: ', ''))).toEqual([
      'High', 'High', 'High', 'Medium', 'Medium', 'Medium',
    ])
    const first = () => within(screen.getAllByRole('listitem').find((li) => li.textContent?.startsWith('#1'))!).getByRole('heading', { level: 3 })
    expect((await screen.findByRole('radio', { name: 'Lunar base (0.16 g)' })).getAttribute('aria-checked')).toBe('true')
    expect(first()).toHaveTextContent('Saffire')
    fireEvent.click(screen.getByRole('radio', { name: 'ISS orbital lab (0 g)' }))
    expect(first()).toHaveTextContent('BASS-II')
  })

  it('the BASS-II table starts collapsed, then shows 10 rows until "Show all"', async () => {
    renderAt('/documentation')
    // N comes from the records actually loaded.
    const show = await screen.findByRole('button', { name: 'Show table (79 records)' }, { timeout: 5000 })
    expect(show).toHaveAttribute('aria-expanded', 'false')
    const data = within(document.getElementById('data')!)
    expect(data.queryByRole('table')).toBeNull()
    expect(data.getByText(/DOI 10\.60555\/4qc4-de67, CC0-1\.0 · Olson et al\., NASA\/TM-20210011385/)).toBeInTheDocument()

    fireEvent.click(show)
    expect(await screen.findByText('BASS2-M1')).toBeInTheDocument()
    const table = screen.getByRole('table', { name: /BASS-II test records/ })
    expect(within(table).getAllByRole('row')).toHaveLength(11)
    fireEvent.click(screen.getByRole('button', { name: 'Show all 79' }))
    expect(within(table).getAllByRole('row')).toHaveLength(80)
    expect(screen.getByText('Observed data · NASA PSI BASS-II')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Hide table' }))
    expect(data.queryByRole('table')).toBeNull()
  })

  it('references are numbered and the SAME credit no longer covers other investigations', async () => {
    const { container } = renderAt('/documentation')
    expect(await screen.findByRole('heading', { level: 2, name: 'References' })).toBeInTheDocument()
    for (let n = 1; n <= 6; n++) expect(container.querySelector(`#ref-${n}`)).not.toBeNull()
    expect(screen.queryByText(/SAME \/ SoFIE \/ FLEX \/ SPICE/)).toBeNull()
  })

  it('/research redirects to /documentation, keeping the anchor', async () => {
    renderAt('/research#credits')
    expect(await screen.findByRole('heading', { level: 1, name: 'Documentation' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Documentation', current: 'page' })).toHaveAttribute('href', '/documentation')
  })

  it.each([
    ['/simulator', 'Simulator'],
    ['/documentation', 'Documentation'],
    ['/does-not-exist', 'Page not found'],
  ])('route %s renders its page title', async (path, title) => {
    renderAt(path)
    expect(await screen.findByRole('heading', { level: 1, name: title }, { timeout: 5000 })).toBeInTheDocument()
  })
})
