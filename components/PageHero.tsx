export default function PageHero({
  eyebrow,
  title,
  sub,
  ghost,
}: {
  eyebrow?: string
  title: React.ReactNode
  sub?: React.ReactNode
  /** Oversized watermark word behind the title — part of the theme's look. */
  ghost?: string
}) {
  return (
    <section className="bould-page-hero">
      {ghost && (
        <span className="bould-page-hero__ghost" aria-hidden="true">
          {ghost}
        </span>
      )}
      <div className="bould-page-hero__inner">
        {eyebrow && <p className="bould-section-label">{eyebrow}</p>}
        {/*
          Exactly one h1 per page, and it is the page's actual promise rather
          than a brand word — the brief's fix for a site whose h1 was "We Build
          The Future Of Commerce."
        */}
        <h1 className="bould-page-hero__title">{title}</h1>
        {sub && <p className="bould-page-hero__sub">{sub}</p>}
      </div>
    </section>
  )
}
