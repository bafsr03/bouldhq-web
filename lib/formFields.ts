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
