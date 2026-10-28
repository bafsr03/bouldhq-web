import { NextResponse } from 'next/server'
import {
  looksAutomated,
  validateLead,
  type LeadPayload,
} from '@/lib/leads'
import { leadForSheet, leadSheetConfigured, postToLeadSheet } from '@/lib/leadSheet'
import { bouldLeadsConfigured, sendToBouldLeads } from '@/lib/bouldleads'
import { sendText, smsConfigured, QUOTE_TEXT } from '@/lib/sms'
import { verifyTurnstile } from '@/lib/turnstile'
import { utmLine } from '@/lib/utm'
import { LEGAL_NAME } from '@/lib/site'

/**
 * Lead intake for the ranking check, contact, results-page callback, and
 * Minnesota quote forms.
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
// Ranking-check requests wait for BouldLeads to run the Google check (see lib/bouldleads.ts).
export const maxDuration = 30

const TO = process.env.LEAD_TO_EMAIL
const RESEND_KEY = process.env.RESEND_API_KEY

function renderLead(lead: LeadPayload): string {
  const lines: string[] = [`New lead — ${lead.source}`, '', `Name:      ${lead.name}`]
  if (lead.business) lines.push(`Business:  ${lead.business}`)
  if (lead.email) lines.push(`Email:     ${lead.email}`)
  if (lead.phone) lines.push(`Phone:     ${lead.phone}`)
  if (lead.website) lines.push(`Website:   ${lead.website}`)
  if (lead.industry) lines.push(`${lead.source === 'ranking-check' ? 'Does:     ' : 'Industry: '} ${lead.industry}`)
  if (lead.city) lines.push(`City:      ${lead.city}`)
  if (lead.need) lines.push(`Needs:     ${lead.need}`)
  if (lead.heardVia) lines.push(`Heard via: ${lead.heardVia}`)
  if (lead.checkSlug) lines.push(`Results:   /check/${lead.checkSlug}`)
  const utm = utmLine(lead.utm)
  if (utm) lines.push(`Came from: ${utm}`)
  if (lead.message) lines.push('', 'Message:', lead.message)

  if (lead.source === 'ranking-check') {
    lines.push(
      '',
      bouldLeadsConfigured()
        ? 'The top-3 check is running in BouldLeads (tagged "Site request"). Call within one business day.'
        : 'BouldLeads is not connected: run the top-3 check by hand. Call within one business day.'
    )
  }

  if (lead.source === 'minnesota-quote') {
    lines.push('', 'From the Minnesota Google Ads page. Call within 15 minutes.')
  }

  return lines.join('\n')
}

function subjectFor(lead: LeadPayload): string {
  if (lead.source === 'ranking-check') return `Ranking check request: ${lead.business} (${lead.city})`
  if (lead.source === 'check-callback') return `Call me back: ${lead.name}, from a results link`
  if (lead.source === 'minnesota-quote') return `Google Ads MN quote — ${lead.business}`
  return `New inquiry — ${lead.business}`
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
    sheet: leadSheetConfigured(),
    bouldleads: bouldLeadsConfigured(),
    turnstile: Boolean(process.env.TURNSTILE_SECRET_KEY),
    sms: smsConfigured(),
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

  // Probes (see below) deliver nothing, so they skip the bot check: that keeps
  // scripts/verify.sh working against production with Turnstile switched on.
  const probe = (body.email ?? '').trim().toLowerCase().endsWith('@example.com')
  const human =
    probe ||
    (await verifyTurnstile(
      body['cf-turnstile-response'],
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null
    ))
  if (!human) {
    return NextResponse.json(
      { ok: false, error: 'Please complete the "verify you are human" check and send again.' },
      { status: 422 }
    )
  }

  const { fields } = validateLead(body)
  if (Object.keys(fields).length > 0) {
    return NextResponse.json(
      { ok: false, error: 'Please check the highlighted fields.', fields },
      { status: 422 }
    )
  }

  const { 'cf-turnstile-response': _token, ...rest } = body
  void _token
  const lead = rest as LeadPayload
  const text = renderLead(lead)

  /*
    A probe exercises validation and delivery configuration without actually
    emailing anyone.

    scripts/verify.sh posts a real lead on every run to prove this endpoint
    accepts valid input. That was harmless while delivery was log-only, but the
    moment RESEND_API_KEY was set it meant every verification run — including
    every run against production — put a fake "Verify Co" lead in the inbox that
    real enquiries land in. Someone checking leads has no way to tell the two
    apart at a glance, which is how a real one gets deleted with the noise.

    example.com is reserved by RFC 2606 and can never belong to anyone, so an
    address there cannot be a genuine enquiry and cannot receive mail even if it
    were. The request is still validated, still counted, still logged, and still
    returns 200 — only the send is skipped.
  */
  if (probe) {
    console.info('[lead] probe accepted, delivery skipped (reserved example.com address)')
    return NextResponse.json({ ok: true, probe: true })
  }

  /*
    The sheet is where the salesperson works, and its Apps Script also sends
    the instant call-this-lead alert. Started before the email so the two run
    side by side; awaited before responding because a serverless function may
    be frozen the moment the response is sent.
  */
  const sheet = leadSheetConfigured()
    ? postToLeadSheet({ action: 'append_lead', lead: leadForSheet(lead) }).then((r) => {
        if (!r.ok) console.error('[lead] sheet delivery failed:', r.error)
      })
    : Promise.resolve()

  /*
    BouldLeads saves the lead and runs the top-3 check before answering, so
    Jake opens a lead that is ready to call. Callbacks attach to the lead whose
    results link the owner was on.
  */
  const leads =
    bouldLeadsConfigured() &&
    (lead.source === 'ranking-check' || lead.source === 'check-callback' || lead.source === 'minnesota-quote')
      ? sendToBouldLeads(lead).then((r) => {
          if (!r.ok) console.error('[lead] BouldLeads intake failed:', r.error)
        })
      : Promise.resolve()

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
          ...(lead.email ? { reply_to: lead.email } : {}),
          subject: subjectFor(lead),
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

  /*
    Minnesota ad leads get Jake's "got your request" text straight away
    (launch doc, section 7). Probes never reach this point, so verify.sh can't
    text anyone.
  */
  const sms =
    lead.source === 'minnesota-quote' && lead.phone && smsConfigured()
      ? sendText(lead.phone, QUOTE_TEXT).then((r) => {
          if (!r.ok) console.error('[lead] auto-text failed:', r.error)
        })
      : Promise.resolve()

  await Promise.all([sheet, leads, sms])

  return NextResponse.json({ ok: true })
}
