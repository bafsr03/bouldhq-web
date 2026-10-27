'use client'

/*
  A global-error boundary replaces the root layout entirely, so it has to render
  its own <html> and <body> — and it cannot use anything from that layout,
  including the stylesheets, which is why the styles here are inline.

  It also exists for a build reason. Without this file Next synthesises a default
  /_global-error page, and prerendering that synthesised page fails in this
  project ("Cannot read properties of null (reading 'useContext')"), taking the
  whole build down. Owning the route fixes the build and gets us a branded crash
  page instead of a white screen. Do not delete it because "nothing links to it".
*/
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#080F22',
          color: '#F7F8FC',
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif',
          padding: '2rem',
        }}
      >
        <main style={{ maxWidth: '34rem', textAlign: 'center' }}>
          <p
            style={{
              margin: '0 0 1rem',
              fontSize: '0.75rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              opacity: 0.6,
            }}
          >
            Something broke
          </p>
          <h1 style={{ margin: '0 0 1rem', fontSize: 'clamp(1.75rem, 6vw, 2.75rem)', lineHeight: 1.1 }}>
            This page failed to load.
          </h1>
          <p style={{ margin: '0 0 2rem', lineHeight: 1.6, opacity: 0.8 }}>
            That is on us, not on you. Try again — and if it keeps happening, call{' '}
            <a href="tel:+18012004716" style={{ color: 'inherit' }}>
              (801) 200-4716
            </a>{' '}
            and we will sort it out.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={reset}
              style={{
                minHeight: 44,
                padding: '0 1.5rem',
                border: 0,
                borderRadius: 999,
                background: '#F7F8FC',
                color: '#080F22',
                fontSize: '1rem',
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                minHeight: 44,
                padding: '0 1.5rem',
                display: 'inline-flex',
                alignItems: 'center',
                borderRadius: 999,
                border: '1px solid rgba(247, 248, 252,0.3)',
                color: 'inherit',
                textDecoration: 'none',
                fontSize: '1rem',
              }}
            >
              Go to the homepage
            </a>
          </div>
          {error.digest ? (
            <p style={{ marginTop: '2rem', fontSize: '0.75rem', opacity: 0.4 }}>
              Reference: {error.digest}
            </p>
          ) : null}
        </main>
      </body>
    </html>
  )
}
