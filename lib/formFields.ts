/**
 * Form field definitions.
 *
 * These live outside components/LeadForm.tsx because that file is a client
 * module: Next's client-module proxy only exposes component exports to the
 * server graph, so a plain data export imported from a server component such as
 * /contact arrives as undefined. Keeping the data in a shared, directive-free
 * module lets both sides import the same definitions.
 *
 * The Contact and audit forms are built from the SAME pieces, in the same
 * order, with the same labels and placeholders. They used to drift — "Current
 * website" against "Your website", "City" against "City you serve", the
 * attribution question on one form and not the other, and the qualifying fields
 * in a different order on each. Two forms that ask the same thing in two
 * different ways produce two shapes of lead and make the answers harder to
 * compare.
 */

import type { LeadPayload } from './leads'

export type Field = {
  name: keyof LeadPayload & string
  label: string
  type?: 'text' | 'email' | 'tel' | 'url' | 'textarea' | 'select'
  required?: boolean
  placeholder?: string
  autoComplete?: string
  inputMode?: 'url' | 'tel' | 'email' | 'text'
  options?: string[]
}

/** Who you are. Required except the phone, which not everyone wants to give. */
export const CORE_FIELDS: Field[] = [
  { name: 'name', label: 'Your name', required: true, autoComplete: 'name' },
  { name: 'business', label: 'Business name', required: true, autoComplete: 'organization' },
  { name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email' },
  { name: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel' },
]

/**
 * What makes a lead actionable.
 *
 * The audit form promises to "check every answer against your actual Google
 * profile, listings, and site" — which is impossible without knowing the site
 * and the city. Asking only for name, business, and email meant every
 * submission arrived unactionable and needed a reply just to ask the two
 * questions that should have been on the form.
 */
export const QUALIFY_FIELDS: Field[] = [
  {
    /*
      Deliberately a text input, not type="url". Now that native validation is
      on, type="url" rejects "rubiobrothersconcrete.com" for want of an "https://"
      — the exact way every business owner types their own address. The server
      does not require a scheme either. `inputMode` still gets the URL keyboard
      on a phone.
    */
    name: 'website',
    label: 'Your website',
    inputMode: 'url',
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

/**
 * Attribution. On both forms, with identical options — otherwise the answers
 * cannot be counted together, which is the only reason to ask at all.
 */
export const HEARD_VIA_FIELD: Field = {
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
}

export const MESSAGE_FIELD: Field = {
  name: 'message',
  label: 'What is going on with your website?',
  type: 'textarea',
  placeholder: 'No site yet, a site that gets no calls, a rebuild, a Shopify store…',
}

/** Free visibility audit. Submitted with the score and all twelve answers. */
export const AUDIT_FIELDS: Field[] = [
  ...CORE_FIELDS,
  ...QUALIFY_FIELDS,
  HEARD_VIA_FIELD,
]

/** Contact. Same fields, same order, plus somewhere to say what is wrong. */
export const CONTACT_FIELDS: Field[] = [
  ...CORE_FIELDS,
  ...QUALIFY_FIELDS,
  HEARD_VIA_FIELD,
  MESSAGE_FIELD,
]
