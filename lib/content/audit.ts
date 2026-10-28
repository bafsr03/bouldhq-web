import { PLANS } from './pricing'

/**
 * The 20-point local visibility audit.
 *
 * This is the same scorecard the brief applies to Bould itself (where it scores
 * 2–4 out of 20). Point weights are taken verbatim from the brief's table and
 * sum to exactly 20 — `TOTAL_POINTS` asserts that at module load so an edit to
 * one row can't silently break the scale the verdicts are calibrated against.
 */

export type AuditQuestion = {
  id: string
  points: number
  question: string
  /** Shown under the question — what a "yes" actually requires. */
  help: string
  /** What Bould does about a "no". Drives the emailed audit and the sales call. */
  fix: string
}

export const AUDIT_QUESTIONS: AuditQuestion[] = [
  {
    id: 'gbp-verified',
    points: 2,
    question: 'Is your Google Business Profile verified, and do you have access to it?',
    help: 'Not just \u201cit exists\u201d — you can log in and edit it today.',
    fix: 'We claim or recover the profile and get it verified in your name.',
  },
  {
    id: 'gbp-category',
    points: 2,
    question: 'Does the profile’s primary category match your main service?',
    help: 'A concrete contractor listed as "General contractor" is losing the searches that matter.',
    fix: 'We set the primary category to the service you actually want calls for.',
  },
  {
    id: 'reviews',
    points: 3,
    question: 'Do you have 20 or more Google reviews, averaging 4.5 stars or better?',
    help: 'The single heaviest item on this scorecard, and the hardest to fake.',
    fix: 'You get a review link, a text template, and a QR card so asking takes ten seconds.',
  },
  {
    id: 'recent-activity',
    points: 1,
    question: 'Have you posted photos or updates to the profile in the last 90 days?',
    help: 'A profile that has been silent for a year reads as a business that may have closed.',
    fix: 'Profile updates and fresh job photos, kept current for you.',
  },
  {
    id: 'map-pack',
    points: 3,
    question: 'Do you show up in the Google map pack for "your service + your city"?',
    help: 'Search it in an incognito window. The three businesses in the map box are the map pack.',
    fix: 'Reviews, categories, service pages, and local content — the slow half, started immediately.',
  },
  {
    id: 'own-name',
    points: 2,
    question: 'When someone searches your business name, is the whole first page you?',
    help: 'If another company with a similar name outranks you, referrals are being lost before they reach you.',
    fix: 'Consistent listings and profiles until the first page of your own name belongs to you.',
  },
  {
    id: 'listings',
    points: 2,
    question: 'Are you listed in at least four directories besides Google?',
    help: 'Bing Places, Apple Business Connect, Yelp, BBB, and industry directories.',
    fix: 'We create and verify the listings, with identical details on every one.',
  },
  {
    id: 'nap-consistent',
    points: 1,
    question: 'Are your name, phone number, and service area identical everywhere they appear?',
    help: 'One old phone number on one old listing is enough to split your search presence in two.',
    fix: 'We audit every listing and bring them all onto one set of details.',
  },
  {
    id: 'name-says',
    points: 1,
    question: 'Does your business name say what you do?',
    help: '"Rubio Brothers Concrete" does. A name that could be anything has to work harder.',
    fix: 'Page titles and profile categories carry the service when the name does not.',
  },
  {
    id: 'one-market',
    points: 1,
    question: 'Do you serve one clear market rather than several scattered ones?',
    help: 'A page that tries to cover every town at once competes with the local business in each of them, and beats none of them. Google ranks the specific answer.',
    fix: 'One page per market you genuinely serve, each backed by real local work — not a list of towns in the footer.',
  },
  {
    id: 'timing',
    points: 1,
    question: 'Do you get work year-round rather than in one short season?',
    help: 'Seasonal businesses need the site ready before the season, not during it.',
    fix: 'We time the launch and the 60-day plan around your season.',
  },
  {
    id: 'baseline',
    points: 1,
    question: 'Do you know how many leads you got last month, and where they came from?',
    help: 'Without a baseline there is no way to prove anything changed.',
    fix: 'We record a baseline at onboarding and report against it every month.',
  },
]

export const TOTAL_POINTS = AUDIT_QUESTIONS.reduce((n, q) => n + q.points, 0)

if (TOTAL_POINTS !== 20) {
  throw new Error(
    `Visibility audit must total 20 points to match the published scorecard; got ${TOTAL_POINTS}.`
  )
}

export type Verdict = {
  id: 'launch-now' | 'launch-with-visibility' | 'visibility-first'
  min: number
  label: string
  summary: string
  detail: string
  /** The plan this score points to. Matches PLANS[].id in ./pricing. */
  plan: 'starter' | 'golden-formula'
}

/**
 * Brief, sales playbook: the verdict decides what gets sold. Bands are set so
 * the brief's own worked examples land where it says they do — Bould at 2–4 and
 * Kilowash are "visibility first", Rubio's strong-visibility profile is
 * "launch now".
 */
export const VERDICTS: Verdict[] = [
  {
    id: 'launch-now',
    min: 14,
    label: 'You’re ready for a new site',
    summary: 'People are already finding you. The website is what is losing them.',
    plan: 'starter',
    detail:
      'You have the harder half solved. A site that turns those visits into calls is the fastest change you can make — this is exactly the position Rubio Brothers Concrete was in before their rebuild.',
  },
  {
    id: 'launch-with-visibility',
    min: 8,
    label: 'Launch with a visibility package',
    summary: 'Half the machine is working. Building only one half wastes the other.',
    plan: 'golden-formula',
    detail:
      'A new site will convert better immediately, but the gaps above are capping how many people ever see it. Build and fix visibility in the same 60 days.',
  },
  {
    id: 'visibility-first',
    min: 0,
    label: 'Visibility first',
    summary: 'A better website multiplies demand. It does not create it.',
    plan: 'golden-formula',
    detail:
      'Right now almost nobody is finding you, so a redesign alone would multiply a very small number. Reviews, listings, and a finished Google profile come first — then the site.',
  },
]

export function verdictFor(score: number): Verdict {
  return VERDICTS.find((v) => score >= v.min) ?? VERDICTS[VERDICTS.length - 1]
}

/**
 * The plan each verdict points to, resolved against the price list so the
 * recommendation can never name a plan that no longer exists or quote a price
 * that has moved.
 */
export function planFor(score: number) {
  const id = verdictFor(score).plan
  const plan = PLANS.find((p) => p.id === id)
  if (!plan) {
    throw new Error(`Audit verdict points at plan "${id}", which is not in PLANS.`)
  }
  return plan
}
