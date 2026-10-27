'use client'

import Link from 'next/link'
import { useId, useState } from 'react'

/**
 * Leads = Visibility × Conversion, as two questions a visitor can answer about
 * their own business. The answers pick one of four cells and say what fixes it.
 *
 * It replaced a plotted 2×2 chart. The grid is still here, as plain text, so
 * the argument reads the same before anyone clicks (and to a crawler); the
 * questions just point at the cell that applies to you.
 */

type Answer = 'yes' | 'no'

type Cell = {
  found: Answer
  chosen: Answer
  title: string
  body: string
  fix: string
  href: string
  link: string
}

const CELLS: Cell[] = [
  {
    found: 'no',
    chosen: 'yes',
    title: 'Ready, not found',
    body: 'The site does its job, but too few people ever see it.',
    fix: 'The visibility work: your Google profile, reviews and listings. Golden Formula adds it.',
    href: '/pricing',
    link: 'See Golden Formula',
  },
  {
    found: 'yes',
    chosen: 'yes',
    title: 'Leads flow',
    body: 'Both halves are working. The job is keeping it that way.',
    fix: 'Keep the site and the profile looked after. The free ranking check shows if anything is slipping.',
    href: '/visibility-audit',
    link: 'Get a free ranking check',
  },
  {
    found: 'no',
    chosen: 'no',
    title: 'Starting from zero',
    body: 'Nobody finds you, and the site would not win them over if they did.',
    fix: 'Both halves: a new site and the monthly visibility work. That is Golden Formula.',
    href: '/pricing',
    link: 'See the plans',
  },
  {
    found: 'yes',
    chosen: 'no',
    title: 'Found, not chosen',
    body: 'People land on your site and leave without calling. That was Rubio Brothers for a year.',
    fix: 'A site built to turn visits into calls. Website Build covers it.',
    href: '/pricing',
    link: 'See Website Build',
  },
]

const QUESTIONS = [
  {
    key: 'found' as const,
    text: 'When someone nearby searches for what you do, do they find you?',
    yes: 'Yes, usually',
    no: 'Not really',
  },
  {
    key: 'chosen' as const,
    text: 'When they land on your site, do they call or ask for a quote?',
    yes: 'Yes, often',
    no: 'Not really',
  },
]

export default function FormulaCheck() {
  const id = useId()
  const [answers, setAnswers] = useState<{ found?: Answer; chosen?: Answer }>({})
  const current =
    answers.found && answers.chosen
      ? CELLS.find((c) => c.found === answers.found && c.chosen === answers.chosen)
      : undefined

  return (
    <div className="bould-formula">
      <p className="bould-formula__heading">Where do you stand?</p>

      {QUESTIONS.map((q) => (
        <fieldset key={q.key} className="bould-formula__question">
          <legend>{q.text}</legend>
          <div className="bould-formula__options">
            {(['yes', 'no'] as const).map((value) => (
              <label key={value} className="bould-formula__option">
                <input
                  type="radio"
                  name={`${id}-${q.key}`}
                  value={value}
                  checked={answers[q.key] === value}
                  onChange={() => setAnswers((a) => ({ ...a, [q.key]: value }))}
                />
                <span>{q[value]}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ))}

      <div className="bould-formula__grid-wrap">
        <p className="bould-formula__axis bould-formula__axis--y">Chosen</p>
        <ul className="bould-formula__grid" aria-label="The four places a business can be">
          {CELLS.map((c) => (
            <li
              key={c.title}
              className={`bould-formula__cell${c === current ? ' is-active' : ''}`}
              aria-current={c === current ? 'true' : undefined}
            >
              <strong>{c.title}</strong>
              <span>{c.body}</span>
            </li>
          ))}
        </ul>
        <p className="bould-formula__axis bould-formula__axis--x">Found</p>
      </div>

      <div className="bould-formula__result" aria-live="polite">
        {current ? (
          <>
            <p className="bould-formula__result-label">What fixes it</p>
            <p className="bould-formula__result-body">{current.fix}</p>
            <Link href={current.href} className="bould-inline-link">
              {current.link} &rarr;
            </Link>
          </>
        ) : (
          <p className="bould-formula__result-hint">Answer both questions to see your square.</p>
        )}
      </div>
    </div>
  )
}
