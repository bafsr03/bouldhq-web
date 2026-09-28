'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AUDIT_QUESTIONS,
  TOTAL_POINTS,
  verdictFor,
} from '@/lib/content/audit'
import { trackAuditComplete } from '@/lib/track'
import LeadForm from './LeadForm'
import { AUDIT_FIELDS } from '@/lib/formFields'

type Answer = 'yes' | 'no'

/**
 * The 20-point visibility scorer (brief, decision 8).
 *
 * Two design decisions worth stating:
 *
 * 1. Every question renders on the server in one list rather than as a wizard.
 *    A wizard hides eleven of the twelve questions from the crawler, and this
 *    page is meant to rank for people searching whether their business shows up
 *    on Google. The questions ARE the content.
 *
 * 2. The score is shown for free and the form comes after. Gating the score
 *    behind an email gets more addresses and fewer conversations; showing it
 *    first means the person who fills in the form has already seen their own
 *    number and has a reason to want the rest. The brief's sales playbook runs
 *    on the prospect seeing "their own business, not a generic pitch."
 */
export default function AuditTool() {
  const [answers, setAnswers] = useState<Record<string, Answer>>({})
  const resultRef = useRef<HTMLDivElement>(null)

  const answeredCount = Object.keys(answers).length
  const complete = answeredCount === AUDIT_QUESTIONS.length

  const score = useMemo(
    () =>
      AUDIT_QUESTIONS.reduce(
        (sum, q) => (answers[q.id] === 'yes' ? sum + q.points : sum),
        0
      ),
    [answers]
  )

  const verdict = verdictFor(score)
  const gaps = AUDIT_QUESTIONS.filter((q) => answers[q.id] === 'no')

  useEffect(() => {
    if (complete) trackAuditComplete(score, verdict.label)
    // Fires once per completed run; re-answering a question and completing
    // again is a genuinely new result worth recording.
  }, [complete, score, verdict.label])

  return (
    <div className="bould-audit">
      <ol className="bould-audit__list">
        {AUDIT_QUESTIONS.map((q, i) => {
          const value = answers[q.id]
          return (
            <li key={q.id} className="bould-audit__item">
              {/*
                A radiogroup rather than fieldset/legend. A <legend> is painted
                on the fieldset's border box and cannot be laid out as a normal
                block child, which pushed every question outside its own card.
                role="radiogroup" + aria-labelledby gives screen readers the same
                grouping and label without fighting the rendering.
              */}
              <div
                className="bould-audit__fieldset"
                role="radiogroup"
                aria-labelledby={`${q.id}-label`}
                aria-describedby={`${q.id}-help`}
              >
                <p className="bould-audit__question" id={`${q.id}-label`}>
                  <span className="bould-audit__num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {q.question}
                  <span className="bould-audit__points">
                    {q.points} {q.points === 1 ? 'point' : 'points'}
                  </span>
                </p>
                <p className="bould-audit__help" id={`${q.id}-help`}>
                  {q.help}
                </p>

                <div className="bould-audit__choices">
                  {(['yes', 'no'] as const).map((choice) => (
                    <label
                      key={choice}
                      className={`bould-audit__choice${value === choice ? ' is-selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={choice}
                        checked={value === choice}
                        onChange={() =>
                          setAnswers((prev) => ({ ...prev, [q.id]: choice }))
                        }
                      />
                      <span>{choice === 'yes' ? 'Yes' : 'No / not sure'}</span>
                    </label>
                  ))}
                </div>

                {value === 'no' && (
                  <p className="bould-audit__fix">
                    <span className="bould-audit__fix-label">What we do about it</span>
                    {q.fix}
                  </p>
                )}
              </div>
            </li>
          )
        })}
      </ol>

      {/* Live running total, announced politely so it does not interrupt. */}
      <div
        className="bould-audit__meter"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="bould-audit__meter-head">
          <span className="bould-audit__meter-score">
            {score}
            <span className="bould-audit__meter-total"> / {TOTAL_POINTS}</span>
          </span>
          <span className="bould-audit__meter-progress">
            {answeredCount} of {AUDIT_QUESTIONS.length} answered
          </span>
        </div>
        <div className="bould-audit__meter-track" aria-hidden="true">
          <div
            className="bould-audit__meter-fill"
            style={{ width: `${(score / TOTAL_POINTS) * 100}%` }}
          />
        </div>
      </div>

      {complete && (
        <div className="bould-audit__result" ref={resultRef} tabIndex={-1}>
          <p className="bould-section-label">Your verdict</p>
          <h2 className="bould-audit__verdict">{verdict.label}</h2>
          <p className="bould-audit__verdict-summary">{verdict.summary}</p>
          <p className="bould-audit__verdict-detail">{verdict.detail}</p>

          {gaps.length > 0 && (
            <div className="bould-audit__gaps">
              <h3 className="bould-audit__gaps-heading">
                {gaps.length} {gaps.length === 1 ? 'gap' : 'gaps'} to close
              </h3>
              <ul>
                {gaps.map((g) => (
                  <li key={g.id}>
                    <strong>{g.question}</strong> {g.fix}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bould-audit__capture">
            <h3 className="bould-audit__capture-heading">
              Want the written version?
            </h3>
            <p className="bould-audit__capture-body">
              Tell us where to look and we will check every answer against your
              actual Google profile, listings, and site by hand — then send back
              the full audit with what to fix first, in order. No charge, and no
              obligation to buy anything.
            </p>
            <LeadForm
              source="visibility-audit"
              fields={AUDIT_FIELDS}
              submitLabel="Send me the full audit"
              successTitle="On its way."
              successBody="We will check your profile and listings by hand and come back within one business day."
              note="We use your details to send the audit and follow up once. Nothing else."
              extra={{
                audit: {
                  score,
                  total: TOTAL_POINTS,
                  verdict: verdict.label,
                  answers: AUDIT_QUESTIONS.map((q) => ({
                    id: q.id,
                    question: q.question,
                    answer: answers[q.id]!,
                    points: q.points,
                  })),
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
