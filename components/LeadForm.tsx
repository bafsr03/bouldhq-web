'use client'

import { useEffect, useRef, useState } from 'react'
import type { LeadPayload, LeadSource } from '@/lib/leads'
import type { Field } from '@/lib/formFields'
import { trackLeadSubmit } from '@/lib/track'

/**
 * The shared lead form.
 *
 * `extra` carries the audit result when this is mounted under the scorer, so one
 * submission delivers both the contact details and the twelve answers — which is
 * what makes the emailed audit possible without a second round trip to the
 * prospect.
 */
export default function LeadForm({
  source,
  fields,
  extra,
  submitLabel = 'Send it over',
  successTitle = 'Got it.',
  successBody = 'We will be in touch within one business day.',
  note,
}: {
  source: LeadSource
  fields: Field[]
  extra?: Partial<LeadPayload>
  submitLabel?: string
  successTitle?: string
  successBody?: string
  note?: React.ReactNode
}) {
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')
  const mountedAt = useRef(Date.now())
  const successRef = useRef<HTMLDivElement>(null)

  // Move focus to the confirmation so the outcome is announced rather than
  // silently swapped in below the fold.
  useEffect(() => {
    if (state === 'done') successRef.current?.focus()
  }, [state])

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (state === 'sending') return

    const data = new FormData(event.currentTarget)
    const payload: Record<string, unknown> = {
      ...extra,
      source,
      elapsedMs: Date.now() - mountedAt.current,
    }
    data.forEach((value, key) => {
      payload[key] = typeof value === 'string' ? value.trim() : value
    })

    setState('sending')
    setErrors({})
    setFormError('')

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = (await res.json()) as {
        ok: boolean
        error?: string
        fields?: Record<string, string>
      }

      if (!json.ok) {
        setErrors(json.fields ?? {})
        setFormError(json.error ?? 'Something went wrong. Please try again.')
        setState('error')
        return
      }

      trackLeadSubmit(source, extra?.audit ? { score: extra.audit.score } : {})
      setState('done')
    } catch {
      setFormError(
        'We could not reach the server. Please try again, or email jake@bouldhq.com.'
      )
      setState('error')
    }
  }

  if (state === 'done') {
    return (
      <div
        className="bould-contact__success"
        ref={successRef}
        tabIndex={-1}
        role="status"
      >
        <p className="bould-contact__success-title">{successTitle}</p>
        <p className="bould-contact__success-text">{successBody}</p>
      </div>
    )
  }

  return (
    /*
      `method="post"` and `action` are set even though onSubmit always calls
      preventDefault and posts as JSON. If the JS ever fails to hydrate, the
      browser's own submit runs — and a GET form would put the visitor's name,
      email, and phone in the URL, where they land in history, in the Referer
      header, and in server logs.

      Native validation is left ON (no `noValidate`). The server validates too
      and is the authority, but a required field should turn red before the
      round trip, not after it.
    */
    <form
      className="bould-lead-form"
      onSubmit={onSubmit}
      method="post"
      action="/api/lead"
    >
      {/*
        Honeypot. Hidden from sight and from assistive technology, never
        focusable — a real person cannot fill it, so anything that does is
        automated. Validated server-side in lib/leads.ts.
      */}
      <div className="bould-hp" aria-hidden="true">
        <label htmlFor={`hp-${source}`}>Do not fill this in</label>
        <input
          id={`hp-${source}`}
          type="text"
          name="company_website_confirm"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="bould-lead-form__grid">
        {fields.map((f) => {
          const id = `${source}-${f.name}`
          const err = errors[f.name]
          return (
            <div
              key={f.name}
              className={`bould-contact__field${f.type === 'textarea' ? ' bould-contact__field--wide' : ''}`}
            >
              <label className="bould-contact__label" htmlFor={id}>
                {f.label}
                {f.required && <span aria-hidden="true"> *</span>}
                {f.required && <span className="bould-sr-only"> (required)</span>}
              </label>

              {f.type === 'textarea' ? (
                <textarea
                  id={id}
                  name={f.name}
                  rows={5}
                  className="bould-contact__textarea"
                  placeholder={f.placeholder}
                  required={f.required}
                  aria-invalid={err ? true : undefined}
                  aria-describedby={err ? `${id}-error` : undefined}
                />
              ) : f.type === 'select' ? (
                <select
                  id={id}
                  name={f.name}
                  className="bould-contact__select"
                  defaultValue=""
                  aria-invalid={err ? true : undefined}
                  aria-describedby={err ? `${id}-error` : undefined}
                >
                  <option value="">Choose one</option>
                  {f.options?.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={id}
                  name={f.name}
                  type={f.type ?? 'text'}
                  className="bould-contact__input"
                  inputMode={f.inputMode}
                  placeholder={f.placeholder}
                  autoComplete={f.autoComplete}
                  required={f.required}
                  aria-invalid={err ? true : undefined}
                  aria-describedby={err ? `${id}-error` : undefined}
                />
              )}

              {err && (
                <p className="bould-contact__error" id={`${id}-error`}>
                  {err}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {note && <p className="bould-contact__disclaimer">{note}</p>}

      {formError && (
        <p className="bould-contact__error" role="alert">
          {formError}
        </p>
      )}

      <button
        type="submit"
        className="bould-btn bould-btn--primary bould-contact__submit"
        disabled={state === 'sending'}
      >
        {state === 'sending' ? 'Sending…' : submitLabel}
      </button>
    </form>
  )
}
