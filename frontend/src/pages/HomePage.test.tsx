// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'

afterEach(() => {
  cleanup()
  vi.resetModules()
  vi.doUnmock('../app/routes')
})

async function renderHome(docsUrl: string | null) {
  vi.doMock('../app/routes', async (importOriginal) => ({
    ...(await importOriginal<typeof import('../app/routes')>()),
    TECHNICAL_DOCS_PDF_URL: docsUrl,
  }))
  const { HomePage } = await import('./HomePage')
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  )
}

describe('Home SI disclosure', () => {
  it('shows the short block without the documentation link while the technical PDF does not exist', async () => {
    await renderHome(null)
    const si = within(screen.getByTestId('si-compact'))
    expect(si.getByRole('heading', { level: 2, name: 'How we use SI' })).toBeInTheDocument()
    expect(si.getAllByRole('term').map((dt) => dt.textContent)).toEqual(['In the product', 'In development', 'Human responsibility'])
    expect(si.queryByRole('link')).toBeNull()
  })

  it('adds the documentation link once the technical PDF link is set', async () => {
    await renderHome('https://example.org/astrofire-technical-docs.pdf')
    const si = within(screen.getByTestId('si-compact'))
    expect(screen.getByTestId('si-compact')).toHaveAttribute('id', 'si-usage')
    expect(si.getByText('Transparency', { selector: 'p' })).toBeInTheDocument()
    expect(si.getByRole('heading', { level: 2, name: 'How we use SI' })).toBeInTheDocument()
    expect(si.getByText('In the product').nextSibling).toHaveTextContent(
      'When you run a simulation, a rule-based engine matches your scenario to NASA BASS-II data and technical reports. The diagnosis and guidance texts were drafted with SI and reviewed by the team.',
    )
    expect(si.getByText('In development').nextSibling).toHaveTextContent(
      'AI tools supported specific tasks: ChatGPT, Codex, Gemini and Claude / Claude Code (code, 3D, data and interface), the AstroFire logo (created with Claude Code) and the demo video narration ([VOICE TOOL]).',
    )
    expect(si.getByText('Human responsibility').nextSibling).toHaveTextContent(
      'The team conceived the solution, made the design and science decisions, and reviewed all code, data and results.',
    )
    expect(si.getByRole('link', { name: /Full SI disclosure in the documentation/ })).toHaveAttribute(
      'href',
      'https://example.org/astrofire-technical-docs.pdf',
    )
  })
})
