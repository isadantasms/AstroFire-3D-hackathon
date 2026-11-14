// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { Route, Routes } from 'react-router'
import { Layout } from './Layout'
import { HomePage } from '../pages/HomePage'
import { SimulatorPage } from '../pages/SimulatorPage'
import { ResearchPage } from '../pages/ResearchPage'
import { AboutPage } from '../pages/AboutPage'
import { NotFoundPage } from '../pages/NotFoundPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="simulator" element={<SimulatorPage />} />
        <Route path="research" element={<ResearchPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
