import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import Link from 'next/link'

import PageHero from '@/components/PageHero'
import PageCta from '@/components/PageCta'
import WorkGrid from '@/components/WorkGrid'
import JsonLd from '@/components/JsonLd'
import {
  breadcrumbSchema,
  graph,
  serviceSchema,
  webPageSchema,
} from '@/lib/schema'
import { PROJECTS } from '@/lib/content/work'

/**
 * Brief, site map — Ecommerce websites, and the resolution of decision 3.
 *
 * The homepage leads with local service businesses. This page is where the
 * Shopify brands still have a home, and it is also the only place 3D appears —
 * as a feature of a website ("3D product visuals"), never as a standalone
 * product. "3D stores", "virtual try-on", "AR", and "headless" do not appear on
 * this site at all: the brief removes them as services, and try-on is switched
 * off.
 */
const TITLE = 'Shopify Store Design & Development'
const DESCRIPTION =
  'Custom Shopify storefronts for product brands, with 3D product visuals for things customers need to inspect before they buy. Migrations, speed, merchandising.'

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/services/shopify-stores',
})

export default function ShopifyStoresPage() {
  const ecommerce = PROJECTS.filter((p) => p.segment === 'ecommerce')

  return (
    <div className="bould-page-wrap">
      <JsonLd
        data={graph(
          webPageSchema({
            path: '/services/shopify-stores',
            name: TITLE,
            description: DESCRIPTION,
          }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Ecommerce websites', path: '/services/shopify-stores' },
          ]),
          serviceSchema({
            name: 'Shopify store design and development',
            description: DESCRIPTION,
            path: '/services/shopify-stores',
            serviceType: 'Ecommerce website design',
          })
        )}
      />

      <PageHero
        ghost="Shopify"
        eyebrow="Ecommerce"
        title="Shopify stores for brands whose product is the pitch."
        sub="Custom builds, migrations, and 3D product visuals — for the products that lose sales because a photograph cannot show them properly."
      />

      <section className="bould-section" aria-labelledby="3d-heading">
        <div className="bould-section__inner bould-section__inner--narrow">
          <p className="bould-section-label">3D product visuals</p>
          <h2 className="bould-section-title" id="3d-heading">
            A feature of the store, not a product of its own.
          </h2>
          <p className="bould-section-body">
            Some products sell themselves in a photograph. Others do not: a buyer
            needs to judge scale, finish, and detail before they will commit, and
            a flat grid pushes that conversation into an email thread you then
            have to answer by hand.
          </p>
          <p className="bould-section-body">
            For those products we build interactive 3D visuals directly into the
            storefront — rotatable, loading progressively so the page still
            opens fast on a phone, and falling back to normal imagery on devices
            that cannot render them. We have done it for{' '}
            <a
              href="https://joondistro.com/"
              className="bould-inline-link bould-inline-link--tap"
              target="_blank"
              rel="noopener noreferrer"
            >
              Joon Distribution
            </a>{' '}
            and{' '}
            <a
              href="https://www.dummiez.co/"
              className="bould-inline-link bould-inline-link--tap"
              target="_blank"
              rel="noopener noreferrer"
            >
              Dummiez
            </a>
            .
          </p>
          <p className="bould-section-body bould-section-body--muted">
            We will also tell you when your products do not need it. Most do not,
            and 3D on a product that photographs fine is money spent on a demo.
          </p>
        </div>
      </section>

      <section className="bould-section bould-section--alt" aria-labelledby="fit-heading">
        <div className="bould-section__inner bould-section__inner--narrow">
          <h2 className="bould-section-title" id="fit-heading">
            When Shopify is right, and when it is not
          </h2>
          <div className="bould-two-col">
            <div>
              <h3 className="bould-mini-card__title">Shopify is right when</h3>
              <ul className="bould-check-list">
                <li>You sell products online and need checkout, inventory, and payments</li>
                <li>You want to add products and run sales without a developer</li>
                <li>You are on a platform you have outgrown and need a migration</li>
                <li>You want apps and integrations that already exist</li>
              </ul>
            </div>
            <div>
              <h3 className="bould-mini-card__title">Shopify is wrong when</h3>
              <ul className="bould-x-list">
                <li>You sell a service and take inquiries by phone or form</li>
                <li>You have nothing to sell online and just need to be found</li>
                <li>You are paying a monthly platform fee for a cart nobody uses</li>
              </ul>
            </div>
          </div>
          <p className="bould-section-body">
            If you are in the second column, you want{' '}
            <Link href="/how-it-works" className="bould-inline-link bould-inline-link--tap">
              the local business plan
            </Link>{' '}
            instead. We will say so even though it is the cheaper option.
          </p>
        </div>
      </section>

      <section className="bould-work" aria-labelledby="ecom-work-heading">
        <div className="bould-section__inner">
          <p className="bould-section-label">Ecommerce work</p>
          <h2 className="bould-section-title" id="ecom-work-heading">
            Brands we have built for.
          </h2>
          <WorkGrid projects={ecommerce} />
        </div>
      </section>

      <PageCta
        label="Thinking about a rebuild or a migration?"
        href="/contact"
        cta="Tell us about the store"
      />
    </div>
  )
}
