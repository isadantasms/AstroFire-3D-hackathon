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
  it('shows three short rows and a direct documentation link (Research & Data until the PDF exists)', async () => {
    await renderHome(null)
    const section = screen.getByTestId('si-compact')
    const si = within(section)
    expect(section).toHaveAttribute('id', 'si-usage')
    expect(si.getByText('Transparency', { selector: 'p' })).toBeInTheDocument()
    expect(si.getByRole('heading', { level: 2, name: 'How we use SI' })).toBeInTheDocument()
    expect(si.getAllByRole('term').map((dt) => dt.textContent)).toEqual(['In the product', 'In development', 'Human responsibility'])
    expect(si.getByText('In the product').nextSibling).toHaveTextContent(
      'A rule-based engine matches each scenario to NASA data. Its diagnosis texts were drafted with SI and reviewed by the team.',
    )
    expect(si.getByText('In development').nextSibling).toHaveTextContent(
      'ChatGPT, Codex, Gemini and Claude Code supported code, 3D, data and interface. Claude Code created the logo; [VOICE TOOL] narrates the demo.',
    )
    expect(si.getByText('Human responsibility').nextSibling).toHaveTextContent(
      'The team conceived the solution, made every decision and reviewed all code, data and results.',
    )
    expect(si.queryByText('Learn more')).toBeNull()
    expect(section.querySelector('details')).toBeNull()
    expect(si.getByRole('link', { name: /Read the documentation/ })).toHaveAttribute('href', '/research')
  })

  it('the documentation link opens the technical PDF once it is set', async () => {
    await renderHome('https://example.org/astrofire-technical-docs.pdf')
    const si = within(screen.getByTestId('si-compact'))
    expect(si.getByRole('link', { name: /Full SI disclosure in the documentation/ })).toHaveAttribute(
      'href',
      'https://example.org/astrofire-technical-docs.pdf',
    )
  })
})
