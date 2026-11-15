// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router'
import { Layout } from './Layout'
import { HomePage } from '../pages/HomePage'
import { DocumentationPage } from '../pages/DocumentationPage'
import { NotFoundPage } from '../pages/NotFoundPage'

// The simulator bundles the contract validator and BASS-II records; load it on demand.
const SimulatorPage = lazy(() =>
  import('../pages/SimulatorPage').then((m) => ({ default: m.SimulatorPage })),
)

function RouteFallback() {
  return (
    <p role="status" className="px-4 py-10 text-center font-mono text-xs text-secondary">
      Loading console…
    </p>
  )
}

/** Old Research & Data links keep working: /research(#anchor) -> /documentation(#anchor). */
function ResearchRedirect() {
  const { hash } = useLocation()
  return <Navigate to={{ pathname: '/documentation', hash }} replace />
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route
          path="simulator"
          element={
            <Suspense fallback={<RouteFallback />}>
              <SimulatorPage />
            </Suspense>
          }
        />
        <Route path="documentation" element={<DocumentationPage />} />
        <Route path="research" element={<ResearchRedirect />} />
        {/* The About page was merged into the Home (SI usage) and Documentation (credits). */}
        <Route path="about" element={<Navigate to="/#si-usage" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
