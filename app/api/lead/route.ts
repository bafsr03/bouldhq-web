import { NextResponse } from 'next/server'
import {
  looksAutomated,
  validateLead,
  type LeadPayload,
} from '@/lib/leads'
import { LEGAL_NAME } from '@/lib/site'

/**
 * Lead intake for the audit and contact forms.
 *
 * Node runtime (the default): this talks to an outbound email API and has no
 * latency requirement that would justify the Edge runtime's constraints.
 *
 * Delivery is intentionally degradable. If RESEND_API_KEY and LEAD_TO_EMAIL are
 * set the lead is emailed; if they are not — which is the state this repo ships
 * in until someone provisions them — the lead is still accepted and logged, and
 * the visitor still gets a success screen. A lead form that 500s because an env
 * var is missing is worse than one that files to the runtime log.
 */
export const dynamic = 'force-dynamic'

const TO = process.env.LEAD_TO_EMAIL
const RESEND_KEY = process.env.RESEND_API_KEY

function renderLead(lead: LeadPayload): string {
  const lines: string[] = [
    `New lead — ${lead.source}`,
    '',
    `Name:      ${lead.name}`,
    `Business:  ${lead.business}`,
    `Email:     ${lead.email}`,
  ]
  if (lead.phone) lines.push(`Phone:     ${lead.phone}`)
  if (lead.website) lines.push(`Website:   ${lead.website}`)
  if (lead.industry) lines.push(`Industry:  ${lead.industry}`)
  if (lead.city) lines.push(`City:      ${lead.city}`)
  if (lead.heardVia) lines.push(`Heard via: ${lead.heardVia}`)
  if (lead.message) lines.push('', 'Message:', lead.message)

  if (lead.audit) {
    lines.push(
      '',
      `Visibility score: ${lead.audit.score} / ${lead.audit.total} — ${lead.audit.verdict}`,
      '',
      'Answers:'
    )
    for (const a of lead.audit.answers) {
      lines.push(`  [${a.answer === 'yes' ? 'x' : ' '}] (${a.points}) ${a.question}`)
    }
  }

  return lines.join('\n')
}

/**
 * Delivery status, so a deploy can be checked without reading runtime logs.
 *
 * Reports only whether a transport is configured — never the key, never the
 * destination address. Without this, a site can look completely healthy while
 * silently filing every lead to a log nobody reads, and the first sign of
 * trouble is a customer asking why nobody called them back.
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    delivery: RESEND_KEY && TO ? 'email' : 'log-only',
    configured: Boolean(RESEND_KEY && TO),
  })
}

export async function POST(request: Request) {
  let body: Partial<LeadPayload>
  try {
    body = (await request.json()) as Partial<LeadPayload>
  } catch {
    return NextResponse.json({ ok: false, error: 'Malformed request.' }, { status: 400 })
  }

  // Accept-and-drop, so the bot learns nothing from the response.
  if (looksAutomated(body)) {
    return NextResponse.json({ ok: true })
  }

  const { fields } = validateLead(body)
  if (Object.keys(fields).length > 0) {
    return NextResponse.json(
      { ok: false, error: 'Please check the highlighted fields.', fields },
      { status: 422 }
    )
  }

  const lead = body as LeadPayload
  const text = renderLead(lead)

  if (RESEND_KEY && TO) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `${LEGAL_NAME} <leads@bouldhq.com>`,
          to: [TO],
          reply_to: lead.email,
          subject:
            lead.audit != null
              ? `Audit lead — ${lead.business} scored ${lead.audit.score}/${lead.audit.total}`
              : `New enquiry — ${lead.business}`,
          text,
        }),
      })
      if (!res.ok) {
        console.error('[lead] resend rejected', res.status, await res.text())
        console.info('[lead] undelivered lead follows\n' + text)
      }
    } catch (err) {
      console.error('[lead] delivery failed', err)
      console.info('[lead] undelivered lead follows\n' + text)
    }
  } else {
    console.warn(
      '[lead] NO MAIL TRANSPORT CONFIGURED — this lead was not emailed to anyone. ' +
        'Set RESEND_API_KEY and LEAD_TO_EMAIL. The lead is reproduced below so it ' +
        'can be recovered from the runtime log.'
    )
    console.info(text)
  }

  return NextResponse.json({ ok: true })
}
