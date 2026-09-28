/**
 * Form field definitions.
 *
 * These live outside components/LeadForm.tsx because that file is a client
 * module: Next's client-module proxy only exposes component exports to the
 * server graph, so a plain data export imported from a server component such as
 * /contact arrives as undefined. Keeping the data in a shared, directive-free
 * module lets both sides import the same definitions.
 */

import type { LeadPayload } from './leads'

export type Field = {
  name: keyof LeadPayload & string
  label: string
  type?: 'text' | 'email' | 'tel' | 'url' | 'textarea' | 'select'
  required?: boolean
  placeholder?: string
  autoComplete?: string
  options?: string[]
}

export const CORE_FIELDS: Field[] = [
  { name: 'name', label: 'Your name', required: true, autoComplete: 'name' },
  { name: 'business', label: 'Business name', required: true, autoComplete: 'organization' },
  { name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email' },
  { name: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel' },
]

/**
 * What the audit needs in order to actually be an audit.
 *
 * The capture form promises to "check every answer against your actual Google
 * profile, listings, and site" — which is impossible without knowing the site
 * and the city. Asking only for name, business, and email meant every
 * submission arrived unactionable and needed a reply just to ask the two
 * questions that should have been on the form.
 */
export const AUDIT_FIELDS: Field[] = [
  ...CORE_FIELDS,
  {
    name: 'website',
    label: 'Your website',
    type: 'url',
    placeholder: "Paste the address, or leave blank if you don't have one",
    autoComplete: 'url',
  },
  {
    name: 'city',
    label: 'City you serve',
    placeholder: 'So we can check the map pack for your area',
    autoComplete: 'address-level2',
  },
  {
    name: 'industry',
    label: 'What kind of business?',
    placeholder: 'Concrete, auto repair, retail brand…',
  },
]

/** Brief, contact page: current website, industry, city, and the attribution question. */
export const QUALIFY_FIELDS: Field[] = [
  {
    name: 'website',
    label: 'Current website',
    type: 'url',
    placeholder: 'Leave blank if you do not have one yet',
    autoComplete: 'url',
  },
  { name: 'industry', label: 'What kind of business?', placeholder: 'Concrete, auto repair, retail brand…' },
  { name: 'city', label: 'City', autoComplete: 'address-level2' },
  {
    name: 'heardVia',
    label: 'How did you hear about us?',
    type: 'select',
    options: [
      'Google search',
      'Google Business Profile',
      'A Bould client',
      'Saw "Website by Bould" on a site',
      'Referral from a friend',
      'Social media',
      'Other',
    ],
  },
]
