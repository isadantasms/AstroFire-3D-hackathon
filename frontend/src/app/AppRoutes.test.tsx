// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
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
      '© 2026 21 PyroRangers · Built for NASA Space Apps Challenge 2026',
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
    expect(screen.getByRole('link', { name: 'AstroFire 3D home' })).toBeInTheDocument()
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
    expect(screen.getByRole('heading', { level: 2, name: 'How AstroFire 3D helps' })).toBeInTheDocument()

    const steps = within(screen.getByRole('heading', { level: 2, name: 'How AstroFire 3D helps' }).closest('section')!)
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
    expect(closing.getByRole('link', { name: 'Documentation' })).toHaveAttribute('href', '/documentation')

    // Old sections are gone.
    for (const old of ['The science', 'How it works', 'What makes AstroFire 3D different', 'Back on Earth']) {
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
    expect(brand).toHaveTextContent('AstroFire 3D')
    expect(within(brand).getByText('3D').className).toMatch(/9AA8BD/)
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
      'How AstroFire 3D helps',
      'Who it’s for',
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
    // The narration sentence stays hidden until VOICE_TOOL is set in content/project.ts.
    expect(screen.getByTestId('si-compact').textContent).not.toMatch(/VOICE TOOL|narrates the demo/)
    expect(si.getByText(/The team conceived the solution/)).toBeInTheDocument()
    expect(document.body.textContent).not.toMatch(/recreated by the team|SI interprets the experimental data/)

    // Evidence strip: counts come from the data, plus the badge legend.
    const evidence = within(screen.getByTestId('evidence-strip'))
    expect(evidence.getByText('79 BASS-II tests from NASA PSI')).toBeInTheDocument()
    expect(evidence.getByText('6 NASA investigations compared by habitat')).toBeInTheDocument()
    expect(evidence.getByText('Sources cited')).toBeInTheDocument()
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

  it('Documentation: four parts with matching shortcuts and the full-documentation card', async () => {
    renderAt('/documentation')
    expect(await screen.findByRole('heading', { level: 1, name: 'Documentation' })).toBeInTheDocument()
    expect(screen.getByText('The research, data and methods behind AstroFire 3D.')).toBeInTheDocument()
    const nav = within(screen.getByRole('navigation', { name: 'On this page' }))
    expect(nav.getAllByRole('link').map((a) => [a.textContent, a.getAttribute('href')])).toEqual([
      ['Full documentation', '#full-documentation'],
      ['Sources', '#research'],
      ['Data', '#data'],
      ['Credits', '#credits'],
    ])
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      'AstroFire 3D · Technical Documentation',
      'The research behind AstroFire 3D',
      'The experimental data',
      'Credits & licenses',
    ])

    const card = within(document.getElementById('full-documentation')!)
    expect(card.getByText(/Everything about the project in one 50-page technical reference/)).toBeInTheDocument()
    const contents = card.getByTestId('doc-contents')
    expect(contents.className).toMatch(/sm:columns-2/)
    expect(within(contents).getAllByRole('listitem')).toHaveLength(12)
    expect(within(contents).getByRole('link', { name: /Use of Super Intelligence \(SI\)/ })).toHaveAttribute(
      'href',
      'https://drive.google.com/file/d/1I76fUH7d-4MW_0Z12umlQFeijdn4akI0/view#nameddest=si-disclosure',
    )
    const downloadLink = card.getByRole('link', { name: /Download full documentation \(PDF\)/ })
    expect(downloadLink).toHaveAttribute('href', 'https://drive.google.com/file/d/1I76fUH7d-4MW_0Z12umlQFeijdn4akI0/view')
    expect(card.queryByText('Read the SI disclosure')).toBeNull()

    // Data notes are one line inside the data section.
    expect(screen.getByTestId('data-notes')).toHaveTextContent(/PSI-10 has no license listed and is not used/)
    expect(document.getElementById('data')!.contains(screen.getByTestId('data-notes'))).toBe(true)

    // Moved to the PDF (docs/technical-notes.md): ranking by habitat, relevance, card details, model, method.
    expect(screen.queryByRole('radio', { name: /Lunar base|ISS orbital lab/ })).toBeNull()
    expect(screen.queryByTestId('relevance')).toBeNull()
    expect(screen.queryByText('Details')).toBeNull()
    expect(screen.queryByText(/Team-assigned relevance|Which experiments matter/)).toBeNull()
    expect(document.getElementById('method')).toBeNull()
    expect(screen.queryByText(/Ignition\/quench accuracy|Factor importance|cross-validation/i)).toBeNull()
  })

  it('Sources: one plain line and a source link per investigation; full references collapsed', async () => {
    const { container } = renderAt('/documentation')
    const research = within(await screen.findByRole('region', { name: 'The research behind AstroFire 3D' }))
    const items = research.getAllByRole('listitem').filter((li) => li.querySelector('h3'))
    expect(items.map((li) => li.querySelector('h3')!.textContent)).toEqual([
      'Burning and Suppression of Solids–II (BASS-II)',
      'Spacecraft Fire Safety Demonstration Project (Saffire I–VI)',
      'Solid Fuel Ignition and Extinction (RTDFS, NCA, GEL, MIST, SMuRF)',
      'Smoke Aerosol Measurement Experiment (SAME)',
      'Flame Extinguishment Experiment (FLEX)',
      'Smoke Point In Co-flow Experiment (SPICE)',
    ])
    expect(within(items[0]).getByText(/How flames spread and go out on solid materials aboard the ISS/)).toBeInTheDocument()
    expect(within(items[0]).getByRole('link', { name: /View source/ })).toHaveAttribute('href', 'https://doi.org/10.60555/4qc4-de67')
    for (const li of items) expect(within(li).getByRole('link', { name: /View source/ })).toBeInTheDocument()

    // Full references: collapsed by default, numbered, with the license note.
    const refs = container.querySelector('#references') as HTMLDetailsElement
    expect(refs.tagName).toBe('DETAILS')
    expect(refs.open).toBe(false)
    expect(within(refs).getByText('Full references (14)')).toBeInTheDocument()
    for (let n = 1; n <= 14; n++) expect(container.querySelector(`#ref-${n}`)).not.toBeNull()
    expect(within(refs).getByText(/NASA data is CC0-1\.0/)).toBeInTheDocument()
    expect(screen.queryByText(/SAME \/ SoFIE \/ FLEX \/ SPICE/)).toBeNull()
  })

  it('Sources: study tags and the Prevention / Detection / Suppression filter', async () => {
    renderAt('/documentation')
    const research = within(await screen.findByRole('region', { name: 'The research behind AstroFire 3D' }))
    expect(research.getByText('Tags summarize what each investigation studied, based on its published objectives.')).toBeInTheDocument()
    const names = () => research.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)
    const bass = research.getByText('Burning and Suppression of Solids–II (BASS-II)').closest('li')!
    expect(within(within(bass).getByTestId('tags')).getAllByRole('listitem').map((li) => li.textContent)).toEqual([
      'Material flammability',
      'Cabin airflow',
      'Extinction limits',
    ])
    const filter = within(research.getByRole('radiogroup', { name: 'Filter by fire-safety area' }))
    expect(filter.getAllByRole('radio').map((r) => r.textContent)).toEqual(['All', 'Prevention', 'Detection', 'Suppression'])
    expect(filter.getByRole('radio', { name: 'All' })).toHaveAttribute('aria-checked', 'true')
    expect(names()).toHaveLength(6)

    fireEvent.click(filter.getByRole('radio', { name: 'Prevention' }))
    expect(names().map((n) => n?.match(/\((BASS-II|Saffire|SoFIE|SAME|FLEX|SPICE)/)?.[1] ?? n)).toEqual(['BASS-II', 'Saffire', 'Solid Fuel Ignition and Extinction (RTDFS, NCA, GEL, MIST, SMuRF)', 'SPICE'])
    fireEvent.click(filter.getByRole('radio', { name: 'Detection' }))
    expect(names()).toEqual([
      'Spacecraft Fire Safety Demonstration Project (Saffire I–VI)',
      'Smoke Aerosol Measurement Experiment (SAME)',
      'Smoke Point In Co-flow Experiment (SPICE)',
    ])
    fireEvent.click(filter.getByRole('radio', { name: 'Suppression' }))
    expect(names()).toEqual(['Burning and Suppression of Solids–II (BASS-II)', 'Flame Extinguishment Experiment (FLEX)'])
    // No scores or relevance levels.
    expect(screen.queryByText(/High|Medium|\/100/)).toBeNull()
  })

  it('a link to #references opens the full references', async () => {
    const { container } = renderAt('/documentation#references')
    await screen.findByRole('heading', { level: 1, name: 'Documentation' })
    await waitFor(() => expect((container.querySelector('#references') as HTMLDetailsElement).open).toBe(true))
  })

  it('Credits & licenses: tools, assets and SI tools without repeating NASA sources', async () => {
    const { container } = renderAt('/documentation')
    await screen.findByRole('heading', { level: 2, name: 'Credits & licenses' })
    const credits = within(container.querySelector('#credits') as HTMLElement)
    expect(credits.queryByText(/BASS-II \(PSI-25\)|NASA\/TM-20210011385|NTRS-|Saffire|SoFIE|FLEX|SPICE/)).toBeNull()
    expect(credits.getByText(/IBM Plex Sans & IBM Plex Mono/)).toBeInTheDocument()
    expect(credits.getByText('3D voxel models created by the team with MagicaVoxel')).toBeInTheDocument()
    expect(
      credits.getByText(
        'AstroFire 3D logo: concept generated with ChatGPT; simplified vector artwork recreated with Claude Code (SI-assisted) and reviewed by the team.',
      ),
    ).toBeInTheDocument()
    expect(credits.getByText('Unity (3D chamber engine and WebGL template)')).toBeInTheDocument()
    expect(credits.getByText(/^ChatGPT \(OpenAI\).*logo concept/)).toBeInTheDocument()
    expect(credits.getByText(/^Codex \(OpenAI\)/)).toBeInTheDocument()
    for (const name of ['Antigravity: coding environment used with Gemini', 'Google Colab: model training and validation']) {
      const row = credits.getByText(name).closest('tr')!
      expect(within(row).getByText('Google Terms of Service')).toBeInTheDocument()
      expect(within(row).getByRole('link')).toHaveAttribute('href', 'https://policies.google.com/terms')
    }
    expect(within(credits.getByText('Unity (3D chamber engine and WebGL template)').closest('tr')!).getByText('Unity Terms of Service')).toBeInTheDocument()
    expect(credits.getByText(/UFSC \/ LEPTEN · VSB-30 suborbital microgravity boiling study/)).toBeInTheDocument()
    expect(credits.queryByText(/VOICE TOOL|demo video narration/)).toBeNull()
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
