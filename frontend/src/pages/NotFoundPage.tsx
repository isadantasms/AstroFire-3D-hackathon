// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import { Link } from 'react-router'
import { PageHeader } from '../components/PageHeader'

export function NotFoundPage() {
  return (
    <>
      <PageHeader eyebrow="Error 404" title="Page not found" />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Link to="/" className="text-sm text-focus hover:underline">
          Return to Home
        </Link>
      </div>
    </>
  )
}
